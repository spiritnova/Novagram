import { Clock, Hash, Search as SearchIcon, X } from 'lucide-react'
import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import styles from './Search.module.css'
import { Skeleton } from '../UI Kit/Skeleton'
import { getTrendingTags, searchAll } from '../../mock/api'

const MAX_RECENT = 8

function loadRecent(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? []
    } catch {
        return []
    }
}

function saveRecent(key, list) {
    try {
        localStorage.setItem(key, JSON.stringify(list))
    } catch {
        // recent searches just won't be remembered
    }
}

const itemKey = (item) => (item.type === 'user' ? `user:${item.username}` : `tag:${item.tag}`)
const itemPath = (item) => (item.type === 'user' ? `/${item.username}` : `/explore?tag=${encodeURIComponent(item.tag)}`)

// Bolds the part of a name that matches what was typed
function Highlight({ text, query }) {
    const q = query.trim().replace(/^[@#]/, '')
    const at = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1
    if (at < 0) return text

    return (
        <>
            {text.slice(0, at)}
            <mark className={styles.match}>{text.slice(at, at + q.length)}</mark>
            {text.slice(at + q.length)}
        </>
    )
}

function Avatar({ user }) {
    return (
        <span className={styles.avatar}>
            {user.picture ? <img src={user.picture} alt="" /> : user.username.charAt(0).toUpperCase()}
        </span>
    )
}

// The panel that slides out of the sidebar: search people and hashtags, with recent searches
const Search = forwardRef(({ onNavigate, onClose }, ref) => {
    const [text, setText] = useState('')
    const [debounced, setDebounced] = useState('')
    const [active, setActive] = useState(-1)

    const username = sessionStorage.getItem('username')
    const recentKey = `novagram_recent_searches_${username}`
    const [recent, setRecent] = useState(() => loadRecent(recentKey))

    const navigate = useNavigate()
    const input = useRef()
    const listId = useId()

    useEffect(() => {
        input.current?.focus()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(text), 250)
        return () => clearTimeout(timer)
    }, [text])

    const searching = debounced.trim() !== ''

    const resultsQuery = useQuery({
        queryKey: ['search', debounced.trim()],
        queryFn: () => searchAll(debounced, username),
        enabled: searching,
        placeholderData: keepPreviousData,
    })

    const trendingQuery = useQuery({
        queryKey: ['trending-tags'],
        queryFn: getTrendingTags,
    })

    // Everything selectable, in the order it appears, for arrow-key navigation
    const items = useMemo(() => {
        if (!searching) return recent
        const data = resultsQuery.data
        if (!data) return []
        return [
            ...data.users.map(u => ({ type: 'user', username: u.username, name: u.name, picture: u.picture })),
            ...data.tags.map(t => ({ type: 'tag', tag: t.tag, count: t.count })),
        ]
    }, [searching, recent, resultsQuery.data])

    useEffect(() => {
        setActive(-1)
    }, [items])

    const remember = (item) => {
        const next = [item, ...recent.filter(r => itemKey(r) !== itemKey(item))].slice(0, MAX_RECENT)
        setRecent(next)
        saveRecent(recentKey, next)
    }

    const open = (item) => {
        remember(item)
        navigate(itemPath(item))
        onNavigate?.()
    }

    const forget = (item) => {
        const next = recent.filter(r => itemKey(r) !== itemKey(item))
        setRecent(next)
        saveRecent(recentKey, next)
    }

    const clearRecent = () => {
        setRecent([])
        saveRecent(recentKey, [])
    }

    const keyHandler = (e) => {
        if (e.key === 'Escape') {
            onClose?.()
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive(prev => (items.length ? (prev + 1) % items.length : -1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive(prev => (items.length ? (prev <= 0 ? items.length - 1 : prev - 1) : -1))
        } else if (e.key === 'Enter' && active >= 0 && items[active]) {
            e.preventDefault()
            open(items[active])
        }
    }

    const optionProps = (item, index) => ({
        id: `${listId}-${index}`,
        role: 'option',
        'aria-selected': index === active,
        className: `${styles.row} ${index === active ? styles.active : ''}`,
        onMouseMove: () => setActive(index),
    })

    const renderItem = (item, index, { removable } = {}) => {
        const isUser = item.type === 'user'
        return (
            <li key={itemKey(item)} {...optionProps(item, index)}>
                <Link to={itemPath(item)} className={styles.link} onClick={() => remember(item)} tabIndex={-1}>
                    {isUser
                        ? <Avatar user={item} />
                        : <span className={`${styles.avatar} ${styles.hash}`}><Hash size={18} aria-hidden="true" /></span>}
                    <span className={styles.text}>
                        <span className={styles.primary}>
                            {isUser ? <Highlight text={item.username} query={text} /> : <>#<Highlight text={item.tag} query={text} /></>}
                        </span>
                        <span className={styles.secondary}>
                            {isUser
                                ? <Highlight text={item.name ?? ''} query={text} />
                                : (item.count != null ? `${item.count} post${item.count === 1 ? '' : 's'}` : 'Hashtag')}
                        </span>
                    </span>
                </Link>
                {removable && (
                    <button className={styles.remove} onClick={() => forget(item)} aria-label={`Remove ${isUser ? item.username : `#${item.tag}`} from recent searches`}>
                        <X size={16} aria-hidden="true" />
                    </button>
                )}
            </li>
        )
    }

    const data = resultsQuery.data
    const userCount = data?.users.length ?? 0
    const loadingFirst = searching && resultsQuery.isPending

    return(
        <div className={styles.container} ref={ref} role="dialog" aria-label="Search">
            <h3>Search</h3>

            <div className={styles.search}>
                <SearchIcon size={18} aria-hidden="true" />
                <input
                    ref={input}
                    type="text"
                    role="combobox"
                    aria-expanded={items.length > 0}
                    aria-controls={listId}
                    aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
                    aria-label="Search people and hashtags"
                    placeholder="Search people or #hashtags"
                    autoComplete="off"
                    spellCheck="false"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={keyHandler}
                />
                {text && (
                    <button className={styles.clear} onClick={() => { setText(''); input.current?.focus() }} aria-label="Clear search">
                        <X size={16} aria-hidden="true" />
                    </button>
                )}
            </div>

            <div className={styles.body}>
                {loadingFirst && (
                    <div className={styles.loading} role="status" aria-label="Searching">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className={styles.row}>
                                <Skeleton className={styles.avatar} style={{ borderRadius: '50%' }} />
                                <Skeleton style={{ flex: 1, height: '1rem' }} />
                            </div>
                        ))}
                    </div>
                )}

                {searching && resultsQuery.isError && (
                    <div className={styles.empty}>
                        <p>Couldn't run that search.</p>
                        <button onClick={() => resultsQuery.refetch()}>Try again</button>
                    </div>
                )}

                {searching && data && (
                    items.length === 0
                        ? <div className={styles.empty}><p>No results for "{debounced.trim()}"</p></div>
                        : (
                            <ul id={listId} role="listbox" aria-label="Search results" className={styles.list}>
                                {userCount > 0 && <li role="presentation" className={styles.heading}>People</li>}
                                {items.slice(0, userCount).map((item, i) => renderItem(item, i))}
                                {items.length > userCount && <li role="presentation" className={styles.heading}>Hashtags</li>}
                                {items.slice(userCount).map((item, i) => renderItem(item, userCount + i))}
                            </ul>
                        )
                )}

                {!searching && recent.length > 0 && (
                    <>
                        <div className={styles.sectionHead}>
                            <span>Recent</span>
                            <button onClick={clearRecent}>Clear all</button>
                        </div>
                        <ul id={listId} role="listbox" aria-label="Recent searches" className={styles.list}>
                            {recent.map((item, i) => renderItem(item, i, { removable: true }))}
                        </ul>
                    </>
                )}

                {!searching && recent.length === 0 && (
                    <div className={styles.suggest}>
                        <p className={styles.sectionHead}><span><Clock size={14} aria-hidden="true" /> Nothing recent yet</span></p>
                        {trendingQuery.data?.length > 0 && (
                            <>
                                <p className={styles.heading}>Trending</p>
                                <div className={styles.chips}>
                                    {trendingQuery.data.map(({ tag }) => (
                                        <Link
                                            key={tag}
                                            to={`/explore?tag=${encodeURIComponent(tag)}`}
                                            className={styles.chip}
                                            onClick={() => { remember({ type: 'tag', tag }); onNavigate?.() }}
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
})

export default Search;
