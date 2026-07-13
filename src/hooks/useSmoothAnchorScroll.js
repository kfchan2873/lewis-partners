import { useEffect } from 'react'

const NAVBAR_OFFSET = 76 // navbar height (74px) + border-bottom (2px)
const DURATION = 700

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function smoothScrollTo(targetY) {
  const startY = window.scrollY
  const diff = targetY - startY
  let startTime = null

  function step(timestamp) {
    if (startTime === null) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / DURATION, 1)
    window.scrollTo(0, startY + diff * easeInOutCubic(progress))
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

// Intercepts in-page anchor clicks (Navbar, Hero CTAs, Testimonials, Footer, etc.)
// and replaces the browser's instant hash-jump with an eased scroll.
export default function useSmoothAnchorScroll() {
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (!link) return

      const id = link.getAttribute('href').slice(1)
      if (!id) return

      const target = document.getElementById(id)
      if (!target) return

      e.preventDefault()
      const targetY = Math.max(
        target.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET,
        0
      )
      smoothScrollTo(targetY)
      window.history.pushState(null, '', `#${id}`)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
}
