import { Img } from "@/components/Img";
import { Parallax } from "@/components/Parallax";
import { TLink } from "@/components/PageTransition";

type Props = { images: string[] };

/** "Discover my work" banner with a loose stack of images drifting behind the type. */
export function DiscoverBanner({ images }: Props) {
  const pics = images.filter(Boolean).slice(0, 5);
  const layout = [
    { left: "34%", top: "8%", w: "13vw", speed: -0.12 },
    { left: "52%", top: "20%", w: "11vw", speed: 0.1 },
    { left: "44%", top: "46%", w: "15vw", speed: -0.06 },
    { left: "60%", top: "58%", w: "9vw", speed: 0.14 },
    { left: "30%", top: "62%", w: "10vw", speed: 0.08 },
  ];

  return (
    <TLink href="/projects" className="discover" data-cursor="Explore" aria-label="Discover my work">
      <div className="discover__stack" aria-hidden="true">
        {pics.map((src, i) => (
          <Parallax
            key={i}
            speed={layout[i].speed}
            className="discover__pic"
          >
            <span style={{ width: layout[i].w, left: layout[i].left, top: layout[i].top }} className="discover__frame">
              <Img src={src} alt="" sizes="16vw" />
            </span>
          </Parallax>
        ))}
      </div>
      <span className="discover__text">
        <span>Discover</span>
        <span>my</span>
        <span>work</span>
      </span>
    </TLink>
  );
}
