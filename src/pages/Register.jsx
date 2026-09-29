import { UserRound as UserRoundIcon } from 'lucide-react'
import styles from "./Login.module.css";
import styless from "./Register.module.css"
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Loader from '../components/UI Kit/Loader'
import { register } from '../mock/api'

export default function Register() {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState();

  const [enteredUsername, setEnteredUsername] = useState("");
  const [usernameIsValid, setUsernameIsValid] = useState();

  const [enteredName, setEnteredName] = useState("")
  const [nameIsValid, setNameIsValid] = useState();

  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  const [formIsValid, setFormIsValid] = useState(false);


  const [data, setData] = useState([{}])
  const [isLoading, setIsLoading] = useState(false)

  const darkTheme = useTheme()

  useEffect(() => {
    setFormIsValid(
      enteredPassword.trim().length >= 8 &&
        enteredUsername.trim().length >= 4 &&
          enteredName.trim().length >= 4 &&
            enteredPassword === enteredConfirmPassword
    );
  }, [enteredName, enteredPassword, enteredUsername, enteredConfirmPassword]);

  const usernameChangeHandler = (e) => {
    setEnteredUsername(e.target.value);
  };

  const validateUsernameHandler = () => {
    setUsernameIsValid(enteredUsername.trim().length >= 4);
  };

  const nameChangeHandler = (e) => {
    setEnteredName(e.target.value)
  }

  const validateNameHandler = e => {
    setNameIsValid(enteredName.trim().length >= 4)
  }

  const passwordChangeHandler = (e) => {
    setEnteredPassword(e.target.value);
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length >= 8);
  };

  const confirmPasswordChangeHandler = (e) => {
    setEnteredConfirmPassword(e.target.value);
  };


  let navigate = useNavigate()


  const formSubmissionHandler = (e) => {
    e.preventDefault()

    setIsLoading(true)
    register(enteredName, enteredUsername, enteredPassword, enteredConfirmPassword)
    .then(data => {
      setIsLoading(false)
      if(data.success){
        navigate("/login")
      }
      setData(data)
    })
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={formSubmissionHandler}>
        <div className={`${styles.cover} ${darkTheme ? '' : styles['cover-light']}`}>
          <h1 className={styles.title}>Register</h1>
          <input
            className={styles.inputs}
            type="text"
            name="name"
            placeholder="name"
            value={enteredName}
            onChange={nameChangeHandler}
            onBlur={validateNameHandler}
            required
          />
          {!nameIsValid ? (
            <p className={styles["password-warning"]}>
              Name must contain at least 4 letters
            </p>
          ) : (
            ""
          )}
          {data.name && <p>Name must contain at least 4 letters</p>}
          <input
            className={styles.inputs}
            type="text"
            name="username"
            placeholder="username"
            value={enteredUsername}
            onChange={usernameChangeHandler}
            onBlur={validateUsernameHandler}
            required
          />
          {data.username && 
            <p className={styles["password-error"]}>
              {data.username}
            </p>
            }
            {!usernameIsValid && <p className={styles['password-warning']}>Username must contain at least 4 letters</p>}
          <input
            className={styles.inputs}
            type="password"
            placeholder="password"
            name="password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
            required
          />
          {!passwordIsValid && <p className={styles["password-warning"]}>Password must contain at least 8 characters</p>}
          {data.password && <p className={styles['password-error']}>{data.password}</p>}
          <input
            className={styles.inputs}
            type="password"
            name="confirmPassword"
            placeholder="confirm password"
            value={enteredConfirmPassword}
            onChange={confirmPasswordChangeHandler}
            required
          />
          {data.confirmPassword && 
            <p className={styles["password-error"]}>Passwords do not match</p>
            }
          <button
            className={
              styless.regBtn
            }
            disabled={!formIsValid}
          >
            {isLoading ? <Loader type={'1'}/> : 'Register'}
          </button>

          <p>
            Already have an account?{" "}
            <Link to="/login" className={styles.links}>
              Log in
            </Link>
          </p>
          <p>Or</p>
          <div className={styless.media}>
            <UserRoundIcon size="1em" aria-hidden="true" className={styless.facebook} />
            This is a frontend-only demo, sign up creates a local account
          </div>
        </div>
      </form>
    </div>
  );
}
