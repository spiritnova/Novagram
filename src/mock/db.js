const STORAGE_KEY = "novagram_db";

const DEFAULT_FOLLOWING = [
  "sara.travels",
  "mike_codes",
  "luna.artistry",
  "chef.marco",
  "fit.with.tara",
];

// Portraits from randomuser.me: the folder (men/women) and number are fixed, so each user
// always gets the same face, and the gender matches the name
const AVATARS = {
  "sara.travels": "women/44",
  "mike_codes": "men/32",
  "luna.artistry": "women/68",
  "chef.marco": "men/75",
  "fit.with.tara": "women/65",
  "techbyray": "men/46",
  "wanderlust.amy": "women/26",
  "photo.by.leo": "men/22",
};

function avatar(username) {
  return AVATARS[username] ? `https://randomuser.me/api/portraits/${AVATARS[username]}.jpg` : null;
}

// Seed photos are hosted in public/seed (named after the post's seed), each picked to match
// its caption. Serving them from the app avoids depending on an image service being reachable.
function img(seed) {
  return `/seed/${seed}.jpg`;
}

function makeUser({ username, name, bio, following = [] }) {
  return {
    user_id: crypto.randomUUID(),
    username,
    name,
    password: "demo1234",
    bio,
    email: `${username.replace(/[^a-z0-9]/gi, "")}@novagram.demo`,
    picture: avatar(username),
    following: [...following],
  };
}

const USER_SEED = [
  {
    username: "demo_user",
    name: "Demo User",
    bio: "Welcome! This is a demo account for the Novagram portfolio piece.",
    following: DEFAULT_FOLLOWING,
  },
  { username: "sara.travels", name: "Sara Bennett", bio: "Chasing sunsets across 40 countries.", following: ["luna.artistry", "wanderlust.amy"] },
  { username: "mike_codes", name: "Mike Chen", bio: "Building things that (mostly) work.", following: ["techbyray", "demo_user"] },
  { username: "luna.artistry", name: "Luna Rivera", bio: "Digital painter and coffee addict.", following: ["photo.by.leo", "sara.travels"] },
  { username: "chef.marco", name: "Marco Rossi", bio: "Home cook sharing Italian family recipes.", following: ["fit.with.tara"] },
  { username: "fit.with.tara", name: "Tara Owens", bio: "Certified trainer. Strength and mobility.", following: ["chef.marco", "demo_user"] },
  { username: "techbyray", name: "Raymond Lee", bio: "Gadget reviews and unboxings.", following: ["mike_codes", "demo_user"] },
  { username: "wanderlust.amy", name: "Amy Walsh", bio: "Hiking one trail at a time.", following: ["sara.travels", "photo.by.leo"] },
  { username: "photo.by.leo", name: "Leo Fischer", bio: "Street photography, mostly in black and white.", following: ["luna.artistry"] },
];

const POST_TOPICS = {
  "demo_user": [
    { seed: "demo-1", caption: "Trying out Novagram, my new portfolio project!", tags: ["portfolio", "webdev"] },
    { seed: "demo-2", caption: "Late night coding session fueled by coffee.", tags: ["coding", "nightowl"] },
  ],
  "sara.travels": [
    { seed: "sara-1", caption: "Sunrise over the dunes, worth the 4am wake up.", tags: ["travel", "sunrise", "desert"] },
    { seed: "sara-2", caption: "Lost in the old town alleys today.", tags: ["travel", "oldtown"] },
    { seed: "sara-3", caption: "Best street food I've had all year.", tags: ["streetfood", "travel"] },
  ],
  "mike_codes": [
    { seed: "mike-1", caption: "Finally shipped the side project. Six months in the making.", tags: ["webdev", "shipit"], extra: "Thanks @techbyray for the testing!" },
    { seed: "mike-2", caption: "My desk setup after the big cleanup.", tags: ["desksetup", "workspace"] },
    { seed: "mike-3", caption: "Debugging is 90% staring, 10% typing.", tags: ["coding", "debugging"] },
  ],
  "luna.artistry": [
    { seed: "luna-1", caption: "New piece finished, three days of layering colors.", tags: ["digitalart", "illustration"] },
    { seed: "luna-2", caption: "Studio corner on a rainy afternoon.", tags: ["studio", "art"], extra: "Shared with @photo.by.leo." },
    { seed: "luna-3", caption: "Sketchbook dump from this week.", tags: ["sketchbook", "art"] },
  ],
  "chef.marco": [
    { seed: "chef-1", caption: "Sunday sauce, my grandmother's recipe.", tags: ["italianfood", "homecooking"] },
    { seed: "chef-2", caption: "Fresh pasta drying before dinner service.", tags: ["pasta", "homecooking"] },
    { seed: "chef-3", caption: "Tiramisu turned out perfect this time.", tags: ["dessert", "italianfood"] },
  ],
  "fit.with.tara": [
    { seed: "tara-1", caption: "Morning mobility routine, five minutes that change your day.", tags: ["fitness", "mobility"] },
    { seed: "tara-2", caption: "New PR on deadlifts today, small wins.", tags: ["fitness", "deadlift"], extra: "Thanks for the spot @chef.marco." },
    { seed: "tara-3", caption: "Recovery day essentials.", tags: ["fitness", "recovery"] },
  ],
  "techbyray": [
    { seed: "ray-1", caption: "Unboxing the newest release, first impressions video up soon.", tags: ["tech", "unboxing"] },
    { seed: "ray-2", caption: "Cable management finally under control.", tags: ["desksetup", "tech"] },
    { seed: "ray-3", caption: "Testing low light performance tonight.", tags: ["tech", "photography"] },
  ],
  "wanderlust.amy": [
    { seed: "amy-1", caption: "Summit views were worth every step.", tags: ["hiking", "travel"] },
    { seed: "amy-2", caption: "Campsite for the night, stars were unreal.", tags: ["camping", "stars"] },
    { seed: "amy-3", caption: "Trail mix and good company.", tags: ["hiking", "trailmix"] },
  ],
  "photo.by.leo": [
    { seed: "leo-1", caption: "Rainy streets make the best reflections.", tags: ["streetphotography", "rain"] },
    { seed: "leo-2", caption: "Found this doorway and couldn't resist.", tags: ["streetphotography", "architecture"] },
    { seed: "leo-3", caption: "Contrast experiment from the archive.", tags: ["blackandwhite", "streetphotography"] },
  ],
};

