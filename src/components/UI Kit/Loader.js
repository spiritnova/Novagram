import styles from './Loader.module.css'
import Wrapper from './Wrapper'

export default function Loader({type}){
    return (
        <Wrapper>
            {type === '1' && <div className={styles.loader}></div>}
            {type === '2' && 
            <div className={styles['loader-6']}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>}
        </Wrapper>
    )
}
