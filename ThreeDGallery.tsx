/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState, useMemo, useEffect} from 'react';

// Icons for the new card design
const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7v0A2.5 2.5 0 0 0 7 9.5v0A2.5 2.5 0 0 1 4.5 12v0A2.5 2.5 0 0 1 7 14.5v0A2.5 2.5 0 0 0 9.5 17v0A2.5 2.5 0 0 1 12 19.5v0A2.5 2.5 0 0 1 14.5 17v0A2.5 2.5 0 0 0 17 14.5v0A2.5 2.5 0 0 1 19.5 12v0A2.5 2.5 0 0 1 17 9.5v0A2.5 2.5 0 0 0 14.5 7v0A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 2"/>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v0A2.5 2.5 0 0 0 14.5 7v0A2.5 2.5 0 0 1 17 9.5v0A2.5 2.5 0 0 0 19.5 12v0A2.5 2.5 0 0 0 17 14.5v0A2.5 2.5 0 0 1 14.5 17v0A2.5 2.5 0 0 0 12 19.5v0A2.5 2.5 0 0 0 9.5 17v0A2.5 2.5 0 0 1 7 14.5v0A2.5 2.5 0 0 0 4.5 12v0A2.5 2.5 0 0 0 7 9.5v0A2.5 2.5 0 0 1 9.5 7v0A2.5 2.5 0 0 0 12 4.5v0A2.5 2.5 0 0 0 14.5 2"/>
        <path d="M12 12v10"/>
        <path d="M12 12a2.5 2.5 0 0 0 2.5-2.5v0A2.5 2.5 0 0 0 12 7v0A2.5 2.5 0 0 0 9.5 9.5v0A2.5 2.5 0 0 0 12 12Z"/>
        <path d="M4.5 12H2"/>
        <path d="M22 12h-2.5"/>
    </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.6a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.07a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
);

const CellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
        <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"/>
    </svg>
);

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

const Loader = () => (
    <div className="threed-loader-container">
        <div className="pulsar-loader">
            <div className="pulsar-ring"></div>
            <div className="pulsar-ring"></div>
            <div className="pulsar-ring"></div>
            <div className="pulsar-ring"></div>
        </div>
    </div>
);


const ThreeDGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const iconMap = {
    brain: <BrainIcon />,
    cell: <CellIcon />,
    heart: <HeartIcon />,
  };

  useEffect(() => {
    const fetchModels = async () => {
        try {
            // Simulate a network request
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real application, you would fetch this data from an API:
            // const response = await fetch('/api/models');
            // const modelsDataFromApi = await response.json();
            const modelsDataFromApi = [
              {
                id: 'human-brain',
                name: 'Human Brain',
                description: 'A detailed model of the human brain.',
                iconName: 'brain',
                colorClass: 'brain-icon-bg',
                embedUrl: 'https://sketchfab.com/models/e073c2590bc24daaa7323f4daa5b7784/embed',
              },
              {
                id: 'human-cell',
                name: 'Human Cell',
                description: 'A detailed model of a human cell.',
                iconName: 'cell',
                colorClass: 'cell-icon-bg',
                embedUrl: 'https://sketchfab.com/models/60ef7d2515b0403986ff9e8b7f234a66/embed',
              },
              {
                id: 'human-heart',
                name: 'Human Heart',
                description: 'A detailed, animated model of a human heart.',
                iconName: 'heart',
                colorClass: 'heart-icon-bg',
                embedUrl:
                  'https://sketchfab.com/models/c6091410425a4d65b5074127011f0c23/embed',
              },
            ];

            // Attach the component to the data based on the icon name
            const modelsWithIcons = modelsDataFromApi.map(model => ({
                ...model,
                icon: iconMap[model.iconName] || <BrainIcon /> // Fallback icon
            }));

            setModels(modelsWithIcons);

        } catch (err) {
            setError('Failed to load 3D models. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    fetchModels();
  }, []); // Empty dependency array ensures this runs only once on mount

  const filteredModels = useMemo(
    () =>
      models.filter((model) =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, models],
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
        {isLoading ? (
            <Loader />
        ) : error ? (
            <div className="threed-error-container">{error}</div>
        ) : (
            filteredModels.map((model) => (
                <div
                    key={model.id}
                    className="threed-card"
                    onClick={() => openModel(model)}
                    onKeyDown={(e) =>
                    (e.key === 'Enter' || e.key === ' ') && openModel(model)
                    }
                    role="button"
                    tabIndex={0}>
                    <div className={`threed-card-icon-wrapper ${model.colorClass}`}>
                    {model.icon}
                    </div>
                    <div className="threed-card-content">
                    <h4>{model.name}</h4>
                    <p>{model.description}</p>
                    </div>
                    <div className="threed-card-footer">
                    <span>View Model &rarr;</span>
                    </div>
                </div>
            ))
        )}
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