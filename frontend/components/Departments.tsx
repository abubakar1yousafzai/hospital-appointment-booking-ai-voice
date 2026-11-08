'use client'

import { useState } from 'react'
import Image from 'next/image'

const docs = [
  { dept: 'Cardiology',        name: 'Dr. Ahmed',  spec: 'Cardiologist',      img: '/Dr. Ahmed.png',  bioFull: 'Specialist in heart disease diagnosis and treatment. CityCare books ECG, stress test, and cardiology consult slots seamlessly.',      exp: '15 yrs', avail: 'Mon · Wed · Fri', next: 'Mon 10:00 AM' },
  { dept: 'Gynecology',        name: 'Dr. Fatima', spec: 'Gynecologist',       img: '/Dr. Fatima.png', bioFull: 'Expert in women\'s health, antenatal care, and gynecological procedures. CityCare schedules routine checkups and follow-up visits.', exp: '12 yrs', avail: 'Tue · Thu · Sat', next: 'Tue 09:30 AM' },
  { dept: 'General Medicine',  name: 'Dr. Hassan', spec: 'General Physician',  img: '/Dr. Hassan.png', bioFull: 'Primary care physician handling a wide range of medical conditions. CityCare books same-day and routine consultation slots.',          exp: '10 yrs', avail: 'Mon · Tue · Thu', next: 'Mon 11:00 AM' },
]

export default function Departments() {
  const [active, setActive] = useState(0)
  const doc = docs[active]

  return (
    <section className="section" id="departments" style={{ paddingTop: 48 }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>3 departments.<br />One <em>voice</em>.</h2>
          </div>
          <p className="desc">
            Tap a department to see who CityCare books today. Every doctor&apos;s calendar, prep notes,
            and follow-up rules are kept in sync with the hospital&apos;s EHR — no double-bookings, ever.
          </p>
        </div>

        <div className="depts">
          <div className="dept-list">
            {docs.map((d, i) => (
              <div key={d.dept} className={`dept-row${i === active ? ' active' : ''}`} onClick={() => setActive(i)}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div className="dept-name">{d.dept}</div>
                  <div className="dept-meta">{d.spec.split(' ').slice(0, 2).join(' ')} · {d.exp} experience</div>
                </div>
                <span className="mono">{i === active ? '●' : '→'}</span>
              </div>
            ))}
          </div>

          <div className="doc-card">
            <div className="doc-photo">
              <Image
                src={doc.img}
                alt={doc.name}
                fill
                sizes="120px"
                style={{ objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
            <div>
              <div className="doc-name">{doc.name}</div>
              <div className="doc-spec">{doc.spec}</div>
              <p className="doc-bio">{doc.bioFull}</p>
              <div className="doc-meta">
                <div><span>Experience</span>{doc.exp}</div>
                <div><span>Available</span>{doc.avail}</div>
                <div><span>Next open slot</span>{doc.next}</div>
                <div><span>Book via CityCare</span><a href="#" style={{ color: 'var(--teal)', textDecoration: 'underline' }}>Talk to Alex now</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
