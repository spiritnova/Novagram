import styles from './Saved.module.css'

export default function Saved(){
    return(
        <div>
            <div className={styles.buttonDiv}>
                <button className={styles.button}>+ New Collection</button>
            </div>
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