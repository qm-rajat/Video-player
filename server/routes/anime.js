const express = require('express');
const router = express.Router();
const {
  getTrendingAnime,
  getAnimeThemesVideos,
  getLegalEpisodes,
  searchAnime,
  searchYouTubeAnime
} = require('../controllers/anime');

// Free Anime Video & Metadata Endpoints
router.get('/trending', getTrendingAnime);
router.get('/themes', getAnimeThemesVideos);
router.get('/episodes', getLegalEpisodes);
router.get('/search', searchAnime);
router.get('/youtube', searchYouTubeAnime);

module.exports = router;
