import styles from './Home.module.css'

export default function Home(){
    return(
        <div className={styles.home}>
            <h2>Logs: </h2>
            <ul>
                <li>Fixed React Freezing bug</li>
                <li>Completed half the sidebar and containers responsivity</li>
                <li>Fixed my design issues</li>
                <li>Finished the change password tab</li>
                <li>Finished the change password tab</li>
                <li>Used an API to get the IP https://ipgeolocation.io/documentation.html</li>
                <li>Used another api and used the above IP to get the location https://rapidapi.com/xakageminato/api/ip-geolocation-ipwhois-io</li>
                <li>Like functionality done</li>
            </ul>
        </div>
    )
}