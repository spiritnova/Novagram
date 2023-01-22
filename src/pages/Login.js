import styles from "./Login.module.css";
import { useRef, useState } from "react";
import { useTheme } from "../ThemeContext";
import { Link } from "react-router-dom";

export default function Login(props) {
  const passwordRef = useRef();
  const usernameRef = useRef();

  const darkTheme = useTheme();

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
    
    fetch("/login", {
      method : "POST",
      headers : {"Content-Type": "application/json"},
      body : JSON.stringify(data),
      credentials: 'include'
    })
    .then(
      res => res.json()
    )
    .then(data => {
      setData(data)
      if(data.success){
        console.log("success")
        props.onLogin();
      }
      if(data.data){
        props.sendData(data.data)
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
