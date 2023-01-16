import styles from './Backdrop.module.css'

export default function Backdrop({children}){
    return(
        <div className={styles.backdrop}>
            {children}
        </div>
    )
}