// The caption shown on a seed post: text, an optional mention line, then hashtags
function fullCaption(topic) {
  return [topic.caption, topic.extra, (topic.tags ?? []).map((t) => `#${t}`).join(" ")].filter(Boolean).join(" ");
}

// Finds the seed topic for a post whether it still has its original caption or the one with tags
function findTopic(post) {
  return POST_TOPICS[post.username]?.find((t) => post.caption === t.caption || post.caption === fullCaption(t));
}

const COMMENT_POOL = [
  "This is amazing!",
  "Love this so much.",
  "Where was this taken?",
  "Incredible shot.",
  "Need this in my life.",
  "Okay this is everything.",
  "How did you get this angle?",
  "Saving this for later.",
];

function buildPosts() {
  const posts = [];
  const allUsernames = USER_SEED.map((u) => u.username);
  let createdAt = Date.now();

  Object.entries(POST_TOPICS).forEach(([username, topics]) => {
    topics.forEach((topic, i) => {
      createdAt -= 1000 * 60 * 47;
      const commenters = allUsernames.filter((u) => u !== username);
      const commentCount = (i % 3) + 1;
      const comments = Array.from({ length: commentCount }).map((_, ci) => {
        const commenter = commenters[(i + ci * 2) % commenters.length];
        return {
          id: crypto.randomUUID(),
          username: commenter,
          content: COMMENT_POOL[(i + ci) % COMMENT_POOL.length],
          likes: ci % 2 === 0 ? [commenters[(ci + 1) % commenters.length]] : [],
          date: `${ci + 1}d`,
        };
      });

      const likers = commenters.filter((_, idx) => idx % 2 === (i % 2));

      posts.push({
        id: crypto.randomUUID(),
        username,
        image: img(topic.seed),
        caption: fullCaption(topic),
        date: `${(i + 1) * 2} days ago`,
        createdAt,
        likes: likers,
        comments,
      });
    });
  });

  return posts;
}

const SEED_USERNAMES = new Set(USER_SEED.map((u) => u.username));

const DEMO = "demo_user";

// Notifications for the demo account come from what is already in the data:
// likes and comments on its posts, and the people who follow it
function seedNotifications(data) {
  const now = Date.now();
  const list = [];
  const add = (n) => list.push({ id: crypto.randomUUID(), to: DEMO, read: true, ...n });

  data.posts.filter((p) => p.username === DEMO).forEach((post) => {
    post.likes.forEach((from, i) => add({
      from, type: "like", postId: post.id,
      createdAt: Math.min(now - 60000, post.createdAt + (i + 1) * 5 * 60000),
    }));
    post.comments.forEach((c, i) => add({
      from: c.username, type: "comment", postId: post.id, text: c.content,
      createdAt: Math.min(now - 60000, post.createdAt + (i + 1) * 7 * 60000),
    }));
  });

  Object.values(data.users)
    .filter((u) => u.username !== DEMO && u.following.includes(DEMO))
    .forEach((u, i) => add({ from: u.username, type: "follow", createdAt: now - (i + 1) * 3 * 3600000 }));

  list.sort((a, b) => b.createdAt - a.createdAt);
  list.forEach((n, i) => { n.read = i >= 3; });
  return list;
}

