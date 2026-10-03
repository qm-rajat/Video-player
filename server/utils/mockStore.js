// In-memory mock store for AnimePlatform streaming preview environment

const mockMedia = [
  {
    _id: "anime-1",
    title: "Attack on Titan: The Final Battle (Sakuga 4K 60FPS)",
    description: "High-octane climax animation cut featuring stunning 3D Maneuver Gear movement and fluid cinematic choreography produced with breathtaking key animation.",
    category: "action",
    mediaType: "video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://picsum.photos/seed/aotclimax/640/360",
    duration: 596,
    views: 45200,
    likeCount: 3820,
    likes: [],
    tags: ["shonen", "action", "sakuga", "titan", "4k"],
    isPremium: false,
    isActive: true,
    moderationStatus: "approved",
    creator: {
      _id: "creator-1",
      username: "SakugaArchive",
      isVerified: true,
      profile: {
        avatar: "https://picsum.photos/seed/sakuga/120/120"
      }
    },
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    _id: "anime-2",
    title: "Cyberpunk: Edgerunners - Night City Beats [AMV / 4K]",
    description: "An emotional visual tribute across neon-drenched Night City streets set to synthesized electronic beats, highlighting David and Lucy's journey.",
    category: "amv",
    mediaType: "video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl: "https://picsum.photos/seed/edgerunners/640/360",
    duration: 653,
    views: 78900,
    likeCount: 6540,
    likes: [],
    tags: ["cyberpunk", "amv", "scifi", "neon", "music"],
    isPremium: false,
    isActive: true,
    moderationStatus: "approved",
    creator: {
      _id: "creator-2",
      username: "TriggerFanatics",
      isVerified: true,
      profile: {
        avatar: "https://picsum.photos/seed/trigger/120/120"
      }
    },
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    _id: "anime-3",
    title: "Demon Slayer: Hinokami Kagura Flame Dragon Dance Clip",
    description: "Spectacular combat sequence showcasing blended 3D CGI particle effects, vibrant flame dragons, and peak Ufotable compositing.",
    category: "shonen",
    mediaType: "video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://picsum.photos/seed/demonslayer/640/360",
    duration: 15,
    views: 93120,
    likeCount: 8245,
    likes: [],
    tags: ["shonen", "demonslayer", "flamedance", "combat"],
    isPremium: false,
    isActive: true,
    moderationStatus: "approved",
    creator: {
      _id: "creator-3",
      username: "UfotableLovers",
      isVerified: true,
      profile: {
        avatar: "https://picsum.photos/seed/ufotable/120/120"
      }
    },
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    _id: "anime-4",
    title: "Frieren: Beyond Journey's End - Zoltraak Mage Duel Sequence",
    description: "Sublime fantasy spellcasting duel exhibiting atmospheric particle lighting, shattered landscapes, and cinematic pacing.",
    category: "fantasy",
    mediaType: "video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://picsum.photos/seed/frieren/640/360",
    duration: 15,
    views: 69230,
    likeCount: 5890,
    likes: [],
    tags: ["fantasy", "magic", "frieren", "adventure"],
    isPremium: false,
    isActive: true,
    moderationStatus: "approved",
    creator: {
      _id: "creator-1",
      username: "SakugaArchive",
      isVerified: true,
      profile: {
        avatar: "https://picsum.photos/seed/sakuga/120/120"
      }
    },
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
  {
    _id: "anime-5",
    title: "Neon Genesis: Unit 01 Awakening & Berserk Mode Scene",
    description: "Classic psychological mecha animation sequence restored in 1080p remaster with legendary sound design and iconic typography.",
    category: "mecha",
    mediaType: "video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://picsum.photos/seed/evamecha/640/360",
    duration: 60,
    views: 112400,
    likeCount: 9120,
    likes: [],
    tags: ["mecha", "eva", "scifi", "classic", "tokyo3"],
    isPremium: false,
    isActive: true,
    moderationStatus: "approved",
    creator: {
      _id: "creator-2",
      username: "TriggerFanatics",
      isVerified: true,
      profile: {
        avatar: "https://picsum.photos/seed/trigger/120/120"
      }
    },
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
  },
  {
    _id: "anime-6",
    title: "Your Name: Sunset Over Itomori Lake - Lo-Fi Anime Chillout",
    description: "Relaxing atmospheric scenery, pastel sunset reflections, and soothing lofi anime beats set against Makoto Shinkai-inspired aesthetics.",
    category: "slice-of-life",
    mediaType: "video",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    thumbnailUrl: "https://picsum.photos/seed/itomori/640/360",
    duration: 15,
    views: 85410,
    likeCount: 7470,
    likes: [],
    tags: ["lofi", "sliceoflife", "romance", "chill", "sunset"],
    isPremium: false,
    isActive: true,
    moderationStatus: "approved",
    creator: {
      _id: "creator-3",
      username: "UfotableLovers",
      isVerified: true,
      profile: {
        avatar: "https://picsum.photos/seed/ufotable/120/120"
      }
    },
    createdAt: new Date(Date.now() - 3600000 * 150).toISOString(),
  }
];

const mockUsers = new Map();

// Seed a default demo anime fan and anime studio creator
const defaultViewer = {
  _id: "user-demo-viewer",
  username: "otaku_fan",
  email: "viewer@animeplatform.com",
  role: "viewer",
  ageVerified: true,
  isVerified: true,
  isActive: true,
  profile: {
    firstName: "Anime",
    lastName: "Fan",
    avatar: "https://picsum.photos/seed/animefan/100/100"
  },
  favorites: ["anime-1"],
  subscriptions: []
};

const defaultCreator = {
  _id: "creator-1",
  username: "SakugaArchive",
  email: "creator@animeplatform.com",
  role: "creator",
  ageVerified: true,
  isVerified: true,
  isActive: true,
  profile: {
    firstName: "Sakuga",
    lastName: "Archive",
    avatar: "https://picsum.photos/seed/sakuga/120/120",
    bio: "Curating high frame rate sakuga battle cuts, key animation breakdowns, and 4K anime music videos."
  },
  favorites: [],
  subscriptions: []
};

mockUsers.set(defaultViewer.email, defaultViewer);
mockUsers.set(defaultViewer._id, defaultViewer);
mockUsers.set(defaultCreator.email, defaultCreator);
mockUsers.set(defaultCreator._id, defaultCreator);

module.exports = {
  mockMedia,
  mockUsers,
  defaultViewer,
  defaultCreator
};
