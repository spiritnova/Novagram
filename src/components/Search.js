import styles from './Search.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

export default function Search(){
    const [enteredSearch, setEnteredSearch] = useState('')

    const searchHandler = (e) => {
        setEnteredSearch(e.target.value)
    }

    const clearHandler = () => {
        setEnteredSearch('')
    }

    return(
        <div className={styles.container}>
            <h3>Search</h3>

            <div className={styles.search}>
                <input type="text" placeholder="Search" onChange={searchHandler} value={enteredSearch}/>
                <div className={styles.button}>
                    <button onClick={clearHandler}><FontAwesomeIcon icon={faXmark}/></button>
                </div>
            </div>

            <div className={styles.line}></div>

            <div className={styles.results}>
                <div className={styles.result}>
                    <div className={styles.picture}></div>
                    <div className={styles.name}>
                        <div>Jimmy</div>
                        <div>Mohammad Jamal</div>
                    </div>
                </div>
                <div className={styles.result}>
                    <div className={styles.picture}></div>
                    <div className={styles.name}>
                        <div>DreamyBear</div>
                        <div>Hadi zeineddine</div>
                    </div>
                </div>
            </div>
        </div>
    )
}