/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState, useEffect} from 'react';
import AiBoard from './AiBoard';
import Tutorpanel from './Tutorpanel';
import ThreeDGallery from './ThreeDGallery';
import {useTheme} from './ThemeContext';
import AiLab from './AiLab';
import DefaultDashboard from './DefaultDashboard';
import LogoIcon from './Components/LogoIcon';

const DashboardIcon = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

const AiBoardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M12 3L9.27 9.27L3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73z" />
  </svg>
);

const MonitorPenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4.5" />
    <path d="M12 17v4" />
    <path d="M8 21h8" />
    <path d="M21.5 11.5a1.414 1.414 0 0 1-2 2L15 18l-2-2 4.5-4.5a1.414 1.414 0 0 1 2-2l2 2Z" />
  </svg>
);

const ThreeDIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const AiLabIcon = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round">
      <path d="M7 2v11a5 5 0 0 0 10 0V2"/>
      <path d="M5 2h14"/>
      <path d="M7 18.5a2.5 2.5 0 0 0 2.5 2.5h5a2.5 2.5 0 0 0 0-5h-5a2.5 2.5 0 0 1 0-5h5a2.5 2.5 0 0 1 2.5 2.5"/>
    </svg>
);


const HamburgerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SidebarToggleIcon = () => (
    <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="3" x2="9" y2="21"></line>
    </svg>
);

const SunIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const LogOutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const {theme, toggleTheme} = useTheme();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(false); // Disable collapse on mobile
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleModuleChange = (module: string) => {
    setActiveModule(module);
    setIsMenuOpen(false); // Close menu on selection
  };

  const moduleName =
    activeModule === 'dashboard'
      ? 'Dashboard'
      : activeModule === 'aiboard'
      ? 'Ai Board'
      : activeModule === 'tutorpanel'
      ? 'Tutorpanel'
      : activeModule === 'threed-gallery'
      ? '3D Gallery'
      : 'AI Lab';

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="menu-toggle" onClick={() => setIsMenuOpen(true)}><HamburgerIcon /></button>
        <h2>{moduleName}</h2>
      </header>

      {/* Sidebar Overlay for mobile */}
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isMenuOpen ? 'is-open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <LogoIcon />
            <h2>TutorPad</h2>
          </div>
          <button className="menu-close" onClick={() => setIsMenuOpen(false)}><CloseIcon /></button>
        </div>
        <ul className="sidebar-modules">
          <li className={activeModule === 'dashboard' ? 'active' : ''} onClick={() => handleModuleChange('dashboard')}><DashboardIcon /> <span>Dashboard</span></li>
          <li className={activeModule === 'tutorpanel' ? 'active' : ''} onClick={() => handleModuleChange('tutorpanel')}><MonitorPenIcon /> <span>Tutorpanel</span></li>
          <li className={activeModule === 'aiboard' ? 'active' : ''} onClick={() => handleModuleChange('aiboard')}><AiBoardIcon /> <span>AI Board</span></li>
          <li className={activeModule === 'threed-gallery' ? 'active' : ''} onClick={() => handleModuleChange('threed-gallery')}><ThreeDIcon /> <span>3D Gallery</span></li>
          <li className={activeModule === 'ailab' ? 'active' : ''} onClick={() => handleModuleChange('ailab')}><AiLabIcon /> <span>AI Lab</span></li>
        </ul>
        <div className="sidebar-footer">
            <button className="sidebar-toggle" onClick={onLogout}>
                <LogOutIcon /> <span>Logout</span>
            </button>
            <button
              className="sidebar-toggle"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-expanded={!isSidebarCollapsed}
              aria-label={
                isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
              }>
              <SidebarToggleIcon />
              <span>{isSidebarCollapsed ? 'Expand' : 'Collapse'}</span>
            </button>
        </div>
      </aside>

      <main className="content-area">
        <button className="theme-toggle-button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
        {activeModule === 'dashboard' && <DefaultDashboard onNavigate={handleModuleChange} />}
        {activeModule === 'aiboard' && <AiBoard />}
        {activeModule === 'tutorpanel' && <Tutorpanel />}
        {activeModule === 'threed-gallery' && <ThreeDGallery />}
        {activeModule === 'ailab' && <AiLab />}
      </main>
    </div>
  );
};

export default Dashboard;