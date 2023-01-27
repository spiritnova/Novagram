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
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { useContext, useEffect, useState, useRef } from 'react'
import { useTheme } from '../ThemeContext'

import Dropdown from './Dropdown'
import AuthContext from '../context/auth-context'

export default function Sidebar(props){
    const [showBackdrop, setShowBackdrop] = useState(false)

    const [image, setImage] = useState('')
    const [loading, setIsLoading] = useState(false)

    const modal = useRef()
    const modal2 = useRef()
    const modal3 = useRef()

    {showBackdrop
        ? document.body.style.overflow = "hidden"
        : document.body.style.overflow = "auto"
    }

    const pic = useRef()
    const fileInput = useRef()
    const caption = useRef()

    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()

    const darkTheme = useTheme()
    const user = JSON.parse(localStorage.getItem('user'))

    const ctx = useContext(AuthContext)

    darkTheme // Used to match the Body and Wrapper'S color depending on the theme
    ? document.body.style = 'background : #121212'
    : document.body.style = 'background : #f2f2f2'

    const handleShow = (e) => {
        setShowBackdrop(true)
        modal.current.style.display = "flex"
    }

    const handleClose = () => {
        setShowBackdrop(false)
        setPreview(undefined)

        modal.current.style.display = "none"
        modal2.current.style.display = "none"
        modal3.current.style.display = "none"
    }

    const modalBack = (page) => () => {
        if (page === "page"){
            modal.current.style.display = "none"
            setShowBackdrop(false)
        }

        if(page === "page2"){
            modal.current.style.display = "flex"
            modal2.current.style.display = "none"
            fileInput.current.value = ''
            setSelectedFile(undefined)
            setPreview(undefined)
        }

        if(page === "page3"){
            modal3.current.style.display = "none"
            modal2.current.style.display = "flex"
        }
    }

    const modalHandler = () => {
        modal2.current.style.display ="none"
        modal3.current.style.display ="flex"
    }

    const inputChangeHandler = (e) => {
        modal.current.style.display = "none"
        modal2.current.style.display = "flex"

        if(!e.target.files || e.target.files.length === 0){
            setSelectedFile(undefined)
            return
        }

        setSelectedFile(e.target.files[0])
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
        const files = fileInput.current.files

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


        const post = {
            "image": image,
            "username": user.username,
            "caption" : caption.current.value
        }

        fetch("/profile", {
            method: "POST",
            headers : {"Content-Type": "application/json"},
            body: JSON.stringify(post)
        })
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
                    <ActiveLink to={`/profile/${user.username}`}>
                        <FontAwesomeIcon icon={faUser} className={darkTheme ? styles.icons : styles['icons-light']}/> <span className={styles['nav-names']}>Profile</span>
                    </ActiveLink>
                </ul>

                <Dropdown onLogout={props.onLogout}/>
            </nav> : ''}
            {showBackdrop && <div className={styles.backdrop}></div>}
            <div className={styles.modal} ref={modal}>
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
                        <input ref={fileInput} type="file" onChange={inputChangeHandler}/>
                    </label>
                </div>

                <div>
                    <button className={styles['modal-previous']} onClick={modalBack("page")}>
                        <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
                    </button>
                </div>
            
                <div className={styles['modal-preview']}>
                    {selectedFile && <img ref={pic} src={preview}/>}
                </div>
            </div>


            <div className={styles.modal2} ref={modal2}>
                <div>
                    <p>Create new post</p>
                </div>

                <div className={styles['modal-preview']}>
                    {selectedFile && <img  src={preview}/>}
                </div>

                <div>
                    <button className={styles['modal-previous']} onClick={modalBack("page2")}>
                        <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
                    </button>
                </div>

                <div>
                    <button className={styles['modal-next2']} onClick={modalHandler}>
                        Next
                    </button>
                </div>
            </div>
            <div className={styles.modal3} ref={modal3}>
                <div className={styles.modalDiv}>
                    <p>Create new post</p>

                    <button className={styles['modal-previous']} onClick={modalBack("page3")}>
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </button>
                    <button className={styles['modal-share']} onClick={uploadImage}>Share</button>
                </div>

                <div className={styles.caption}>
                    <div className={styles['modal-preview3']}>
                        {selectedFile && <img src={preview}/>}
                    </div>

                    <div className={styles.textarea}>
                        <textarea ref={caption} placeholder='Write a caption...'/>
                    </div>
                </div>
            </div>
            {showBackdrop && <button onClick={handleClose} className={styles['modal-close']}>
                <FontAwesomeIcon icon={faXmark}/> 
            </button>}
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