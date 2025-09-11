/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState, useMemo} from 'react';

// Sample data for 3D models
const modelsData = [
  {
    id: 'human-brain',
    name: 'Human Brain',
    description: 'A detailed model of the human brain.',
    imageUrl:
      'https://images.unsplash.com/photo-1579758629938-03607ccDB445?q=80&w=800&auto=format&fit=crop',
    embedUrl: 'https://sketchfab.com/models/e073c2590bc24daaa7323f4daa5b7784/embed',
  },
  {
    id: 'human-cell',
    name: 'Human Cell',
    description: 'A detailed model of a human cell.',
    imageUrl:
      'https://images.unsplash.com/photo-1582063289721-50d75306ea85?q=80&w=800&auto=format&fit=crop',
    embedUrl: 'https://sketchfab.com/models/60ef7d2515b0403986ff9e8b7f234a66/embed',
  },
  {
    id: 'human-heart',
    name: 'Human Heart',
    description: 'A detailed, animated model of a human heart.',
    imageUrl:
      'https://images.unsplash.com/photo-1599623236021-93c44a2b9044?q=80&w=800&auto=format&fit=crop',
    embedUrl:
      'https://sketchfab.com/models/c6091410425a4d65b5074127011f0c23/embed',
  },
];

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
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

const MedicalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

const ThreeDGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);

  const filteredModels = useMemo(
    () =>
      modelsData.filter((model) =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  );

  const openModel = (model) => {
    setSelectedModel(model);
  };

  const closeModel = () => {
    setSelectedModel(null);
  };

  return (
    <div className="threed-gallery-container">
      <header className="tutorpanel-header">
        <h1>3D Gallery</h1>
        <p>Explore interactive 3D models</p>
      </header>

      <div className="search-filter-bar">
        <div className="threed-search-wrapper">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="tutor-search-bar"
            aria-label="Search 3D models"
          />
        </div>
      </div>

      <main className="threed-gallery-grid">
        {filteredModels.map((model) => (
          <div
            key={model.id}
            className="threed-card"
            onClick={() => openModel(model)}
            onKeyDown={(e) =>
              (e.key === 'Enter' || e.key === ' ') && openModel(model)
            }
            role="button"
            tabIndex={0}>
            <div className="threed-card-image-wrapper">
              <img
                src={model.imageUrl}
                alt={model.name}
                className="threed-card-image"
              />
              <div className="threed-card-icon">
                <MedicalIcon />
              </div>
            </div>
            <div className="threed-card-content">
              <h4>{model.name}</h4>
              <p>{model.description}</p>
            </div>
          </div>
        ))}
      </main>

      {selectedModel && (
        <div
          className="threed-modal-overlay"
          onClick={closeModel}
          role="dialog"
          aria-modal="true">
          <div
            className="threed-modal-content"
            onClick={(e) => e.stopPropagation()}>
            <header className="threed-modal-header">
              <h2>{selectedModel.name}</h2>
              <button
                onClick={closeModel}
                className="threed-modal-close"
                aria-label="Close 3D viewer">
                <CloseIcon />
              </button>
            </header>
            <div className="threed-viewer-container">
              <iframe
                title={selectedModel.name}
                src={selectedModel.embedUrl}
                frameBorder="0"
                allow="autoplay; fullscreen; vr"
                allowFullScreen></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDGallery;
