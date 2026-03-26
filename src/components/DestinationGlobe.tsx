import { useMemo, useRef, useState } from "react";
import { Destination } from "@/data/mockData";

interface GlobeDestination extends Destination {
  coordinates: { lat: number; lon: number };
}

interface DestinationGlobeProps {
  destinations: GlobeDestination[];
  selectedId: string | null;
  onSelect: (destination: GlobeDestination) => void;
}

function projectPoint(lat: number, lon: number, rotationY: number, rotationX: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + rotationY) * (Math.PI / 180);
  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);

  const tilt = rotationX * (Math.PI / 180);
  const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
  const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);

  return { x, y: y2, z: z2 };
}

export default function DestinationGlobe({ destinations, selectedId, onSelect }: DestinationGlobeProps) {
  const [rotation, setRotation] = useState({ x: -18, y: -28 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number; rotationX: number; rotationY: number } | null>(null);

  const points = useMemo(
    () =>
      destinations
        .map((destination) => {
          const projected = projectPoint(
            destination.coordinates.lat,
            destination.coordinates.lon,
            rotation.y,
            rotation.x,
          );

          return {
            destination,
            x: 50 + projected.x * 33,
            y: 50 + projected.y * 33,
            z: projected.z,
          };
        })
        .sort((a, b) => a.z - b.z),
    [destinations, rotation],
  );

  const beginDrag = (clientX: number, clientY: number) => {
    dragRef.current = { x: clientX, y: clientY, rotationX: rotation.x, rotationY: rotation.y };
    setIsDragging(true);
  };

  const updateDrag = (clientX: number, clientY: number) => {
    if (!dragRef.current) return;
    const deltaX = clientX - dragRef.current.x;
    const deltaY = clientY - dragRef.current.y;
    setRotation({
      x: Math.max(-48, Math.min(32, dragRef.current.rotationX - deltaY * 0.18)),
      y: dragRef.current.rotationY + deltaX * 0.28,
    });
  };

  const endDrag = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px] select-none">
      <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle_at_center,_rgba(141,255,238,0.2),_transparent_60%)] blur-3xl" />
      <div
        className={`relative h-full w-full cursor-grab ${isDragging ? "cursor-grabbing" : ""}`}
        onMouseDown={(event) => beginDrag(event.clientX, event.clientY)}
        onMouseMove={(event) => isDragging && updateDrag(event.clientX, event.clientY)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={(event) => beginDrag(event.touches[0].clientX, event.touches[0].clientY)}
        onTouchMove={(event) => updateDrag(event.touches[0].clientX, event.touches[0].clientY)}
        onTouchEnd={endDrag}
      >
        <div className="absolute inset-[8%] rounded-full border border-white/15 bg-[radial-gradient(circle_at_30%_28%,_rgba(255,255,255,0.28),_rgba(255,255,255,0.05)_24%,_rgba(7,18,31,0.92)_62%,_rgba(4,12,24,1)_100%)] shadow-[0_40px_120px_rgba(4,12,24,0.55)]">
          <div
            className="absolute inset-0 rounded-full opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            }}
          />
          <div className="absolute inset-[9%] rounded-full border border-white/10" />
          <div className="absolute inset-[18%] rounded-full border border-white/8" />
          <div className="absolute inset-x-[8%] top-1/2 h-px -translate-y-1/2 bg-white/10" />
          <div className="absolute left-1/2 top-[8%] h-[84%] w-px -translate-x-1/2 bg-white/10" />

          {points.map((point) => {
            const active = point.destination.id === selectedId;
            const hidden = point.z < -0.16;

            return (
              <button
                key={point.destination.id}
                type="button"
                onClick={() => onSelect(point.destination)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  hidden ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: `translate(-50%, -50%) scale(${0.72 + (point.z + 1) * 0.24})`,
                  zIndex: Math.round((point.z + 1) * 100),
                }}
              >
                <span className={`globe-marker ${active ? "globe-marker-active" : ""}`} />
                <span
                  className={`pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] transition-all ${
                    active
                      ? "border-white/30 bg-white text-navy"
                      : "border-white/12 bg-navy/75 text-white/75"
                  }`}
                >
                  {point.destination.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
