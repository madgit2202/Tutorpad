/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import VitalsSimulator from './VitalsSimulator';
import IvCalculator from './IvCalculator';

// Icons for the simulator cards
const VitalsIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M3.36 12.08H7.52l1.3-2.6 2.62 5.2 1.3-2.6h4.28" />
    <path d="M20.84 4.6a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.07a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IvCalculatorIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M12 18h.01" />
    <path d="M7 13h10" />
    <path d="M7 8h2" />
    <path d="M15 8h2" />
  </svg>
);

const AiLab = () => {
  const [activeSimulator, setActiveSimulator] = useState(null);

  // Simulators data
  const simulators = [
    {
      id: 'vitals-simulator',
      name: 'Vitals Simulator',
      description:
        'Practice measuring and interpreting vital signs in various clinical scenarios.',
      icon: <VitalsIcon />,
      enabled: true,
      component: VitalsSimulator,
    },
    {
      id: 'iv-calculator',
      name: 'IV Calculator',
      description:
        'Master intravenous infusion rate calculations with this interactive tool.',
      icon: <IvCalculatorIcon />,
      enabled: true,
      component: IvCalculator,
    },
  ];

  const handleCardClick = (id, enabled) => {
    if (enabled) {
      setActiveSimulator(id);
    }
  };

  const activeSimulatorInfo = simulators.find(s => s.id === activeSimulator);
  const ActiveSimulatorComponent = activeSimulatorInfo?.component;

  return (
    <div className="ailab-container">
      {activeSimulatorInfo ? (
         <header className="ailab-header">
            <h3>{activeSimulatorInfo.name}</h3>
            <button className="simulator-back-button" onClick={() => setActiveSimulator(null)}>
              Back to AI Lab
            </button>
        </header>
      ) : (
        <header className="tutorpanel-header">
          <h1>AI Lab</h1>
          <p>Nursing Practical Simulators</p>
        </header>
      )}

      <main className="ailab-content">
        {ActiveSimulatorComponent ? (
          <ActiveSimulatorComponent />
        ) : (
          <div className="simulator-grid">
            {simulators.map((sim) => (
              <div
                key={sim.id}
                className={`simulator-card ${!sim.enabled ? 'disabled' : ''}`}
                aria-disabled={!sim.enabled}
                tabIndex={sim.enabled ? 0 : -1}
                role="button"
                onClick={() => handleCardClick(sim.id, sim.enabled)}
                onKeyDown={(e) =>
                  (e.key === 'Enter' || e.key === ' ') &&
                  handleCardClick(sim.id, sim.enabled)
                }>
                <div className="simulator-card-icon">{sim.icon}</div>
                <div className="simulator-card-content">
                  <h4>{sim.name}</h4>
                  <p>{sim.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AiLab;