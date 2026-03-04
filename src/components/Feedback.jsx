// src/components/Feedback.jsx

import { useState } from 'react'
import { enquiryTypes, firm } from '../data/siteData'
import './Feedback.css'

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  enquiryType: '',
  message: '',
}

export default function Feedback() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e = {}

    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Valid email required'

    if (form.phone && !/^[0-9+\s()-]{6,}$/.test(form.phone))
      e.phone = 'Enter valid phone number'

    if (!form.enquiryType) e.enquiryType = 'Please select a topic'

    if (!form.message.trim() || form.message.length < 10)
      e.message = 'Please provide a little more detail'

    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1000)
  }

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setErrors({})
    setSubmitted(false)
  }

  return (
    <section className="section feedback">
      <div className="feedback__inner">

        <div className="feedback__header">
          <span className="section-tag">Contact</span>
          <h2 className="feedback__heading">
            Enquire About <br /><em>Our Services</em>
          </h2>
          <p className="feedback__sub">
            Prefer to speak directly? <a href={`tel:${firm.phone.replace(/\s/g, '')}`}>{firm.phone}</a>
          </p>
        </div>

        {submitted ? (
          <div className="feedback__success">
            <div className="feedback__success-icon">✓</div>
            <h3>Thank you, {form.firstName}.</h3>
            <p>We’ll review your enquiry and respond within one business day.</p>
            <button className="btn-primary" onClick={handleReset}>
              Submit another enquiry
            </button>
          </div>
        ) : (
          <form className="feedback__form" onSubmit={handleSubmit} noValidate>

            <div className="form__row">
              <Field label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} />
              <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} />
            </div>

            <div className="form__row">
              <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
              <Field label="Phone (optional)" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
            </div>

            <div className="form__group">
              <label className="form__label">I'm enquiring about</label>
              <select
                name="enquiryType"
                value={form.enquiryType}
                onChange={handleChange}
                className={`form__select ${errors.enquiryType ? 'form__input--error' : ''}`}
              >
                <option value="">Select a topic…</option>
                {enquiryTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.enquiryType && <span className="form__error">{errors.enquiryType}</span>}
            </div>

            <div className="form__group">
              <label className="form__label">Your Message</label>
              <textarea
                name="message"
                rows={5}
                maxLength={500}
                value={form.message}
                onChange={handleChange}
                className={`form__textarea ${errors.message ? 'form__input--error' : ''}`}
              />
              <div className="form__meta">
                {errors.message && <span className="form__error">{errors.message}</span>}
                <span className="form__char-count">{form.message.length} / 500</span>
              </div>
            </div>

            <button
              type="submit"
              className="feedback__submit"
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit Enquiry'}
            </button>

            <p className="form__privacy">
              We respect your privacy. Your information will never be shared.
            </p>

          </form>
        )}
      </div>
    </section>
  )
}

function Field({ label, name, type = 'text', value, onChange, error }) {
  return (
    <div className="form__group">
      <label className="form__label">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`form__input ${error ? 'form__input--error' : ''}`}
      />
      {error && <span className="form__error">{error}</span>}
    </div>
  )
}
