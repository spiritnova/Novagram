import styles from "./Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faTableCells } from "@fortawesome/free-solid-svg-icons";

import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import Wrapper from "../../components/UI Kit/Wrapper";


export default function Profile() {

    const [postCount, setPostCount] = useState();

    const user = JSON.parse(localStorage.getItem('user'))
    const picture = localStorage.getItem('picture')

  return (
    <Wrapper>
      <div className={styles.wrapper}>
        <div className={styles["profile-img-div"]}>
          <div className={styles["profile-img"]}>
            <img src={picture ? picture : user.picture} alt="profile"></img>
          </div>
        </div>

        <div className={styles["profile-data"]}>
          <div className={styles["profile-username"]}>
            <p>{user.username}</p>
            <Link to="/settings" className={styles.setting}>
              Edit profile
            </Link>
            <Link to="/settings">
              <FontAwesomeIcon
                icon={faGear}
                className={styles.icon}
              ></FontAwesomeIcon>
            </Link>
          </div>

          <div className={styles["profile-info"]}>
            <div>
              <span><b>{postCount}</b></span> posts
            </div>
            <div>
              <span><b>96</b></span> followers
            </div>
            <div>
              <span><b>153</b></span> following
            </div>
          </div>

          <div className={styles["profile-description"]}>
            <div>{user.name}</div>
            <p className={styles.bio}>React web developer
            Graphic Designer
            Gamer
            Anime/Manga(hwa, hua)
            Hiking
            Fahita/Shawarma/Hambaga</p>
          </div>
        </div>
      </div>

      <div className={styles.divider}>
        <div className={styles.line}></div>
      </div>

      <div className={styles.section}>
        <div className={styles.nav}>
          <Link to={`/profile/${user.username}`} className={styles.links}>
            <FontAwesomeIcon
              icon={faTableCells}
              className={styles.icons}
            ></FontAwesomeIcon>
            POSTS
          </Link>
          <Link to={`/profile/${user.username}/saved`} className={styles.links}>
            <FontAwesomeIcon
              icon={faBookmark}
              className={styles.icons}
            ></FontAwesomeIcon>
            SAVED
          </Link>
        </div>

        <div className={styles.routes}>
          <Outlet context={[setPostCount]}/>
        </div>
      </div>
    </Wrapper>
  );
}
