'use client'

import { useContext } from 'react'
import { CityCareCtx, type CityCarePersona } from './CityCareContext'
import {
  CalendarIcon, XCircleIcon, RefreshIcon,
  FileTextIcon, BellIcon, PhoneIcon, HeartIcon, ArrowUpRightIcon,
} from './Icons'

const items = [
  { n: '01', icon: <CalendarIcon />, title: 'Book appointments', desc: 'Find any available slot across 14 departments and 80+ doctors. CityCare knows insurance, fasting requirements and prep notes.',
    tags: ['Cardiology', 'Gynecology', 'General Medicine'] },
  { n: '02', icon: <XCircleIcon />,  title: 'Cancel in seconds',  desc: 'No call-tree, no IVR menus. Verify by phone number, cancel, free up the slot — instantly.' },
  { n: '03', icon: <PhoneIcon />,    title: 'Triage & route',      desc: 'Describe symptoms; CityCare suggests the right department, or transfers to a human nurse 24/7.', dark: true },
  { n: '04', icon: <RefreshIcon />,   title: 'Check & reschedule',   desc: 'Check appointment status or reschedule to a different time. CityCare finds the next available slot instantly.' },
]

export default function Capabilities() {
  const c = useContext(CityCareCtx) ?? {} as CityCarePersona
  return (
    <section className="section" id="capabilities">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>
              {c.capH2 ? c.capH2() : (
                <>Four jobs<br />your <em>receptionist</em> never sleeps through.</>
              )}
            </h2>
          </div>
          <p className="desc">
            {c.capDesc ?? 'Alex handles the predictable, repetitive calls — so your front desk can focus on the patients standing in front of them. Every call is logged, transcribed, and audit-trail ready.'}
          </p>
        </div>
        <div className="cap-grid">
          {items.map((it) => (
            <div key={it.n} className={`cap${it.dark ? ' dark' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="cap-num">{it.n} / 04</span>
                <ArrowUpRightIcon />
              </div>
              <div className="cap-icon">{it.icon}</div>
              <div className="cap-title">{it.title}</div>
              <div className="cap-desc">{it.desc}</div>
              {'tags' in it && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
                  {(it as { tags: string[] }).tags.map((t) => (
                    <span key={t} style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.04em',
                      padding: '4px 8px', borderRadius: 6,
                      background: 'var(--mint)', color: 'var(--teal)',
                    }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
