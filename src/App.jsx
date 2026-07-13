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
import AdminGate from './components/AdminGate'
import useSmoothAnchorScroll from './hooks/useSmoothAnchorScroll'
import './App.css'

function HomePage() {
  useSmoothAnchorScroll()

  return (
    <>
      <Navbar />

      <main id="main-content">
        <section id="home"><Hero /></section>
        <section id="services"><Services /></section>
        <section id="about"><About /></section>
        <section id="testimonials"><Testimonials /></section>
        <section id="contact"><Feedback /></section>
        <section id="location"><Contact /></section>
      </main>

      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminGate />} />
      </Routes>
    </BrowserRouter>
  )
}