import styles from './Search.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { forwardRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Search = forwardRef((props, ref) => {
    const [enteredSearch, setEnteredSearch] = useState('')

    const searchQuery = useQuery({
        queryKey: ["search", enteredSearch],
        queryFn: () => axios.get(`/search/${enteredSearch}`),
        enabled: enteredSearch ? true : false
    })

    return(
        <div className={styles.container} ref={ref}>
            <h3>Search</h3>

            <div className={styles.search}>
                <input 
                type="text" 
                placeholder="Search" 
                onChange={(e) => setEnteredSearch(e.target.value)} 
                value={enteredSearch}/>
                <div className={styles.button}>
                    <button onClick={() => setEnteredSearch('')}><FontAwesomeIcon icon={faXmark}/></button>
                </div>
            </div>

            <div className={styles.line}></div>

            <div className={styles.results}>
                {searchQuery.data?.data.map(user => (
                    <div key={user.username} className={styles.result}>
                        <div className={styles.picture}>
                            <img alt={`${user.username}'s pfp`} src={user.picture}/>
                        </div>
                        <div className={styles.name}>
                            <Link to={`/${user.username}`}>
                                <div>{user.username}</div>
                            </Link>
                            <div>{user.name}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
})

export default Search;