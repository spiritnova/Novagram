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

            <h2>TODO:</h2>
            <ul>
                <li>Bookmarking</li>
                <li>Search bar</li>
                <li>Notifications</li>
                <li>Post settings ( delete, edit )</li>
                <li>Home page</li>
                <li>Explore page</li>
                <li>follow system</li>
                <li>edit profile</li>
            </ul>
        </div>
    )
}