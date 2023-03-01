import { faBars, faBookmark, faGear, faMoon, faSun, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { Link } from "react-router-dom"
import styles from './MobileNavbar.module.css'
import { useTheme, useThemeUpdate } from "../context/ThemeContext"

export default function MobileNavbar({logout}){
    const [showDropdown, setShowDropdown] = useState(false)

    const username = sessionStorage.getItem('username')

    const darkTheme = useTheme()

    const themeToggle = useThemeUpdate()
    return(
        <nav className={`${styles.nav} ${darkTheme ? '' : styles.light}`}>
            <h4 style={{color : darkTheme ? 'white': 'black'}}>Novagram</h4>
            <div className={styles.icon}>
                <button 
                    style={{color : darkTheme ? 'white': 'black'}} 
                    onClick={() => setShowDropdown(prev => !prev)}
                >
                    <FontAwesomeIcon icon={faBars}/>
                </button>
            </div>

            {showDropdown && 
            <div className={`${darkTheme ? styles.content : styles['content-light']}`}>
                <ul>
                    <li><Link to='/settings' onClick={() => setShowDropdown(false)}>
                            <div className={styles.link}>
                                <div>
                                    <FontAwesomeIcon icon={faGear}/>
                                </div>
                                <div>Settings</div>
                            </div>
                        </Link>
                    </li>
                    <li onClick={() => setShowDropdown(false)}><Link to={`/${username}/saved`}>
                            <div className={styles.link}>
                                <div>
                                    <FontAwesomeIcon icon={faBookmark}/>
                                </div>
                                <div>Saved</div>
                            </div>
                        </Link>
                    </li>
                    <li onClick={() => themeToggle()}>
                            <div className={styles.link}>
                                <div>
                                    <FontAwesomeIcon icon={darkTheme ? faSun : faMoon}/>
                                </div>
                                <div>Switch Appearance</div>
                            </div>
                    </li>
                    <li><Link to={'#'}>
                            <div className={styles.link}>
                                <div>
                                    <FontAwesomeIcon icon={faTriangleExclamation}/>
                                </div>
                                <div>Report</div>
                            </div>
                        </Link>
                    </li>
                    <li onClick={()=> {
                        logout()
                        setShowDropdown(false)
                    }}><Link>
                            <div className={styles.link}>
                                <div>Logout</div>
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>}

            {showDropdown && <div onClick={() => setShowDropdown(false)} className={styles.backdrop}></div>}
        </nav>
    )
}