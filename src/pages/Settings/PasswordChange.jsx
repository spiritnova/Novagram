import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import styles from './Settings.module.css'
import Field from './Field'
import Button from '../../components/UI Kit/Button'
import { useToast } from '../../context/ToastContext'
import { changePassword } from '../../mock/api'

const EMPTY = { current: '', next: '', confirm: '' }

// 0 to 4: length, upper and lower case, digits, symbols
function strengthOf(password) {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++
    return Math.min(score, 4)
}

const LEVELS = [
    { label: '', color: '' },
    { label: 'Weak', color: 'var(--color-danger)' },
    { label: 'Fair', color: '#e8a317' },
    { label: 'Good', color: '#4cae4f' },
    { label: 'Strong', color: '#2ea44f' },
]

export default function PasswordChange(){
    const [form, setForm] = useState(EMPTY)
    const [errors, setErrors] = useState({})
    const [show, setShow] = useState(false)

    const showToast = useToast()
    const username = sessionStorage.getItem('username')
    const type = show ? 'text' : 'password'

    const change = (key) => (e) => {
        setForm(prev => ({ ...prev, [key]: e.target.value }))
        setErrors(prev => ({ ...prev, [key]: undefined }))
    }

    const mutation = useMutation({
        mutationFn: () => changePassword(username, form.current, form.next),
        onSuccess: (result) => {
            if (!result.success) {
                setErrors({ current: result.error })
                return
            }
            setForm(EMPTY)
            setErrors({})
            showToast('Password changed')
        },
        onError: () => showToast('Could not change your password. Please try again.'),
    })

    const submit = (e) => {
        e.preventDefault()

        const found = {}
        if (!form.current) found.current = 'Enter your current password'
        if (form.next.length < 8) found.next = 'Use at least 8 characters'
        else if (form.next === form.current) found.next = 'Choose a password you have not used here before'
        if (form.confirm !== form.next) found.confirm = 'Passwords do not match'

        setErrors(found)
        if (Object.keys(found).length === 0) mutation.mutate()
    }

    const strength = strengthOf(form.next)

    return(
        <section className={styles.section}>
            <h2 className={styles.title}>Password</h2>
            <p className={styles.lead}>Choose a strong password you don't use anywhere else.</p>

            <form className={styles.form} onSubmit={submit} noValidate>
                <Field
                    label="Current password"
                    type={type}
                    value={form.current}
                    onChange={change('current')}
                    error={errors.current}
                    hint={username === 'demo_user' ? 'The demo account password is demo1234.' : undefined}
                    autoComplete="current-password"
                />

                <Field
                    label="New password"
                    type={type}
                    value={form.next}
                    onChange={change('next')}
                    error={errors.next}
                    autoComplete="new-password"
                />

                {form.next && (
                    <div className={styles.strength} style={{ '--strength-color': LEVELS[strength].color }} aria-live="polite">
                        <div className={styles.meter} aria-hidden="true">
                            {[1, 2, 3, 4].map(n => <span key={n} className={n <= strength ? styles.filled : ''} />)}
                        </div>
                        <span>{LEVELS[strength].label || 'Too short'}</span>
                    </div>
                )}

                <Field
                    label="Confirm new password"
                    type={type}
                    value={form.confirm}
                    onChange={change('confirm')}
                    error={errors.confirm}
                    autoComplete="new-password"
                />

                <label className={styles.check}>
                    <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
                    Show passwords
                </label>

                <div className={styles.actions}>
                    <Button type="submit" variant="primary" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Changing...' : 'Change password'}
                    </Button>
                </div>
            </form>
        </section>
    )
}
