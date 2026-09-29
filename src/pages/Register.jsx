import { Check } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import styles from './Auth/Auth.module.css'
import AuthField from './Auth/AuthField'
import AuthLayout from './Auth/AuthLayout'
import Button from '../components/UI Kit/Button'
import { register } from '../mock/api'

const STRENGTH_LABELS = ['Too short', 'Weak', 'Okay', 'Good', 'Strong']

// 0 for under 8 characters, then 1 to 4 as the password gets longer and more varied
function passwordStrength(password) {
  if (password.trim().length < 8) return 0
  let score = 1
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++
  return score
}

// The same rules the mock API enforces, so problems show up before sending
function validate({ name, username, password, confirm }) {
  const errors = {}
  if (name.trim().length < 4) errors.name = 'Your name needs at least 4 letters.'
  if (username.trim().length < 4) errors.username = 'Your username needs at least 4 characters.'
  if (password.trim().length < 8) errors.password = 'Your password needs at least 8 characters.'
  if (confirm !== password) errors.confirm = "The passwords don't match."
  return errors
}

const FIELD_ORDER = ['name', 'username', 'password', 'confirm']

export default function Register() {
  const [values, setValues] = useState({ name: '', username: '', password: '', confirm: '' })
  const [touched, setTouched] = useState({})
  const [serverErrors, setServerErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const refs = { name: useRef(), username: useRef(), password: useRef(), confirm: useRef() }

  const clientErrors = validate(values)
  // an error shows once you've left the field (or tried to submit), and a server error until you edit the field
  const errorFor = (field) => serverErrors[field] || (touched[field] ? clientErrors[field] : undefined)

  const change = (field) => (e) => {
    setValues(prev => ({ ...prev, [field]: e.target.value }))
    if (serverErrors[field]) setServerErrors(prev => ({ ...prev, [field]: undefined }))
  }
  const blur = (field) => () => setTouched(prev => ({ ...prev, [field]: true }))

  const submit = (e) => {
    e.preventDefault()
    setFormError('')

    const problems = Object.keys(clientErrors)
    if (problems.length > 0) {
      setTouched({ name: true, username: true, password: true, confirm: true })
      refs[FIELD_ORDER.find(field => clientErrors[field])].current.focus()
      return
    }

    setIsLoading(true)
    register(values.name, values.username, values.password, values.confirm)
      .then((data) => {
        if (data.success) {
          navigate('/login', { state: { created: true, username: values.username } })
          return
        }
        setIsLoading(false)
        setServerErrors({ name: data.name, username: data.username, password: data.password, confirm: data.confirmPassword && "The passwords don't match." })
        const first = FIELD_ORDER.find(field => data[field === 'confirm' ? 'confirmPassword' : field])
        if (first) refs[first].current.focus()
      })
      .catch(() => {
        setIsLoading(false)
        setFormError("Couldn't create your account. Please try again.")
      })
  }

  const strength = passwordStrength(values.password)
  const passwordsMatch = values.confirm.length > 0 && values.confirm === values.password

  return (
    <AuthLayout title="Create your account" subtitle="Join Novagram to share photos and follow people you like.">
      {formError && <p className={`${styles.notice} ${styles.failure}`} role="alert">{formError}</p>}

      <form className={styles.form} onSubmit={submit} noValidate>
        <AuthField
          label="Full name"
          name="name"
          autoComplete="name"
          autoFocus
          inputRef={refs.name}
          value={values.name}
          onChange={change('name')}
          onBlur={blur('name')}
          error={errorFor('name')}
        />
        <AuthField
          label="Username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck="false"
          inputRef={refs.username}
          value={values.username}
          onChange={change('username')}
          onBlur={blur('username')}
          error={errorFor('username')}
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          inputRef={refs.password}
          value={values.password}
          onChange={change('password')}
          onBlur={blur('password')}
          error={errorFor('password')}
          hint="Use at least 8 characters."
        >
          {values.password.length > 0 && (
            <div className={styles.strength} aria-live="polite">
              <div className={styles.bars} aria-hidden="true">
                {[1, 2, 3, 4].map(level => (
                  <span key={level} className={strength >= level ? styles[`on${strength}`] : ''} />
                ))}
              </div>
              <span className={styles.strengthLabel}>{STRENGTH_LABELS[strength]}</span>
            </div>
          )}
        </AuthField>
        <AuthField
          label="Confirm password"
          name="confirm"
          type="password"
          autoComplete="new-password"
          inputRef={refs.confirm}
          value={values.confirm}
          onChange={change('confirm')}
          onBlur={blur('confirm')}
          error={errorFor('confirm')}
          hint={passwordsMatch ? 'Passwords match.' : undefined}
        />
        <Button variant="primary" className={styles.full} disabled={isLoading}>
          {isLoading && <span className={styles.spinner} aria-hidden="true" />}
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className={styles.demoNote}>
        <Check size={14} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 4 }} />
        This is a frontend-only demo. Your account is stored in this browser.
      </p>

      <p className={styles.switch}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  )
}
