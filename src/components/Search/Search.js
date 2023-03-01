import styles from './Search.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { forwardRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useTheme } from '../../context/ThemeContext'
import SearchResult from './SearchResult'

const Search = forwardRef((props, ref) => {
    const [enteredSearch, setEnteredSearch] = useState('')

    const darkTheme = useTheme()

    let api = 'https://novagram-api.onrender.com'

    const searchQuery = useQuery({
        queryKey: ["search", enteredSearch],
        queryFn: () => axios.get(`${api}/search/${enteredSearch}`),
        enabled: enteredSearch ? true : false
    })

    console.log(`Search result: ${searchQuery.data?.data}`)
    return(
        <div className={`${darkTheme ? styles.container : styles['container-light']}`} ref={ref}>
            <h3>Search</h3>

            <div className={`${darkTheme ? styles.search : styles['search-light']}`}>
                <input 
                type="text" 
                placeholder="Search" 
                onChange={(e) => setEnteredSearch(e.target.value)} 
                value={enteredSearch}/>
                <div className={`${darkTheme ? styles.button : styles['button-light']}`}>
                    <button onClick={() => setEnteredSearch('')}><FontAwesomeIcon icon={faXmark}/></button>
                </div>
            </div>

            <div className={styles.line}></div>

            <div className={styles.results}>
                {searchQuery.data?.data.map(user => (
                    <SearchResult user={user}/>
                ))}
                {searchQuery.data?.data.error && <p>No search results found</p>}
            </div>
        </div>
    )
})

export default Search;