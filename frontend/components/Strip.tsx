export default function Strip() {
  const items = [
    'BOOK · CANCEL · RESCHEDULE · REMIND · DIRECT · INFORM',
    '14 DEPARTMENTS',
    '3 LANGUAGES — EN / हिंदी / اردو',
    'AVERAGE CALL 47 s',
    '94% RESOLUTION ON FIRST CALL',
    '24 / 7 — INCLUDING HOLIDAYS',
    'ZERO HOLD MUSIC',
  ]
  const repeated = [...items, ...items]
  return (
    <div className="strip">
      <div className="strip-inner">
        {repeated.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  )
}
