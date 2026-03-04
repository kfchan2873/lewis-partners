import { firm } from '../data/siteData'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Contact.css'

// Derive today's day name for "open now" highlighting
function getTodayName() {
  return new Date().toLocaleDateString('en-AU', { weekday: 'long' })
}

export default function Contact() {
  const { ref: leftRef, visible: leftVisible } = useScrollReveal()
  const { ref: rightRef, visible: rightVisible } = useScrollReveal()
  const today = getTodayName()

  const contactItems = [
    {
      icon: '📍',
      label: 'Address',
      value: `${firm.address.street}, ${firm.address.suburb} ${firm.address.state} ${firm.address.postcode}`,
      href: `https://maps.google.com/?q=40+Station+St,+Bayswater+VIC+3153`,
    },
    {
      icon: '📞',
      label: 'Phone',
      value: firm.phone,
      href: `tel:${firm.phone.replace(/\s/g, '')}`,
    },
    {
      icon: '✉️',
      label: 'Email',
      value: firm.email,
      href: `mailto:${firm.email}`,
    },
  ]

  return (
    <section className="section contact" id="contact">
      <div className="contact__inner">

        {/* ---- Left: info + hours ---- */}
        <div
          ref={leftRef}
          className={`contact__info ${leftVisible ? 'fade-up' : ''}`}
        >
          <span className="section-tag">Find Us</span>
          <h2 className="contact__heading">
            Let's have a<br />
            <em>conversation</em>
          </h2>
          <p className="contact__intro">
            Our office is in Bayswater with easy street parking. We also offer
            video and phone consultations for clients who prefer to meet remotely.
          </p>

          <div className="contact__items">
            {contactItems.map(item => (
              <div key={item.label} className="contact__item">
                <div className="contact__item-icon">{item.icon}</div>
                <div>
                  <div className="contact__item-label">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} className="contact__item-value contact__item-value--link">
                      {item.value}
                    </a>
                  ) : (
                    <div className="contact__item-value">{item.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Trading hours table */}
          <div className="contact__hours">
            <div className="contact__hours-title">
              <span>🕘</span> Trading Hours
            </div>
            <table className="contact__hours-table">
              <tbody>
                {firm.hours.map(({ day, open, close }) => {
                  const isToday = day === today
                  return (
                    <tr
                      key={day}
                      className={`contact__hours-row ${isToday ? 'contact__hours-row--today' : ''}`}
                    >
                      <td className="contact__hours-day">{day}</td>
                      <td className="contact__hours-time">
                        {open ? `${open} – ${close}` : 'Closed'}
                      </td>
                      {isToday && (
                        <td className="contact__hours-badge">Today</td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <a
            href={`tel:${firm.phone.replace(/\s/g, '')}`}
            className="contact__call-btn"
          >
            <span>📞</span>
            Call {firm.phone}
          </a>
        </div>

        {/* ---- Right: Google Maps embed ---- */}
        <div
          ref={rightRef}
          className={`contact__map-wrap ${rightVisible ? 'fade-up' : ''}`}
          style={{ animationDelay: '0.2s' }}
        >
          <div className="contact__map-container">
            <iframe
              title="Lewis Partners location — 40 Station St, Bayswater VIC 3153"
              src={firm.googleMapsEmbedUrl}
              className="contact__map-iframe"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="contact__map-footer">
            <span>📍 Unit 5, 40 Station St, Bayswater VIC 3153</span>
            <a
              href="https://maps.google.com/?q=40+Station+St,+Bayswater+VIC+3153"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
