const steps = [
  { n: '01', title: 'Patient calls',    desc: 'A direct line, or click-to-call from the hospital site. No app download. No login.' },
  { n: '02', title: 'Alex listens',     desc: 'Speech-to-text across 3 languages and dialects. Verifies identity by phone + DOB.', live: true },
  { n: '03', title: 'Action taken',     desc: 'Hooks into the hospital EHR — books, cancels, refills, or transfers to a human.' },
  { n: '04', title: 'Confirmation',     desc: 'SMS + WhatsApp receipt within 4 seconds. Reminder sent 24h before the visit.' },
]

export default function How() {
  return (
    <section className="section" id="how">
      <div className="how">
        <h2>Four steps. <em>Forty-seven</em> seconds.</h2>
        <div className="steps">
          {steps.map((s) => (
            <div key={s.n} className={`step${s.live ? ' live' : ''}`}>
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
