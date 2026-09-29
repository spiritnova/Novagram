import styles from './Popup.module.css'

export default function Popup({ message }){
    return(
        <div className={styles.popup} aria-hidden="true">
            <p>{message}</p>
        </div>
    )
}