import { UserRound } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import styles from './Auth/Auth.module.css'
import AuthField from './Auth/AuthField'
import AuthLayout from './Auth/AuthLayout'
import Button from '../components/UI Kit/Button'
import { demoLogin, login } from '../mock/api'

export default function Login({ onLogin }) {
  const location = useLocation()
  const navigate = useNavigate()

  // arriving from the sign-up page: say so, and start with the username filled in
  const created = location.state?.created === true
  const [username, setUsername] = useState(location.state?.username ?? '')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const usernameRef = useRef()
  const passwordRef = useRef()

  const applySession = (data) => {
    sessionStorage.setItem('user_id', data.user_id)
    sessionStorage.setItem('username', data.username)
    sessionStorage.setItem('name', data.name)

    if (data.picture !== null) sessionStorage.setItem('picture', data.picture)
    if (data.bio !== null) sessionStorage.setItem('bio', data.bio)
    if (data.email !== null) sessionStorage.setItem('email', data.email)

    onLogin()
    navigate('/', { replace: true })
  }

  const submit = (e) => {
    e.preventDefault()

    const found = {}
    if (!username.trim()) found.username = 'Enter your username.'
    if (!password) found.password = 'Enter your password.'

    if (found.username || found.password) {
      setErrors(found)
      ;(found.username ? usernameRef : passwordRef).current.focus()
      return
    }

    setErrors({})
    setIsLoading(true)

    login(username, password)
      .then((data) => {
        if (data.success) {
          applySession(data)
          return
        }
        setIsLoading(false)
        setErrors({ form: data.username || data.password || "Couldn't log you in. Please try again." })
      })
      .catch(() => {
        setIsLoading(false)
        setErrors({ form: "Couldn't log you in. Please try again." })
      })
  }

  const demo = () => {
    setErrors({})
    setIsLoading(true)
    demoLogin()
      .then(applySession)
      .catch(() => {
        setIsLoading(false)
        setErrors({ form: "Couldn't start the demo. Please try again." })
      })
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to see what your friends have been sharing.">
      {created && (
        <p className={`${styles.notice} ${styles.success}`} role="status">
          Your account is ready. Log in to get started.
        </p>
      )}
      {errors.form && (
        <p className={`${styles.notice} ${styles.failure}`} role="alert">{errors.form}</p>
      )}

      <form className={styles.form} onSubmit={submit} noValidate>
        <AuthField
          label="Username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck="false"
          autoFocus={!created}
          inputRef={usernameRef}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus={created}
          inputRef={passwordRef}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button variant="primary" className={styles.full} disabled={isLoading}>
          {isLoading && <span className={styles.spinner} aria-hidden="true" />}
          {isLoading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <div className={styles.divider}>or</div>

      <Button type="button" className={styles.full} onClick={demo} disabled={isLoading}>
        <UserRound size={18} aria-hidden="true" />
        Continue as demo user
      </Button>
      <p className={styles.demoNote}>
        This is a portfolio demo with no server, so any username and password will get you in.
      </p>

      <p className={styles.switch}>
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </AuthLayout>
  )
}
