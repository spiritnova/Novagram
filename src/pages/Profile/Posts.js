import styles from './Posts.module.css'

export default function Posts(){
    return(
        <div>
            <div className={styles.cards}>
                <div className={styles.card}></div>
                <div className={styles.card}></div>
                <div className={styles.card}></div>
                <div className={styles.card}></div>
                <div className={styles.card}></div>
                <div className={styles.card}></div>
            </div>
        </div>
    )
}