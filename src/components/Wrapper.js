import { useTheme } from '../ThemeContext';
import styles from './Wrapper.module.css'

export default function Wrapper({children}){

    const darkTheme = useTheme()

    return (
        <div className={darkTheme ? styles['container'] : styles['container-light']}>
            {children}
        </div>
    )
}