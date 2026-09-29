import { getDb, save, DEFAULT_FOLLOWING, SEED_USERNAMES } from "./db";

const DEMO_USERNAME = "demo_user";

function delay(ms = 350 + Math.random() * 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toPublicUser(user) {
  if (!user) return null;
  return { username: user.username, name: user.name, picture: user.picture };
}

function notify(db, { to, from, type, postId, text }) {
  if (!to || to === from) return;
  db.notifications = db.notifications ?? [];
  db.notifications.push({ id: crypto.randomUUID(), to, from, type, postId, text, createdAt: Date.now(), read: false });
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getFollowers(db, username) {
  return Object.values(db.users)
    .filter((u) => u.username !== username && u.following.includes(username))
    .map(toPublicUser);
}

function getFollowing(db, username) {
  const user = db.users[username];
  if (!user) return [];
  return user.following
    .map((f) => db.users[f])
    .filter(Boolean)
    .map(toPublicUser);
}

function renameUsername(db, oldUsername, newUsername) {
  const user = db.users[oldUsername];
  user.username = newUsername;
  db.users[newUsername] = user;
  delete db.users[oldUsername];

  Object.values(db.users).forEach((u) => {
    u.following = u.following.map((f) => (f === oldUsername ? newUsername : f));
  });

  const rename = (name) => (name === oldUsername ? newUsername : name);
  (db.notifications ?? []).forEach((n) => { n.to = rename(n.to); n.from = rename(n.from); });
  (db.messages ?? []).forEach((m) => { m.to = rename(m.to); m.from = rename(m.from); });

  db.posts.forEach((p) => {
    if (p.username === oldUsername) p.username = newUsername;
    p.likes = p.likes.map((l) => (l === oldUsername ? newUsername : l));
    p.comments.forEach((c) => {
      if (c.username === oldUsername) c.username = newUsername;
      c.likes = c.likes.map((l) => (l === oldUsername ? newUsername : l));
    });
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function userAuthResponse(user) {
  return {
    success: true,
    user_id: user.user_id,
    username: user.username,
    name: user.name,
    picture: user.picture,
    bio: user.bio,
    email: user.email,
  };
}

export async function login(username, password) {
  await delay();
  const db = getDb();

  if (!username?.trim() || !password?.trim()) {
    return { success: false, username: "Username and password are required." };
  }

  let user = db.users[username];
  if (!user) {
    user = {
      user_id: crypto.randomUUID(),
      username,
      name: username,
      password,
      bio: "",
      email: "",
      picture: null,
      following: [...DEFAULT_FOLLOWING],
    };
    db.users[username] = user;
    save();
  }

  return userAuthResponse(user);
}

export async function demoLogin() {
  return login(DEMO_USERNAME, "demo1234");
}

export async function register(name, username, password, confirmPassword) {
  await delay();
  const db = getDb();
  const errors = {};

  if (!name || name.trim().length < 4) errors.name = "Name must contain at least 4 letters";
  if (!username || username.trim().length < 4) errors.username = "Username must contain at least 4 letters";
  else if (db.users[username]) errors.username = "This username is already taken";
  if (!password || password.trim().length < 8) errors.password = "Password must contain at least 8 characters";
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";

  if (Object.keys(errors).length > 0) {
    return { success: false, ...errors };
  }

  db.users[username] = {
    user_id: crypto.randomUUID(),
    username,
    name,
    password,
    bio: "",
    email: "",
    picture: null,
    following: [...DEFAULT_FOLLOWING],
  };
  save();

  return { success: true };
}

const FEED_PAGE_SIZE = 4;

export async function getHomeFeed(username, page = 1) {
  await delay();
  const db = getDb();
  const user = db.users[username];
  if (!user) return { posts: [], nextPage: undefined };

  const followingSet = new Set([...user.following, username]);
  const saved = new Set(user.saved ?? []);

  const sorted = db.posts
    .filter((p) => followingSet.has(p.username))
    .sort((a, b) => b.createdAt - a.createdAt);
  const start = (page - 1) * FEED_PAGE_SIZE;

  const posts = sorted
    .slice(start, start + FEED_PAGE_SIZE)
    .map((post) => {
      const lastComment = post.comments[post.comments.length - 1];
      return {
        id: post.id,
        user: post.username,
        userPicture: db.users[post.username]?.picture ?? null,
        picture: post.image,
        caption: post.caption,
        comment: lastComment ? { username: lastComment.username, content: lastComment.content } : undefined,
        commentLength: post.comments.length,
        likesCount: post.likes.length,
        likedByMe: post.likes.includes(username),
        savedByMe: saved.has(post.id),
        date: post.date,
        createdAt: post.createdAt,
      };
    });

  return { posts, nextPage: start + FEED_PAGE_SIZE < sorted.length ? page + 1 : undefined };
}

export async function getSuggestions(username) {
  await delay(250);
  const db = getDb();
  const user = db.users[username];
  if (!user) return [];

  return Object.values(db.users)
    .filter((u) => u.username !== username && !user.following.includes(u.username))
    .map((u) => ({
      ...toPublicUser(u),
      followedBy: user.following.filter((f) => db.users[f]?.following.includes(u.username)),
    }))
    .sort((a, b) => b.followedBy.length - a.followedBy.length)
    .slice(0, 5);
}

const STORY_SLIDES = 3;
const STORY_IMAGES = 6;

// Picks a scenery photo (public/seed/story-1..6) so a user's slides are stable but differ from other users'
function storyImage(username, index) {
  const offset = [...username].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return `/seed/story-${((offset + index * 2) % STORY_IMAGES) + 1}.jpg`;
}

export async function getStories(username) {
  await delay(200);
  const db = getDb();
  const user = db.users[username];
  if (!user) return [];

  return [username, ...user.following]
    .filter((u) => db.users[u])
    .map((u) => ({
      username: u,
      picture: db.users[u].picture ?? null,
      slides: Array.from({ length: STORY_SLIDES }, (_, i) => ({
        id: `${u}-${i}`,
        image: storyImage(u, i),
      })),
    }));
}

export async function toggleSavePost(postId, username) {
  await delay(150);
  const db = getDb();
  const user = db.users[username];
  if (!user) return null;

  user.saved = user.saved ?? [];
  const idx = user.saved.indexOf(postId);
  if (idx === -1) user.saved.push(postId);
  else user.saved.splice(idx, 1);

  save();
  return [...user.saved];
}

export async function getSavedPosts(username) {
  await delay();
  const db = getDb();
  const saved = db.users[username]?.saved ?? [];
  const posts = saved
    .map((id) => db.posts.find((p) => p.id === id))
    .filter(Boolean)
    .reverse()
    .map((p) => ({ id: p.id, image: p.image }));

  return { count: posts.length, posts };
}

const EXPLORE_PAGE_SIZE = 9;

const HASHTAG = /#([\p{L}\p{N}_]+)/gu;

export async function getExplorePosts(page = 1, tag = "") {
  await delay();
  const db = getDb();
  const wanted = tag.toLowerCase();
  const sorted = db.posts
    .filter((p) => !wanted || [...(p.caption ?? "").matchAll(HASHTAG)].some((m) => m[1].toLowerCase() === wanted))
    .sort((a, b) => b.createdAt - a.createdAt);
  const start = (page - 1) * EXPLORE_PAGE_SIZE;
  const pagePosts = sorted.slice(start, start + EXPLORE_PAGE_SIZE);

  return {
    posts: pagePosts.map((p) => ({ id: p.id, image: p.image, likes: p.likes.length, comments: p.comments.length })),
    hasNext: start + EXPLORE_PAGE_SIZE < sorted.length,
    total: sorted.length,
  };
}

export async function getTrendingTags() {
  await delay(200);
  const counts = new Map();
  getDb().posts.forEach((p) => {
    new Set([...(p.caption ?? "").matchAll(HASHTAG)].map((m) => m[1].toLowerCase()))
      .forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1));
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));
}

export async function getUserProfile(routeUsername, viewerUsername) {
  await delay();
  const db = getDb();
  const user = db.users[routeUsername];
  if (!user) {
    throw new Error("User not found");
  }

  const followers = getFollowers(db, routeUsername);
  const following = getFollowing(db, routeUsername);
  const isFollowedByViewer = !!db.users[viewerUsername]?.following.includes(routeUsername);

  return {
    username: user.username,
    name: user.name,
    bio: user.bio,
    picture: user.picture,
    followers,
    following,
    isFollowedByViewer,
  };
}

export async function getUserPosts(username) {
  await delay();
  const db = getDb();
  const posts = db.posts
    .filter((p) => p.username === username)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((p) => ({ id: p.id, image: p.image, likes: p.likes.length, comments: p.comments.length }));

  return { count: posts.length, posts };
}

export async function getPost(id, viewerUsername) {
  await delay();
  const db = getDb();
  const post = db.posts.find((p) => p.id === id);
  if (!post) {
    throw new Error("Post not found");
  }

  const owner = db.users[post.username];

  return {
    id: post.id,
    image: post.image,
    username: post.username,
    picture: owner?.picture ?? null,
    caption: post.caption,
    date: post.date,
    createdAt: post.createdAt,
    savedByMe: !!db.users[viewerUsername]?.saved?.includes(id),
    likes: [...post.likes],
    comments: post.comments.map((c) => ({ ...c, likes: [...c.likes], picture: db.users[c.username]?.picture ?? null })),
  };
}

export async function toggleLikePost(postId, username) {
  await delay(150);
  const db = getDb();
  const post = db.posts.find((p) => p.id === postId);
  if (!post) return null;

  const idx = post.likes.indexOf(username);
  if (idx === -1) {
    post.likes.push(username);
    notify(db, { to: post.username, from: username, type: "like", postId });
  } else {
    post.likes.splice(idx, 1);
    db.notifications = (db.notifications ?? []).filter(
      (n) => !(n.type === "like" && n.from === username && n.postId === postId)
    );
  }

  save();
  return [...post.likes];
}

export async function toggleLikeComment(postId, commentId, username) {
  await delay(150);
  const db = getDb();
  const post = db.posts.find((p) => p.id === postId);
  const comment = post?.comments.find((c) => c.id === commentId);
  if (!comment) return null;

  const idx = comment.likes.indexOf(username);
  if (idx === -1) comment.likes.push(username);
  else comment.likes.splice(idx, 1);

  save();
  return [...comment.likes];
}

export async function addComment({ comment, username, id, parentId = null }) {
  await delay(200);
  const db = getDb();
  const post = db.posts.find((p) => p.id === id);
  if (!post || !comment?.trim()) return null;

  const parent = parentId ? post.comments.find((c) => c.id === parentId) : null;

  const newComment = {
    id: crypto.randomUUID(),
    username,
    content: comment.trim(),
    likes: [],
    date: "Just now",
    parentId: parent ? (parent.parentId ?? parent.id) : null, // replies stay one level deep
  };
  post.comments.push(newComment);

  notify(db, { to: post.username, from: username, type: "comment", postId: id, text: newComment.content });
  if (parent && parent.username !== post.username) {
    notify(db, { to: parent.username, from: username, type: "reply", postId: id, text: newComment.content });
  }

  save();
  return newComment;
}

export async function deleteComment(postId, commentId, username) {
  await delay(150);
  const db = getDb();
  const post = db.posts.find((p) => p.id === postId);
  const comment = post?.comments.find((c) => c.id === commentId);
  if (!comment) return { success: false };

  // You can remove your own comments, and the post's owner can remove anyone's
  if (comment.username !== username && post.username !== username) return { success: false };

  post.comments = post.comments.filter((c) => c.id !== commentId && c.parentId !== commentId);
  save();
  return { success: true };
}

export async function deletePost(postId, username) {
  await delay();
  const db = getDb();
  const idx = db.posts.findIndex((p) => p.id === postId && p.username === username);
  if (idx === -1) return { success: false };

  db.posts.splice(idx, 1);
  db.notifications = (db.notifications ?? []).filter((n) => n.postId !== postId);
  save();
  return { success: true };
}

export async function createPost({ username, caption, imageFile }) {
  await delay(400);
  const db = getDb();
  const imageDataUrl = await fileToDataUrl(imageFile);

  const post = {
    id: crypto.randomUUID(),
    username,
    image: imageDataUrl,
    caption: caption?.trim() ?? "",
    date: "Just now",
    createdAt: Date.now(),
    likes: [],
    comments: [],
  };

  db.posts.unshift(post);
  save();
  simulateEngagement(post.id, username);
  return post;
}

const REACTIONS = ["Love this!", "This is great, well done.", "Okay this is really good.", "Saving this one.", "Nice shot!"];

// Mock backend only: a couple of seeded users like and comment on a new post a few seconds later
function simulateEngagement(postId, owner) {
  const fans = [...SEED_USERNAMES].filter((u) => u !== owner);
  if (fans.length < 2) return;

  const liker = pick(fans);
  const commenter = pick(fans.filter((u) => u !== liker));

  setTimeout(() => {
    const db = getDb();
    const post = db.posts.find((p) => p.id === postId);
    if (!post || post.likes.includes(liker)) return;

    post.likes.push(liker);
    notify(db, { to: owner, from: liker, type: "like", postId });
    save();
  }, 4000);

  setTimeout(() => {
    const db = getDb();
    const post = db.posts.find((p) => p.id === postId);
    if (!post) return;

    const content = pick(REACTIONS);
    post.comments.push({ id: crypto.randomUUID(), username: commenter, content, likes: [], date: "Just now", parentId: null });
    notify(db, { to: owner, from: commenter, type: "comment", postId, text: content });
    save();
  }, 9000);
}

export async function followUser(followerUsername, targetUsername) {
  await delay(150);
  const db = getDb();
  const follower = db.users[followerUsername];
  if (!follower || follower.following.includes(targetUsername)) return;

  follower.following.push(targetUsername);
  notify(db, { to: targetUsername, from: followerUsername, type: "follow" });
  save();
}

export async function unfollowUser(followerUsername, targetUsername) {
  await delay(150);
  const db = getDb();
  const follower = db.users[followerUsername];
  if (!follower) return;

  follower.following = follower.following.filter((f) => f !== targetUsername);
  db.notifications = (db.notifications ?? []).filter(
    (n) => !(n.type === "follow" && n.from === followerUsername && n.to === targetUsername)
  );
  save();
}

export async function searchUsers(query, excludeUsername) {
  await delay(200);
  const db = getDb();
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return Object.values(db.users)
    .filter(
      (u) =>
        u.username !== excludeUsername &&
        (u.username.toLowerCase().includes(q) || u.name.toLowerCase().includes(q))
    )
    .slice(0, 20)
    .map(toPublicUser);
}

const USERNAME_PATTERN = /^[A-Za-z0-9._]{4,30}$/;

export async function searchAll(query, excludeUsername) {
  const q = query.trim().replace(/^[@#]/, "").toLowerCase();
  const onlyTags = query.trim().startsWith("#");
  const onlyPeople = query.trim().startsWith("@");
  if (!q) return { users: [], tags: [] };

  await delay(200);
  const db = getDb();

  const users = onlyTags ? [] : Object.values(db.users)
    .filter((u) => u.username !== excludeUsername && (u.username.toLowerCase().includes(q) || u.name.toLowerCase().includes(q)))
    // names that start with the search first
    .sort((a, b) => Number(b.username.toLowerCase().startsWith(q)) - Number(a.username.toLowerCase().startsWith(q)))
    .slice(0, 8)
    .map(toPublicUser);

  const counts = new Map();
  if (!onlyPeople) {
    db.posts.forEach((p) => {
      new Set([...(p.caption ?? "").matchAll(HASHTAG)].map((m) => m[1].toLowerCase()))
        .forEach((t) => { if (t.includes(q)) counts.set(t, (counts.get(t) ?? 0) + 1); });
    });
  }
  const tags = [...counts.entries()]
    .sort((a, b) => Number(b[0].startsWith(q)) - Number(a[0].startsWith(q)) || b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  return { users, tags };
}

export async function updateProfile(username, { name, username: newUsername, bio, email }) {
  await delay();
  const db = getDb();
  const user = db.users[username];
  if (!user) return { success: false, errors: { form: "Account not found" } };

  const errors = {};
  if (!name?.trim()) errors.name = "Name can't be empty";
  if (newUsername && newUsername !== username) {
    if (!USERNAME_PATTERN.test(newUsername)) {
      errors.username = "Use 4-30 letters, numbers, periods or underscores";
    } else if (db.users[newUsername]) {
      errors.username = "This username is already taken";
    }
  }
  if ((bio ?? "").length > 150) errors.bio = "Bio can be at most 150 characters";
  if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address";
  if (Object.keys(errors).length > 0) return { success: false, errors };

  if (newUsername && newUsername !== username) {
    renameUsername(db, username, newUsername);
  }

  const finalUsername = newUsername && newUsername !== username ? newUsername : username;
  const updated = db.users[finalUsername];
  updated.name = name.trim();
  updated.bio = bio ?? "";
  updated.email = email ?? "";
  save();

  return {
    success: true,
    username: updated.username,
    name: updated.name,
    bio: updated.bio,
    email: updated.email,
  };
}

export async function updateProfilePicture(username, file) {
  await delay(300);
  const db = getDb();
  const user = db.users[username];
  if (!user) return null;

  const dataUrl = await fileToDataUrl(file);
  user.picture = dataUrl;
  user.pictureRemoved = false;
  save();
  return dataUrl;
}

export async function removeProfilePicture(username) {
  await delay(200);
  const db = getDb();
  const user = db.users[username];
  if (!user) return { success: false };

  user.picture = null;
  user.pictureRemoved = true;
  save();
  return { success: true };
}

export async function changePassword(username, oldPassword, newPassword) {
  await delay();
  const db = getDb();
  const user = db.users[username];
  if (!user) return { success: false, error: "Account not found" };
  if (user.password !== oldPassword) return { success: false, error: "Your current password is incorrect" };

  user.password = newPassword;
  save();
  return { success: true };
}


export async function getNotifications(username) {
  await delay(200);
  const db = getDb();
  const following = new Set(db.users[username]?.following ?? []);

  return (db.notifications ?? [])
    .filter((n) => n.to === username && db.users[n.from])
    .map((n) => ({ n, post: n.postId ? db.posts.find((p) => p.id === n.postId) : null }))
    .filter(({ n, post }) => !n.postId || post)
    .sort((a, b) => b.n.createdAt - a.n.createdAt)
    .map(({ n, post }) => ({
      id: n.id,
      type: n.type,
      text: n.text,
      read: n.read,
      createdAt: n.createdAt,
      actor: toPublicUser(db.users[n.from]),
      post: post ? { id: post.id, image: post.image } : null,
      isFollowing: following.has(n.from),
    }));
}

export async function markNotificationsRead(username) {
  await delay(100);
  const db = getDb();
  let changed = false;
  (db.notifications ?? []).forEach((n) => {
    if (n.to === username && !n.read) {
      n.read = true;
      changed = true;
    }
  });
  if (changed) save();
}

export async function getUnreadCounts(username) {
  await delay(60);
  const db = getDb();
  return {
    notifications: (db.notifications ?? []).filter((n) => n.to === username && !n.read && db.users[n.from]).length,
    messages: (db.messages ?? []).filter((m) => m.to === username && !m.read).length,
  };
}

export async function getConversations(username) {
  await delay(200);
  const db = getDb();
  const byUser = new Map();

  (db.messages ?? []).forEach((m) => {
    if (m.from !== username && m.to !== username) return;
    const other = m.from === username ? m.to : m.from;
    if (!db.users[other]) return;

    const conversation = byUser.get(other) ?? { user: toPublicUser(db.users[other]), last: null, unread: 0 };
    if (!conversation.last || m.createdAt > conversation.last.createdAt) conversation.last = m;
    if (m.to === username && !m.read) conversation.unread += 1;
    byUser.set(other, conversation);
  });

  return [...byUser.values()]
    .sort((a, b) => b.last.createdAt - a.last.createdAt)
    .map(({ user, last, unread }) => ({
      user,
      unread,
      last: { text: last.text, fromMe: last.from === username, createdAt: last.createdAt },
    }));
}

export async function getChatContacts(username) {
  await delay(200);
  return getFollowing(getDb(), username);
}

export async function getMessages(username, other) {
  await delay(100);
  const db = getDb();
  const user = db.users[other];
  if (!user) throw new Error("User not found");

  let changed = false;
  const messages = (db.messages ?? []).filter((m) =>
    (m.from === username && m.to === other) || (m.from === other && m.to === username));
  messages.forEach((m) => {
    if (m.to === username && !m.read) {
      m.read = true;
      changed = true;
    }
  });
  if (changed) save();

  return {
    user: toPublicUser(user),
    canReply: SEED_USERNAMES.has(other),
    messages: messages.sort((a, b) => a.createdAt - b.createdAt).map((m) => ({
      id: m.id, text: m.text, fromMe: m.from === username, createdAt: m.createdAt,
    })),
  };
}

const CHAT_REPLIES = [
  "Haha, love that.",
  "Totally agree!",
  "That sounds great.",
  "Ooh, tell me more.",
  "Let's catch up soon.",
  "Nice one!",
  "Thanks for the message, made my day.",
];

export async function sendMessage({ from, to, text }) {
  await delay(150);
  const db = getDb();
  if (!text?.trim() || !db.users[to]) return null;

  db.messages = db.messages ?? [];
  const message = { id: crypto.randomUUID(), from, to, text: text.trim(), createdAt: Date.now(), read: false };
  db.messages.push(message);
  save();

  // Mock backend only: seeded users answer after a moment, so the chat feels live
  if (SEED_USERNAMES.has(to)) {
    setTimeout(() => {
      const current = getDb();
      current.messages.push({ id: crypto.randomUUID(), from: to, to: from, text: pick(CHAT_REPLIES), createdAt: Date.now(), read: false });
      save();
    }, 1800 + Math.random() * 1200);
  }

  return message;
}

export async function getHighlights(username) {
  await delay(200);
  const db = getDb();
  const user = db.users[username];
  if (!user) return [];

  return (user.highlights ?? [])
    .map((h) => {
      const slides = [
        ...(h.postIds ?? [])
          .map((id) => db.posts.find((p) => p.id === id))
          .filter(Boolean)
          .map((p) => ({ id: p.id, image: p.image })),
        ...(h.images ?? []).map((image, i) => ({ id: `${h.id}-${i}`, image })),
      ];
      return { id: h.id, title: h.title, cover: slides[0]?.image ?? null, slides };
    })
    .filter((h) => h.slides.length > 0);
}

export async function createHighlight({ username, title, postIds }) {
  await delay(250);
  const db = getDb();
  const user = db.users[username];
  const owned = new Set(db.posts.filter((p) => p.username === username).map((p) => p.id));
  const chosen = (postIds ?? []).filter((id) => owned.has(id));
  if (!user || chosen.length === 0) return null;

  const highlight = {
    id: crypto.randomUUID(),
    title: title?.trim().slice(0, 15) || "Highlights",
    postIds: chosen,
    images: [],
  };
  user.highlights = [...(user.highlights ?? []), highlight];
  save();
  return highlight;
}

export async function deleteHighlight(username, highlightId) {
  await delay(150);
  const db = getDb();
  const user = db.users[username];
  if (!user) return { success: false };

  user.highlights = (user.highlights ?? []).filter((h) => h.id !== highlightId);
  save();
  return { success: true };
}

const DEFAULT_SETTINGS = {
  privateAccount: false,
  activityStatus: true,
  emails: { feedback: false, reminders: true, news: false, support: true },
};

function readSettings(user) {
  return {
    ...DEFAULT_SETTINGS,
    ...user.settings,
    emails: { ...DEFAULT_SETTINGS.emails, ...user.settings?.emails },
  };
}

export async function getSettings(username) {
  await delay(150);
  const user = getDb().users[username];
  if (!user) throw new Error("User not found");
  return readSettings(user);
}

export async function updateSettings(username, patch) {
  await delay(150);
  const db = getDb();
  const user = db.users[username];
  if (!user) throw new Error("User not found");

  const current = readSettings(user);
  user.settings = {
    ...current,
    ...(typeof patch.privateAccount === "boolean" ? { privateAccount: patch.privateAccount } : {}),
    ...(typeof patch.activityStatus === "boolean" ? { activityStatus: patch.activityStatus } : {}),
    emails: { ...current.emails, ...patch.emails },
  };
  save();
  return user.settings;
}

const REPORT_CATEGORIES = ["bug", "content", "suggestion", "other"];

export async function submitReport({ username, category, details, page }) {
  await delay(400);
  const db = getDb();

  if (!REPORT_CATEGORIES.includes(category)) return { success: false, error: "Choose what this is about" };
  if (!details?.trim() || details.trim().length < 10) {
    return { success: false, error: "Tell us a little more (at least 10 characters)" };
  }

  const report = {
    id: crypto.randomUUID(),
    username,
    category,
    details: details.trim().slice(0, 1000),
    page: page ?? null,
    createdAt: Date.now(),
  };
  db.reports = [...(db.reports ?? []), report];
  save();

  return { success: true, reference: report.id.slice(0, 8).toUpperCase() };
}

export async function getReports(username) {
  await delay(150);
  return (getDb().reports ?? [])
    .filter((r) => r.username === username)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(({ id, category, details, createdAt }) => ({ id, reference: id.slice(0, 8).toUpperCase(), category, details, createdAt }));
}
