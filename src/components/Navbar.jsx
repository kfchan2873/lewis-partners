// src/components/Navbar.jsx

import { useState, useEffect } from 'react'
import { firm, navLinks } from '../data/siteData'
import './Navbar.css'

export default function Navbar({ onAdminToggle, adminMode }) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)

      const sections = navLinks.map(link => link.href.replace('#', ''))
      let current = ''

      sections.forEach(id => {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 140) {
          current = id
        }
      })

      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <a href="#home" className="navbar__logo">
        {firm.brandPrimary} <span>{firm.brandSecondary}</span>
      </a>

      <ul className="navbar__links">
        {navLinks.map(link => (
          <li key={link.href}>
            <a
              href={link.href}
              className={activeSection === link.href.slice(1) ? 'active' : ''}
            >
              {link.label}
            </a>
          </li>
        ))}

        <li>
          <a href="#contact" className="navbar__cta">Get in Touch</a>
        </li>

        <li>
          <button
            className={`navbar__admin-btn ${adminMode ? 'navbar__admin-btn--active' : ''}`}
            onClick={onAdminToggle}
          >
            {adminMode ? '✕ Exit Admin' : '⚙ Admin'}
          </button>
        </li>
      </ul>

      <button
        className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      {menuOpen && (
        <div className="navbar__mobile-menu">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)}>Get in Touch</a>
        </div>
      )}
    </nav>
  )
}