import styles from "./Settings.module.css";
import { useRef, useState } from "react";
import { useTheme } from "../../ThemeContext";

export default function EditProfile() {
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'))
  const picture = localStorage.getItem('picture')

  const [enteredName, setEnteredName] = useState(user.name);
  const [enteredUsername, setEnteredUsername] = useState(user.username);


  if (showModal){
    document.body.style.overflow = "hidden"
  }

  else{
      document.body.style.overflow ="auto"
  }

  const nameChangeHandler = (e) => {
    setEnteredName(e.target.value);
  };

  const usernameChangeHandler = e => {
    setEnteredUsername(e.target.value)
  }

  const handleShow = () => {
    setShowModal(true);
    setShowBackdrop(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setShowBackdrop(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const darkTheme = useTheme();

  const [image, setImage] = useState()
  const [loading, setIsLoading] = useState()

  const pfpInput = useRef()

  const uploadImage = async () => {
    const files = pfpInput.current.files
    
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

    setShowBackdrop(false)
    setShowModal(false)

    user['picture'] = file.eager[0].secure_url

    localStorage.setItem('picture', file.eager[0].secure_url)

    console.log(user.picture)

    console.log(file.eager[0].secure_url)


    fetch("/profile/picture", {
      method: "POST",
      headers : {"Content-Type": "application/json"},
      body: JSON.stringify({
        "image": image,
        "username": user.username
      })
    })
  }

  return (
    <div className={styles.forms}>
      <div className={styles.profile}>
        <div
          className={darkTheme ? styles.imgDiv : styles["imgDiv-light"]}
        >
          <img src={picture ? picture : user.picture}></img>
        </div>
        <div className={styles.pfp}>
          <p>{user.username}</p>
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
            <textarea type="text" placeholder="bio" id="bio"></textarea>
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
          <button className={styles["submit-btn"]} type="submit">
            Submit
          </button>
        </div>
      </form>
      {showBackdrop && <div className={styles.backdrop}></div>}
      {showModal && (
        <div className={styles.modal}>
          <p>Change Profile Photo</p>
          <label>
            Upload photo
            <input type="file" ref={pfpInput} onChange={uploadImage}/>
          </label>
          <button>Remove Current Photo</button>
          <button onClick={handleClose}>Cancel</button>
        </div>
      )}
    </div>
  );
}
