import React from 'react'
import './PageHeader.css'

const PageHeader = (props) => {
  return (
    <header className="PageHeader">
      <h1>{props.title}</h1>
      {props.children}
    </header>
  )
}

export default PageHeader
