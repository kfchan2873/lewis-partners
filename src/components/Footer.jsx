import { firm, navLinks } from '../data/siteData'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            {firm.name.split(' ')[0]} <span>{firm.name.split(' ')[1]}</span>
          </div>
          <p className="footer__tagline">{firm.tagline}</p>
          <p className="footer__motto">"{firm.motto}"</p>
        </div>

        <div className="footer__nav">
          <div className="footer__nav-title">Navigation</div>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="footer__nav-link">{l.label}</a>
          ))}
          <a href="#feedback" className="footer__nav-link">Get in Touch</a>
        </div>

        <div className="footer__contact">
          <div className="footer__nav-title">Contact</div>
          <p>{firm.address.street}</p>
          <p>{firm.address.suburb} {firm.address.state} {firm.address.postcode}</p>
          <a href={`tel:${firm.phone}`} className="footer__nav-link" style={{ marginTop: '0.75rem', display: 'block' }}>{firm.phone}</a>
          <a href={`mailto:${firm.email}`} className="footer__nav-link">{firm.email}</a>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {year} {firm.legalName} · Tax Agent #{firm.taxAgentNumber} · ACN {firm.acn}</p>
        <div className="footer__bottom-links">
          <a href="#">Privacy Policy</a>
          <a href={`https://www.${firm.website}`}>{firm.website}</a>
        </div>
      </div>
    </footer>
  )
}
