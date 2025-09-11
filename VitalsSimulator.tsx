/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {LineChart, Line, YAxis, ResponsiveContainer} from 'recharts';

// --- Configuration ---
const SIMULATION_INTERVAL = 100; // ms
const WAVEFORM_DATA_LENGTH = 150;

const SCENARIOS = {
  normal: {
    name: 'Normal Sinus Rhythm',
    hr: 75, spo2: 98, bp: {systolic: 120, diastolic: 80}, rr: 16, temp: 37.0,
  },
  tachycardia: {
    name: 'Sinus Tachycardia',
    hr: 110, spo2: 99, bp: {systolic: 125, diastolic: 82}, rr: 18, temp: 37.1,
  },
  bradycardia: {
    name: 'Sinus Bradycardia',
    hr: 50, spo2: 97, bp: {systolic: 110, diastolic: 75}, rr: 14, temp: 36.9,
  },
  atrialFibrillation: {
    name: 'Atrial Fibrillation',
    hr: 140, spo2: 95, bp: {systolic: 115, diastolic: 78}, rr: 22, temp: 37.0,
  },
  hypotension: {
    name: 'Hypotension',
    hr: 105, spo2: 96, bp: {systolic: 85, diastolic: 55}, rr: 20, temp: 36.8,
  },
  distress: {
    name: 'Respiratory Distress',
    hr: 120, spo2: 88, bp: {systolic: 140, diastolic: 90}, rr: 28, temp: 37.5,
  },
  sepsis: {
    name: 'Sepsis',
    hr: 125, spo2: 93, bp: {systolic: 88, diastolic: 50}, rr: 26, temp: 38.5,
  },
  cardiacArrest: {
    name: 'Cardiac Arrest',
    hr: 0, spo2: 0, bp: {systolic: 0, diastolic: 0}, rr: 0, temp: 36.0,
  },
};

const ALARM_LIMITS = {
  hr: { low_crisis: 40, low_warning: 50, high_warning: 120, high_crisis: 140 },
  spo2: { low_crisis: 85, low_warning: 90 },
  bp: { systolic: { low_crisis: 70, low_warning: 90, high_warning: 160, high_crisis: 180 } },
  rr: { low_crisis: 8, low_warning: 12, high_warning: 24, high_crisis: 30 },
};

// Waveform patterns
const ecgPattern = [0, 0, 0, 0.1, 0.3, 0.1, 0, -0.2, -0.4, 2.5, -1, 0.2, 0.4, 0.2, 0];
const plethPattern = [0.8, 0.9, 1, 0.95, 0.8, 0.6, 0.4, 0.2, 0.1, 0.2, 0.4, 0.6, 0.7];
const respPattern = [0, 0.2, 0.5, 0.8, 1, 0.8, 0.5, 0.2, 0, -0.1, -0.2, -0.1];
const flatlinePattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


