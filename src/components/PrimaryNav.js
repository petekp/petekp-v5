import React from 'react'
import './PrimaryNav.css'

const PrimaryNav = (props) => {
  return (
    <section className="PrimaryNavContainer">
      <nav className="PrimaryNav">
        <a href="https://medium.com/humane-roots">Medium</a>
        <a href="https://www.linkedin.com/in/njpetrash">LinkedIn</a>
        <a href="mailto:naomi.petrash@gmail.com?subject=Hello">Email</a>
      </nav>
    </section>
  )
}

export default PrimaryNav
