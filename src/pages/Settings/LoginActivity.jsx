import styles from './LoginActivity.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function LoginActivity(){

    const [location, setLocation] = useState('')
    const [ip, setIp] = useState('')


    useEffect(() => {
        axios.get(`https://api.ipgeolocation.io/getip`)
        .then(res => setIp(res.data.ip))


        const options = {
            method: 'GET',
            url: 'https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/',
            params: {ip: ip},
            headers: {
              'X-RapidAPI-Key': 'f57112e585msh933b361a319e13cp161a9fjsnb2f2889df663',
              'X-RapidAPI-Host': 'ip-geolocation-ipwhois-io.p.rapidapi.com'
            }
          };
          
          setTimeout(() => {
            axios.request(options).then(function (response) {
                const location = {
                 city : response.data.city,
                 country: response.data.country,
                }
                setLocation(location)
             }).catch(function (error) {
                 console.error(error);
             });
          }, 1000)
    })


    return(
        <div className={styles.wrapper}>
            <div className={styles['activity-wrapper']}>
                <p className={styles.para}>Login activity</p>
                <p className={styles.para2}>Where You're Logged in</p>
                <div className={styles['location-wrapper']}>
                    <div className={styles['location-icon']}>
                        <FontAwesomeIcon icon={faLocationDot} className={styles.icon}/>
                    </div>
                    <div className={styles.location}>
                        <div>
                            {location.city}, {location.country}
                        </div>

                        <div className={styles.status}>
                            Active now
                        </div>
                    </div>
                </div>
                <div className={styles.line}></div>
            </div>
        </div>
    )
}


