import Wrapper from "./UI Kit/Wrapper";
import styles from './NotFound.module.css'
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function NotFound(){

    const navigate = useNavigate()

    const darkTheme = useTheme()

    return (
        <Wrapper>
            <div className={`${darkTheme ? styles.backdrop : styles['backdrop-light']}`}></div>
            <div className={`${darkTheme ? styles.wrapper : styles['wrapper-light']}`}>
                <h1>NOT FOUND 404</h1>
                <p>It seems that you have visited a route that doesn't exist or may have been removed</p>
                <button onClick={() => {
                    navigate('/')
                }}>Go back</button>
            </div>
        </Wrapper>
    )
}