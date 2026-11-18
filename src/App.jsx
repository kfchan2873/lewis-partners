// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Feedback from './components/Feedback'
import Contact from './components/Contact'
import Footer from './components/Footer'
import useSmoothAnchorScroll from './hooks/useSmoothAnchorScroll'
import './App.css'

function HomePage() {
  useSmoothAnchorScroll()

  return (
    <>
      <Navbar />

      {/* Each component renders its own <section id="…"> — don't wrap them in
          another one here, or every anchor id ends up on the page twice. */}
      <main id="main-content">
        <Hero />
        <Services />
        <About />
        <Testimonials />
        <Feedback />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

// Shared by the browser (App, below) and the build-time prerender
// (src/entry-server.jsx), which wraps it in a StaticRouter instead.
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  )
}