import { NextResponse } from 'next/server';
import { curatedLegalEpisodes } from '@/lib/data';

export async function GET() {
  const query = `
    query {
      Page(page: 1, perPage: 16) {
        media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          description(asHtml: false)
          episodes
          duration
          genres
          averageScore
          seasonYear
          status
          studios(isMain: true) {
            nodes {
              name
            }
          }
          trailer {
            id
            site
            thumbnail
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'AnimeStreamApp/1.0'
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`AniList returned status ${response.status}`);
    }

    const result = await response.json();
    const rawList = result.data?.Page?.media || [];

    const formattedList = rawList.map((anime: any) => {
      const title = anime.title.english || anime.title.romaji;
      const youtubeId = anime.trailer?.site === 'youtube' ? anime.trailer.id : null;
      const videoUrl = youtubeId 
        ? `https://www.youtube.com/watch?v=${youtubeId}` 
        : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

      return {
        _id: `anilist-${anime.id}`,
        id: anime.id,
        title: title,
        nativeTitle: anime.title.native,
        description: anime.description ? anime.description.replace(/<[^>]*>?/gm, '') : 'No synopsis available.',
        thumbnailUrl: anime.coverImage.extraLarge || anime.coverImage.large,
        bannerUrl: anime.bannerImage,
        videoUrl: videoUrl,
        episodes: anime.episodes || 'Ongoing',
        duration: anime.duration || 24,
        genres: anime.genres || [],
        category: (anime.genres?.[0] || 'action').toLowerCase(),
        score: anime.averageScore ? (anime.averageScore / 10).toFixed(1) : '8.5',
        year: anime.seasonYear || new Date().getFullYear(),
        status: anime.status,
        studio: anime.studios?.nodes?.[0]?.name || 'Animation Studio',
        views: Math.floor(Math.random() * 80000) + 20000,
        likeCount: Math.floor(Math.random() * 8000) + 1000
      };
    });

    return NextResponse.json({
      success: true,
      source: 'live',
      count: formattedList.length,
      data: formattedList
    });
  } catch (error: any) {
    console.warn('AniList route fallback:', error.message);
    return NextResponse.json({
      success: true,
      source: 'fallback',
      count: curatedLegalEpisodes.length,
      data: curatedLegalEpisodes
    });
  }
}
