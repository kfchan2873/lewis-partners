import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AdminPanel from './AdminPanel'
import './AdminGate.css'

// Prototype-only gate: the correct password ships inside the client bundle
// (any VITE_ env var is readable in dist/ JS), so this keeps casual visitors
// out but is not real security. See CLAUDE.md for the server-side auth plan.
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

export default function AdminGate() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      setError(false)
    } else {
      setError(true)
      setPassword('')
    }
  }

  if (authed) {
    return (
      <div className="admin-page">
        <AdminPanel onClose={() => navigate('/')} />
      </div>
    )
  }

  return (
    <div className="admin-page">
      <form className="admin-gate" onSubmit={handleSubmit}>
        <h1 className="admin-gate__title">Admin Access</h1>
        <p className="admin-gate__sub">Enter the password to continue.</p>

        <input
          type="password"
          className="admin-gate__input"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(false) }}
          placeholder="Password"
          autoFocus
        />

        {error && <p className="admin-gate__error">Incorrect password</p>}

        <button type="submit" className="admin-gate__btn">Enter</button>
        <Link className="admin-gate__back" to="/">← Back to site</Link>
      </form>
    </div>
  )
}
