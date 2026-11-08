'use client'

import { useContext } from 'react'
import { CityCareCtx, type CityCarePersona } from './CityCareContext'
import { PhoneIcon } from './Icons'

export default function Hero() {
  const c = useContext(CityCareCtx) ?? {} as CityCarePersona
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-main">
          <h1>
            {c.heroH1 ? c.heroH1() : (
              <>Book a doctor.<br /><em>Just by speaking.</em></>
            )}
          </h1>
          <p className="lede">
            {c.heroLede ?? 'Meet Alex — the voice receptionist that books, reschedules and cancels appointments across 3 departments. No app. No waiting. Just speak — in English'}
          </p>
          <div className="hero-cta">
            <a className="btn btn-teal" href="#"><PhoneIcon /> Talk to Alex now</a>
            <a className="btn btn-outline" href="#">See how it works →</a>
          </div>
          <div className="hero-tags">
            <span>Available 24 / 7</span>
            <span>Avg. call 47 seconds</span>
          </div>
        </div>
      </div>
    </section>
  )
}
