import { useTheme } from '../context/ThemeContext';
import styles from './Container.module.css'

export default function Container({children}){

    const darkTheme = useTheme()

    if(darkTheme){
        document.body.style.backgroundColor = '#121212'
    }

    return (
        <div className={darkTheme ? styles['container'] : styles['container-light']}>
            {children}
        </div>
    )
}