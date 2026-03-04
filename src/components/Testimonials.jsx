import { useState } from 'react'
import { testimonials } from '../data/siteData'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Testimonials.css'

function StarRating({ count }) {
  return (
    <div className="stars">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  )
}

function TestimonialCard({ t, index }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`testimonial-card ${visible ? 'fade-up' : ''}`}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="testimonial-card__quote">"</div>
      <StarRating count={t.stars} />
      <p className="testimonial-card__text">{t.text}</p>
      <div className="testimonial-card__author">
        <div className="testimonial-card__avatar">{t.initials}</div>
        <div>
          <div className="testimonial-card__name">{t.name}</div>
          <div className="testimonial-card__role">{t.role}</div>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { ref, visible } = useScrollReveal()

  return (
    <section className="section testimonials" id="testimonials">
      <div
        ref={ref}
        className={`testimonials__header ${visible ? 'fade-up' : ''}`}
      >
        <span className="section-tag">Client Stories</span>
        <h2 className="testimonials__heading">
          Trusted by small businesses<br />
          <em>and individuals alike</em>
        </h2>
      </div>

      <div className="testimonials__grid">
        {testimonials.map((t, i) => (
          <TestimonialCard key={t.name} t={t} index={i} />
        ))}
      </div>

      {/* CTA nudge */}
      <div className={`testimonials__cta ${visible ? 'fade-up' : ''}`} style={{ animationDelay: '0.4s' }}>
        <p>Join our growing list of satisfied clients</p>
        <a href="#contact" className="btn-primary">Book a Free Consultation</a>
      </div>
    </section>
  )
}
