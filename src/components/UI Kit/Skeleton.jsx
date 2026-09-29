import styles from './Skeleton.module.css'

export function Skeleton({ className = '', style }) {
  return <div className={`${styles.skeleton} ${className}`} style={style} aria-hidden="true" />
}

// Holds the stories row's place while it loads, so the posts below don't jump when it appears
export function StoriesSkeleton() {
  return (
    <div className={styles.stories} aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.story}>
          <Skeleton className={styles.circle} />
          <Skeleton className={styles.line} style={{ width: '3rem' }} />
        </div>
      ))}
    </div>
  )
}

export function FeedSkeleton() {
  return (
    <div className={styles.feed} role="status" aria-label="Loading feed">
      <StoriesSkeleton />
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className={styles.post}>
          <div className={styles.header}>
            <Skeleton className={styles.avatar} />
            <Skeleton className={styles.line} style={{ width: '7rem' }} />
          </div>
          <Skeleton className={styles.image} />
          <Skeleton className={styles.line} style={{ width: '5rem', marginTop: '0.9rem' }} />
          <Skeleton className={styles.line} style={{ width: '70%', marginTop: '0.6rem' }} />
        </div>
      ))}
    </div>
  )
}

export function GridSkeleton({ columns = 3, count = 9 }) {
  return (
    <div
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      role="status"
      aria-label="Loading posts"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={styles.tile} />
      ))}
    </div>
  )
}
