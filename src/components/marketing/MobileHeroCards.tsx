/* eslint-disable @next/next/no-img-element */
"use client";

/** Mobile Hero Cards — vertical card layout with connection dots. */

const cards = [
  {
    id: "3d",
    type: "3D",
    label: "Rodin 2.0",
    image:
      "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68349ea45685e2905f5c21e6_3D_RODIN_hero_mobile.avif",
    size: "medium" as const,
  },
  {
    id: "stable",
    type: "Image",
    label: "Stable Diffusion",
    image:
      "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68349df097acbeb0e747fb60_Diffusion-diff_hero_mobile.avif",
    size: "large" as const,
  },
  {
    id: "flux",
    type: "Image",
    label: "Flux Pro 1.1",
    image:
      "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/683751c043700044e036204f_bird_mobile.avif",
    size: "medium" as const,
  },
  {
    id: "minimax",
    type: "Video",
    label: "Minimax Video",
    image:
      "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6835ce9cc9475b88f57c57da_VIDEO_hero_mobile.png",
    video: "https://assets.weavy.ai/homepage/hero/hero_video_mobile_342px.mp4",
    size: "large" as const,
  },
];

export default function MobileHeroCards() {
  return (
    <div className="relative pb-8" style={{ marginTop: "4em" }}>
      {/* Background with gradient matching .hero-cards-area */}
      <div
        className="relative rounded-xl overflow-hidden pt-6 pb-8"
        style={{
          background:
            "linear-gradient(to bottom, #f9f9f400, #f3f3ee 40%, #e3e3e7 77%, #c8d7cc)",
        }}
      >
        {/* Cards — alternating layout */}
        <div className="relative space-y-4 px-4">
          {/* Row 1: 3D Rodin (right) */}
          <div className="flex justify-end">
            <div className="w-[55%]">
              <CardItem card={cards[0]} />
            </div>
          </div>

          {/* SVG connection */}
          <svg
            className="absolute top-[10%] left-[40%] w-20 h-24 overflow-visible"
            aria-hidden="true"
          >
            <path
              d="M 0 0 Q 40 30, 60 60"
              fill="none"
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="1.5"
            />
          </svg>

          {/* Row 2: Stable Diffusion (left, large) */}
          <div className="flex justify-start">
            <div className="w-[70%]">
              <CardItem card={cards[1]} />
            </div>
          </div>

          {/* Row 3: Flux Pro (right) */}
          <div className="flex justify-end">
            <div className="w-[55%]">
              <CardItem card={cards[2]} />
            </div>
          </div>

          {/* Row 4: Minimax Video (left, large) */}
          <div className="flex justify-start">
            <div className="w-[75%]">
              <CardItem card={cards[3]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CardItemProps {
  card: {
    id: string;
    type: string;
    label: string;
    image: string;
    video?: string;
    size: "medium" | "large";
  };
}

function CardItem({ card }: CardItemProps) {
  const heightClass =
    card.size === "large" ? "aspect-[3/4]" : "aspect-square";

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <div className="flex items-center gap-2 text-[9px] font-medium tracking-[0.12em] uppercase text-[#252525]/70">
        <span>{card.type}</span>
        {card.label && (
          <span className="text-[#252525] font-semibold">{card.label}</span>
        )}
      </div>

      {/* Content */}
      <div
        className={`${heightClass} w-full rounded-lg overflow-hidden bg-gray-100/50 relative`}
      >
        <img
          src={card.image}
          alt={card.label || card.type}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Video overlay */}
        {card.video && (
          <video
            autoPlay
            loop
            muted
            playsInline
            suppressHydrationWarning
            className="absolute inset-0 w-full h-full object-cover"
            style={{ pointerEvents: "none" }}
          >
            <source src={card.video} type="video/mp4" />
          </video>
        )}

        {/* Connection dots */}
        <div className="absolute top-1/2 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#252525]/30 -translate-y-1/2" />
        <div className="absolute top-1/2 -left-1.5 w-2.5 h-2.5 rounded-full bg-[#252525]/30 -translate-y-1/2" />
      </div>
    </div>
  );
}
