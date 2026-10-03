import api from './api';

// Fallback curated anime streams if offline or network glitch
const fallbackEpisodes = [
  {
    _id: "legal-1",
    title: "Chainsaw Man - Episode 1: Dog & Chainsaw",
    seriesTitle: "Chainsaw Man",
    episodeNumber: 1,
    description: "Denji lives as a Devil Hunter with Pochita until a betrayal awakens him as Chainsaw Man.",
    thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=q15CRdE5Bv0",
    duration: 1440,
    category: "shonen",
    source: "MAPPA / Official Stream",
    views: 1850000,
    likes: 142000
  },
  {
    _id: "legal-2",
    title: "Spy x Family - Episode 1: Operation Strix",
    seriesTitle: "Spy x Family",
    episodeNumber: 1,
    description: "Master spy Twilight must build an undercover family in seven days, meeting Anya.",
    thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=ofXigq9aIpo",
    duration: 1440,
    category: "comedy",
    source: "Muse Asia / Official Stream",
    views: 2950000,
    likes: 215000
  },
  {
    _id: "legal-3",
    title: "Jujutsu Kaisen: Shibuya Incident - Gojo Satoru Awakening Clip",
    seriesTitle: "Jujutsu Kaisen",
    episodeNumber: 9,
    description: "The peak animated battle between Gojo Satoru and cursed spirits in Shibuya.",
    thumbnailUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=yYm_gQcFrH8",
    duration: 320,
    category: "action",
    source: "TOHO animation / Sakuga Cut",
    views: 3420000,
    likes: 289000
  },
  {
    _id: "legal-4",
    title: "Demon Slayer: Entertainment District - Tengen vs Gyutaro Climax (60FPS)",
    seriesTitle: "Demon Slayer: Kimetsu no Yaiba",
    episodeNumber: 10,
    description: "Sound Hashira Tengen Uzui clashes blades in an astronomical blast of score musical technique.",
    thumbnailUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/watch?v=0hBfxv23pIU",
    duration: 480,
    category: "action",
    source: "Ufotable Highlights",
    views: 5210000,
    likes: 412000
  }
];

const fallbackThemes = [
  {
    _id: "theme-fb-1",
    title: ".hack//Liminality - Opening 1 (High Quality 1080p)",
    seriesTitle: ".hack//Liminality",
    songTitle: "Edge",
    category: "amv",
    videoUrl: "https://v.animethemes.moe/DotHackLiminality-OP1.webm",
    thumbnailUrl: "https://picsum.photos/seed/hackliminality/640/360",
    resolution: 1080,
    source: "AnimeThemes.moe",
    duration: 92,
    views: 24800,
    likeCount: 2100
  },
  {
    _id: "theme-fb-2",
    title: "Neon Genesis Evangelion - A Cruel Angel's Thesis Sakuga Cut",
    seriesTitle: "Neon Genesis Evangelion",
    songTitle: "A Cruel Angel's Thesis",
    category: "mecha",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://picsum.photos/seed/evamecha/640/360",
    resolution: 720,
    source: "Anime Archive",
    duration: 90,
    views: 68900,
    likeCount: 5400
  }
];

const animeAPI = {
  // 1. Fetch Trending Anime with PV trailers & details (AniList & Jikan)
  getTrendingAnime: async () => {
    try {
      const response = await api.get('/anime/trending');
      return response.data;
    } catch (error) {
      console.warn('Anime trending fetch fallback:', error.message);
      return { success: true, source: 'fallback', data: fallbackEpisodes };
    }
  },

  // 2. Fetch Direct Video Openings/Endings/Themes (AnimeThemes API - .webm / .mp4 direct streams)
  getAnimeThemes: async () => {
    try {
      const response = await api.get('/anime/themes');
      return response.data;
    } catch (error) {
      console.warn('Anime themes fetch fallback:', error.message);
      return { success: true, source: 'fallback', data: fallbackThemes };
    }
  },

  // 3. Fetch Curated Legal Free Anime Episodes & Sakuga Showcases (Official streams)
  getLegalEpisodes: async () => {
    try {
      const response = await api.get('/anime/episodes');
      return response.data;
    } catch (error) {
      console.warn('Anime episodes fetch fallback:', error.message);
      return { success: true, source: 'fallback', data: fallbackEpisodes };
    }
  },

  // 4. Live Anime Search across catalog
  searchAnime: async (query) => {
    try {
      const response = await api.get('/anime/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.warn('Anime search fallback:', error.message);
      const filtered = fallbackEpisodes.filter(e => 
        e.title.toLowerCase().includes((query || '').toLowerCase())
      );
      return { success: true, source: 'fallback', data: filtered };
    }
  },

  // 5. YouTube Data API v3 Anime Streams
  searchYouTubeAnime: async (query = 'anime episode full official', maxResults = 12) => {
    try {
      const response = await api.get('/anime/youtube', {
        params: { q: query, maxResults }
      });
      return response.data;
    } catch (error) {
      console.warn('YouTube anime fetch fallback:', error.message);
      return { success: true, source: 'fallback', data: fallbackEpisodes };
    }
  }
};

export default animeAPI;
