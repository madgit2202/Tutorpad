/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState, useMemo, useEffect} from 'react';
import AiBoard from './AiBoard';
import ThreeDGallery from './ThreeDGallery';

// --- Icon Components ---

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const TocIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const CheckmarkIcon = () => (
  <svg
    className="checkmark-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const PrevIcon = () => <ChevronRightIcon style={{transform: 'rotate(180deg)'}} />;
const NextIcon = () => <ChevronRightIcon />;

const PlusIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const MinusIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const AiBoardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M12 3L9.27 9.27L3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73z" />
  </svg>
);

const MinimizeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
  </svg>
);

const RestoreIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M15 3h6v6h-6V3zM9 3H3v6h6V3zM15 21h6v-6h-6v6zM9 21H3v-6h6v6z" />
  </svg>
);

const ThreeDIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

// --- Sub-components ---

const TableOfContents = ({
  subject,
  activeTopic,
  onSelectTopic,
  initialUnitId,
  completedTopics,
}) => {
  const [expandedItems, setExpandedItems] = useState(() => {
    // Automatically expand the initial unit and its first chapter
    const initialUnit = subject.units.find((u) => u.id === initialUnitId);
    if (!initialUnit) return {};
    const initialChapter =
      initialUnit.chapters.length > 0 ? initialUnit.chapters[0].id : null;
    return {
      [initialUnitId]: true,
      ...(initialChapter && {[initialChapter]: true}),
    };
  });

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({...prev, [id]: !prev[id]}));
  };

  return (
    <nav aria-label="Table of Contents">
      <ul className="toc-list">
        {subject.units.map((unit) => (
          <li key={unit.id} className="toc-item toc-unit">
            <div onClick={() => toggleExpand(unit.id)}>
              <span>{unit.name}</span>
              <ChevronRightIcon
                className={`toc-chevron ${
                  expandedItems[unit.id] ? 'expanded' : ''
                }`}
              />
            </div>
            <div
              className={`toc-item-content ${
                expandedItems[unit.id] ? 'expanded' : ''
              }`}>
              <ul className="toc-list">
                {unit.chapters.map((chapter) => (
                  <li key={chapter.id} className="toc-item toc-chapter">
                    <div onClick={() => toggleExpand(chapter.id)}>
                      <span>{chapter.name}</span>
                      <ChevronRightIcon
                        className={`toc-chevron ${
                          expandedItems[chapter.id] ? 'expanded' : ''
                        }`}
                      />
                    </div>
                    <div
                      className={`toc-item-content ${
                        expandedItems[chapter.id] ? 'expanded' : ''
                      }`}>
                      <ul className="toc-list">
                        {chapter.topics.map((topic) => {
                          const isCompleted = completedTopics.has(topic.id);
                          return (
                            <li
                              key={topic.id}
                              className={`toc-topic ${
                                activeTopic?.id === topic.id ? 'active' : ''
                              }`}
                              onClick={() => onSelectTopic(topic)}>
                              {isCompleted && <CheckmarkIcon />}
                              <span>{topic.title}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const findUnitForTopic = (subject, topicId) => {
    for (const unit of subject.units) {
        for (const chapter of unit.chapters) {
            if (chapter.topics.some(t => t.id === topicId)) {
                return unit;
            }
        }
    }
    return null;
}

const LessonViewer = ({lessonData, onClose, completedTopics, setCompletedTopics}) => {
  const {subject, course, term, initialUnitId, initialTopicId} = lessonData;
  const [isTocOpen, setIsTocOpen] = useState(true);
  const [fontSize, setFontSize] = useState(1); // 1 = 1rem
  
  const [activeModule, setActiveModule] = useState(null);
  const [isModuleMinimized, setIsModuleMinimized] = useState(false);
  const [moduleWidth, setModuleWidth] = useState(window.innerWidth * 0.4);
  const isResizing = React.useRef(false);

  const FONT_STEP = 0.1;
  const MIN_FONT_SIZE = 0.8;
  const MAX_FONT_SIZE = 1.5;

  const flatTopics = useMemo(() => {
    return subject.units.flatMap((unit) =>
      unit.chapters.flatMap((chapter) => chapter.topics),
    );
  }, [subject]);

  const [activeTopic, setActiveTopic] = useState(() => {
    if (initialTopicId) {
        const topic = flatTopics.find(t => t.id === initialTopicId);
        if (topic) return topic;
    }
    const initialUnit = subject.units.find((u) => u.id === initialUnitId);
    if (
      initialUnit &&
      initialUnit.chapters.length > 0 &&
      initialUnit.chapters[0].topics.length > 0
    ) {
      return initialUnit.chapters[0].topics[0];
    }
    return flatTopics[0] || null;
  });

  useEffect(() => {
    if (activeTopic && course && term && subject) {
        const unit = findUnitForTopic(subject, activeTopic.id);
        if (unit) {
            const lastViewed = {
                courseId: course.id,
                termId: term.id,
                subjectName: subject.name,
                unitId: unit.id,
                topicId: activeTopic.id,
                topicTitle: activeTopic.title,
                subjectTitle: subject.name,
            };
            localStorage.setItem('lastViewedLesson', JSON.stringify(lastViewed));
        }
    }
  }, [activeTopic, course, term, subject]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(MAX_FONT_SIZE, prev + FONT_STEP));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(MIN_FONT_SIZE, prev - FONT_STEP));
  };
  
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      // Calculate new width from the right edge of the screen
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 300 && newWidth < window.innerWidth * 0.8) {
        setModuleWidth(newWidth);
      }
    };
    const handleMouseUp = () => {
      isResizing.current = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  const handleAiBoardToggle = () => {
    if (activeModule === 'aiboard') {
      setIsModuleMinimized(!isModuleMinimized);
    } else {
      setActiveModule('aiboard');
      setIsModuleMinimized(false);
    }
  };

  const handleThreeDGalleryToggle = () => {
    if (activeModule === 'threed-gallery') {
      setIsModuleMinimized(!isModuleMinimized);
    } else {
      setActiveModule('threed-gallery');
      setIsModuleMinimized(false);
    }
  };

  const activeTopicIndex = useMemo(
    () => flatTopics.findIndex((t) => t.id === activeTopic?.id),
    [flatTopics, activeTopic],
  );

  const handleToggleComplete = () => {
    setCompletedTopics((prev) => {
      const newSet = new Set(prev);
      newSet.add(activeTopic.id);
      return newSet;
    });
  };

  const navigateTopic = (direction) => {
    // Mark current topic as complete when moving forward
    if (direction > 0 && activeTopic) {
      handleToggleComplete();
    }
    const newIndex = activeTopicIndex + direction;
    if (newIndex >= 0 && newIndex < flatTopics.length) {
      setActiveTopic(flatTopics[newIndex]);
    }
  };

  const mainContentRef = React.useRef(null);
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [activeTopic]);

  if (!activeTopic) {
    return (
      <div className="lesson-viewer-container">
        <p>No content available for this subject.</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }
  
  const isCurrentTopicCompleted = completedTopics.has(activeTopic.id);
  const moduleTitle =
    activeModule === 'aiboard'
      ? 'Ai Board'
      : activeModule === 'threed-gallery'
      ? '3D Gallery'
      : '';

  return (
    <div className="lesson-viewer-container">
      <header className="lv-header">
        <div className="lv-header-left">
          <button
            className="lv-nav-button"
            onClick={() => setIsTocOpen(!isTocOpen)}
            aria-label={
              isTocOpen ? 'Hide Table of Contents' : 'Show Table of Contents'
            }>
            <TocIcon />
          </button>
          <h2>{subject.name}</h2>
        </div>
        <div className="lv-header-right">
          <button
            className="lv-nav-button"
            onClick={() => navigateTopic(-1)}
            disabled={activeTopicIndex === 0}
            aria-label="Previous Topic">
            <PrevIcon />
            <span>Prev</span>
          </button>
          <button
            className="lv-nav-button"
            onClick={() => navigateTopic(1)}
            disabled={activeTopicIndex === flatTopics.length - 1}
            aria-label="Next Topic">
            <span>Next</span>
            <NextIcon />
          </button>
          <button
            className="lv-nav-button"
            onClick={onClose}
            aria-label="Close Lesson Viewer">
            <CloseIcon />
          </button>
        </div>
      </header>
      <div className="lv-body">
        <aside className={`lv-toc ${!isTocOpen ? 'collapsed' : ''}`}>
          <TableOfContents
            subject={subject}
            activeTopic={activeTopic}
            onSelectTopic={setActiveTopic}
            initialUnitId={initialUnitId}
            completedTopics={completedTopics}
          />
        </aside>
        <main
          className="lv-main"
          ref={mainContentRef}
          style={{fontSize: `${fontSize}rem`}}>
          <article className="lv-content">
            <h3>{activeTopic.title}</h3>
            {activeTopic.description && <p>{activeTopic.description}</p>}
            <div dangerouslySetInnerHTML={{__html: activeTopic.content}} />
          </article>
          <footer className="lv-footer">
            <button
              className={`lv-complete-button ${
                isCurrentTopicCompleted ? 'completed' : ''
              }`}
              onClick={handleToggleComplete}
              disabled={isCurrentTopicCompleted}>
              {isCurrentTopicCompleted ? '✓ Completed' : 'Mark as Complete'}
            </button>
          </footer>
        </main>
        
        {activeModule && (
          <div
            className={`lv-module-viewer ${isModuleMinimized ? 'minimized' : ''}`}
            style={{ width: isModuleMinimized ? '48px' : `${moduleWidth}px` }}
          >
            <div className="resize-handle" onMouseDown={handleResizeMouseDown} />
            <header className="lv-module-header">
              <h3>{moduleTitle}</h3>
              <div className="lv-module-header-buttons">
                <button
                  className="lv-toolbar-button"
                  onClick={() => setIsModuleMinimized(true)}
                  aria-label="Minimize Module"
                >
                  <MinimizeIcon />
                </button>
                <button
                  className="lv-toolbar-button"
                  onClick={() => setActiveModule(null)}
                  aria-label="Close Module"
                >
                  <CloseIcon />
                </button>
              </div>
            </header>
            <div className="lv-module-content">
              {activeModule === 'aiboard' && <AiBoard />}
              {activeModule === 'threed-gallery' && <ThreeDGallery />}
            </div>
            <div className="lv-module-minimized-content">
              <button
                className="lv-toolbar-button"
                onClick={() => setIsModuleMinimized(false)}
                aria-label="Restore Module"
              >
                <RestoreIcon />
              </button>
            </div>
          </div>
        )}

        <div className="lv-floating-toolbar">
          <button
            className="lv-toolbar-button"
            onClick={increaseFontSize}
            disabled={fontSize >= MAX_FONT_SIZE}
            aria-label="Increase font size">
            <PlusIcon />
          </button>
          <button
            className="lv-toolbar-button"
            onClick={decreaseFontSize}
            disabled={fontSize <= MIN_FONT_SIZE}
            aria-label="Decrease font size">
            <MinusIcon />
          </button>
          <button
            className="lv-toolbar-button"
            onClick={handleAiBoardToggle}
            aria-label="Toggle AI Board">
            <AiBoardIcon />
          </button>
          <button
            className="lv-toolbar-button"
            onClick={handleThreeDGalleryToggle}
            aria-label="Toggle 3D Gallery">
            <ThreeDIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;