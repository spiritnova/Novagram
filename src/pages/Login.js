import styles from "./Login.module.css";
import { useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login(props) {
  const passwordRef = useRef();
  const usernameRef = useRef();

  const darkTheme = useTheme();

  const navigate = useNavigate()

  const [data, setData] = useState([{}]);

  const formSubmissionHandler = (e) => {
    e.preventDefault();

    if (usernameRef.current.value === "") {
      return;
    }

    if (passwordRef.current.value === "") {
      return;
    }

    const data = {
      "username" : usernameRef.current.value,
      "password" : passwordRef.current.value,
    }

    let api = 'https://novagram-api.onrender.com'

    fetch(`${api}/login`, {
      method : "POST",
      headers : {"Content-Type": "application/json"},
      body : JSON.stringify(data),
    })
    .then(
      res => res.json()
    )
    .then(data => {
      setData(data)
      sessionStorage.setItem('user_id', data.user_id)
      sessionStorage.setItem('username', data.username)
      sessionStorage.setItem('name', data.name)

      if(data.picture !== null){
        sessionStorage.setItem('picture', data.picture)
      }

      if(data.bio !== null){
        sessionStorage.setItem('bio', data.bio)
        console.log(data.bio)
      }
      if(data.email !== null){
        sessionStorage.setItem('email', data.email)
      }
      if(data.success){
        props.onLogin();
        navigate("/")
      }
    })
  };
  return (
    <div className={styles.wrapper}>
      <form onSubmit={formSubmissionHandler}>
        <div
          style={{height: 570}}
          className={`${styles.cover} ${
            darkTheme ? "" : styles["cover-light"]
          } `}
        >
          <h1>Login</h1>
          <input
            className={styles.inputs}
            type="text"
            name="username"
            placeholder="username"
            ref={usernameRef}
          />
          {data.username && <p className={styles.error}>{data.username}</p>}
          <input
            className={styles.inputs}
            type="password"
            name="password"
            placeholder="password"
            ref={passwordRef}
          />
          {data.password && <p className={styles.error}>{data.password}</p>}
          <button className={styles.loginBtn}>Login</button>

          <p>
            Don't have an account?{" "}
            <Link to="/register" className={styles.links}>
              Sign up
            </Link>
          </p>
          <p>Or</p>
          <div className={styles.media}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1384/1384053.png"
              className={styles.facebook}
              alt="facebook"
            ></img>
            Login with Facebook
          </div>
        </div>
      </form>
    </div>
  );
}
