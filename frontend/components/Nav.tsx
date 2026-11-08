'use client'

import { useContext, useEffect, useState } from 'react'
import { CityCareCtx, type CityCarePersona } from './CityCareContext'

export default function Nav() {
  const c = useContext(CityCareCtx) ?? {} as CityCarePersona
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${scrolled ? ' nav-scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <nav className="nav-links">
          <a href="#capabilities">What it does</a>
          <a href="#how">How it works</a>
          <a href="#doctors">Doctors</a>
          <a href="#departments">Departments</a>
          <a href="#stories">Stories</a>
        </nav>
      </div>
    </header>
  )
}
