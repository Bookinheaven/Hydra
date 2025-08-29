import { useState } from 'react'
import './App.css'
import TypingBox from './components/TypingBox'
import DTypingBox from './components/DTypingBox'

function App() {

  return (
    <>
      <div id='header-frame' className=''>
        <h1>Hydra</h1>
      </div>
      {/* Need to add access bar here */}
      <div id="tempspace">

      </div>
      {/* <TypingBox></TypingBox> */}
      <DTypingBox></DTypingBox>
    </>
  )
}

export default App
