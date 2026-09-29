import { Camera as CameraIcon, UserRound as UserRoundIcon } from 'lucide-react'
import styles from "./Login.module.css";
import { useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/UI Kit/Loader";
import { login, demoLogin } from "../mock/api";

export default function Login(props) {
  const passwordRef = useRef();
  const usernameRef = useRef();

  const darkTheme = useTheme();

  const navigate = useNavigate();

  const [data, setData] = useState([{}]);
  const [isLoading, setisLoading] = useState(false);

  const applySession = (data) => {
    props.onLogin();
    navigate("/");

    sessionStorage.setItem("user_id", data.user_id);
    sessionStorage.setItem("username", data.username);
    sessionStorage.setItem("name", data.name);

    if (data.picture !== null) {
      sessionStorage.setItem("picture", data.picture);
    }

    if (data.bio !== null) {
      sessionStorage.setItem("bio", data.bio);
    }
    if (data.email !== null) {
      sessionStorage.setItem("email", data.email);
    }
  };

  const formSubmissionHandler = (e) => {
    e.preventDefault();

    if (usernameRef.current.value === "") {
      return;
    }

    if (passwordRef.current.value === "") {
      return;
    }

    setisLoading(true);

    login(usernameRef.current.value, passwordRef.current.value).then((data) => {
      setisLoading(false);
      setData(data);

      if (data.success) {
        applySession(data);
      }
    });
  };

  const demoLoginHandler = () => {
    setisLoading(true);
    demoLogin().then((data) => {
      setisLoading(false);
      applySession(data);
    });
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={formSubmissionHandler}>
        <div
          className={`${styles.cover} ${
            darkTheme ? "" : styles["cover-light"]
          } `}
        >
          <div className={styles.logo}>
            <CameraIcon size="1em" aria-hidden="true" className={styles.logoIcon} />
            <span className={styles.logoWordmark}>Novagram</span>
          </div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Log in to continue</p>
          <input
            className={styles.inputs}
            type="text"
            name="username"
            placeholder="Username"
            ref={usernameRef}
          />
          {data.username && <p className={styles.error}>{data.username}</p>}
          <input
            className={styles.inputs}
            type="password"
            name="password"
            placeholder="Password"
            ref={passwordRef}
          />
          {data.password && <p className={styles.error}>{data.password}</p>}
          <button className={styles.loginBtn}>
            {isLoading ? <Loader type={"2"} /> : "Login"}
          </button>

          <p className={styles.registerText}>
            Don't have an account?{" "}
            <Link to="/register" className={styles.links}>
              Sign up
            </Link>
          </p>
          <p className={styles.orText}>Or</p>
          <div className={styles.socialMedia}>
            <button
              type="button"
              className={styles.socialBtn}
              onClick={demoLoginHandler}
              disabled={isLoading}
            >
              <UserRoundIcon size="1em" aria-hidden="true" className={styles.socialIcon} />
              Continue as demo user
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
