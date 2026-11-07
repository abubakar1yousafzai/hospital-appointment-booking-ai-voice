const quotes = [
  {
    q: 'I called at 11 PM because my son had a fever. CityCare booked us with a pediatrician for the next morning, sent reminders, and called the day after to check on him. It felt human.',
    name: 'Mrs. Anu Pillai',
    role: 'Patient · Pediatrics',
    av: 'A',
  },
  {
    q: "Our front desk used to lose 4 hours a day to repeat 'kya appointment confirm ho gaya' calls. CityCare took that off our plate. The team is finally answering the patients in the lobby.",
    name: 'Sarah Joseph',
    role: 'Front-desk lead · Apollo Wellness',
    av: 'S',
  },
]

export default function Stories() {
  return (
    <section className="section" id="stories" style={{ paddingTop: 24 }}>
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>Patients and staff,<br /><em>actually</em> calmer.</h2>
          </div>
          <p className="desc">From the people who use CityCare every day — across 1,400+ recorded calls and 38 staff interviews.</p>
        </div>
        <div className="quote-grid">
          {quotes.map((q, i) => (
            <div key={i} className="quote">
              <p>&ldquo;{q.q}&rdquo;</p>
              <div className="quote-by">
                <div className="quote-av">{q.av}</div>
                <div>
                  <div className="quote-name">{q.name}</div>
                  <div className="quote-role">{q.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
