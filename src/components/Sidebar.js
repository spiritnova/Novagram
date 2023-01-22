import styles from './Sidebar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {faHouse} from '@fortawesome/free-solid-svg-icons'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import { faCompass } from '@fortawesome/free-regular-svg-icons'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { useContext, useState } from 'react'
import { useTheme } from '../ThemeContext'

import Dropdown from './Dropdown'
import AuthContext from '../context/auth-context'
import { useData } from '../context/user-context'
import Backdrop from './UI Kit/Backdrop'

export default function Sidebar(props){
    const [showBackdrop, setShowBackdrop] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const [image, setImage] = useState('')
    const [loading, setIsLoading] = useState(false)


    const darkTheme = useTheme()
    const userData = useData()


    darkTheme // Used to match the Body and Wrapper'S color depending on the theme
    ? document.body.style = 'background : #121212'
    : document.body.style = 'background : #f2f2f2'

    const handleShow = () => {
        setShowBackdrop(true)
        setShowModal(true)
    }

    const handleClose = () => {
        setShowBackdrop(false)
        setShowModal(false)
    }

    const uploadImage = async (e) => {
        const files = e.target.files
        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', 'novagram')
        setIsLoading(true)
        const res = await fetch("https://api.cloudinary.com/v1_1/dj3sulxro/image/upload", {
            method: "POST",
            body: data
        })
        const file = await res.json()

        setImage(file.secure_url)
        setIsLoading(false)

        const img = {
            "image": image,
            "username": userData.userData.username
        }

        fetch("/profile", {
            method: "POST",
            headers : {"Content-Type": "application/json"},
            body: JSON.stringify(img)
        })
    }

    return (
        <AuthContext.Consumer>
            {(ctx) => {
                return (
                    <div>
                        {ctx.isLoggedIn ? <nav className={darkTheme ? styles.nav : styles['nav-light']}>
                            <Link to="/" className={darkTheme ? styles['site-title'] : styles['site-title-light']}><span className={styles['nav-names']}>Novagram</span></Link>
                            <ul className={darkTheme ? styles['nav-links'] : styles['nav-links-light']}>
                                <ActiveLink to="/">
                                    <FontAwesomeIcon icon={faHouse} className={darkTheme ? styles.icons : styles['icons-light']}/>   <span className={styles['nav-names']}>Home</span>
                                </ActiveLink>
                                <li>
                                    <button className={darkTheme ? styles.buttons : styles['buttons-light']}>
                                        <FontAwesomeIcon icon={faMagnifyingGlass} className={darkTheme ? styles.icons : styles['icons-light']}/>   <span className={styles['nav-names']}>Search</span>
                                    </button>
                                </li>
                                <ActiveLink to="/explore">
                                    <FontAwesomeIcon icon={faCompass} className={darkTheme ? styles.icons : styles['icons-light']}/> <span className={styles['nav-names']}>Explore</span>
                                </ActiveLink>
        
                                <ActiveLink to="/messages">
                                    <FontAwesomeIcon icon={faComment} className={darkTheme ? styles.icons : styles['icons-light']}/> <span className={styles['nav-names']}>Messages</span>
                                </ActiveLink>
                                <li>
                                    <button className={darkTheme ? styles.buttons : styles['buttons-light']}>
                                    <FontAwesomeIcon icon={faHeart} className={darkTheme ? styles.icons : styles['icons-light']}/> <span className={styles['nav-names']}>Notifications</span>
                                    </button>
                                </li>
                                <li>
                                    <button className={darkTheme ? styles.buttons : styles['buttons-light']} onClick={handleShow}>
                                    <FontAwesomeIcon icon={faSquarePlus} className={darkTheme ? styles.icons : styles['icons-light']}/> <span className={styles['nav-names']}>Create</span>
                                    </button>
                                </li>
                                <ActiveLink to="/profile">
                                    <FontAwesomeIcon icon={faUser} className={darkTheme ? styles.icons : styles['icons-light']}/> <span className={styles['nav-names']}>Profile</span>
                                </ActiveLink>
                            </ul>
        
                            <Dropdown onLogout={props.onLogout}/>
                        </nav> : ''}
                       {showBackdrop && <Backdrop/>}
                        {showModal && <div className={styles.modal}>
                            <div>
                                <p>Create new post</p>
                            </div>

                            <div>
                                <FontAwesomeIcon icon={faPhotoFilm} className={styles['modal-icon']}></FontAwesomeIcon>
                            </div>

                            <p>Drag photos and videos here</p>

                            <div>
                                <label className={styles['modal-label']}>
                                    Select from computer
                                    <input type="file" onChange={uploadImage}/>
                                </label>
                            </div>

                            <div>
                                <button onClick={handleClose} className={styles['modal-close']}>
                                    <FontAwesomeIcon icon={faXmark}/> 
                                </button>
                            </div>
                       </div>}
                    </div>
                )
            }}
        </AuthContext.Consumer>
    )
}



// Function to determine the current active page
function ActiveLink({to, children, ...props}){
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({path: resolvedPath.pathname, end: true})

    return (
    <li className={isActive ? styles.active : ''}>
        <Link to={to} {...props}>
            {children}
        </Link>
    </li>)
}