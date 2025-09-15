/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState, useMemo, useEffect} from 'react';
import LessonViewer from './LessonViewer';

// --- Data ---
export const coursesData = [
  {
    id: 'bsc-nursing',
    name: 'B.Sc Nursing',
    duration: '8 semesters',
    imageUrl:
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800&auto=format&fit=crop',
    terms: [
      {
        id: 1,
        name: 'Semester 1',
        subjects: [
          {
            name: 'General Science',
            units: [
              {id: 'gs-u1', name: 'Physics', chapters: []},
              {id: 'gs-u2', name: 'Chemistry', chapters: []},
              {id: 'gs-u3', name: 'Biology', chapters: []},
            ],
          },
          {
            name: 'Communicative English',
            units: [
              {id: 'ce-u1', name: 'Grammar and sentence construction', chapters: []},
              {id: 'ce-u2', name: 'Listening skills', chapters: []},
              {id: 'ce-u3', name: 'Speaking skills', chapters: []},
              {id: 'ce-u4', name: 'Writing skills', chapters: []},
              {id: 'ce-u5', name: 'Reading comprehension', chapters: []},
            ],
          },
          {
            name: 'Applied Anatomy & Physiology',
            units: [
              {
                id: 'aap-u1',
                name: 'Anatomical terms and positions',
                chapters: [
                  {
                    id: 'aap-u1-c1',
                    name: 'Introduction to Anatomical Terms and Positions',
                    description:
                      'This chapter introduces the fundamental terminology used in anatomy to describe locations, positions, and orientations of the human body. It establishes the basis for precise and consistent communication in nursing and healthcare by standardizing the way the body is viewed and described regardless of body orientation.',
                    topics: [
                      {
                        id: 'aap-u1-c1-t1',
                        title: 'Anatomical Position and Orientation',
                        description: '',
                        content: `<p>Anatomical position and orientation provide a standardized way to describe the human body and its parts regardless of its actual position. This reference position allows healthcare professionals to communicate clearly and avoid confusion about locations or directions on the body.</p><img src="https://images.unsplash.com/photo-1631594323444-665035775c47?q=80&w=800&auto=format&fit=crop" alt="Diagram of the anatomical position" class="lv-media-image" /><h4>Anatomical Position:</h4><ul><li>The body stands upright facing forward.</li><li>Feet are flat on the floor, slightly apart.</li><li>Arms hang at the sides with palms facing forward.</li><li>Head is level, and eyes look straight ahead.</li></ul><h4>Importance of Anatomical Position:</h4><ul><li>It is the universal starting point for describing locations and directions.</li><li>All anatomical terminology assumes the body is in this position.</li><li>For example, “anterior” always means the front surface as seen in this position.</li></ul><h4>Body Orientation:</h4><ul><li>Terms like left and right always refer to the patient’s left and right, not the observer’s.</li><li>This standardization is critical in clinical settings, surgeries, and medical imaging to avoid mistakes.</li></ul><h4>Instructional Video:</h4><p>This video provides a clear overview of the anatomical position and directional terms.</p><div class="lv-video-wrapper"><iframe src="https://www.youtube.com/embed/qPix_X-9t7E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`,
                      },
                      {
                        id: 'aap-u1-c1-t2',
                        title: 'Directional Terms',
                        description: '',
                        content: `<ul><li><b>Anterior (ventral):</b> Front of the body</li><li><b>Posterior (dorsal):</b> Back of the body</li><li><b>Superior (cranial):</b> Towards the head or above another part</li><li><b>Inferior (caudal):</b> Away from the head or below another part</li><li><b>Medial:</b> Towards the midline of the body</li><li><b>Lateral:</b> Away from the midline</li><li><b>Proximal:</b> Closer to the point of attachment/trunk (used for limbs)</li><li><b>Distal:</b> Farther from the point of attachment/trunk</li><li><b>Superficial:</b> Closer to the surface</li><li><b>Deep:</b> Away from the surface</li><li><b>Prone:</b> Lying face down</li><li><b>Supine:</b> Lying face up</li></ul>`,
                      },
                      {
                        id: 'aap-u1-c1-t3',
                        title: 'Planes and Sections of the Body',
                        description: '',
                        content: `<ul><li><b>Sagittal Plane:</b> Divides body into right and left parts</li><li><b>Median (Midsagittal) Plane:</b> Equal right and left halves</li><li><b>Frontal (Coronal) Plane:</b> Divides into anterior (front) and posterior (back)</li><li><b>Transverse (Horizontal) Plane:</b> Divides into superior (upper) and inferior (lower) parts</li><li><b>Oblique Plane:</b> Any plane at an angle other than the above three</li></ul>`,
                      },
                      {
                        id: 'aap-u1-c1-t4',
                        title: 'Regional Terms of the Body',
                        description: '',
                        content: `<p>Terms to describe specific body regions, e.g., brachium (arm), antebrachium (forearm), crural (leg), pedal (foot), thoracic (chest), abdominal, pelvic, cervical (neck), etc. These terms help localize structures precisely in clinical and academic contexts.</p>`,
                      },
                      {
                        id: 'aap-u1-c1-t5',
                        title: 'Movements of the Body',
                        description: '',
                        content: `<ul><li>Flexion and Extension</li><li>Abduction and Adduction</li><li>Medial and Lateral Rotation</li><li>Supination and Pronation</li><li>Inversion and Eversion</li><li>Circumduction</li><li>Plantar and Dorsal flexion</li></ul>`,
                      },
                    ],
                  },
                ],
              },
              {id: 'aap-u2', name: 'Respiratory system', chapters: []},
              {id: 'aap-u3', name: 'Circulatory system', chapters: []},
              {id: 'aap-u4', name: 'Digestive system', chapters: []},
              {id: 'aap-u5', name: 'Nervous system and sensory organs', chapters: []},
              {id: 'aap-u6', name: 'Musculoskeletal system', chapters: []},
              {id: 'aap-u7', name: 'Endocrine system', chapters: []},
              {id: 'aap-u8', name: 'Reproductive system', chapters: []},
              {id: 'aap-u9', name: 'Renal system', chapters: []},
            ],
          },
          {
            name: 'Applied Sociology & Psychology',
            units: [
              {id: 'asp-u1', name: 'Introduction to Sociology and Psychology', chapters: []},
              {id: 'asp-u2', name: 'Social institutions and community health', chapters: []},
              {id: 'asp-u3', name: 'Role of nurse in healthcare teams', chapters: []},
              {id: 'asp-u4', name: 'Psychology - Cognitive processes, emotions, behavior, development', chapters: []},
            ],
          },
          {
            name: 'Nursing Foundations I',
            units: [
              {id: 'nf1-u1', name: 'Introduction to Nursing and its philosophy', chapters: []},
              {id: 'nf1-u2', name: 'Health and illness concepts', chapters: []},
              {id: 'nf1-u3', name: 'Basic nursing procedures', chapters: []},
              {id: 'nf1-u4', name: 'Patient safety and infection control', chapters: []},
              {id: 'nf1-u5', name: 'Vital signs measurement', chapters: []},
              {id: 'nf1-u6', name: 'First aid and emergency nursing', chapters: []},
            ],
          },
        ],
      },
      // ... (other semesters can be added here with the new structure)
    ],
  },
  {
    id: 'gnm',
    name: 'GNM',
    duration: '3 years',
    imageUrl:
      'https://images.unsplash.com/photo-1550355191-aa7583f09f1a?q=80&w=800&auto=format&fit=crop',
    terms: [], // Simplified for brevity
  },
  {
    id: 'pc-bsc',
    name: 'Post Basic B.Sc Nursing',
    duration: '2 years',
    imageUrl:
      'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?q=80&w=800&auto=format&fit=crop',
    terms: [], // Simplified for brevity
  },
  {
    id: 'msc-nursing',
    name: 'M.Sc Nursing',
    duration: '2 years',
    imageUrl:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
    terms: [], // Simplified for brevity
  },
];

