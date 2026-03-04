import { hero, firm } from '../data/siteData'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="home">
      {/* Decorative background orb */}
      <div className="hero__orb" />
      <div className="hero__quote-mark">"</div>

      <div className="hero__inner">
        <div className="hero__badge fade-up" style={{ animationDelay: '0s' }}>
          {hero.badge}
        </div>

        <h1 className="hero__headline fade-up" style={{ animationDelay: '0.15s' }}>
          <em>{hero.headline[0]}</em><br />
          {hero.headline[1]}<br />
          {hero.headline[2]}
        </h1>

        <p className="hero__sub fade-up" style={{ animationDelay: '0.3s' }}>
          {hero.subheading}
        </p>

        <div className="hero__btns fade-up" style={{ animationDelay: '0.45s' }}>
          <a href="#contact" className="btn-primary">{hero.cta.primary}</a>
          <a href="#services" className="btn-ghost">{hero.cta.secondary}</a>
        </div>

        <div className="hero__stats fade-up" style={{ animationDelay: '0.6s' }}>
          {hero.stats.map((s, i) => (
            <div key={i} className="hero__stat">
              <span className="hero__stat-num">{s.number}</span>
              <span className="hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-hint">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}
