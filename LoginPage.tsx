/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

// Re-using the logo from Dashboard.tsx
const LogoIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 17H20M12 17V21M8 21H16M3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H5C3.89543 16 3 15.1046 3 14Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M9 10L12 8.5L15 10L12 11.5L9 10Z" />
  </svg>
);


const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <LogoIcon />
                    <h1>Welcome to TutorPad</h1>
                    <p>Sign in to continue your learning journey.</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="you@example.com" defaultValue="demo@tutorpad.com" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="••••••••" defaultValue="password" />
                    </div>
                    <button type="submit" className="login-button">Sign In</button>
                </form>
                <div className="login-divider">
                    <span>OR</span>
                </div>
                <div className="social-login">
                    {/* Placeholder for future social logins */}
                    <button type="button" className="social-button">Continue with Google</button>
                    <button type="button" className="social-button">Continue with Microsoft</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
