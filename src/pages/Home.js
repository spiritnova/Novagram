import styles from './Home.module.css'

export default function Home(){
    return(
        <div className={styles.home}>
            <h1>TODO :</h1>
            <ul>
                <li style={{color : 'green'}}>Step 1: Create the side navbar</li>
                <li style={{color : 'green'}}>Step 2: Create the dropdown menu in the sidebar and move it to a diff component</li>
                <li style={{color : 'green'}}>Step 3: Set up React Router</li>
                <li style={{color : 'green'}}>Step 4: Set up Dark and Light Themes</li>
                <li style={{color : 'green'}}>Step 5: Login Form and State</li>
                <li style={{color : 'green'}}>Step 6: Register Form and State</li>
                <li style={{color : 'green'}}>Step 7: Fix the logout redirection</li>
                <li style={{color : 'green'}}>Step 8: Form Validation</li>
                <li style={{color : 'green'}}>Step 9: Profile Design</li>
                <li style={{color : 'green'}}>Step 10: Saved Route</li>
                <li style={{color : 'green'}}>Step 11: Implemented the login activity location using the ipgeolocation api</li>
                <li style={{color : 'green'}}>Step 12: Settings design</li>
                <li style={{color : 'green'}}>Step 13: Create button design</li>
                <li style={{color : 'green'}}>Step 14: decide between flask or firebase</li>
                <li style={{color : 'red'}}>Step #: Fix the dropdown menu button ( disappear when clicking on a link ) try using useRef</li>
                <li style={{color : 'red'}}>Step #: Mobile responsivity 20%</li>
            </ul>

            <h2>Logs: </h2>
            <ul>
                <li>Fixed React Freezing bug</li>
                <li>Completed half the sidebar and containers responsivity</li>
                <li>Fixed my design issues</li>
                <li>Finished the change password tab</li>
                <li>Finished the change password tab</li>
                <li>Used an API to get the IP https://ipgeolocation.io/documentation.html</li>
                <li>Used another api and used the above IP to get the location https://rapidapi.com/xakageminato/api/ip-geolocation-ipwhois-io</li>
            </ul>
        </div>
    )
}