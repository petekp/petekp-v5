import React from 'react'
import PrimaryNav from './PrimaryNav'
import Background from './Background'
import './App.css'

const App = (props) => {
  return (
    <div>
      <Background />
      <main role="main">
        <div className="wrapper">
          {props.children}
          <PrimaryNav />
        </div>
      </main>
    </div>
  )
}

export default App
