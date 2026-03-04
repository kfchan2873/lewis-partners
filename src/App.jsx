// src/App.jsx

import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Feedback from './components/Feedback'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminPanel from './components/AdminPanel'
import './App.css'

export default function App() {
  const [adminMode, setAdminMode] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('admin-active', adminMode)
  }, [adminMode])

  return (
    <>
      {adminMode && (
        <div className="admin-bar">
          <span>⚙ Admin Mode Active — use the panel (bottom right) to make content changes</span>
          <button onClick={() => setAdminMode(false)} className="admin-bar__exit">
            Exit Admin View
          </button>
        </div>
      )}

      <Navbar
        onAdminToggle={() => setAdminMode(v => !v)}
        adminMode={adminMode}
      />

      <main id="main-content">
        <section id="home"><Hero /></section>
        <section id="services"><Services /></section>
        <section id="about"><About /></section>
        <section id="testimonials"><Testimonials /></section>
        <section id="contact"><Feedback /></section>
        <section id="location"><Contact /></section>
      </main>

      <Footer />

      {adminMode && (
        <AdminPanel onClose={() => setAdminMode(false)} />
      )}
    </>
  )
}