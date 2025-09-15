/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import LoginPage from './LoginPage';
import SplashScreen from './SplashScreen';

const App = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 4000); // Let the splash screen run for 4 seconds
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <>
            {isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />}
        </>
    );
};

export default App;