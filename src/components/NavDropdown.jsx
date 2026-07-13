// src/components/NavDropdown.jsx

import { useEffect, useRef, useState } from 'react'
import { externalLinks } from '../data/siteData'
import './NavDropdown.css'

const activeLinks = externalLinks.filter(link => link.active)
const categories = [...new Set(activeLinks.map(link => link.category))]

export default function NavDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="nav-dropdown" ref={ref}>
      <button
        type="button"
        className={`nav-dropdown__trigger ${open ? 'active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Useful Links
        <span className={`nav-dropdown__caret ${open ? 'open' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="nav-dropdown__panel" role="menu">
          {categories.map(category => (
            <div className="nav-dropdown__group" key={category}>
              <div className="nav-dropdown__group-title">{category}</div>
              {activeLinks
                .filter(link => link.category === category)
                .map(link => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-dropdown__item"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}logos/${link.logo}`}
                      alt=""
                      className="nav-dropdown__logo"
                      onError={e => { e.currentTarget.style.visibility = 'hidden' }}
                    />
                    <span>{link.label}</span>
                  </a>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
