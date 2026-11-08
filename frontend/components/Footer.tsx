import { PhoneIcon } from './Icons'

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-brand">CityCare<em>.</em></div>
            <p className="foot-tag">Voice receptionist for Apollo Wellness Hospital. Built with care, by people who hate hold music.</p>
            <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
              <a className="btn btn-light" href="#"><PhoneIcon /> Call CityCare</a>
            </div>
          </div>
          <div className="foot-col">
            <h4>For patients</h4>
            <ul>
              <li><a href="#">Book appointment</a></li>
              <li><a href="#">Cancel / reschedule</a></li>
              <li><a href="#">Patient portal</a></li>
              <li><a href="#">Insurance &amp; billing</a></li>
              <li><a href="#">Emergency</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Hospital</h4>
            <ul>
              <li><a href="#">Departments</a></li>
              <li><a href="#">Doctors</a></li>
              <li><a href="#">Visit us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>About CityCare</h4>
            <ul>
              <li><a href="#">How it works</a></li>
              <li><a href="#">Languages</a></li>
              <li><a href="#">Privacy &amp; data</a></li>
              <li><a href="#">For doctors</a></li>
              <li><a href="#">Status</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="#">+91 1800-WAYU-911</a></li>
              <li><a href="#">hello@wayu.health</a></li>
              <li><a href="#">@wayu.health</a></li>
              <li><a href="#">Press kit</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <div>© 2026 Apollo Wellness Hospital · CityCare v3.2.1</div>
          <div>HIPAA-aware · ISO 27001 · DPDP-2023 compliant</div>
        </div>
      </div>
    </footer>
  )
}
