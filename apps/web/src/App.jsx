import { Routes, Route, Navigate } from 'react-router-dom'
import ClockBoard from './pages/ClockBoard'
import Airport from './pages/Airport'
import Hourglass from './pages/Hourglass'
import Nav from './components/Nav'
import { SettingsProvider, useSettings } from './context/SettingsContext'
import { AppProvider, useAppContext } from './context/AppContext'
import { ServerProvider } from './context/ServerContext'
import React from 'react'
import Digital from './pages/Digital'
import Win95 from './pages/Win95'
import { measureClockDrift } from '@clockboard/shared/drift'

const VALID_ROUTES = new Set(['/clock', '/flipboard', '/hourglass', '/digital', '/win95'])

function getDefaultRoute() {
  const stored = localStorage.getItem('cb_defaultRoute')
  return (stored && VALID_ROUTES.has(stored)) ? stored : '/flipboard'
}

function AppShell() {
  const {
    navOpen, setNavOpen,
    isFullscreen, makeFullscreen, closeFullscreen,
    showControls,
    addTimer, addStopwatch,
    containerRef,
  } = useAppContext();
  const {themeValues} = useSettings(); 
  React.useEffect(() => {
    const getTimeDriftWithLatency = () => measureClockDrift();
    setTimeout(() => {
    // Usage
    getTimeDriftWithLatency().then(drift => {
      if (drift) {
        console.log(`Network latency: ${drift.networkLatencyMs}ms`);
        console.log(`Adjusted drift: ${drift.driftSeconds} seconds`);
        console.log(`Clock is ${drift.isSlow ? 'slow' : 'ahead'}`);
        console.log(`Accurate: ${drift.isAccurate}`);
      }
    }).catch(err => {
      console.error('Error occurred while fetching time drift: retrtying', err);
      getTimeDriftWithLatency().then(drift => {
      if (drift) {
        console.log(`Network latency: ${drift.networkLatencyMs}ms`);
        console.log(`Adjusted drift: ${drift.driftSeconds} seconds`);
        console.log(`Clock is ${drift.isSlow ? 'slow' : 'ahead'}`);
        console.log(`Accurate: ${drift.isAccurate}`);
      }
    }).catch(err => {
      console.error('Error occurred while fetching time drift:', err);
    
    });},600);
    });
  }, []);
    
  return (
    <div id="app" ref={containerRef} style={{  "--primaryColor": themeValues.primaryColor,"--secondaryColor": themeValues.secondaryColor }}>
      <audio id="timer-complete-sound">
        <source src="assets/media/timer.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="controls-container" style={showControls ? {pointerEvents:"all",opacity:1} : {pointerEvents:"none"}}>
        <i onClick={() => setNavOpen(true)} className="fas fa-cog  mainActionIcon"></i>
      
      &nbsp;&nbsp;&nbsp;
      {(document.children[0].requestFullscreen || document.children[0].mozRequestFullscreen || document.children[0].webkitRequestFullscreen || document.children[0].msRequestFullscreen ) &&
        (!isFullscreen ? 
          <i id="fullscreen-open" onClick={makeFullscreen} className="fas fa-expand  mainActionIcon"></i>
        :
          <i id="fullscreen-close" onClick={closeFullscreen} className="fas fa-compress actionIcon mainActionIcon"></i>
        )}
      </div>
      

      <Nav
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        onAddTimer={addTimer}
        onAddStopwatch={addStopwatch}
      />
      <Routes>
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="/clock" element={<ClockBoard />} />
        <Route path="/flipboard" element={<Airport />} />
        <Route path="/hourglass" element={<Hourglass />} />
        <Route path="/digital" element={<Digital />} />
        <Route path="/win95" element={<Win95 />} />
        <Route path="*" element={<Navigate to="/flipboard" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <ServerProvider>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </ServerProvider>
    </SettingsProvider>
  )
}
