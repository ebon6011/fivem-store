"use client";

import { useState } from "react";
import { PlayIcon } from "./icons";

// Shows a play button first; YouTube only loads after a click (faster page, no tracking until then).
export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="glass relative aspect-video overflow-hidden">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-accent/5"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white glow transition group-hover:scale-110">
            <PlayIcon className="h-7 w-7" />
          </span>
          <span className="text-sm font-medium text-zinc-200">Watch preview</span>
          <span className="text-xs text-zinc-500">Loads YouTube when clicked</span>
        </button>
      )}
    </div>
  );
}
