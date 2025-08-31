import { useState } from 'react'
import './App.css'
import TypingBox from './components/TypingBox'
import TopBar from './components/TopBar'

function App() {

  return (
    <>
      <div id='header-frame' className=''>
        <h1>Hydra</h1>
      </div>
      {/* Need to add access bar here */}
      <TopBar></TopBar>
      <div id="tempspace">
      </div>
      <TypingBox></TypingBox>
    </>
  )
}

export default App
