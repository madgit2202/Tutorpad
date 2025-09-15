/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import LogoIcon from './Components/LogoIcon';


const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <LogoIcon width={48} height={48} />
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