// --- Icon Components ---
const BackIcon = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      aria-hidden="true">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const HealthIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M3.22 12H9.5l.7-1.44.7 1.44H15" />
  </svg>
);

const FileIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const BookIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

// --- Sub-components ---

const Breadcrumbs = ({path, onNavigate}) => (
  <nav className="tutor-breadcrumbs" aria-label="breadcrumb">
    {path.map((item, index) => (
      <React.Fragment key={index}>
        <button
          onClick={() => onNavigate(index)}
          disabled={index === path.length - 1}>
          {item.name}
        </button>
        {index < path.length - 1 && <span aria-hidden="true">/</span>}
      </React.Fragment>
    ))}
  </nav>
);

const Tutorpanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [lessonData, setLessonData] = useState(null);
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('lessonProgress');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
      console.error('Failed to load lesson progress:', error);
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        'lessonProgress',
        JSON.stringify(Array.from(completedTopics)),
      );
    } catch (error) {
      console.error('Failed to save lesson progress:', error);
    }
  }, [completedTopics]);

  const filteredCourses = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase().trim();
    let results = coursesData;

    // 1. Apply course filter
    if (selectedCourseFilter !== 'all') {
      results = results.filter((course) => course.id === selectedCourseFilter);
    }

    // 2. Apply search term
    if (lowercasedTerm) {
      results = results.filter(
        (course) =>
          // Search course name
          course.name.toLowerCase().includes(lowercasedTerm) ||
          // Search subject names within the course
          course.terms.some((term) =>
            term.subjects.some((subject) =>
              subject.name.toLowerCase().includes(lowercasedTerm),
            ),
          ),
      );
    }

    return results;
  }, [searchTerm, selectedCourseFilter]);

  const calculateUnitProgress = (unit) => {
    const allTopics = unit.chapters.flatMap((chapter) => chapter.topics);
    const totalTopics = allTopics.length;
    if (totalTopics === 0) return {completed: 0, total: 0, percentage: 0};
    const completedCount = allTopics.filter((topic) =>
      completedTopics.has(topic.id),
    ).length;
    const percentage = Math.round((completedCount / totalTopics) * 100);
    return {completed: completedCount, total: totalTopics, percentage};
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setSelectedTerm(null);
    setSelectedSubject(null);
  };

  const handleSelectTerm = (term) => {
    setSelectedTerm(term);
    setSelectedSubject(null);
  };

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
  };

  const handleUnitClick = (unit) => {
    setLessonData({
      subject: selectedSubject,
      initialUnitId: unit.id,
    });
  };

  const handleBack = () => {
    if (selectedSubject) {
      setSelectedSubject(null);
    } else if (selectedTerm) {
      setSelectedTerm(null);
    } else if (selectedCourse) {
      setSelectedCourse(null);
    }
  };

  const handleBreadcrumbNavigate = (index) => {
    if (index === 0) {
      setSelectedCourse(null);
      setSelectedTerm(null);
      setSelectedSubject(null);
    }
    if (index === 1) {
      setSelectedTerm(null);
      setSelectedSubject(null);
    }
    if (index === 2) {
      setSelectedSubject(null);
    }
  };

  const getBreadcrumbPath = () => {
    const path = [{name: 'Courses'}];
    if (selectedCourse) path.push({name: selectedCourse.name});
    if (selectedTerm) path.push({name: selectedTerm.name});
    if (selectedSubject) path.push({name: selectedSubject.name});
    return path;
  };

  const renderContent = () => {
    if (selectedSubject) {
      return (
        <div className="unit-list-container">
          <h3>Units for {selectedSubject.name}</h3>
          <div className="unit-grid">
            {selectedSubject.units.map((unit, index) => {
              const hasContent = unit.chapters && unit.chapters.length > 0;
              const progress = hasContent ? calculateUnitProgress(unit) : null;
              return (
                <div
                  key={unit.id || index}
                  className={`unit-card ${hasContent ? 'clickable' : ''}`}
                  onClick={hasContent ? () => handleUnitClick(unit) : null}
                  onKeyDown={
                    hasContent
                      ? (e) =>
                          (e.key === 'Enter' || e.key === ' ') &&
                          handleUnitClick(unit)
                      : null
                  }
                  tabIndex={hasContent ? 0 : -1}
                  role={hasContent ? 'button' : 'listitem'}>
                  <div className="unit-card-header">
                    <FileIcon />
                    <span>{unit.name}</span>
                  </div>
                  {hasContent && progress && (
                    <div className="unit-progress-container">
                      <div className="unit-progress-bar">
                        <div
                          className="unit-progress-bar-fill"
                          style={{width: `${progress.percentage}%`}}></div>
                      </div>
                      <span className="unit-progress-text">
                        {progress.completed}/{progress.total} Topics (
                        {progress.percentage}%)
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (selectedTerm) {
      return (
        <div className="subject-list-container">
          <h3>Subjects for {selectedTerm.name}</h3>
          <div className="course-grid">
            {selectedTerm.subjects.map((subject, index) => (
              <div
                key={index}
                className="subject-card clickable"
                onClick={() => handleSelectSubject(subject)}
                onKeyDown={(e) =>
                  (e.key === 'Enter' || e.key === ' ') &&
                  handleSelectSubject(subject)
                }
                tabIndex={0}
                role="button">
                <div className="subject-card-icon-wrapper">
                  <HealthIcon />
                </div>
                <div className="subject-card-name">
                  <span>{subject.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (selectedCourse) {
      return (
        <div className="term-list">
          <h3>Select a Term/Year for {selectedCourse.name}</h3>
          <div className="course-grid">
            {selectedCourse.terms.map((term) => (
              <div
                key={term.id}
                className="term-card"
                onClick={() => handleSelectTerm(term)}
                onKeyDown={(e) =>
                  (e.key === 'Enter' || e.key === ' ') &&
                  handleSelectTerm(term)
                }
                role="button"
                tabIndex={0}>
                <div className="term-card-header">
                  <BookIcon />
                  <h4>{term.name}</h4>
                </div>
                <div className="term-card-body">
                  <p className="term-card-subjects">
                    {term.subjects.length} Subjects
                  </p>
                </div>
                <div className="term-card-footer">
                  <ChevronRightIcon />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="search-filter-bar">
          <input
            type="search"
            placeholder="Search courses or subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="tutor-search-bar"
            aria-label="Search courses or subjects"
          />
          <div className="tutor-filter-bar">
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              aria-label="Filter by course">
              <option value="all">All Courses</option>
              {coursesData.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="course-card"
              onClick={() => handleSelectCourse(course)}
              onKeyDown={(e) =>
                (e.key === 'Enter' || e.key === ' ') &&
                handleSelectCourse(course)
              }
              role="button"
              tabIndex={0}>
              <img
                src={course.imageUrl}
                alt={`${course.name} course image`}
                className="course-card-image"
              />
              <div className="course-card-content">
                <h4>{course.name}</h4>
                <p>{course.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  if (lessonData) {
    return (
      <LessonViewer
        lessonData={lessonData}
        onClose={() => setLessonData(null)}
        completedTopics={completedTopics}
        setCompletedTopics={setCompletedTopics}
      />
    );
  }

  return (
    <div className="tutorpanel-container">
      <header className="tutorpanel-header">
        {selectedCourse && (
            <button className="tutorpanel-back-button" onClick={handleBack} aria-label="Go back">
                <BackIcon />
            </button>
        )}
        <h1>Tutorpanel</h1>
        <Breadcrumbs
          path={getBreadcrumbPath()}
          onNavigate={handleBreadcrumbNavigate}
        />
      </header>
      <main className="tutorpanel-content">{renderContent()}</main>
    </div>
  );
};

export default Tutorpanel;