import { useTheme } from '../ThemeContext';
import styles from './Container.module.css'

export default function Container({children}){

    const darkTheme = useTheme()

    return (
        <div className={darkTheme ? styles['container'] : styles['container-light']}>
            {children}
        </div>
    )
}