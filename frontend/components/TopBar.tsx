import { GlobeIcon } from './Icons'

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="wrap">
        <div className="left">
          <span className="pill">EMERGENCY</span>
          <span>24/7 Helpline · <strong style={{ color: 'var(--teal-2)' }}>+1 (555) 010-1234</strong></span>
          <span style={{ opacity: 0.7 }}>Mon–Sun · All Departments</span>
        </div>
        <div className="left" style={{ opacity: 0.85 }}>
          <a href="#">Patient Portal</a>
          <a href="#">For Doctors</a>
          <a href="#"><GlobeIcon /> EN</a>
        </div>
      </div>
    </div>
  )
}
