import { useState } from 'react'
import './AdminPanel.css'

// Admin Panel — "plain English" content editing layer
// In production this would send instructions to an AI API
// which updates siteData.js and triggers a rebuild.

export default function AdminPanel({ onClose }) {
  const [instruction, setInstruction] = useState('')
  const [log, setLog] = useState([])
  const [loading, setLoading] = useState(false)

  const handleApply = () => {
    if (!instruction.trim()) return
    setLoading(true)

    setTimeout(() => {
      setLog(prev => [
        {
          id: Date.now(),
          text: instruction,
          time: new Date().toLocaleTimeString(),
          status: 'queued',
        },
        ...prev,
      ])
      setInstruction('')
      setLoading(false)
    }, 900)
  }

  const EXAMPLES = [
    'Change the hero headline to "Tax Made Simple"',
    'Add a new service: Payroll & STP',
    'Update the phone number to 03 9XXX XXXX',
    'Add a testimonial from James Brown, Builder',
  ]

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <div>
          <div className="admin-panel__title">⚙ Content Editor</div>
          <div className="admin-panel__sub">Plain-English Admin Layer</div>
        </div>
        <button className="admin-panel__close" onClick={onClose}>✕</button>
      </div>

      <div className="admin-panel__body">
        <p className="admin-panel__hint">
          Describe what you want to change in plain English:
        </p>
        <textarea
          className="admin-panel__input"
          value={instruction}
          onChange={e => setInstruction(e.target.value)}
          placeholder='e.g. "Change the motto to our new tagline"'
          rows={3}
        />
        <button
          className={`admin-panel__btn ${loading ? 'loading' : ''}`}
          onClick={handleApply}
          disabled={loading || !instruction.trim()}
        >
          {loading ? 'Processing…' : 'Apply Change →'}
        </button>

        <div className="admin-panel__examples">
          <p className="admin-panel__examples-title">Try an example:</p>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              className="admin-panel__example"
              onClick={() => setInstruction(ex)}
            >
              {ex}
            </button>
          ))}
        </div>

        {log.length > 0 && (
          <div className="admin-panel__log">
            <p className="admin-panel__log-title">Change queue</p>
            {log.map(entry => (
              <div key={entry.id} className="admin-panel__log-entry">
                <span className="admin-panel__log-status">⏳</span>
                <span className="admin-panel__log-text">{entry.text}</span>
                <span className="admin-panel__log-time">{entry.time}</span>
              </div>
            ))}
            <p className="admin-panel__log-note">
              ✦ In production, queued changes are sent to an AI content engine, applied to siteData.js, and published automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
