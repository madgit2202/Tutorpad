/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState, useEffect} from 'react';
import { coursesData } from './Tutorpanel';

// Icons for navigation cards
const BookOpenIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
);

const AiBoardIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L9.27 9.27L3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73z" /></svg>
);

const ThreeDIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);

const AiLabIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2v11a5 5 0 0 0 10 0V2"/><path d="M5 2h14"/><path d="M7 18.5a2.5 2.5 0 0 0 2.5 2.5h5a2.5 2.5 0 0 0 0-5h-5a2.5 2.5 0 0 1 0-5h5a2.5 2.5 0 0 1 2.5 2.5"/></svg>
);

const ResumeIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);


// Icons for stat cards
const LibraryIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
);

const FileTextIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
);


const DefaultDashboard = ({ onNavigate }) => {
    const [lastLesson, setLastLesson] = useState(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('lastViewedLesson');
            if (saved) {
                setLastLesson(JSON.parse(saved));
            }
        } catch (error) {
            console.error("Failed to parse last viewed lesson:", error);
        }
    }, []);

    // Calculate stats
    const totalCourses = coursesData.length;
    const totalUnits = coursesData.reduce((acc, course) => {
        return acc + course.terms.reduce((termAcc, term) => {
            return termAcc + term.subjects.reduce((subjectAcc, subject) => {
                return subjectAcc + subject.units.length;
            }, 0);
        }, 0);
    }, 0);

    return (
        <div className="default-dashboard-container">
            <div className="dd-welcome-banner">
                <div className="dd-banner-bg-icon">
                    <BookOpenIcon />
                </div>
                <div className="dd-welcome-banner-content">
                    <h2>Welcome to TutorPad</h2>
                    <p>Enhance your learning with advanced methodologies.</p>
                </div>
            </div>

            <div className="dd-stats-grid">
                <div className="dd-stat-card courses-card">
                    <div className="dd-stat-card-icon-wrapper">
                        <LibraryIcon />
                    </div>
                    <div className="dd-stat-card-content">
                        <h4>Total Courses</h4>
                        <p>{totalCourses}</p>
                    </div>
                </div>
                <div className="dd-stat-card lessons-card">
                    <div className="dd-stat-card-icon-wrapper">
                        <FileTextIcon />
                    </div>
                    <div className="dd-stat-card-content">
                        <h4>Total Units</h4>
                        <p>{totalUnits}</p>
                    </div>
                </div>
            </div>

            <div className="dd-quick-nav">
                <h3>Quick Navigation</h3>
                <div className="dd-nav-grid">
                    {lastLesson && (
                        <div className="dd-nav-card" onClick={() => onNavigate('tutorpanel', lastLesson)}>
                            <ResumeIcon />
                            <div className="dd-nav-card-text-wrapper">
                                <span>Continue Lesson</span>
                                <p title={`${lastLesson.subjectTitle}: ${lastLesson.topicTitle}`}>
                                    {lastLesson.subjectTitle}: {lastLesson.topicTitle}
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="dd-nav-card" onClick={() => onNavigate('tutorpanel')}>
                        <BookOpenIcon />
                        <div className="dd-nav-card-text-wrapper">
                             <span>Browse Courses</span>
                        </div>
                    </div>
                    <div className="dd-nav-card" onClick={() => onNavigate('aiboard')}>
                        <AiBoardIcon />
                        <div className="dd-nav-card-text-wrapper">
                            <span>AI Whiteboard</span>
                        </div>
                    </div>
                    <div className="dd-nav-card" onClick={() => onNavigate('threed-gallery')}>
                        <ThreeDIcon />
                        <div className="dd-nav-card-text-wrapper">
                             <span>3D Gallery</span>
                        </div>
                    </div>
                    <div className="dd-nav-card" onClick={() => onNavigate('ailab')}>
                        <AiLabIcon />
                        <div className="dd-nav-card-text-wrapper">
                            <span>AI Sim Lab</span>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="dd-footer">
                <p>Developed by vollstkek business solutions</p>
                <a href="mailto:vollstek@gmail.com" className="dd-support-button">Get Support</a>
            </footer>
        </div>
    );
};

export default DefaultDashboard;