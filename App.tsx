/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import SplashScreen from './SplashScreen';

type View = 'splash' | 'login' | 'signup' | 'dashboard';

interface User {
    name: string;
}

const App = () => {
    const [view, setView] = useState<View>('splash');
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setView('login'); // Default to login view after splash
        }, 3000); // Splash screen duration
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        setView('dashboard');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView('login');
    };
    
    const renderView = () => {
        switch (view) {
            case 'splash':
                return <SplashScreen />;
            case 'login':
                return <LoginPage onLogin={() => handleLogin({ name: 'Demo Tutor' })} onNavigateToSignup={() => setView('signup')} />;
            case 'signup':
                return <SignupPage onSignup={handleLogin} onNavigateToLogin={() => setView('login')} />;
            case 'dashboard':
                return <Dashboard currentUser={currentUser} onLogout={handleLogout} />;
            default:
                return <LoginPage onLogin={() => handleLogin({ name: 'Demo Tutor' })} onNavigateToSignup={() => setView('signup')} />;
        }
    }

    return (
        <>
           {renderView()}
        </>
    );
};

export default App;