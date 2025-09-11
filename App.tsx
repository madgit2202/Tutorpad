/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import Dashboard from './Dashboard';
import LoginPage from './LoginPage';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <>
            {isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />}
        </>
    );
};

export default App;