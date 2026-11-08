import { PhoneIcon } from './Icons'

export default function CtaBand() {
  return (
    <section>
      <div className="cta-band">
        <h2>Call Alex — or<br />tap the <em>mic</em>.</h2>
        <div className="row">
          <a className="btn btn-light" href="tel:18001000911"><PhoneIcon /> Talk to Alex now</a>
          <a className="btn btn-outline" href="#" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'var(--paper)' }}>
            Or open the voice widget →
          </a>
        </div>
      </div>
    </section>
  )
}