// Highlights are saved groups of photos on a profile. The first one for each seeded user is all
// of their posts; a couple of users also get one made from the scenery photos in public/seed.
const HIGHLIGHT_SEED = {
  demo_user: [{ title: "Portfolio" }],
  "sara.travels": [{ title: "Travels" }, { title: "Scenery", images: ["/seed/story-1.jpg", "/seed/story-4.jpg"] }],
  mike_codes: [{ title: "Projects" }],
  "luna.artistry": [{ title: "Art" }],
  "chef.marco": [{ title: "Recipes" }],
  "fit.with.tara": [{ title: "Training" }],
  techbyray: [{ title: "Gear" }],
  "wanderlust.amy": [{ title: "Trails" }, { title: "Summits", images: ["/seed/story-5.jpg", "/seed/story-6.jpg"] }],
  "photo.by.leo": [{ title: "Streets" }],
};

function seedHighlights(data) {
  Object.entries(HIGHLIGHT_SEED).forEach(([username, list]) => {
    const user = data.users[username];
    if (!user || user.highlights) return;

    user.highlights = list.map((h) => ({
      id: crypto.randomUUID(),
      title: h.title,
      postIds: h.images ? [] : data.posts.filter((p) => p.username === username).map((p) => p.id),
      images: h.images ?? [],
    }));
  });
}

function seedMessages() {
  const now = Date.now();
  const m = (from, to, text, minutesAgo, read = true) => ({
    id: crypto.randomUUID(), from, to, text, createdAt: now - minutesAgo * 60000, read,
  });

  return [
    m("sara.travels", DEMO, "Hey! Saw your Novagram project, it looks great", 180),
    m(DEMO, "sara.travels", "Thank you! Still polishing a few things", 175),
    m("sara.travels", DEMO, "The stories feature is a nice touch", 20, false),
    m("mike_codes", DEMO, "Are you using React Query for the feed?", 1500),
    m(DEMO, "mike_codes", "Yep, optimistic updates and infinite scroll", 1490),
    m("mike_codes", DEMO, "Nice. Send me the repo link when it is public", 1480),
    m("chef.marco", DEMO, "Thanks for the follow!", 4000),
  ];
}

function buildSeedDb() {
  const users = {};
  USER_SEED.forEach((u) => {
    users[u.username] = makeUser(u);
  });

  const posts = buildPosts();
  const data = { users, posts };
  data.notifications = seedNotifications(data);
  data.messages = seedMessages();
  seedHighlights(data);

  return data;
}

let db = null;

function load() {
  if (db) return db;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      db = JSON.parse(raw);
      upgradeSavedData(db);
      return db;
    }
  } catch {
    // fall through to reseed
  }

  db = buildSeedDb();
  persist();
  return db;
}

// Brings demo data saved by older versions up to date. Avatars are only filled in when empty,
// so anything a visitor uploaded is left alone.
function upgradeSavedData(data) {
  let changed = false;

  // Earlier versions loaded random or hotlinked photos that didn't match the captions
  data.posts.forEach((post) => {
    if (!/^https:\/\/(picsum\.photos|loremflickr\.com)\//.test(post.image)) return;

    const topic = findTopic(post);
    if (topic) {
      post.image = img(topic.seed);
      changed = true;
    }
  });

  // Seed posts saved before hashtags existed get their tagged caption
  data.posts.forEach((post) => {
    const topic = POST_TOPICS[post.username]?.find((t) => post.caption === t.caption);
    if (topic && fullCaption(topic) !== post.caption) {
      post.caption = fullCaption(topic);
      changed = true;
    }
  });

  if (Object.keys(HIGHLIGHT_SEED).some((u) => data.users[u] && !data.users[u].highlights)) {
    seedHighlights(data);
    changed = true;
  }

  if (!data.notifications) {
    data.notifications = seedNotifications(data);
    changed = true;
  }
  if (!data.messages) {
    data.messages = data.users[DEMO] ? seedMessages() : [];
    changed = true;
  }

  Object.values(data.users).forEach((user) => {
    if (!user.picture && !user.pictureRemoved && avatar(user.username)) {
      user.picture = avatar(user.username);
      changed = true;
    }
  });
  if (changed) persist();
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function getDb() {
  return load();
}

export function save() {
  persist();
}

export function resetDemoData() {
  db = buildSeedDb();
  persist();
  return db;
}

export { DEFAULT_FOLLOWING, SEED_USERNAMES };
