/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
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


const DefaultDashboard = ({ onNavigate }) => {
    // Calculate stats
    const totalCourses = coursesData.length;
    const totalLessons = coursesData.reduce((acc, course) => {
        return acc + course.terms.reduce((termAcc, term) => {
            return termAcc + term.subjects.reduce((subjectAcc, subject) => {
                return subjectAcc + subject.units.reduce((unitAcc, unit) => {
                    return unitAcc + unit.chapters.reduce((chapterAcc, chapter) => {
                        return chapterAcc + chapter.topics.length;
                    }, 0);
                }, 0);
            }, 0);
        }, 0);
    }, 0);

    return (
        <div className="default-dashboard-container">
            <div className="dd-welcome-banner">
                <h2>Welcome to TutorPad</h2>
                <p>Enhance your learning with advanced methodologies.</p>
            </div>

            <div className="dd-stats-grid">
                <div className="dd-stat-card">
                    <h4>Total Courses</h4>
                    <p>{totalCourses}</p>
                </div>
                <div className="dd-stat-card">
                    <h4>Total Lessons</h4>
                    <p>{totalLessons}</p>
                </div>
            </div>

            <div className="dd-quick-nav">
                <h3>Quick Navigation</h3>
                <div className="dd-nav-grid">
                    <div className="dd-nav-card" onClick={() => onNavigate('tutorpanel')}>
                        <BookOpenIcon />
                        <span>Browse Courses</span>
                    </div>
                    <div className="dd-nav-card" onClick={() => onNavigate('aiboard')}>
                        <AiBoardIcon />
                        <span>AI Whiteboard</span>
                    </div>
                    <div className="dd-nav-card" onClick={() => onNavigate('threed-gallery')}>
                        <ThreeDIcon />
                        <span>3D Gallery</span>
                    </div>
                    <div className="dd-nav-card" onClick={() => onNavigate('ailab')}>
                        <AiLabIcon />
                        <span>AI Sim Lab</span>
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