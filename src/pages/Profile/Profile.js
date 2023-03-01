import Wrapper from "../../components/UI Kit/Wrapper";
import styles from "./Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faGear, faTableCells } from "@fortawesome/free-solid-svg-icons";

import { Link, Outlet, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "../../context/ThemeContext";

import axios from "axios";
import Loader from "../../components/UI Kit/Loader";
import ProfileInfo from "../../components/ProfileInfo";
import FollowModal from "../../components/FollowModal";
import ProfileInfoMobile from "../../components/ProfileInfoMobile";


export default function Profile() {

  const [differentProfile, setDifferentProfile] = useState(false)
  const [followersIsActive, setFollowersIsActive] = useState(false)
  const [followingIsActive, setFollowingIsActive] = useState(false)

  const [valid, setIsValid] = useState(false)


  const picture = sessionStorage.getItem('picture')
  const username = sessionStorage.getItem('username')
  const bio = sessionStorage.getItem('bio')

  const user = useParams()

  const darkTheme = useTheme()

  const defaultImage = user.username.charAt(0).toUpperCase()


  useMemo(() => { // This hook is to check whenever we visit other profiles
    if (user.username !== username){
      setDifferentProfile(true)
    }
    else{
      setDifferentProfile(false)
    }
  }, [user.username, username])

  let api = 'https://novagram-api.onrender.com'

  const userQuery = useQuery({
    queryKey: ["userData", user.username],
    queryFn : () => axios.post(`${api}/user/${user.username}`, {
      "username": username
    }),
  })

  const [followed, setFollowed] = useState(false)

  useEffect(() => {
    userQuery.data?.data.following.forEach(follow => {
      if(follow.username === user.username){
        setFollowed(true)
      }
    });
  }, [user.username, userQuery.data?.data.following])

  useEffect(() => {
    if(userQuery.isLoading){
      setIsValid(false)
    }
    else{
      setIsValid(true)
    }
  }, [userQuery.isLoading])

  const [postCount, setPostCount] = useState()

  let followers

  if(differentProfile){
    followers = userQuery.data?.data.user_followers
  }
  else{
    followers = userQuery.data?.data.followers
  }

  let following
  if(differentProfile){
    following = userQuery.data?.data.user_following
  }
  else{
    following = userQuery.data?.data.following
  }

  const followHandler = () => {
    setFollowed(prev => !prev)

    axios.post(`${api}/follow`, {
      "state": !followed,
      "follower": username,
      "followed": user.username
    })
  }



  const followersClickHandler = () => {
    setFollowersIsActive(true)
  }

  const followingClickHandler = () => {
    setFollowingIsActive(true)
  }

  const closeModalHandler = () => {
    setFollowersIsActive(false)
    setFollowingIsActive(false)
  }

  return (
    <Wrapper>
      {valid && <div className={styles.wrapper}>
        <div className={styles["profile-img-div"]}>
          <div className={styles["profile-img"]}>
            {differentProfile 
            ? (userQuery.data?.data.picture 
              ? <img src={userQuery.data?.data.picture} alt="profile"></img> 
              : <div className={styles.defaultImg}><span>{defaultImage}</span></div>) 
            : !picture 
              ? <div className={styles.defaultImg}><span>{defaultImage}</span></div> 
              : <img src={userQuery.data?.data.picture} alt="profile"></img>}
          
          </div>
        </div>

        <div className={styles["profile-data"]}>
          <div className={styles["profile-username"]}>
            <p>{userQuery.data?.data.username}</p>
            {!differentProfile ? <Wrapper>
              <Link to="/settings" className={`${darkTheme ?  styles.setting : styles['setting-light']}`}>
                Edit profile
              </Link>
              <Link to="/settings">
                <FontAwesomeIcon
                  icon={faGear}
                  className={`${darkTheme ? styles.icon : styles['icon-light']}`}
                ></FontAwesomeIcon>
              </Link>
            </Wrapper>:
             <button 
             className={styles.follow}
             onClick={followHandler}
             >
              {followed ? 'Unfollow' : 'Follow'}
            </button>}
          </div>

          <ProfileInfo 
          followersClick={followersClickHandler}
          followingClick={followingClickHandler}
          differentProfile={differentProfile}
          postCount={postCount}
          userQuery={userQuery}
          />

          {followersIsActive && <FollowModal follows={followers} close={closeModalHandler} name={'Followers'}/>}
          {followingIsActive && <FollowModal follows={following} close={closeModalHandler} name={'Following'}/>}

          <div className={styles["profile-description"]}>
            <div>{userQuery.data?.data.name}</div>
            <p className={styles.bio}>
              {differentProfile ? userQuery.data?.data.bio : bio}
            </p>
          </div>
        </div>
      </div>}

      {valid &&
      <div className={styles["profile-description-mobile"]}>
        <div>{userQuery.data?.data.name}</div>
        <p className={styles.bio}>
          {differentProfile ? userQuery.data?.data.bio : bio}
        </p>
      </div>
      }

      {valid && 
      <ProfileInfoMobile
        followersClick={followersClickHandler}
        followingClick={followingClickHandler}
        differentProfile={differentProfile}
        postCount={postCount}
        userQuery={userQuery}
      />}

      {userQuery.isLoading && <div className={styles.loader}><Loader type='2'/></div>}

      {valid && <div className={styles.divider}>
        <div className={`${darkTheme ? styles.line : styles['line-light']}`}></div>
      </div>}

      {valid && <div className={styles.section}>
        <div className={styles.nav}>
          <Link to={`/${user.username}`} className={`${darkTheme ? styles.links : styles['links-light']}`}>
            <FontAwesomeIcon
              icon={faTableCells}
              className={styles.icons}
            ></FontAwesomeIcon>
            POSTS
          </Link>
          {!differentProfile ? <Link to={`/${username}/saved`} className={`${darkTheme ? styles.links : styles['links-light']}`}>
            <FontAwesomeIcon
              icon={faBookmark}
              className={styles.icons}
            ></FontAwesomeIcon>
            SAVED
          </Link>: ''}
        </div>

        <div className={styles.routes}>
          <Outlet context={setPostCount}/>
        </div>
      </div>}
    </Wrapper>
  );
}
