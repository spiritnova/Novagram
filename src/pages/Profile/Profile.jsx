import { Settings as SettingsIcon, Grid3x3 as Grid3x3Icon, Bookmark as BookmarkIcon } from 'lucide-react'

import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../context/ToastContext";

import styles from "./Profile.module.css";
import Button from "../../components/UI Kit/Button";
import { Skeleton } from "../../components/UI Kit/Skeleton";
import ProfileInfo from "../../components/ProfileInfo";
import FollowModal from "../../components/FollowModal";
import Highlights from "../../components/Highlights";
import RichText from "../../components/RichText";
import { followUser, getUserProfile, unfollowUser } from "../../mock/api";


export default function Profile() {

  const [followersIsActive, setFollowersIsActive] = useState(false)
  const [followingIsActive, setFollowingIsActive] = useState(false)
  const [postCount, setPostCount] = useState()

  const picture = sessionStorage.getItem('picture')
  const username = sessionStorage.getItem('username')
  const bio = sessionStorage.getItem('bio')

  const user = useParams()
  const navigate = useNavigate()

  const queryClient = useQueryClient()
  const showToast = useToast()

  const isOwn = user.username === username
  const defaultImage = user.username.charAt(0).toUpperCase()

  const userQuery = useQuery({
    queryKey: ["userData", user.username],
    queryFn : () => getUserProfile(user.username, username),
    retry: false,
  })

  useEffect(() => {
    if(userQuery.isError){
      navigate("/404")
    }
  }, [userQuery.isError, navigate])

  const followMutation = useMutation({
    mutationFn: (nextFollowed) => nextFollowed
      ? followUser(username, user.username)
      : unfollowUser(username, user.username),
    onMutate: async (nextFollowed) => {
      const key = ["userData", user.username]
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData(key)
      const me = { username, name: sessionStorage.getItem('name') ?? username, picture: picture ?? null }

      queryClient.setQueryData(key, (data) => data && ({
        ...data,
        isFollowedByViewer: nextFollowed,
        followers: nextFollowed
          ? [...data.followers, me]
          : data.followers.filter(f => f.username !== username),
      }))
      return { previous }
    },
    onError: (_error, _next, context) => {
      queryClient.setQueryData(["userData", user.username], context.previous)
      showToast('Something went wrong. Please try again.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userData", user.username] })
      queryClient.invalidateQueries({ queryKey: ["home", username] })
      queryClient.invalidateQueries({ queryKey: ["stories", username] })
      queryClient.invalidateQueries({ queryKey: ["suggestions", username] })
    },
  })

  const followed = userQuery.data?.isFollowedByViewer ?? false

  const closeModalHandler = () => {
    setFollowersIsActive(false)
    setFollowingIsActive(false)
  }

  const refreshProfile = () => queryClient.invalidateQueries({ queryKey: ["userData", user.username] })

  if (userQuery.isPending) {
    return (
      <div className={styles.page} role="status" aria-label="Loading profile">
        <div className={styles.header}>
          <Skeleton className={styles.avatar} style={{ borderRadius: '50%' }} />
          <div className={styles.skeletonLines}>
            <Skeleton style={{ width: '10rem', height: '1.25rem' }} />
            <Skeleton style={{ width: '16rem', height: '1rem' }} />
            <Skeleton style={{ width: '12rem', height: '1rem' }} />
          </div>
        </div>
      </div>
    )
  }

  if (!userQuery.isSuccess) return null

  const profile = userQuery.data
  const avatar = isOwn ? (picture || profile.picture) : profile.picture
  const bioText = isOwn ? (bio ?? profile.bio) : profile.bio

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.avatar}>
          {avatar
            ? <img src={avatar} alt={`${profile.username}'s profile`} />
            : <span>{defaultImage}</span>}
        </div>

        <div className={styles.top}>
          <h1 className={styles.username}>{profile.username}</h1>

          <div className={styles.actions}>
            {isOwn ? (
              <>
                <Button as={Link} to="/settings">Edit profile</Button>
                <Button as={Link} to="/settings" variant="ghost" aria-label="Settings" className={styles.iconButton}>
                  <SettingsIcon size="1em" aria-hidden="true" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={followed ? 'secondary' : 'primary'}
                  onClick={() => followMutation.mutate(!followed)}
                  disabled={followMutation.isPending}
                  aria-pressed={followed}
                  className={styles.followButton}
                >
                  {followed
                    ? <span className={styles.swap}><span className={styles.idle}>Following</span><span className={styles.hover}>Unfollow</span></span>
                    : 'Follow'}
                </Button>
                <Button as={Link} to={`/messages/${profile.username}`}>Message</Button>
              </>
            )}
          </div>
        </div>

        <ProfileInfo
          postCount={postCount}
          followers={profile.followers.length}
          following={profile.following.length}
          onFollowers={() => setFollowersIsActive(true)}
          onFollowing={() => setFollowingIsActive(true)}
        />

        <div className={styles.about}>
          <div className={styles.name}>{profile.name}</div>
          {bioText && <p className={styles.bio}><RichText text={bioText} /></p>}
        </div>
      </header>

      {followersIsActive && <FollowModal
        follows={profile.followers}
        close={closeModalHandler}
        name={'Followers'}
        profileUsername={user.username}
        viewerUsername={username}
        onChanged={refreshProfile}
      />}
      {followingIsActive && <FollowModal
        follows={profile.following}
        close={closeModalHandler}
        name={'Following'}
        profileUsername={user.username}
        viewerUsername={username}
        onChanged={refreshProfile}
      />}

      <Highlights username={profile.username} picture={avatar} isOwn={isOwn} />

      <nav className={styles.tabs} aria-label="Profile sections">
        <NavLink to={`/${user.username}`} end className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}>
          <Grid3x3Icon size="1em" aria-hidden="true" />
          <span>Posts</span>
        </NavLink>
        {isOwn && (
          <NavLink to={`/${username}/saved`} className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}>
            <BookmarkIcon size="1em" aria-hidden="true" />
            <span>Saved</span>
          </NavLink>
        )}
      </nav>

      <div className={styles.routes}>
        <Outlet context={setPostCount}/>
      </div>
    </div>
  );
}
