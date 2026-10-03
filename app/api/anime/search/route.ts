import { NextResponse } from 'next/server';
import { curatedLegalEpisodes } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryText = (searchParams.get('q') || '').trim();

  if (!queryText) {
    return NextResponse.json({ success: true, count: 0, data: [] });
  }

  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 12) {
        media(search: $search, type: ANIME, isAdult: false) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            extraLarge
          }
          description(asHtml: false)
          episodes
          duration
          genres
          averageScore
          seasonYear
          trailer {
            id
            site
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
      body: JSON.stringify({
        query,
        variables: { search: queryText }
      }),
      next: { revalidate: 3600 }
    });

    const json = await response.json();
    const list = json.data?.Page?.media || [];

    const formatted = list.map((item: any) => {
      const title = item.title.english || item.title.romaji;
      const youtubeId = item.trailer?.site === 'youtube' ? item.trailer.id : null;
      const videoUrl = youtubeId 
        ? `https://www.youtube.com/watch?v=${youtubeId}` 
        : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

      return {
        _id: `search-${item.id}`,
        id: item.id,
        title,
        description: item.description ? item.description.replace(/<[^>]*>?/gm, '') : 'No description available',
        thumbnailUrl: item.coverImage.extraLarge || item.coverImage.large,
        videoUrl,
        genres: item.genres || [],
        category: (item.genres?.[0] || 'action').toLowerCase(),
        score: item.averageScore ? (item.averageScore / 10).toFixed(1) : '8.0',
        episodes: item.episodes || 12,
        year: item.seasonYear || new Date().getFullYear(),
        views: Math.floor(Math.random() * 50000) + 10000,
        likeCount: Math.floor(Math.random() * 4000) + 500
      };
    });

    return NextResponse.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (err: any) {
    console.warn('Search fallback:', err.message);
    const filtered = curatedLegalEpisodes.filter(item => 
      item.title.toLowerCase().includes(queryText.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(queryText.toLowerCase()))
    );
    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  }
}
