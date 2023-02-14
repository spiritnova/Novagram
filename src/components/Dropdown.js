import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme, useThemeUpdate } from '../context/ThemeContext'

import Wrapper from './UI Kit/Wrapper'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './Dropdown.module.css'

import { faGear } from '@fortawesome/free-solid-svg-icons'
import { faBookmark } from '@fortawesome/free-regular-svg-icons'
import { faMoon } from '@fortawesome/free-regular-svg-icons'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'


export default function Dropdown(props){
    const [isActive, setIsActive] = useState(false) // This is to set the state of the visibility of the dropdown

    const username = sessionStorage.getItem('username')

    const toggleTheme = useThemeUpdate()

    const darkTheme = useTheme()

    return (
        <Wrapper>
            {isActive ? <div className={darkTheme ? styles['dropdown-content'] : styles['dropdown-content-light']}>
                <Link to='/settings'>
                Settings<FontAwesomeIcon icon={faGear} className={styles['dropdown-icons']}/>
                </Link>
                <Link to={`/profile/${username}/saved`}>
                Saved <FontAwesomeIcon icon={faBookmark} className={styles['dropdown-icons']}/>
                </Link>
                <button className={darkTheme ? styles.buttons : styles['buttons-light']} onClick={toggleTheme}>
                    Switch appearance <FontAwesomeIcon icon={faMoon} className={styles['dropdown-icons']}/>
                </button>
                <Link to='/report'>
                    Report a problem <FontAwesomeIcon icon={faTriangleExclamation} className={styles['dropdown-icons']}/>
                </Link>
                <button className={darkTheme ? styles.buttons : styles['buttons-light']} onClick={props.onLogout}>Log out</button>
            </div> : ''}

            <div className={styles['more-div']}>
                <button 
                className={darkTheme ? styles.more : styles['more-light']} 
                onClick={() => setIsActive(prev => !prev)}>
                    <FontAwesomeIcon icon={faBars} className={darkTheme ? styles.icons : styles['icons-light']}/> <span className={styles['nav-names']}>More</span>
                </button>
            </div>
        </Wrapper>
    )
}
