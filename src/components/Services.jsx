import { useState } from 'react'
import { services, firm } from '../data/siteData'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Services.css'

function ServiceCard({ service, index }) {
  const [hovered, setHovered] = useState(false)
  const { ref, visible } = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`service-card ${visible ? 'fade-up' : ''} ${hovered ? 'service-card--hovered' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="service-card__icon">{service.icon}</div>
      <h3 className="service-card__title">{service.title}</h3>
      <p className="service-card__desc">{service.description}</p>
      <div className="service-card__arrow">→</div>
    </div>
  )
}

export default function Services() {
  const { ref, visible } = useScrollReveal()

  return (
    <section className="section services" id="services">
      <div
        ref={ref}
        className={`services__header ${visible ? 'fade-up' : ''}`}
      >
        <span className="section-tag">We Help You With</span>
        <h2 className="services__heading">
          Taxation &amp; Accounting<br />
          <em>Services that work for you</em>
        </h2>
        <p className="services__purpose">
          Our purpose is to assist you to <strong>succeed financially</strong> and comply
          with your taxation obligations <strong>as cost-effectively as possible</strong>.
        </p>
      </div>

      <div className="services__grid">
        {services.map((s, i) => (
          <ServiceCard key={s.title} service={s} index={i} />
        ))}
      </div>

      {/* Motto banner */}
      <MottoBanner />
    </section>
  )
}

function MottoBanner() {
  const { ref, visible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`services__motto ${visible ? 'fade-up' : ''}`}
    >
      <p className="services__motto-text">"{firm.motto}"</p>
      <p className="services__motto-attr">Lewis Partners · Our Guiding Philosophy</p>
    </div>
  )
}
