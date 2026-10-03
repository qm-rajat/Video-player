# AnimeStream - Next.js Anime Video Streaming Platform

A production-ready full-stack **Next.js** anime streaming and video platform ready for instant 1-click deployment on **Vercel**.

## Features

- **⚡ Next.js 14 App Router & TypeScript**: Fast SSR/SSG, edge-ready API routes.
- **🔴 YouTube Data API v3**: Live anime episode and sakuga streaming powered by YouTube Data API v3.
- **🎵 AnimeThemes API**: Direct `.webm` / `.mp4` anime openings and endings streaming without ads.
- **🔥 AniList GraphQL & Jikan v4**: Trending anime metadata, trailers, and score rankings.
- **🎬 Responsive Theater Video Player**: Embedded HTML5 and YouTube stream player.
- **🎨 Tailwind CSS Dark Theme**: Modern anime-focused UI.
- **📱 Creator Dashboard & Studio**: Video submission and analytics.

## Deploying to Vercel

1. Push this repository to your **GitHub** / **GitLab** account.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and select this repository.
3. In **Environment Variables**, add:
   - `YOUTUBE_API_KEY`: Your YouTube Data API v3 Key.
4. Click **Deploy**! Vercel will automatically run `next build` and provision the edge and serverless API endpoints.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
