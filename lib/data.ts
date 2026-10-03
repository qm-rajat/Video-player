export interface MediaItem {
  _id: string;
  id?: string | number;
  title: string;
  seriesTitle?: string;
  episodeNumber?: number;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration?: number;
  category?: string;
  source?: string;
  channelTitle?: string;
  resolution?: number;
  songTitle?: string;
  views?: number;
  likes?: number;
  likeCount?: number;
  score?: string;
  episodes?: string | number;
  studio?: string;
  year?: number;
  tags?: string[];
  creator?: {
    username: string;
    profile?: {
      avatar?: string;
    };
  };
}

export const curatedLegalEpisodes: MediaItem[] = [
  {
    _id: "legal-1",
    id: "legal-1",
    title: "Chainsaw Man - Episode 1: Dog & Chainsaw",
    seriesTitle: "Chainsaw Man",
    episodeNumber: 1,
    description: "Denji lives as a Devil Hunter with the Chainsaw Devil Pochita until a betrayal leads him to awaken as Chainsaw Man in an explosive first episode.",
    thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=q15CRdE5Bv0",
    duration: 1440,
    category: "shonen",
    source: "MAPPA / Official Stream",
    views: 1850000,
    likes: 142000,
    tags: ["chainsaw man", "action", "shonen", "mappa", "episode 1"],
    creator: {
      username: "MAPPA Official",
      profile: { avatar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=80" }
    }
  },
  {
    _id: "legal-2",
    id: "legal-2",
    title: "Spy x Family - Episode 1: Operation Strix",
    seriesTitle: "Spy x Family",
    episodeNumber: 1,
    description: "Master spy Twilight must build an undercover family in just seven days to infiltrate an elite academy, meeting the telepathic orphan Anya.",
    thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ofXigq9aIpo",
    duration: 1440,
    category: "comedy",
    source: "Muse Asia / Official Stream",
    views: 2950000,
    likes: 215000,
    tags: ["spy x family", "comedy", "action", "anya"],
    creator: {
      username: "Muse Asia",
      profile: { avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100&auto=format&fit=crop&q=80" }
    }
  },
  {
    _id: "legal-3",
    id: "legal-3",
    title: "Jujutsu Kaisen: Shibuya Incident - Gojo Satoru Awakening Clip",
    seriesTitle: "Jujutsu Kaisen",
    episodeNumber: 9,
    description: "The peak animated battle between Gojo Satoru and the cursed spirits in Shibuya Station, featuring fluid choreography and limitless void effects.",
    thumbnailUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=yYm_gQcFrH8",
    duration: 320,
    category: "action",
    source: "TOHO animation / Sakuga Cut",
    views: 3420000,
    likes: 289000,
    tags: ["jujutsu kaisen", "gojo", "sakuga", "action", "shibuya"],
    creator: {
      username: "TOHO animation",
      profile: { avatar: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&auto=format&fit=crop&q=80" }
    }
  },
  {
    _id: "legal-4",
    id: "legal-4",
    title: "Demon Slayer: Entertainment District - Tengen vs Gyutaro Climax (60FPS)",
    seriesTitle: "Demon Slayer: Kimetsu no Yaiba",
    episodeNumber: 10,
    description: "Sound Hashira Tengen Uzui clashes blades in an astronomical blast of score musical technique and firework explosions by Ufotable.",
    thumbnailUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=0hBfxv23pIU",
    duration: 480,
    category: "action",
    source: "Ufotable Highlights",
    views: 5210000,
    likes: 412000,
    tags: ["demon slayer", "tengen", "gyutaro", "ufotable", "sakuga"],
    creator: {
      username: "Ufotable Studios",
      profile: { avatar: "https://images.unsplash.com/photo-1563089145-599997674d42?w=100&auto=format&fit=crop&q=80" }
    }
  },
  {
    _id: "legal-5",
    id: "legal-5",
    title: "Frieren: Beyond Journey's End - Frieren vs Fern Magic Training Battle",
    seriesTitle: "Frieren: Beyond Journey's End",
    episodeNumber: 5,
    description: "Madhouse showcases supreme magic choreography, atmospheric velocity, and cinematic sound design in this breathtaking duel scene.",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=q6_y6aRk6Z0",
    duration: 360,
    category: "fantasy",
    source: "Madhouse Official Clip",
    views: 1680000,
    likes: 138000,
    tags: ["frieren", "fantasy", "magic", "madhouse"],
    creator: {
      username: "Madhouse",
      profile: { avatar: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&auto=format&fit=crop&q=80" }
    }
  },
  {
    _id: "legal-6",
    id: "legal-6",
    title: "Solo Leveling - Episode 2: If I Had One More Chance",
    seriesTitle: "Solo Leveling",
    episodeNumber: 2,
    description: "Sung Jinwoo faces the terrifying double dungeon deity statues and receives a secret quest that unlocks the player system.",
    thumbnailUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=jWJ87jR0vjU",
    duration: 1440,
    category: "action",
    source: "A-1 Pictures Stream",
    views: 2410000,
    likes: 195000,
    tags: ["solo leveling", "action", "fantasy", "jinwoo"],
    creator: {
      username: "A-1 Pictures",
      profile: { avatar: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=100&auto=format&fit=crop&q=80" }
    }
  }
];

export const mockUser = {
  id: "user-1",
  username: "AnimeFan2026",
  email: "user@animestream.com",
  role: "creator",
  profile: {
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    bio: "Passionate anime fan, reviewer & sakuga animator.",
    subscribersCount: 1420
  }
};
