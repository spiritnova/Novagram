import { Bug, CircleCheck, Flag, Lightbulb, MessageSquare, X } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import styles from './ReportDialog.module.css'
import Button from './UI Kit/Button'
import useDialog from '../hooks/useDialog'
import { submitReport } from '../mock/api'

export const CATEGORIES = [
    { id: 'bug', label: 'Something isn\'t working', icon: Bug },
    { id: 'content', label: 'Inappropriate content', icon: Flag },
    { id: 'suggestion', label: 'Suggestion', icon: Lightbulb },
    { id: 'other', label: 'Something else', icon: MessageSquare },
]

// "Report a problem": pick what it is about, describe it, and it is saved with the page you were on
export default function ReportDialog({ onClose }) {
    const [category, setCategory] = useState('')
    const [details, setDetails] = useState('')
    const [includePage, setIncludePage] = useState(true)
    const [error, setError] = useState('')
    const [reference, setReference] = useState(null)

    const location = useLocation()
    const queryClient = useQueryClient()
    const detailsId = useId()
    const username = sessionStorage.getItem('username')

    const overlay = useRef()
    useDialog(overlay, { onClose })

    const mutation = useMutation({
        mutationFn: () => submitReport({
            username,
            category,
            details,
            page: includePage ? location.pathname + location.search : null,
        }),
        onSuccess: (result) => {
            if (!result.success) {
                setError(result.error)
                return
            }
            queryClient.invalidateQueries({ queryKey: ['reports', username] })
            setReference(result.reference)
        },
        onError: () => setError("Couldn't send your report. Please try again."),
    })

    const submit = (e) => {
        e.preventDefault()
        setError('')
        mutation.mutate()
    }

    return createPortal(
        <div className={styles.overlay} ref={overlay} onClick={onClose}>
            <div className={styles.dialog} role="dialog" aria-modal="true" aria-label="Report a problem" onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2>Report a problem</h2>
                    <button className={styles.close} onClick={onClose} aria-label="Close"><X size={20} /></button>
                </header>

                {reference ? (
                    <div className={styles.done}>
                        <CircleCheck size={48} strokeWidth={1.5} aria-hidden="true" />
                        <h3>Thanks, we got it</h3>
                        <p>Your report has been sent. Reference <b>{reference}</b>.</p>
                        <Button variant="primary" onClick={onClose}>Done</Button>
                    </div>
                ) : (
                    <form className={styles.form} onSubmit={submit} noValidate>
                        <fieldset className={styles.categories}>
                            <legend>What is this about?</legend>
                            {CATEGORIES.map(({ id, label, icon: Icon }) => (
                                <label key={id} className={`${styles.category} ${category === id ? styles.selected : ''}`}>
                                    <input
                                        type="radio"
                                        name="report-category"
                                        value={id}
                                        checked={category === id}
                                        onChange={() => { setCategory(id); setError('') }}
                                    />
                                    <Icon size={18} aria-hidden="true" />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </fieldset>

                        <div className={styles.field}>
                            <label htmlFor={detailsId}>Details</label>
                            <textarea
                                id={detailsId}
                                value={details}
                                onChange={(e) => { setDetails(e.target.value.slice(0, 1000)); setError('') }}
                                placeholder="What happened, and what did you expect?"
                                rows={5}
                            />
                            <span className={styles.counter}>{details.length}/1000</span>
                        </div>

                        <label className={styles.check}>
                            <input type="checkbox" checked={includePage} onChange={(e) => setIncludePage(e.target.checked)} />
                            Include the page I'm on ({location.pathname})
                        </label>

                        {error && <p className={styles.error} role="alert">{error}</p>}

                        <div className={styles.actions}>
                            <Button type="button" onClick={onClose}>Cancel</Button>
                            <Button type="submit" variant="primary" disabled={mutation.isPending}>
                                {mutation.isPending ? 'Sending...' : 'Send report'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>,
        document.body
    )
}
