/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
// Copyright 2024 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may not use a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Fix: Import `Modality` for use in image editing API calls.
import {GeneratedImage, GoogleGenAI, Modality} from '@google/genai';
import {useRef, useState} from 'react';
import {
  AssetRecordType,
  Box,
  createShapeId,
  Editor,
  stopEventPropagation,
  Tldraw,
  TldrawProps,
  TldrawUiButton,
  TldrawUiButtonIcon,
  TldrawUiContextualToolbar,
  TLShapeId,
  TLTextShape,
  toRichText,
  track,
  useEditor,
  usePassThroughWheelEvents,
  useToasts,
} from 'tldraw';
import {PromptBar} from './Components/PromptBar';
import {useTheme} from './ThemeContext';
import {
  addPlaceholder,
  bloblToBase64,
  createArrowBetweenShapes,
  loadIcon,
  placeNewShape,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from './utils';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const GEMINI_MODEL_NAME = 'gemini-2.5-flash';
const IMAGEN_MODEL_NAME = 'imagen-4.0-generate-001';
const GEMINI_IMAGE_MODEL_NAME = 'gemini-2.5-flash-image-preview';

async function describeImage(imageBlob: Blob): Promise<string> {
  const imageDataBase64 = await bloblToBase64(imageBlob);

  const textPrompt = `Describe the image`;

  const imagePrompt = {
    inlineData: {
      data: imageDataBase64,
      mimeType: 'image/jpeg',
    },
  };

  // Fix: The `contents` parameter should be a `Content` object for single-turn requests.
  const result = await ai.models.generateContent({
    model: GEMINI_MODEL_NAME,
    contents: {parts: [{text: textPrompt}, imagePrompt]},
  });
  return result.text;
}

async function generateImages(
  prompt: string,
  imageBlob: Blob = null,
  numberOfImages = 1,
): Promise<string[]> {
  const imageObjects = [];

  if (imageBlob) {
    const imageDataBase64 = await bloblToBase64(imageBlob);
    const mimeType =
      imageDataBase64.match(/data:(.*);base64,/)?.[1] || 'image/jpeg';

    const imagePart = {inlineData: {mimeType, data: imageDataBase64}};
    const textPart = {text: prompt};

    // Fix: The `contents` parameter should be a `Content` object for single-turn requests.
    // Add required `responseModalities` config for image editing.
    const res = await ai.models.generateContent({
      model: GEMINI_IMAGE_MODEL_NAME,
      contents: {parts: [imagePart, textPart]},
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const imagePartRes = res.candidates?.[0]?.content?.parts?.find(
      (p) => p.inlineData,
    );
    if (imagePartRes && imagePartRes.inlineData) {
      const src = `data:${imagePartRes.inlineData.mimeType};base64,${imagePartRes.inlineData.data}`;
      imageObjects.push(src);
    } else {
      throw new Error(`No image data found for prompt: ${prompt}`);
    }
  } else {
    const response = await ai.models.generateImages({
      model: IMAGEN_MODEL_NAME,
      prompt,
      config: {
        numberOfImages,
        aspectRatio: '16:9',
        outputMimeType: 'image/jpeg',
      },
    });

    if (response?.generatedImages) {
      response.generatedImages.forEach(
        (generatedImage: GeneratedImage, index: number) => {
          if (generatedImage.image?.imageBytes) {
            const src = `data:image/jpeg;base64,${generatedImage.image.imageBytes}`;
            imageObjects.push(src);
          }
        },
      );
    }
  }

  return imageObjects;
}

const describeClick = async (editor: Editor) => {
  console.log('describe');
  const shapes = editor.getSelectedShapes();
  const shape = shapes.find((shape) => editor.isShapeOfType(shape, 'image'));

  if (!shape) return;

  console.log('selected image shape:', shape.id);

  const placeholderIds = addPlaceholder(editor, 'Generating description...');
  editor.select(placeholderIds[0]);
  editor.zoomToSelectionIfOffscreen(20);

  // Export as PNG blob
  const shapeExport = await editor.toImage([shape.id], {
    format: 'png',
    scale: 1,
    background: true,
  });

  const response = await describeImage(shapeExport.blob);

  editor.deleteShapes(placeholderIds);

  const textShapeId = createShapeId();
  editor.createShape({
    id: textShapeId,
    type: 'text',
    props: {
      richText: toRichText(response),
      autoSize: false,
      w: VIDEO_WIDTH,
    },
  });

  const newShape = editor.getShape(textShapeId);

  if (!newShape) return;

  placeNewShape(editor, newShape);
  createArrowBetweenShapes(editor, shape.id, newShape.id);
};

const genImageClick = async (editor: Editor) => {
  console.log('generate image');
  const shapes = editor.getSelectedShapes();
  const contents: string[] = [];
  const images = [];

  const sourceShapesId: TLShapeId[] = [];

  await Promise.all(
    shapes
      .filter((shape) => editor.isShapeOfType(shape, 'text'))
      .map(async (shape) => {
        console.log('selected text shape:', shape.id);
        const selectedTextShape = editor.getShape<TLTextShape>(shape.id)!;
        console.log(selectedTextShape);
        const textParts = (selectedTextShape.props.richText.content as any[])
          .filter((p) => p.type === 'paragraph' && p.content?.length > 0)
          .map((p) => p.content.map((t: any) => t.text).join(''));
        contents.push(...textParts);
        sourceShapesId.push(shape.id);
      }),
  );

  const imageShapes = shapes.filter((shape) =>
    editor.isShapeOfType(shape, 'image'),
  );
  imageShapes.length = Math.min(1, imageShapes.length); // Max 1 image shape

  await Promise.all(
    imageShapes.map(async (shape) => {
      console.log('selected image shape:', shape.id);
      // Export as PNG blob
      const shapeExport = await editor.toImage([shape.id], {
        format: 'png',
        scale: 1,
        background: true,
      });
      images.push(shapeExport.blob);
      sourceShapesId.push(shape.id);
    }),
  );

  console.log(contents, images);
  if (contents.length === 0 && images.length === 0) return;

  const placeholderIds = addPlaceholder(editor, 'Generating image...');
  editor.select(placeholderIds[0]);
  editor.zoomToSelectionIfOffscreen(20);

  const promptText = contents.join('\n');
  const image = images.length > 0 ? images[0] : null;

  console.log('generating...', contents);
  let imageObjects = [];
  try {
    imageObjects = await generateImages(promptText, image);
  } catch (e) {
    editor.select(placeholderIds[0]);
    editor.deleteShapes(placeholderIds);
    throw new Error(e.message);
  }
  console.log('done.');

  editor.select(placeholderIds[0]);

  let bounds = editor.getSelectionPageBounds();

  const x = bounds.left;
  const y = bounds.top;
  const w = bounds.width;
  const h = bounds.height;

  editor.deleteShapes(placeholderIds);

  let lastId: TLShapeId = null;

  imageObjects.forEach((imgSrc, i) => {
    const assetId = AssetRecordType.createId();

    editor.createAssets([
      {
        id: assetId,
        type: 'image',
        typeName: 'asset',
        props: {
          name: `sample_${i}_${assetId}.jpg`,
          src: imgSrc,
          w: VIDEO_WIDTH,
          h: VIDEO_HEIGHT,
          mimeType: 'image/jpeg',
          isAnimated: false,
        },
        meta: {},
      },
    ]);

    lastId = createShapeId();
    editor.createShape({
      id: lastId,
      type: 'image',
      x: x + i * 30,
      y: y + i * 30,
      props: {
        assetId,
        w,
        h,
      },
    });

    sourceShapesId.forEach((shapeId) => {
      createArrowBetweenShapes(editor, shapeId, lastId);
    });
  });

  if (lastId) {
    editor.select(lastId);
    editor.zoomToSelection({animation: {duration: 400}});
  }
};

const generateNewImage = async (
  editor: Editor,
  prompt: string,
  imgSrc: string,
) => {
  console.log('generateNewImage', prompt, imgSrc);

  const textShapeId = createShapeId();
  const imgShapeId = createShapeId();
  const idsToSelect: TLShapeId[] = [];

  // add image to canvas
  if (imgSrc) {
    const assetId = AssetRecordType.createId();

    editor.createAssets([
      {
        id: assetId,
        type: 'image',
        typeName: 'asset',
        props: {
          name: `uploaded_image_${assetId}.jpg`,
          src: imgSrc,
          w: VIDEO_WIDTH,
          h: VIDEO_HEIGHT,
          mimeType: 'image/jpeg',
          isAnimated: false,
        },
        meta: {},
      },
    ]);

    editor.createShape({
      id: imgShapeId,
      type: 'image',
      props: {
        assetId,
      },
    });

    const imgShape = editor.getShape(imgShapeId);
    placeNewShape(editor, imgShape!);
    idsToSelect.push(imgShapeId);
  }

  // add text to canvas
  if (prompt) {
    editor.createShape({
      id: textShapeId,
      type: 'text',
      props: {
        richText: toRichText(prompt),
        autoSize: true,
      },
    });

    const textShape = editor.getShape(textShapeId);
    placeNewShape(editor, textShape!);
    idsToSelect.push(textShapeId);
  }

  // select
  if (idsToSelect.length > 0) {
    editor.select(...idsToSelect);
    editor.zoomToSelection({animation: {duration: 400}});
  }

  // generate
  await genImageClick(editor);
};

// ---

const assetUrls: TldrawProps['assetUrls'] = {
  icons: {
    'genai-describe-image': await loadIcon('/genai-describe-image.svg'),
    'genai-generate-image': await loadIcon('/genai-generate-image.svg'),
  },
};

const OverlayComponent = track(() => {
  const editor = useEditor();
  const {addToast} = useToasts();
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      onPointerDown={stopEventPropagation}>
      <ContextualToolbarComponent />
      <PromptBar
        onSubmit={async (prompt, image) => {
          try {
            await generateNewImage(editor, prompt, image);
          } catch (e) {
            addToast({title: e.message, severity: 'error'});
          }
        }}
      />
    </div>
  );
});

const ContextualToolbarComponent = track(() => {
  const editor = useEditor();
  const ref = useRef<HTMLDivElement>(null);
  usePassThroughWheelEvents(ref);

  const showToolbar = editor.isIn('select.idle');
  if (!showToolbar) return null;

  const getSelectionBounds = () => {
    const fullBounds = editor.getSelectionRotatedScreenBounds();
    if (!fullBounds) return undefined;
    const box = new Box(
      fullBounds.x,
      fullBounds.y + fullBounds.height + 75,
      fullBounds.width,
      0,
    );
    return box;
  };

  const shapes = editor.getSelectedShapes();
  const textShapes = shapes.filter((shape) =>
    editor.isShapeOfType(shape, 'text'),
  );
  const imageShapes = shapes.filter((shape) =>
    editor.isShapeOfType(shape, 'image'),
  );
  const otherShapes = shapes.filter(
    (shape) =>
      !editor.isShapeOfType(shape, 'image') &&
      !editor.isShapeOfType(shape, 'text'),
  );

  const hasImage = imageShapes.length > 0;
  const hasText = textShapes.length > 0;
  const hasOtherShapes = otherShapes.length > 0;

  if (hasOtherShapes || (textShapes.length === 0 && imageShapes.length === 0))
    return null;

  const actions = [];

  if (hasImage && !hasText) {
    actions.push({
      label: 'Describe',
      title: 'Describe image',
      icon: 'genai-describe-image',
      onClick: () => describeClick(editor),
    });
  }
  if (hasText && !hasImage) {
    actions.push({
      label: 'Generate image',
      title: 'Generate image from text',
      icon: 'genai-generate-image',
      onClick: () => genImageClick(editor),
    });
  }
  if (hasText && hasImage) {
    actions.push({
      label: 'Generate image',
      title: 'Generate image from image and text',
      icon: 'genai-generate-image',
      onClick: () => genImageClick(editor),
    });
  }
  if (hasOtherShapes) actions.length = 0;

  return (
    <TldrawUiContextualToolbar
      getSelectionBounds={getSelectionBounds}
      label="GenAI">
      <div className="genai-actions-context" ref={ref}>
        {actions?.map(({label, title, icon, onClick}, i) => (
          <TldrawUiButton
            key={`${i}`}
            title={title}
            type="icon"
            onClick={onClick}>
            <TldrawUiButtonIcon small icon={icon} />
            {label}
          </TldrawUiButton>
        ))}
      </div>
    </TldrawUiContextualToolbar>
  );
});

// ---

export default function AiBoard() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const {theme} = useTheme();

  return (
    <div className="aiboard-module-container">
      <div className="tldraw-wrapper">
        <Tldraw
          // Fix: The `darkMode` prop does not exist on TldrawProps. The theme is instead
          // controlled by the `data-theme` attribute on a parent element, which is
          // handled by the `ThemeProvider`.
          components={{
            InFrontOfTheCanvas: OverlayComponent,
          }}
          assetUrls={assetUrls}
          onMount={(editor) => {
            setEditor(editor);
            editor.user.updateUserPreferences({
              animationSpeed: 1,
            });
            editor.zoomToFit();
          }}
        />
      </div>
    </div>
  );
}