const VitalsSimulator = () => {
  const [activeScenario, setActiveScenario] = useState('normal');
  const [vitals, setVitals] = useState({...SCENARIOS.normal});
  const [ecgData, setEcgData] = useState([]);
  const [spo2Data, setSpo2Data] = useState([]);
  const [rrData, setRrData] = useState([]);
  const [alarms, setAlarms] = useState<{ [key: string]: 'warning' | 'crisis' | null }>({});
  const [areAlarmsSilenced, setAreAlarmsSilenced] = useState(false);
  const [activeIntervention, setActiveIntervention] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [nibp, setNibp] = useState({
    cycling: false,
    lastReading: SCENARIOS.normal.bp,
    autoCycleInterval: 0, // minutes, 0 is off
    nextCycleTimestamp: null,
    cuffPressure: 0,
  });

  const logEvent = useCallback((message) => {
    setEventLog(prev => [{ time: new Date(), message }, ...prev.slice(0, 100)]);
  }, []);

  const generateWaveformCycle = (basePattern, rate, isAfib = false) => {
    if (rate === 0) return flatlinePattern;
    const baseCycleLength = (60 / rate) * (1000 / SIMULATION_INTERVAL);
    let cycleLength = baseCycleLength;
    if (isAfib) {
      cycleLength = baseCycleLength * (0.7 + Math.random() * 0.6); // Irregularly irregular
    }
    const finalPattern = [...basePattern];
    const flatLineLength = Math.max(0, cycleLength - basePattern.length);
    for (let i = 0; i < flatLineLength; i++) {
      finalPattern.push(basePattern === respPattern ? -0.1 : 0);
    }
    return finalPattern;
  };

  useEffect(() => {
    let ecgCycle = generateWaveformCycle(ecgPattern, vitals.hr, activeScenario === 'atrialFibrillation');
    let spo2Cycle = generateWaveformCycle(plethPattern, vitals.hr, activeScenario === 'atrialFibrillation');
    let rrCycle = generateWaveformCycle(respPattern, vitals.rr);
    let ecgIndex = 0, spo2Index = 0, rrIndex = 0;

    const interval = setInterval(() => {
      // --- Update Vitals from Interventions ---
      if (activeIntervention) {
        setVitals(prev => {
          let newVitals = {...prev};
          if (activeIntervention === 'oxygen') newVitals.spo2 = Math.min(100, prev.spo2 + 0.1);
          if (activeIntervention === 'epinephrine') {
            newVitals.hr = Math.min(200, prev.hr + 1);
            newVitals.bp.systolic = Math.min(220, prev.bp.systolic + 1);
          }
          if (activeIntervention === 'saline') newVitals.bp.systolic = Math.min(220, prev.bp.systolic + 0.2);
          return newVitals;
        });
      }
      
      // --- NIBP Auto Cycle ---
      if (nibp.autoCycleInterval > 0 && Date.now() >= nibp.nextCycleTimestamp) {
        startNibpCycle(false); // Don't log event here, it's logged in startNibpCycle
      }
      
      // --- Update Waveforms ---
      ecgIndex = (ecgIndex + 1) % ecgCycle.length;
      spo2Index = (spo2Index + 1) % spo2Cycle.length;
      rrIndex = (rrIndex + 1) % rrCycle.length;

      if(ecgIndex === 0) ecgCycle = generateWaveformCycle(ecgPattern, vitals.hr, activeScenario === 'atrialFibrillation');
      if(spo2Index === 0) spo2Cycle = generateWaveformCycle(plethPattern, vitals.hr, activeScenario === 'atrialFibrillation');
      if(rrIndex === 0) rrCycle = generateWaveformCycle(respPattern, vitals.rr);
      
      const updateWaveform = (setter, cycle, index, noise) => {
        setter(prev => [
            ...prev.slice(prev.length - WAVEFORM_DATA_LENGTH + 1),
            { uv: cycle[index] + (Math.random() - 0.5) * noise }
        ]);
      };
      updateWaveform(setEcgData, ecgCycle, ecgIndex, 0.05);
      updateWaveform(setSpo2Data, spo2Cycle, spo2Index, 0.02);
      updateWaveform(setRrData, rrCycle, rrIndex, 0.01);
      
      // --- Check Alarms ---
      setAlarms(prevAlarms => {
        const newAlarms: typeof alarms = {};
        const checkLimit = (val, limits) => {
            if (val < limits.low_crisis || val > limits.high_crisis) return 'crisis';
            if (val < limits.low_warning || val > limits.high_warning) return 'warning';
            return null;
        };
        newAlarms.hr = checkLimit(vitals.hr, ALARM_LIMITS.hr);
        newAlarms.spo2 = vitals.spo2 < ALARM_LIMITS.spo2.low_crisis ? 'crisis' : (vitals.spo2 < ALARM_LIMITS.spo2.low_warning ? 'warning' : null);
        newAlarms.bp = checkLimit(nibp.lastReading.systolic, ALARM_LIMITS.bp.systolic);
        newAlarms.rr = checkLimit(vitals.rr, ALARM_LIMITS.rr);

        if(newAlarms.hr && !prevAlarms.hr) logEvent(`Alarm: HR ${newAlarms.hr}`);
        if(newAlarms.spo2 && !prevAlarms.spo2) logEvent(`Alarm: SpO2 ${newAlarms.spo2}`);
        if(newAlarms.bp && !prevAlarms.bp) logEvent(`Alarm: NIBP ${newAlarms.bp}`);
        if(newAlarms.rr && !prevAlarms.rr) logEvent(`Alarm: RR ${newAlarms.rr}`);
        
        return newAlarms;
      });
    }, SIMULATION_INTERVAL);

    return () => clearInterval(interval);
  }, [vitals, activeIntervention, nibp.autoCycleInterval, nibp.nextCycleTimestamp, activeScenario, logEvent]);

  // Initial data fill
  useEffect(() => {
    const initialData = Array(WAVEFORM_DATA_LENGTH).fill({uv: 0});
    setEcgData(initialData);
    setSpo2Data(initialData);
    setRrData(initialData);
    logEvent('Simulator started.');
  }, [logEvent]);

  const handleScenarioChange = useCallback((newScenarioKey) => {
    setActiveScenario(newScenarioKey);
    const newVitals = SCENARIOS[newScenarioKey];
    setVitals({...newVitals});
    setNibp(prev => ({ ...prev, lastReading: newVitals.bp }));
    setActiveIntervention(null);
    logEvent(`Scenario changed: ${newVitals.name}`);
  }, [logEvent]);
  
  const handleVitalChange = (vital, subkey, change) => {
    if (activeScenario !== 'custom') {
        setActiveScenario('custom');
        logEvent('Switched to Custom Scenario due to manual input.');
    }
    setVitals(prev => {
      const newVitals = JSON.parse(JSON.stringify(prev));
      if (subkey) newVitals[vital][subkey] += change;
      else newVitals[vital] += change;
      return newVitals;
    });
  };

  const handleIntervention = (intervention) => {
    setActiveIntervention(intervention);
    logEvent(`Intervention: Administer ${intervention}`);
    setTimeout(() => setActiveIntervention(null), 10000);
  };
  
  const silenceAlarms = () => {
    setAreAlarmsSilenced(true);
    logEvent('Alarms silenced for 60 seconds.');
    setTimeout(() => { setAreAlarmsSilenced(false); logEvent('Alarms re-enabled.'); }, 60000);
  };
  
  const handleCodeBlue = () => {
    handleScenarioChange('cardiacArrest');
    logEvent('CODE BLUE activated.');
  };

  const startNibpCycle = useCallback((isManual = true) => {
    if (isManual) logEvent('NIBP cycle started...');
    setNibp(prev => ({ ...prev, cycling: true, cuffPressure: 50 }));

    const cuffInterval = setInterval(() => {
        setNibp(prev => {
            const newPressure = prev.cuffPressure + 20;
            if (newPressure > 160) {
                clearInterval(cuffInterval);
                setTimeout(() => {
                    const reading = {
                        systolic: Math.round(vitals.bp.systolic + (Math.random() - 0.5) * 4),
                        diastolic: Math.round(vitals.bp.diastolic + (Math.random() - 0.5) * 4),
                    };
                    setNibp(p => {
                        const newNibpState = { ...p, cycling: false, lastReading: reading, cuffPressure: 0 };
                        if (p.autoCycleInterval > 0) {
                            newNibpState.nextCycleTimestamp = Date.now() + p.autoCycleInterval * 60 * 1000;
                        }
                        return newNibpState;
                    });
                    logEvent(`NIBP Reading: ${reading.systolic}/${reading.diastolic} mmHg`);
                }, 1000);
            }
            return { ...prev, cuffPressure: newPressure };
        });
    }, 500);
  }, [vitals.bp, logEvent]);
  
  const handleAutoCycleChange = (minutes) => {
    logEvent(minutes > 0 ? `NIBP auto-cycle set to ${minutes} min.` : `NIBP auto-cycle turned OFF.`);
    if (minutes > 0) {
        setNibp(prev => ({
            ...prev,
            autoCycleInterval: minutes,
            nextCycleTimestamp: Date.now() + 5000, // First reading in 5s
        }));
    } else {
        setNibp(prev => ({
            ...prev,
            autoCycleInterval: 0,
            nextCycleTimestamp: null,
        }));
    }
  };

  const WaveformChart = ({ data, color, domain }) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <YAxis domain={domain} hide />
        <Line type="monotone" dataKey="uv" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );

  const VitalDisplay = ({ label, value, unit, limits = null, alarm = null, children = null }) => (
    <div className={`vital-box numeric ${alarm && !areAlarmsSilenced ? `alarm-${alarm}` : ''}`} style={{color: `var(--vital-${label.toLowerCase()}-color)`}}>
        <div className="vital-numeric-main">
            <div className="vital-label">{label}</div>
            <div className="vital-value">{value}</div>
        </div>
        <div className="vital-numeric-side">
            <div className="vital-unit">{unit}</div>
            {limits && <div className="vital-alarm-limits">{limits}</div>}
        </div>
        {children}
    </div>
  );

  return (
    <div className="simulator-wrapper">
      <div className="simulator-left-column">
        <div className="vitals-monitor-frame">
          <div className="vitals-monitor">
            <div className="monitor-grid">
              <div className="vital-box waveform ecg">
                <span className="waveform-label" style={{color: 'var(--vital-ecg-color)'}}>ECG II</span>
                <WaveformChart data={ecgData} color={'var(--vital-ecg-color)'} domain={[-2, 3]} />
              </div>
              <VitalDisplay label="HR" value={Math.round(vitals.hr)} unit="/min" alarm={alarms.hr} limits={`${ALARM_LIMITS.hr.low_warning}-${ALARM_LIMITS.hr.high_warning}`} />

              <div className="vital-box waveform pleth">
                <span className="waveform-label" style={{color: 'var(--vital-spo2-color)'}}>Pleth</span>
                <WaveformChart data={spo2Data} color={'var(--vital-spo2-color)'} domain={[0, 1.2]}/>
              </div>
              <VitalDisplay label="SpO2" value={Math.round(vitals.spo2)} unit="%" alarm={alarms.spo2} limits={`>${ALARM_LIMITS.spo2.low_warning}`} />

              <div className="vital-box waveform resp">
                <span className="waveform-label" style={{color: 'var(--vital-rr-color)'}}>Resp</span>
                <WaveformChart data={rrData} color={'var(--vital-rr-color)'} domain={[-0.3, 1.2]}/>
              </div>
              <VitalDisplay label="RR" value={Math.round(vitals.rr)} unit="/min" alarm={alarms.rr} limits={`${ALARM_LIMITS.rr.low_warning}-${ALARM_LIMITS.rr.high_warning}`} />
              
              <div className={`vital-box numeric nibp ${alarms.bp && !areAlarmsSilenced ? `alarm-${alarms.bp}` : ''}`}>
                  <div className="vital-numeric-main">
                      <div className="vital-label">NIBP</div>
                      <div className="vital-value">{nibp.cycling ? '--/--' : `${Math.round(nibp.lastReading.systolic)}/${Math.round(nibp.lastReading.diastolic)}`}</div>
                  </div>
                  <div className="vital-numeric-side">
                       <div className="vital-unit">mmHg</div>
                       <div className="vital-alarm-limits">Sys {ALARM_LIMITS.bp.systolic.low_warning}-{ALARM_LIMITS.bp.systolic.high_warning}</div>
                  </div>
                   {nibp.cycling && <div className="nibp-cycle-info">Cuff: {nibp.cuffPressure} mmHg</div>}
              </div>
               <VitalDisplay label="Temp" value={vitals.temp.toFixed(1)} unit="°C" />
            </div>
          </div>
        </div>
        <div className="control-panel-section">
          <h3>Scenarios</h3>
          <div className="scenarios-list">
             {(Object.entries(SCENARIOS).map(([key, scenario]) => (
                <div key={key}
                    className={`scenario-item ${activeScenario === key ? 'active' : ''}`}
                    onClick={() => handleScenarioChange(key)}>
                    <h4>{scenario.name}</h4>
                </div>
            )))}
            <div className={`scenario-item ${activeScenario === 'custom' ? 'active' : ''}`}><h4>Custom Scenario</h4></div>
          </div>
        </div>
      </div>

      <div className="simulator-control-panel">
        <div className="control-panel-section">
            <h3>NIBP Cycle</h3>
            <div className="nibp-auto-cycle-controls">
                <button className="start-nibp-button" onClick={() => startNibpCycle(true)} disabled={nibp.cycling}>
                    {nibp.cycling ? 'Cycling...' : 'Start Manual'}
                </button>
                <div className="auto-cycle-buttons">
                    {[5, 10, 15, 0].map(min => (
                        <button key={min}
                            className={nibp.autoCycleInterval === min ? 'active' : ''}
                            onClick={() => handleAutoCycleChange(min)}>
                            {min > 0 ? `${min} min` : 'Off'}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="control-panel-section">
          <h3>Manual Controls</h3>
          <div className="manual-controls">
            <div className="vital-control-group"><span className="control-label">Heart Rate</span><div className="vital-control"><button onClick={() => handleVitalChange('hr', null, -5)}>-</button><span>{Math.round(vitals.hr)}</span><button onClick={() => handleVitalChange('hr', null, 5)}>+</button></div></div>
            <div className="vital-control-group"><span className="control-label">SpO2</span><div className="vital-control"><button onClick={() => handleVitalChange('spo2', null, -1)}>-</button><span>{Math.round(vitals.spo2)}</span><button onClick={() => handleVitalChange('spo2', null, 1)}>+</button></div></div>
            <div className="vital-control-group"><span className="control-label">BP (Sys)</span><div className="vital-control"><button onClick={() => handleVitalChange('bp', 'systolic', -5)}>-</button><span>{Math.round(vitals.bp.systolic)}</span><button onClick={() => handleVitalChange('bp', 'systolic', 5)}>+</button></div></div>
            <div className="vital-control-group"><span className="control-label">Resp. Rate</span><div className="vital-control"><button onClick={() => handleVitalChange('rr', null, -1)}>-</button><span>{Math.round(vitals.rr)}</span><button onClick={() => handleVitalChange('rr', null, 1)}>+</button></div></div>
          </div>
        </div>
        
        <div className="control-panel-section">
            <h3>Clinical Interventions</h3>
            <div className="interventions-list">
                <button className="intervention-button" onClick={() => handleIntervention('oxygen')}>Administer Oxygen</button>
                <button className="intervention-button" onClick={() => handleIntervention('epinephrine')}>Administer Epinephrine</button>
                <button className="intervention-button" onClick={() => handleIntervention('saline')}>Administer Saline Bolus</button>
            </div>
        </div>
        
         <div className="control-panel-section">
            <h3>Alarms & Emergencies</h3>
            <div className="control-panel-buttons">
                 <button className={`control-panel-button control-button-warning ${areAlarmsSilenced ? 'active' : ''}`} onClick={silenceAlarms}>
                    {areAlarmsSilenced ? 'Alarms Silenced' : 'Silence Alarms'}
                </button>
                <button className="control-panel-button control-button-danger" onClick={handleCodeBlue}>Code Blue</button>
            </div>
        </div>

        <div className="control-panel-section event-log-section">
            <h3>Event Log</h3>
            <div className="event-log-list">
                {eventLog.map((event, index) => (
                    <div key={index} className="log-entry">
                        <span className="log-timestamp">{event.time.toLocaleTimeString()}</span>
                        <span>{event.message}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsSimulator;