import Wrapper from "./UI Kit/Wrapper";
import styles from './NotFound.module.css'
import { useNavigate } from "react-router-dom";

export default function NotFound(){

    const navigate = useNavigate()

    return (
        <Wrapper>
            <div className={styles.backdrop}></div>
            <div className={styles.wrapper}>
                <h1>NOT FOUND 404</h1>
                <p>It seems that you have visited a route that doesn't exist or may have been removed</p>
                <button onClick={() => {
                    navigate('/')
                }}>Go back</button>
            </div>
        </Wrapper>
    )
}