export default function Stats() {
  return (
    <section style={{ paddingBottom: 80 }}>
      <div className="wrap">
        <div className="stats">
          <div className="stat">
            <div className="n">94<em>%</em></div>
            <div className="l">First-call resolution</div>
          </div>
          <div className="stat">
            <div className="n">47<em>s</em></div>
            <div className="l">Average call length</div>
          </div>
          <div className="stat">
            <div className="n">12,400<em>+</em></div>
            <div className="l">Calls handled this month</div>
          </div>
          <div className="stat">
            <div className="n">3<em>×</em></div>
            <div className="l">Front-desk capacity unlocked</div>
          </div>
        </div>
      </div>
    </section>
  )
}
