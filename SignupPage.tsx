/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import LogoIcon from './Components/LogoIcon';
import { coursesData } from './Tutorpanel';

const SignupPage = ({ onSignup, onNavigateToLogin }: { onSignup: (user: { name: string }) => void, onNavigateToLogin: () => void }) => {
    const [fullName, setFullName] = useState('');
    const [selections, setSelections] = useState<{
        courses: string[];
        terms: Record<string, number[]>;
        subjects: Record<number, string[]>;
    }>({
        courses: [],
        terms: {},
        subjects: {}
    });

    const handleCourseToggle = (courseId: string) => {
        setSelections(prev => {
            const isSelected = prev.courses.includes(courseId);
            
            if (isSelected) {
                // Un-selecting
                const newCourses = prev.courses.filter(id => id !== courseId);
                const newTerms = { ...prev.terms };
                delete newTerms[courseId];
                
                const newSubjects = { ...prev.subjects };
                const courseData = coursesData.find(c => c.id === courseId);
                if (courseData) {
                    for (const term of courseData.terms) {
                        delete newSubjects[term.id];
                    }
                }
                
                return {
                    courses: newCourses,
                    terms: newTerms,
                    subjects: newSubjects,
                };
            } else {
                // Selecting
                return {
                    ...prev,
                    courses: [...prev.courses, courseId],
                    terms: {
                        ...prev.terms,
                        [courseId]: [],
                    }
                };
            }
        });
    };

    const handleTermToggle = (courseId: string, termId: number) => {
        setSelections(prev => {
            const isSelected = prev.terms[courseId]?.includes(termId);
            const newTermsForCourse = [...(prev.terms[courseId] || [])];
            
            if (isSelected) {
                // Un-selecting
                const termIndex = newTermsForCourse.indexOf(termId);
                if (termIndex > -1) newTermsForCourse.splice(termIndex, 1);
                
                const newSubjects = { ...prev.subjects };
                delete newSubjects[termId];

                return {
                    ...prev,
                    terms: {
                        ...prev.terms,
                        [courseId]: newTermsForCourse,
                    },
                    subjects: newSubjects,
                };
            } else {
                // Selecting
                newTermsForCourse.push(termId);
                return {
                    ...prev,
                    terms: {
                        ...prev.terms,
                        [courseId]: newTermsForCourse,
                    },
                    subjects: {
                        ...prev.subjects,
                        [termId]: [],
                    }
                };
            }
        });
    };

    const handleSubjectToggle = (termId: number, subjectName: string) => {
        setSelections(prev => {
            const isSelected = prev.subjects[termId]?.includes(subjectName);
            const newSubjectsForTerm = [...(prev.subjects[termId] || [])];

            if (isSelected) {
                const subjectIndex = newSubjectsForTerm.indexOf(subjectName);
                if (subjectIndex > -1) newSubjectsForTerm.splice(subjectIndex, 1);
            } else {
                newSubjectsForTerm.push(subjectName);
            }

            return {
                ...prev,
                subjects: {
                    ...prev.subjects,
                    [termId]: newSubjectsForTerm,
                },
            };
        });
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would handle the 'selections' state data here.
        // For this demo, we'll just log in the user.
        onSignup({ name: fullName });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <LogoIcon width={48} height={48} />
                    <h1>Tutor Signup</h1>
                    <p>Create your account to get started.</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="fullname">Full Name</label>
                        <input 
                            type="text" 
                            id="fullname" 
                            placeholder="John Doe" 
                            required 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="you@example.com" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="••••••••" required />
                    </div>
                    
                    <div className="selection-group">
                        <label>Subjects Handled</label>
                        <div className="selection-tree">
                            {coursesData.map(course => (
                                <div key={course.id} className="course-node">
                                    <label>
                                        <input 
                                            type="checkbox" 
                                            checked={selections.courses.includes(course.id)} 
                                            onChange={() => handleCourseToggle(course.id)}
                                        />
                                        {course.name}
                                    </label>
                                    {selections.courses.includes(course.id) && (
                                    <div className="term-nodes">
                                        {course.terms.map(term => (
                                        <div key={term.id} className="term-node">
                                            <label>
                                            <input
                                                type="checkbox"
                                                checked={selections.terms[course.id]?.includes(term.id)}
                                                onChange={() => handleTermToggle(course.id, term.id)}
                                            />
                                            {term.name}
                                            </label>
                                            {selections.terms[course.id]?.includes(term.id) && (
                                            <div className="subject-nodes">
                                                {term.subjects.map(subject => (
                                                <div key={subject.name} className="subject-node">
                                                    <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={selections.subjects[term.id]?.includes(subject.name)}
                                                        onChange={() => handleSubjectToggle(term.id, subject.name)}
                                                    />
                                                    {subject.name}
                                                    </label>
                                                </div>
                                                ))}
                                            </div>
                                            )}
                                        </div>
                                        ))}
                                    </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="login-button">Sign Up</button>
                </form>
                <div className="auth-nav-link">
                    Already have an account? <button onClick={onNavigateToLogin}>Sign In</button>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;