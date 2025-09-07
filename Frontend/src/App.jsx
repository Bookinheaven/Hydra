import { useState, useEffect } from 'react'
import './App.css'
import TypingBox from './components/TypingBox'
import TopBar from './components/TopBar'

function App() {
  const [currentMode, setCurrentMode] = useState({"type": "words", "subgroup": "p"})
  
  return (
    <>
      <div id='header-frame' className=''>
        <h1>Hydra</h1>
      </div>
      {/* Need to add access bar here */}
      <TopBar currentMode={currentMode} setCurrentMode={setCurrentMode}></TopBar>
      <div id="tempspace">
      </div>
      <TypingBox currentMode={currentMode} setCurrentMode={setCurrentMode}></TypingBox>
    </>
  )
}

export default App
