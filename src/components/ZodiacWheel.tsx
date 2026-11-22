import React, { useState } from 'react';
import { ZODIAC_SIGNS, ZodiacId, ZodiacSign } from '../data/zodiacData';
import { PlanetPosition } from '../utils/astrologyEngine';

interface ZodiacWheelProps {
  planets: PlanetPosition[];
  selectedSignId?: ZodiacId;
  ascendantDegree?: number;
  onSelectSign?: (signId: ZodiacId) => void;
}

export const ZodiacWheel: React.FC<ZodiacWheelProps> = ({
  planets,
  selectedSignId,
  ascendantDegree,
  onSelectSign,
}) => {
  const [activePlanetKey, setActivePlanetKey] = useState<string | null>(
    planets[0]?.key ?? null
  );

  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 182;
  const signRingInnerR = 136;
  const orbitR = 104;
  const innerR = 54;

  // Counter-clockwise cosmological ring starting from left/Ascendant or 180°
  const baseOffset = ascendantDegree !== undefined ? 180 - ascendantDegree : 180;

  const polarToCartesian = (r: number, eclipticDeg: number) => {
    const angleRad = ((baseOffset - eclipticDeg) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  const describeWedge = (startDeg: number, endDeg: number, rIn: number, rOut: number) => {
    const p1 = polarToCartesian(rOut, startDeg);
    const p2 = polarToCartesian(rOut, endDeg);
    const p3 = polarToCartesian(rIn, endDeg);
    const p4 = polarToCartesian(rIn, startDeg);
    return `M ${p1.x} ${p1.y} A ${rOut} ${rOut} 0 0 0 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rIn} ${rIn} 0 0 1 ${p4.x} ${p4.y} Z`;
  };

  const activePlanet = planets.find((p) => p.key === activePlanetKey) ?? planets[0];

  // Spread overlapping planet markers slightly in radius if their longitudes are close
  const placedPlanets = planets.map((planet, idx) => {
    let radialOffset = 0;
    for (let j = 0; j < idx; j++) {
      const diff = Math.abs(planet.longitude - planets[j].longitude);
      const minDiff = Math.min(diff, 360 - diff);
      if (minDiff < 14) {
        radialOffset += 18;
      }
    }
    const r = Math.max(innerR + 14, orbitR - (radialOffset % 38));
    const pos = polarToCartesian(r, planet.longitude);
    return { planet, pos, r };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-[380px] aspect-square">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full select-none overflow-visible"
          role="img"
          aria-label="دائرة الأبراج والكواكب الفلكية"
        >
          <defs>
            <radialGradient id="crimsonWheelGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(225, 29, 72, 0.20)" />
              <stop offset="65%" stopColor="rgba(159, 18, 57, 0.06)" />
              <stop offset="100%" stopColor="rgba(11, 9, 12, 0)" />
            </radialGradient>
          </defs>

          {/* Ambient crimson core glow */}
          <circle cx={cx} cy={cy} r={outerR} fill="url(#crimsonWheelGlow)" />

          {/* 12 Zodiac segments */}
          {ZODIAC_SIGNS.map((sign: ZodiacSign) => {
            const startDeg = sign.index * 30;
            const endDeg = startDeg + 30;
            const midDeg = startDeg + 15;
            const labelPos = polarToCartesian((outerR + signRingInnerR) / 2, midDeg);
            const isSelected = sign.id === selectedSignId;

            return (
              <g
                key={sign.id}
                onClick={() => onSelectSign?.(sign.id)}
                className={onSelectSign ? 'cursor-pointer' : ''}
              >
                <path
                  d={describeWedge(startDeg, endDeg, signRingInnerR, outerR)}
                  fill={
                    isSelected
                      ? 'rgba(225, 29, 72, 0.24)'
                      : 'rgba(23, 18, 25, 0.65)'
                  }
                  stroke={
                    isSelected
                      ? 'rgba(251, 113, 133, 0.65)'
                      : 'rgba(255, 255, 255, 0.09)'
                  }
                  strokeWidth={isSelected ? 1.4 : 0.8}
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isSelected ? '#FDE68A' : '#CBD5E1'}
                  fontSize="11"
                  fontWeight={isSelected ? '700' : '500'}
                  fontFamily="Cairo, sans-serif"
                >
                  {sign.arabicName}
                </text>
              </g>
            );
          })}

          {/* Intersecting golden celestial orbit rings */}
          <circle
            cx={cx}
            cy={cy}
            r={signRingInnerR}
            fill="none"
            stroke="rgba(255, 185, 95, 0.32)"
            strokeWidth={1}
          />
          <circle
            cx={cx}
            cy={cy}
            r={orbitR}
            fill="none"
            stroke="rgba(255, 255, 255, 0.10)"
            strokeDasharray="3 4"
            strokeWidth={0.9}
          />
          <circle
            cx={cx}
            cy={cy}
            r={innerR}
            fill="rgba(11, 9, 12, 0.85)"
            stroke="rgba(225, 29, 72, 0.35)"
            strokeWidth={1}
          />

          {/* Subtle aspect chords connecting Sun, Moon, and Venus/Mars */}
          {placedPlanets.length >= 4 && (
            <g opacity={0.28}>
              <line
                x1={placedPlanets[0].pos.x}
                y1={placedPlanets[0].pos.y}
                x2={placedPlanets[1].pos.x}
                y2={placedPlanets[1].pos.y}
                stroke="#FFB95F"
                strokeWidth={0.9}
              />
              <line
                x1={placedPlanets[0].pos.x}
                y1={placedPlanets[0].pos.y}
                x2={placedPlanets[3].pos.x}
                y2={placedPlanets[3].pos.y}
                stroke="#FB7185"
                strokeWidth={0.9}
              />
            </g>
          )}

          {/* Ascendant horizon axis if provided */}
          {ascendantDegree !== undefined && (
            <g>
              {(() => {
                const ascOuter = polarToCartesian(outerR + 8, ascendantDegree);
                const dscOuter = polarToCartesian(outerR + 8, ascendantDegree + 180);
                return (
                  <>
                    <line
                      x1={ascOuter.x}
                      y1={ascOuter.y}
                      x2={dscOuter.x}
                      y2={dscOuter.y}
                      stroke="rgba(251, 113, 133, 0.48)"
                      strokeWidth={1.2}
                      strokeDasharray="4 3"
                    />
                    <circle cx={ascOuter.x} cy={ascOuter.y} r={3.5} fill="#FB7185" />
                  </>
                );
              })()}
            </g>
          )}

          {/* Planetary markers */}
          {placedPlanets.map(({ planet, pos }) => {
            const isActive = activePlanet?.key === planet.key;
            const ringTick = polarToCartesian(signRingInnerR, planet.longitude);

            return (
              <g
                key={planet.key}
                onClick={() => setActivePlanetKey(planet.key)}
                className="cursor-pointer"
              >
                <line
                  x1={ringTick.x}
                  y1={ringTick.y}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={isActive ? 'rgba(255, 185, 95, 0.65)' : 'rgba(255,255,255,0.14)'}
                  strokeWidth={0.9}
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 13 : 10}
                  fill={isActive ? '#E11D48' : '#1B141D'}
                  stroke={isActive ? '#FDE68A' : 'rgba(255, 185, 95, 0.55)'}
                  strokeWidth={isActive ? 1.6 : 1}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isActive ? '#FFFFFF' : '#FDE68A'}
                  fontSize="9.5"
                  fontWeight="700"
                  fontFamily="Cairo, sans-serif"
                >
                  {planet.arabicName.slice(0, 2)}
                </text>
              </g>
            );
          })}

          {/* Center readout inside dial */}
          {activePlanet && (
            <g>
              <text
                x={cx}
                y={cy - 10}
                textAnchor="middle"
                fill="#FDE68A"
                fontSize="12"
                fontWeight="700"
                fontFamily="Cairo, sans-serif"
              >
                {activePlanet.arabicName}
              </text>
              <text
                x={cx}
                y={cy + 8}
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="11"
                fontWeight="600"
                fontFamily="Cairo, sans-serif"
              >
                {activePlanet.sign.arabicName}
              </text>
              <text
                x={cx}
                y={cy + 24}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="9.5"
                fontFamily="JetBrains Mono, monospace"
              >
                {activePlanet.formattedDegree}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Interactive planet inspection bar */}
      {activePlanet && (
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-300 text-center">
          <span className="font-semibold text-[#FDE68A]">{activePlanet.arabicName}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>برج {activePlanet.sign.arabicName}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono-tabular text-slate-400" dir="ltr">
            {activePlanet.formattedDegree}
          </span>
          {activePlanet.isRetrograde && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-[#FB7185] font-medium">حركة تراجعية</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
