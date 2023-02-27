import { useTheme } from '../../context/ThemeContext'
import styles from './Saved.module.css'

export default function Saved(){
    const darkTheme = useTheme()

    return(
        <div className={styles.wrapper}>
            <div className={styles.buttonDiv}>
                <button className={`${darkTheme ? styles.button: styles['button-light']}`}>+ New Collection</button>
            </div>
            <div className={styles.cards}>
                <div className={`${darkTheme ? styles.card : styles['card-light']}`}></div>
                <div className={`${darkTheme ? styles.card : styles['card-light']}`}></div>
                <div className={`${darkTheme ? styles.card : styles['card-light']}`}></div>
                <div className={`${darkTheme ? styles.card : styles['card-light']}`}></div>
                <div className={`${darkTheme ? styles.card : styles['card-light']}`}></div>
                <div className={`${darkTheme ? styles.card : styles['card-light']}`}></div>
            </div>
        </div>
    )
}