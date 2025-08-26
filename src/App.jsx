import { useState } from 'react'
import './App.css'
import TypingBox from './components/TypingBox'

function App() {

  return (
    <>
      <div id='header-frame' className='p-6 '>
        <h1>Hydra</h1>
      </div>
      <TypingBox></TypingBox>
    </>
  )
}

export default App
