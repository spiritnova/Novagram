import { Link } from 'react-router-dom'
import styles from './RichText.module.css'

// #hashtag or @username (a trailing dot is punctuation, not part of the name)
const TOKEN = /(#[\p{L}\p{N}_]+|@[\w.]*\w)/u

// Renders text with hashtags linking to the Explore tag view and mentions linking to profiles
export default function RichText({ text }) {
    return text.split(TOKEN).map((part, i) => {
        if (i % 2 === 0) return part

        const to = part.startsWith('#')
            ? `/explore?tag=${encodeURIComponent(part.slice(1).toLowerCase())}`
            : `/${part.slice(1)}`

        return <Link key={i} to={to} className={styles.link}>{part}</Link>
    })
}
