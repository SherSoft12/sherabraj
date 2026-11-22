import React from 'react';
import { ZodiacId } from '../data/zodiacData';
import { PlanetKey } from '../utils/astrologyEngine';

interface ZodiacGlyphProps {
  signId: ZodiacId;
  className?: string;
}

export const ZodiacGlyph: React.FC<ZodiacGlyphProps> = ({ signId, className = 'w-6 h-6' }) => {
  const paths: Record<ZodiacId, React.ReactNode> = {
    aries: (
      <>
        <path d="M12 20V10" />
        <path d="M12 10C12 6.5 9.5 4.5 7 4.5C4.8 4.5 3.5 6 3.5 8" />
        <path d="M12 10C12 6.5 14.5 4.5 17 4.5C19.2 4.5 20.5 6 20.5 8" />
      </>
    ),
    taurus: (
      <>
        <circle cx="12" cy="14" r="5" />
        <path d="M6.5 5.5C6.5 8 9 9.5 12 9.5C15 9.5 17.5 8 17.5 5.5" />
      </>
    ),
    gemini: (
      <>
        <path d="M6 5C9.5 6.5 14.5 6.5 18 5" />
        <path d="M6 19C9.5 17.5 14.5 17.5 18 19" />
        <path d="M9.5 6V18" />
        <path d="M14.5 6V18" />
      </>
    ),
    cancer: (
      <>
        <circle cx="7" cy="9" r="2.5" />
        <circle cx="17" cy="15" r="2.5" />
        <path d="M7 6.5C11.5 5.5 16 7 18.5 10" />
        <path d="M17 17.5C12.5 18.5 8 17 5.5 14" />
      </>
    ),
    leo: (
      <>
        <circle cx="7.5" cy="15" r="2.5" />
        <path d="M9.5 13.5C10.5 9 12.5 6 15.5 6C18 6 19.5 7.8 19.5 10C19.5 13 16.5 15.5 16.5 17.5C16.5 18.8 17.5 19.5 19 19" />
      </>
    ),
    virgo: (
      <>
        <path d="M5 6V17" />
        <path d="M5 10C5 7.5 7 6 8.5 6C10 6 10.5 7.5 10.5 10V17" />
        <path d="M10.5 10C10.5 7.5 12.5 6 14 6C15.5 6 16 7.5 16 10V17.5C16 19 17.5 19.5 19 18.5" />
        <path d="M16 11C18.5 11 20 12.5 19 15C18 17.5 15.5 19 13 19.5" />
      </>
    ),
    libra: (
      <>
        <path d="M4 18H20" />
        <path d="M4 14.5H8.2C7.8 13.6 7.5 12.8 7.5 11.8C7.5 9.3 9.5 7.3 12 7.3C14.5 7.3 16.5 9.3 16.5 11.8C16.5 12.8 16.2 13.6 15.8 14.5H20" />
      </>
    ),
    scorpio: (
      <>
        <path d="M4.5 6.5V16.5" />
        <path d="M4.5 10.5C4.5 8 6.5 6.5 8 6.5C9.5 6.5 10 8 10 10.5V16.5" />
        <path d="M10 10.5C10 8 12 6.5 13.5 6.5C15 6.5 15.5 8 15.5 10.5V16C15.5 18 17 18.5 19.5 16.5" />
        <path d="M17.5 15.5L20 16.5L18.5 19" />
      </>
    ),
    sagittarius: (
      <>
        <path d="M5 19L19 5" />
        <path d="M12.5 5H19V11.5" />
        <path d="M7.5 11.5L12.5 16.5" />
      </>
    ),
    capricorn: (
      <>
        <path d="M4.5 6.5L8.5 16.5L12.5 7.5C13.5 11 14 14.5 15 16.5C16.5 19 19.5 18.5 19.5 15.5C19.5 13.5 17.5 12.5 16 14C14.5 15.5 14 18 12 19.5" />
      </>
    ),
    aquarius: (
      <>
        <path d="M4 9.5L7 6.5L10 9.5L13 6.5L16 9.5L19 6.5" />
        <path d="M4 16L7 13L10 16L13 13L16 16L19 13" />
      </>
    ),
    pisces: (
      <>
        <path d="M6.5 5C9.5 8.5 9.5 15.5 6.5 19" />
        <path d="M17.5 5C14.5 8.5 14.5 15.5 17.5 19" />
        <path d="M5 12H19" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[signId]}
    </svg>
  );
};

interface PlanetGlyphProps {
  planet: PlanetKey;
  className?: string;
}

export const PlanetGlyph: React.FC<PlanetGlyphProps> = ({ planet, className = 'w-5 h-5' }) => {
  const icons: Record<PlanetKey, React.ReactNode> = {
    sun: (
      <>
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      </>
    ),
    moon: <path d="M15.5 5.5A6.5 6.5 0 1 0 18.5 15.5A5.2 5.2 0 1 1 15.5 5.5Z" />,
    mercury: (
      <>
        <circle cx="12" cy="11.5" r="4" />
        <path d="M8.5 5C9.5 7 14.5 7 15.5 5" />
        <path d="M12 15.5V20" />
        <path d="M9.5 18H14.5" />
      </>
    ),
    venus: (
      <>
        <circle cx="12" cy="9.5" r="4.5" />
        <path d="M12 14V20" />
        <path d="M9.5 17.5H14.5" />
      </>
    ),
    mars: (
      <>
        <circle cx="10" cy="14" r="4.5" />
        <path d="M13.5 10.5L19 5" />
        <path d="M14.5 5H19V9.5" />
      </>
    ),
    jupiter: (
      <>
        <path d="M7 7.5C7 5.5 10 5 11.5 6.5C13 8 12.5 11 9.5 14H17" />
        <path d="M14.5 5.5V19" />
      </>
    ),
    saturn: (
      <>
        <path d="M7 6.5H12.5" />
        <path d="M9.5 4.5V17.5" />
        <path d="M9.5 11.5C11.5 9.5 15 9.5 15.5 12.5C16 15.5 13.5 17.5 16.5 18.5" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[planet]}
    </svg>
  );
};
