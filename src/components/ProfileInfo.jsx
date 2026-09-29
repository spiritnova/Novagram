import styles from './ProfileInfo.module.css'

// Posts / followers / following counts. Followers and following open their lists.
export default function ProfileInfo({ postCount, followers, following, onFollowers, onFollowing }){
    return (
        <ul className={styles.stats}>
            <li>
                <span className={styles.stat}>
                    <b>{postCount ?? 0}</b>
                    <span>posts</span>
                </span>
            </li>
            <li>
                <button className={styles.stat} onClick={onFollowers}>
                    <b>{followers}</b>
                    <span>followers</span>
                </button>
            </li>
            <li>
                <button className={styles.stat} onClick={onFollowing}>
                    <b>{following}</b>
                    <span>following</span>
                </button>
            </li>
        </ul>
    )
}
