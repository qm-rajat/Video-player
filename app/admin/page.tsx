import React from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const subsystems = [
    { title: 'YOUTUBE V3 API', spec: 'AIzaSyDL7Hw... [ACTIVE]', status: 'STATUS: 200 OK' },
    { title: 'ANIMETHEMES .WEBM', spec: 'DIRECT CDN CLUSTER', status: 'STATUS: MOUNTED' },
    { title: 'ANILIST GRAPHQL', spec: 'METADATA REVALIDATION', status: 'STATUS: 3600S TTL' },
    { title: 'VERCEL SERVERLESS', spec: 'NEXT.JS 14 RUNTIME', status: 'STATUS: DEPLOYED' },
  ];

  return (
    <div>
      <section className="pt">
        <div className="cr">
          <Link href="/">HOME</Link> / <span>SYSTEM ADMIN CONSOLE</span>
        </div>
        <h1>ADMIN CONSOLE</h1>
      </section>

      {/* Fixwell 4-Box Subsystem Status Grid */}
      <div className="bx4">
        {subsystems.map((sub) => (
          <div key={sub.title} className="bx">
            <small>{sub.status}</small>
            <div className="n">{sub.title}</div>
            <p className="font-mono text-xs text-neutral-600 mt-2">{sub.spec}</p>
            <div className="pp !text-xl mt-auto text-black">ONLINE</div>
          </div>
        ))}
      </div>

      {/* Technical Spec Sheet & Deployment Table */}
      <div className="pd">
        <div className="sheet">
          <h2 className="text-2xl font-display mb-4">SYSTEM ARCHITECTURE SPECIFICATION</h2>
          <table>
            <tbody>
              <tr>
                <td>ENGINE CORE</td>
                <td>Next.js 14 App Router (Full-Stack TypeScript)</td>
              </tr>
              <tr>
                <td>CONTAINER PLATFORM</td>
                <td>Vercel Edge & Serverless Functions</td>
              </tr>
              <tr>
                <td>MEDIA CACHING</td>
                <td>Same-Origin Next.js API Routes (/api/anime/*)</td>
              </tr>
              <tr>
                <td>VIDEO STREAM PLAYER</td>
                <td>Adaptive HTML5 + YouTube Iframe Embed Hybrid</td>
              </tr>
              <tr>
                <td>HAZARD ACCENT</td>
                <td>#FF4D00 (International High-Visibility Signal Orange)</td>
              </tr>
              <tr>
                <td>PRIMARY CANVAS</td>
                <td>#EFEFEA (Concrete Archival Paper Raw Tone)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bb">
          <b>VERCEL DEPLOYMENT DOCKET</b>
          <div className="big !text-3xl mt-2 mb-4 leading-tight">
            1-CLICK READY
          </div>
          <p className="text-xs font-mono mb-4 text-black font-bold">
            All routes compiled with zero dependencies on external legacy servers.
            Push repository to GitHub and connect directly in Vercel.
          </p>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="bt w w-full block text-center"
          >
            OPEN VERCEL DASHBOARD &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
