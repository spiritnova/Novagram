import styles from "./Settings.module.css";
import { useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
import Popup from "../../components/UI Kit/Popup";
import { useQueryClient } from "@tanstack/react-query";

export default function EditProfile() {
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  const modal = useRef()

  const queryClient = useQueryClient()

  const username = sessionStorage.getItem('username')
  const name = sessionStorage.getItem('name')
  const picture = sessionStorage.getItem('picture')
  const bio = sessionStorage.getItem('bio')
  const email = sessionStorage.getItem('email')

  const defaultImage = username.charAt(0).toUpperCase()


  const [enteredName, setEnteredName] = useState(name);
  const [enteredUsername, setEnteredUsername] = useState(username);
  const [enteredBio, setEnteredBio] = useState(bio)
  const [enteredEmail, setEnteredMail] = useState(email)

  const [valid, setIsValid] = useState(false)


  if (showModal){
    document.body.style.overflow = "hidden"
  }

  else{
      document.body.style.overflow ="auto"
  }

  const nameChangeHandler = (e) => {
    setEnteredName(e.target.value);

    setIsValid(true)
  };

  const usernameChangeHandler = e => {
    setEnteredUsername(e.target.value)

    setIsValid(true)
  }

  const bioChangeHandler = e => {
    setEnteredBio(e.target.value)

    setIsValid(true)
  }

  const emailChangeHandler = e => {
    setEnteredMail(e.target.value)

    setIsValid(true)
  }

  const handleShow = () => {
    setShowModal(true);
    setShowBackdrop(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setShowBackdrop(false);
  };

  const handleBackdrop = (e) => {
    setShowModal(false)
    setShowBackdrop(false)
  }

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const darkTheme = useTheme();

  const pfpInput = useRef()

  let api = 'https://novagram-api.onrender.com'

  const uploadImage = async () => {

    setShowBackdrop(false)
    setShowModal(false)
    
    const files = pfpInput.current.files

    
    const data = new FormData()
    
    
    data.append("image", files[0])

    const res = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers : {
          "Authorization": "Client-ID 6997d124420fdc3"
        },
        body: data
    })
    const file = await res.json()

    console.log(file)


    sessionStorage.setItem('picture', file.data.link)

    fetch(`${api}/profile/picture`, {
      method: "POST",
      headers : {"Content-Type": "application/json"},
      body: JSON.stringify({
        "image": file.data.link,
        "username": username
      })
    })

    setPopupMessage('Profile picture changed successfully.')
    setShowPopup(true)

    const popupTimer = setTimeout(() => {
      setShowPopup(false)
    }, 2500)

    return () => {
      clearTimeout(popupTimer)
    }
  }

  // Editing the profile Submit function

  function editsSubmitHandler(){
    axios.post(`${api}/profile/edit`, {
      "user": username,
      "name": enteredName,
      "username": enteredUsername,
      "bio": enteredBio,
      "email": enteredEmail,
    }).then(res => {
      sessionStorage.setItem('username', res.data.data.username)
      sessionStorage.setItem('name', res.data.data.name)
      sessionStorage.setItem('bio', res.data.data.bio)
      sessionStorage.setItem('email', res.data.data.email)
    })

    queryClient.invalidateQueries(["posts"])
    setPopupMessage('Profile has been saved.')
    setShowPopup(true)

    setIsValid(false)

    const popupTimer = setTimeout(() => {
      setShowPopup(false)
    }, 2500)

    return () => {
      clearTimeout(popupTimer)
    }
  }

  return (
    <div className={styles.forms}>
      <div className={styles.profile}>
        <div
          className={darkTheme ? styles.imgDiv : styles["imgDiv-light"]}
        >
          
          {picture 
          ? <img alt="profilePicture" src={picture}></img>
          : defaultImage
        }
          
        </div>
        <div className={styles.pfp}>
          <p>{username}</p>
          <button type="button" onClick={handleShow}>
            Change profile photo
          </button>
        </div>
      </div>

      <form className={styles["form-container"]} onSubmit={submitHandler}>
        <div className={styles.form}>
          <div className={styles["form-label"]}>
            <label htmlFor="name">Name</label>
          </div>
          <div
            className={
              darkTheme ? styles["form-input"] : styles["form-input-light"]
            }
          >
            <input
              type="text"
              placeholder="name"
              id="name"
              onChange={nameChangeHandler}
              value={enteredName}
            />
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles["form-label"]}>
            <label htmlFor="username">Username</label>
          </div>
          <div
            className={
              darkTheme ? styles["form-input"] : styles["form-input-light"]
            }
          >
            <input 
            type="text" 
            placeholder="username" 
            id="username"
            onChange={usernameChangeHandler}
            value={enteredUsername}
            />
            <p>
              In most cases, you'll be able to change your username in 14 days
            </p>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles["form-label"]}>
            <label htmlFor="website">Website</label>
          </div>
          <div
            className={
              darkTheme ? styles["form-input"] : styles["form-input-light"]
            }
          >
            <input
              type="text"
              placeholder="www.example.com"
              id="website"
            ></input>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles["form-label"]}>
            <label htmlFor="bio">Bio</label>
          </div>
          <div
            className={
              darkTheme ? styles["form-input"] : styles["form-input-light"]
            }
          >
            <textarea 
            type="text" 
            placeholder="bio" 
            id="bio" 
            onChange={bioChangeHandler}
            value={enteredBio}
            />
            <span>Personal Information</span>
            <p>
              Provide your personal information, even if the account is used for
              a business, a pet or something else. This won't be a part of your
              public profile.
            </p>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles["form-label"]}>
            <label htmlFor="email">Email</label>
          </div>
          <div
            className={
              darkTheme ? styles["form-input"] : styles["form-input-light"]
            }
          >
            <input
              type="email"
              placeholder="johndoe@hotmail.com"
              id="email"
              onChange={emailChangeHandler}
              value={enteredEmail}
            ></input>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles["form-label"]}>
            <label htmlFor="phone">Phone number</label>
          </div>
          <div
            className={
              darkTheme ? styles["form-input"] : styles["form-input-light"]
            }
          >
            <input type="tel" placeholder="+123 - 425123" id="phone"></input>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles["form-label"]}>
            <label htmlFor="gender">Gender</label>
          </div>
          <div
            className={
              darkTheme ? styles["form-input"] : styles["form-input-light"]
            }
          >
            <input type="text" placeholder="gender" id="gender"></input>
          </div>
        </div>

        <div className={styles["submit-btn-div"]}>
          <button className={styles["submit-btn"]} type="submit" onClick={editsSubmitHandler} disabled={!valid}>
            Submit
          </button>
        </div>
      </form>

      {showPopup && <Popup message={popupMessage}/>}
      {showBackdrop && <div className={styles.backdrop} onClick={handleBackdrop}></div>}
      {showModal && (
        <div className={styles.modalWrapper}>
        <div className={styles.modal} ref={modal}>
          <p>Change Profile Photo</p>
          <label>
            Upload photo
            <input type="file" ref={pfpInput} onChange={uploadImage}/>
          </label>
          <button>Remove Current Photo</button>
          <button onClick={handleClose}>Cancel</button>
        </div>
        </div>
      )}
    </div>
  );
}
