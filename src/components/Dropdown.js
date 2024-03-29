import { useEffect, useRef, useState } from 'react'
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

    const dropdown = useRef()
    const btn = useRef()

    const toggleTheme = useThemeUpdate()

    const darkTheme = useTheme()

    useEffect(() => {
        
        function dropdownCloseHandler(e){
            if(e.target && btn.current.contains(e.target))
            {
                setIsActive(prev => !prev)
            }
            if (dropdown.current && !dropdown.current.contains(e.target)) {
                setIsActive(false)
            }
        }
        document.addEventListener('click', dropdownCloseHandler)
        
        return () => {
            document.removeEventListener('click', dropdownCloseHandler)
        }
    }, [dropdown])

    return (
        <Wrapper>
            {isActive ? <div ref={dropdown} className={darkTheme ? styles['dropdown-content'] : styles['dropdown-content-light']}>
                <Link to='/settings'>
                Settings<FontAwesomeIcon icon={faGear} className={styles['dropdown-icons']}/>
                </Link>
                <Link to={`/${username}/saved`}>
                Saved <FontAwesomeIcon icon={faBookmark} className={styles['dropdown-icons']}/>
                </Link>
                <button className={darkTheme ? styles.buttons : styles['buttons-light']} onClick={toggleTheme}>
                    Switch appearance <FontAwesomeIcon icon={faMoon} className={styles['dropdown-icons']}/>
                </button>
                <Link to='#'>
                    Report a problem <FontAwesomeIcon icon={faTriangleExclamation} className={styles['dropdown-icons']}/>
                </Link>
                <button className={darkTheme ? styles.buttons : styles['buttons-light']} onClick={props.onLogout}>Log out</button>
            </div> : ''}

            <div className={styles['more-div']}>
                <button 
                ref={btn}
                className={darkTheme ? styles.more : styles['more-light']} 
                >
                    <FontAwesomeIcon icon={faBars} className={darkTheme ? styles.icons : styles['icons-light']}/> <span className={styles['nav-names']}>More</span>
                </button>
            </div>
        </Wrapper>
    )
}
