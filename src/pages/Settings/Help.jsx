import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import styles from './Settings.module.css'
import Button from '../../components/UI Kit/Button'
import ReportDialog, { CATEGORIES } from '../../components/ReportDialog'
import { getReports } from '../../mock/api'
import { resetDemoData } from '../../mock/db'
import { timeAgo } from '../../utils/time'

const SHORTCUTS = [
    { keys: 'Esc', does: 'Close a post, story or dialog' },
    { keys: '← →', does: 'Move between story slides' },
    { keys: '↑ ↓', does: 'Move through search results' },
    { keys: 'Enter', does: 'Send a comment or message' },
    { keys: 'Shift + Enter', does: 'New line in a comment' },
    { keys: 'Double-click', does: 'Like a photo in the feed' },
]

export default function Help(){
    const [confirming, setConfirming] = useState(false)
    const [reporting, setReporting] = useState(false)
    const queryClient = useQueryClient()
    const username = sessionStorage.getItem('username')

    const reportsQuery = useQuery({
        queryKey: ['reports', username],
        queryFn: () => getReports(username),
    })
    const reports = reportsQuery.data ?? []

    // Start again from the original demo data. The account may no longer exist afterwards, so sign out.
    const reset = () => {
        resetDemoData()
        queryClient.clear()
        try {
            sessionStorage.clear()
            localStorage.removeItem('novagram_seen_stories')
        } catch {
            // nothing to clear
        }
        window.location.assign('/login')
    }

    return(
        <section className={styles.section}>
            <h2 className={styles.title}>Help</h2>

            <div className={styles.card}>
                <div className={styles.rowText} style={{ padding: 'var(--space-4) 0 0' }}>
                    <div className={styles.rowTitle}>Keyboard shortcuts</div>
                </div>
                <dl className={styles.shortcuts}>
                    {SHORTCUTS.map(({ keys, does }) => (
                        <div key={keys} style={{ display: 'contents' }}>
                            <dt><kbd>{keys}</kbd></dt>
                            <dd>{does}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            <div className={styles.card}>
                <div className={styles.row}>
                    <div className={styles.rowText}>
                        <div className={styles.rowTitle}>Report a problem</div>
                        <p className={styles.rowDesc}>Found a bug or have an idea? Tell us and we'll look into it.</p>
                    </div>
                    <Button size="sm" variant="primary" onClick={() => setReporting(true)}>Report</Button>
                </div>
                {reports.length > 0 && (
                    <ul className={styles.sessions}>
                        {reports.slice(0, 3).map(r => (
                            <li key={r.id} className={styles.session}>
                                <div className={styles.rowText}>
                                    <div className={styles.rowTitle}>
                                        {CATEGORIES.find(c => c.id === r.category)?.label ?? 'Report'}
                                        <span className={styles.badge}>Received</span>
                                    </div>
                                    <p className={styles.rowDesc}>#{r.reference} · {timeAgo(r.createdAt)} · {r.details.length > 60 ? `${r.details.slice(0, 60)}...` : r.details}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={styles.card}>
                <div className={styles.row}>
                    <div className={styles.rowText}>
                        <div className={styles.rowTitle}>About this demo</div>
                        <p className={styles.rowDesc}>
                            Novagram is a portfolio project built with React, React Router and TanStack Query.
                            There is no server: everything, including the other accounts' replies, is simulated in your browser.
                        </p>
                    </div>
                </div>
            </div>

            <div className={`${styles.card} ${styles.danger}`}>
                <div className={styles.row}>
                    <div className={styles.rowText}>
                        <div className={styles.rowTitle}>Reset demo data</div>
                        <p className={styles.rowDesc}>
                            Restores the original posts, messages and accounts, and signs you out.
                            Anything you created will be removed.
                        </p>
                    </div>
                    {confirming ? (
                        <div className={styles.actions}>
                            <Button variant="danger" size="sm" onClick={reset}>Yes, reset</Button>
                            <Button size="sm" onClick={() => setConfirming(false)}>Cancel</Button>
                        </div>
                    ) : (
                        <Button size="sm" onClick={() => setConfirming(true)}>Reset</Button>
                    )}
                </div>
            </div>

            {reporting && <ReportDialog onClose={() => setReporting(false)} />}
        </section>
    )
}
