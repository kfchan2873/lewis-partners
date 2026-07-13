import { about } from '../data/siteData'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './About.css'

export default function About() {
  const { ref: imgRef, visible: imgVisible } = useScrollReveal()
  const { ref: textRef, visible: textVisible } = useScrollReveal()

  return (
    <section className="section about" id="about">
      <div className="about__inner">

        {/* Photo / identity column */}
        <div
          ref={imgRef}
          className={`about__img-wrap ${imgVisible ? 'fade-up' : ''}`}
        >
          <div className="about__img-placeholder">
            {/* Replace with: <img src="/kenneth-lewis.jpg" alt="Kenneth Lewis" /> */}
            <span className="about__img-initials">KL</span>
            <span className="about__img-hint">Photo to be supplied</span>
          </div>
          <div className="about__img-frame" />

          {/* Floating IPA credential card */}
          <div className="about__credential-card">
            <span className="about__credential-icon">✓</span>
            <div>
              <div className="about__credential-title">IPA Registered</div>
              <div className="about__credential-sub">Tax Agent #24251007</div>
            </div>
          </div>

          {/* Floating Deakin card */}
          <div className="about__credential-card about__credential-card--bottom">
            <span className="about__credential-icon about__credential-icon--blue">🎓</span>
            <div>
              <div className="about__credential-title">Deakin University</div>
              <div className="about__credential-sub">Graduate</div>
            </div>
          </div>
        </div>

        {/* Text column */}
        <div
          ref={textRef}
          className={`about__text ${textVisible ? 'fade-up' : ''}`}
          style={{ animationDelay: '0.15s' }}
        >
          <span className="section-tag">Meet the Principal</span>
          <h2 className="about__name">{about.name}</h2>
          <p className="about__title-line">{about.title}</p>
          <p className="about__credentials-line">{about.credentials.join(' · ')}</p>

          {about.bio.map((para, i) => (
            <p key={i} className="about__para">{para}</p>
          ))}

          <div className="about__badges">
            {about.badges.map(b => (
              <span key={b} className="about__badge">{b}</span>
            ))}
          </div>

          {about.linkedin && (
            <a
              href={about.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="about__linkedin"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              View LinkedIn Profile
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
