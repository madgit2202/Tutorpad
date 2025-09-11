/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState, useMemo, useEffect} from 'react';

const SIMULATION_INTERVAL = 250; // ms
const KVO_RATE_ML_PER_HOUR = 20; // Keep Vein Open rate

const practiceScenarios = [
    { label: "1000mL over 8 hours (15 gtts/mL)", volume: 1000, time: 8 * 60, dropFactor: 15 },
    { label: "500mL over 4 hours (60 gtts/mL)", volume: 500, time: 4 * 60, dropFactor: 60 },
    { label: "250mL over 2 hours (10 gtts/mL)", volume: 250, time: 2 * 60, dropFactor: 10 },
];

const referenceData = [
    { type: 'Macro Drip', factors: '10, 15, 20 gtts/mL', use: 'Standard infusions' },
    { type: 'Micro Drip', factors: '60 gtts/mL', use: 'Pediatrics, precision infusions' },
];

const IvCalculator = () => {
  const [volume, setVolume] = useState(1000); // mL
  const [time, setTime] = useState(8 * 60); // in minutes
  const [dropFactor, setDropFactor] = useState(15); // gtts/mL
  const [isRunning, setIsRunning] = useState(false);
  const [totalInfused, setTotalInfused] = useState(0);
  const [infusionComplete, setInfusionComplete] = useState(false);

  const handleValueChange = (setter, value, step, min, max) => {
    setter(prev => {
      const newValue = prev + step;
      if (newValue >= min && newValue <= max) {
        return newValue;
      }
      return prev;
    });
  };

  const calculatedResults = useMemo(() => {
    if (time === 0 || dropFactor === 0 || volume === 0) {
      return { dropsPerMinute: 0, mlPerHour: 0 };
    }
    const currentMlPerHour = infusionComplete ? KVO_RATE_ML_PER_HOUR : (volume / (time / 60));
    const dropsPerMinute = (currentMlPerHour / 60) * dropFactor;
    
    return {
      dropsPerMinute: Math.round(dropsPerMinute),
      mlPerHour: Math.round(currentMlPerHour),
    };
  }, [volume, time, dropFactor, infusionComplete]);

  useEffect(() => {
    let interval;
    if (isRunning) {
        const mlPerTick = (calculatedResults.mlPerHour / 3600) * (SIMULATION_INTERVAL / 1000);
        interval = setInterval(() => {
            setTotalInfused(prev => {
                const newTotal = prev + mlPerTick;
                if (newTotal >= volume) {
                    setIsRunning(false);
                    setInfusionComplete(true);
                    return volume;
                }
                return newTotal;
            });
        }, SIMULATION_INTERVAL);
    }
    return () => clearInterval(interval);
  }, [isRunning, calculatedResults.mlPerHour, volume]);
  
  const handleStartStop = () => {
    if (infusionComplete) { // Reset logic
        setInfusionComplete(false);
        setTotalInfused(0);
        setIsRunning(false);
        return;
    }

    if (isRunning) {
      setIsRunning(false);
    } else {
      setInfusionComplete(false);
      setTotalInfused(0);
      setIsRunning(true);
    }
  };

  const handleScenarioClick = (scenario) => {
    setVolume(scenario.volume);
    setTime(scenario.time);
    setDropFactor(scenario.dropFactor);
    setIsRunning(false);
    setInfusionComplete(false);
    setTotalInfused(0);
  };
  
  const fluidLevel = Math.max(0, 100 - (totalInfused / volume) * 100);

  const dripAnimationDuration = (isRunning || infusionComplete) && calculatedResults.dropsPerMinute > 0
    ? `${60 / calculatedResults.dropsPerMinute}s`
    : 'none';
  
  const getButtonText = () => {
    if (infusionComplete) return 'Reset';
    return isRunning ? 'Stop Infusion' : 'Start Infusion';
  }

  return (
    <div className="iv-calculator-container">
      <div className="iv-calculator-main">
        <div className="iv-pole-and-bag">
          <div className="iv-pole"></div>
          <div className="iv-bag">
            <div className="iv-fluid" style={{ height: `${fluidLevel}%` }}></div>
          </div>
          <div className="iv-drip-chamber">
            <div
              className={`iv-drip ${(isRunning || infusionComplete) ? 'dripping' : ''}`}
              style={{ animationDuration: dripAnimationDuration }}
            ></div>
          </div>
        </div>

        <div className="iv-pump-body">
          <div className="iv-pump-screen">
            <div className="iv-pump-results">
              <h4>Infusion Rate</h4>
              <div className="iv-pump-results-grid">
                <div>
                  <div className="iv-pump-result-value">{calculatedResults.dropsPerMinute}</div>
                  <div className="iv-pump-result-unit">gtts/min</div>
                </div>
                <div>
                  <div className="iv-pump-result-value">{calculatedResults.mlPerHour}</div>
                  <div className="iv-pump-result-unit">mL/hr</div>
                </div>
              </div>
               <div className="iv-pump-extra-info">
                 {infusionComplete ? (
                    <div className="infusion-complete-alarm">INFUSION COMPLETE</div>
                 ) : (
                    <div>Total Infused: {totalInfused.toFixed(1)} mL</div>
                 )}
               </div>
            </div>
          </div>

          <div className="iv-pump-controls">
            <div className="pump-control-group">
              <label>Volume (mL)</label>
              <div className="pump-stepper">
                <button onClick={() => handleValueChange(setVolume, volume, -50, 50, 2000)} disabled={isRunning || infusionComplete}>-</button>
                <input
                    type="number"
                    className="pump-stepper-value"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    disabled={isRunning || infusionComplete}
                    aria-label="Volume in mL"
                />
                <button onClick={() => handleValueChange(setVolume, volume, 50, 50, 2000)} disabled={isRunning || infusionComplete}>+</button>
              </div>
            </div>
            <div className="pump-control-group">
              <label>Time (min)</label>
              <div className="pump-stepper">
                <button onClick={() => handleValueChange(setTime, time, -15, 15, 1440)} disabled={isRunning || infusionComplete}>-</button>
                 <input
                    type="number"
                    className="pump-stepper-value"
                    value={time}
                    onChange={(e) => setTime(Number(e.target.value))}
                    disabled={isRunning || infusionComplete}
                    aria-label="Time in minutes"
                />
                <button onClick={() => handleValueChange(setTime, time, 15, 15, 1440)} disabled={isRunning || infusionComplete}>+</button>
              </div>
            </div>
            <div className="pump-control-group">
              <label>Drop Factor</label>
              <div className="pump-drop-factor-buttons">
                {[10, 15, 20, 60].map(df => (
                  <button
                    key={df}
                    onClick={() => setDropFactor(df)}
                    className={dropFactor === df ? 'active' : ''}
                    disabled={isRunning || infusionComplete}
                  >
                    {df}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleStartStop}
              className={`pump-action-button ${isRunning ? 'stop' : ''}`}
              disabled={volume === 0 || time === 0}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
      <div className="iv-educational-panel">
          <div className="educational-section">
              <h3>Formula Breakdown</h3>
              <p className="formula-breakdown">
                ({volume}mL × {dropFactor}gtts/mL) ÷ {time}min = <span className="result">{calculatedResults.dropsPerMinute} gtts/min</span>
              </p>
          </div>
          <div className="educational-section">
              <h3>Practice Scenarios</h3>
              {practiceScenarios.map((scenario, index) => (
                  <button key={index} className="practice-scenario-button" onClick={() => handleScenarioClick(scenario)}>
                      {scenario.label}
                  </button>
              ))}
          </div>
          <div className="educational-section">
              <h3>Reference Chart</h3>
              <div className="reference-chart">
                  <table>
                      <thead>
                          <tr>
                              <th>Tubing Type</th>
                              <th>Drop Factors</th>
                              <th>Common Use</th>
                          </tr>
                      </thead>
                      <tbody>
                          {referenceData.map((row, index) => (
                              <tr key={index}>
                                  <td>{row.type}</td>
                                  <td>{row.factors}</td>
                                  <td>{row.use}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
  );
};

export default IvCalculator;