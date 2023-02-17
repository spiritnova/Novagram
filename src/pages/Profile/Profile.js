import Wrapper from "../../components/UI Kit/Wrapper";
import styles from "./Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faTableCells } from "@fortawesome/free-solid-svg-icons";

import { Link, Outlet, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Follower from "../../components/Follower";
import ProfileInfo from "../../components/ProfileInfo";


export default function Profile() {

  const [differentProfile, setDifferentProfile] = useState(false)
  const [followersIsActive, setFollowersIsActive] = useState(false)
  const [followingIsActive, setFollowingIsActive] = useState(false)

  const picture = sessionStorage.getItem('picture')
  const username = sessionStorage.getItem('username')
  const name = sessionStorage.getItem('name')
  const bio = sessionStorage.getItem('bio')

  const user = useParams()

  const defaultImage = user.username.charAt(0).toUpperCase()


  useMemo(() => {
    if (user.username !== username){
      setDifferentProfile(true)
    }
  }, [username, user.username])

  const userQuery = useQuery({
    queryKey: ["posts", user.username],
    queryFn : () => axios.post(`/user/${user.username}`, {
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

    axios.post("/follow", {
      "state": followed,
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
      <div className={styles.wrapper}>
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
            <p>{user.username}</p>
            {!differentProfile ? <Wrapper>
              <Link to="/settings" className={styles.setting}>
                Edit profile
              </Link>
              <Link to="/settings">
                <FontAwesomeIcon
                  icon={faGear}
                  className={styles.icon}
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
          userFollowersLength={userQuery.data?.data.user_followers.length}
          userFollowingLength={userQuery.data?.data.user_following.length}
          followersLength={userQuery.data?.data.followers.length}
          followingLength={userQuery.data?.data.following.length}
          />

          {followersIsActive && 
          <Wrapper>
            <div className={styles.backdrop} onClick={() => setFollowersIsActive(false)}></div>
            <div className={styles.modal}>
              <div className={styles.title}>
                <span>Followers</span>
                <button><FontAwesomeIcon icon={faXmark} onClick={closeModalHandler}/></button>
              </div>
              {followers.length !== 0 ?  followers.map(follow => (
                <Follower key={follow.username} username={follow.username} name={follow.name} picture={follow.picture} />
              )): <div className={styles.negative}><span>No Followers</span></div>}
            </div>
          </Wrapper>
          }
          {followingIsActive && 
          <Wrapper>
            <div className={styles.backdrop} onClick={() => setFollowingIsActive(false)}></div>
            <div className={styles.modal}>
              <div className={styles.title}>
                <span>Following</span>
                <button><FontAwesomeIcon icon={faXmark} onClick={closeModalHandler}/></button>
              </div>
              {following.length !== 0 ?  following.map(follow => (
                <Follower key={follow.username} username={follow.username} name={follow.name} picture={follow.picture} />
              )): <div className={styles.negative}><span>Not following anyone</span></div>}
            </div>
          </Wrapper>
          }

          <div className={styles["profile-description"]}>
            <div>{differentProfile ?  userQuery.data?.data.name : name}</div>
            <p className={styles.bio}>
              {differentProfile ? userQuery.data?.data.bio : bio}
            </p>
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
          {!differentProfile ? <Link to={`/profile/${username}/saved`} className={styles.links}>
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
      </div>
    </Wrapper>
  );
}
