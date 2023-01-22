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
import { useContext, useEffect, useState } from 'react'
import { useTheme } from '../ThemeContext'

import Dropdown from './Dropdown'
import AuthContext from '../context/auth-context'
import Backdrop from './UI Kit/Backdrop'

export default function Sidebar(props){
    const [showBackdrop, setShowBackdrop] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const [image, setImage] = useState('')
    const [loading, setIsLoading] = useState(false)

    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()


    const darkTheme = useTheme()
    const user = JSON.parse(localStorage.getItem('user'))

    const ctx = useContext(AuthContext)

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

        let modal2 = document.getElementById("modal2")
        let modal3 = document.getElementById("modal3")
        modal2.style.display = "none"
        modal3.style.display = "none"
    }

    useEffect(() => {
        if(!selectedFile){
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl) 
    }, [selectedFile])

    const uploadImage = async (e) => {

        let modal1 = document.getElementById("modal1")
        let modal2 = document.getElementById("modal2")

        modal1.style.display = "none"
        modal2.style.display = "flex"

        const files = e.target.files
        console.log(files, files[0])

        if(!e.target.files || e.target.files.length === 0){
            setSelectedFile(undefined)
            return
        }

        setSelectedFile(e.target.files[0])

        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', 'novagram')
        setIsLoading(true)
        // const res = await fetch("https://api.cloudinary.com/v1_1/dj3sulxro/image/upload", {
        //     method: "POST",
        //     body: data
        // })
        // const file = await res.json()

        // setImage(file.secure_url)
        setIsLoading(false)

        const img = {
            "image": image,
            "username": user.username
        }

        fetch("/profile", {
            method: "POST",
            headers : {"Content-Type": "application/json"},
            body: JSON.stringify(img)
        })
    }

    const modalHandler = () => {
        let modal2 = document.getElementById("modal2")
        let modal3 = document.getElementById("modal3")

        modal2.style.display ="none"
        modal3.style.display ="flex"
    }

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
            {showModal && <div id="modal1" className={styles.modal}>
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
                <div className={styles['modal-preview']}>
                    {selectedFile && <img src={preview}/>}
                </div>
            </div>}
            <div id="modal2" className={styles.modal2}>
                <div>
                    <p>Create new post</p>
                </div>

                <div className={styles['modal-preview']}>
                    {selectedFile && <img src={preview}/>}
                </div>

                <div>
                    <button className={styles['modal-previous']}>
                        back
                    </button>
                </div>

                <div>
                    <button className={styles['modal-next']} onClick={modalHandler}>
                        Next
                    </button>
                </div>
            </div>
            <div id="modal3" className={styles.modal2}>
                <div>
                    <p>Create new post</p>
                </div>

                <div>
                    <div className={styles['modal-preview']}>
                        {selectedFile && <img src={preview}/>}
                    </div>

                    <div>
                        <textarea></textarea>
                    </div>
                </div>

                <div>
                    <button className={styles['modal-previous']}>
                        back
                    </button>
                </div>

                <div>
                    <button onClick={handleClose} className={styles['modal-close']}>
                        <FontAwesomeIcon icon={faXmark}/> 
                    </button>
                </div>
            </div>
        </div>
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