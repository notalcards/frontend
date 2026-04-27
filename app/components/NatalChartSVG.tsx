'use client';

import { useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// ─── Constants ───────────────────────────────────────────────────────────────

const CX = 300, CY = 300;
const R_ZODIAC_OUTER = 280;
const R_ZODIAC_INNER = 248;
const R_HOUSE_OUTER  = 248;
const R_HOUSE_INNER  = 210;
const R_PLANET       = 230; // placement track
const R_ASPECT_OUTER = 206;
const R_ASPECT_INNER = 0;

const ZODIAC_SIGNS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const ZODIAC_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
// Fire, Earth, Air, Water cycle
const ELEMENT_COLORS: Record<string, string> = {
  Fire:  '#ff6b6b',
  Earth: '#56c271',
  Air:   '#f7c948',
  Water: '#60a5fa',
};
const ELEMENTS = ['Fire','Earth','Air','Water','Fire','Earth','Air','Water','Fire','Earth','Air','Water'];

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  Chiron: '⚷', Mean_Lilith: '⚸', Ascendant: 'AC', Medium_Coeli: 'MC',
  Descendant: 'DC', Imum_Coeli: 'IC',
};

const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFD700', Moon: '#C0C8D0', Mercury: '#B8A0DC',
  Venus: '#F4A8B0', Mars: '#FF6B6B', Jupiter: '#FFA500',
  Saturn: '#A09060', Uranus: '#60CFC0', Neptune: '#6080FF',
  Pluto: '#C060C0', Chiron: '#80C080', Mean_Lilith: '#A0A0C0',
  Ascendant: '#E2E0F0', Medium_Coeli: '#E2E0F0',
  Descendant: '#E2E0F0', Imum_Coeli: '#E2E0F0',
};

const ASPECT_STYLES: Record<string, { color: string; dash: string; opacity: number }> = {
  conjunction:    { color: '#FFD700', dash: 'none',    opacity: 0.9 },
  opposition:     { color: '#FF6060', dash: '4,3',     opacity: 0.85 },
  trine:          { color: '#60FF90', dash: 'none',    opacity: 0.8 },
  square:         { color: '#FF8040', dash: '4,3',     opacity: 0.8 },
  sextile:        { color: '#60C0FF', dash: 'none',    opacity: 0.7 },
  quincunx:       { color: '#C060C0', dash: '2,4',     opacity: 0.6 },
  semisextile:    { color: '#80C0A0', dash: '2,4',     opacity: 0.5 },
  semisquare:     { color: '#C0A060', dash: '2,3',     opacity: 0.5 },
  sesquisquare:   { color: '#A06040', dash: '2,3',     opacity: 0.5 },
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface PlanetPos {
  name: string;
  absolute_longitude: number;
  is_retrograde?: boolean;
}

interface HouseCusp {
  house: number;
  absolute_longitude: number;
}

interface Aspect {
  point1: string;
  point2: string;
  aspect_type: string;
}

interface ResultData {
  subject_data: {
    ascendant?: { abs_pos: number };
    [key: string]: unknown;
  };
  chart_data: {
    planetary_positions: PlanetPos[];
    house_cusps: HouseCusp[];
    aspects: Aspect[];
  };
}

interface Props {
  resultData: ResultData;
  profileName?: string;
  birthDate?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toXY(angleDeg: number, r: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [CX + r * Math.cos(rad), CY - r * Math.sin(rad)];
}

/** Convert absolute ecliptic longitude → SVG math angle (0=right, CCW) */
function lonToMathAngle(lon: number, ascLon: number): number {
  return 180 + (lon - ascLon);
}

function describeArc(startAngle: number, endAngle: number, r: number): string {
  const [x1, y1] = toXY(startAngle, r);
  const [x2, y2] = toXY(endAngle, r);
  let delta = endAngle - startAngle;
  while (delta < 0) delta += 360;
  while (delta >= 360) delta -= 360;
  const large = delta > 180 ? 1 : 0;
  // CCW arc in SVG (sweep=0 for math coords since y is flipped)
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 0 ${x2} ${y2}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NatalChartSVG({ resultData, profileName, birthDate }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  const ascLon = resultData.subject_data.ascendant?.abs_pos ?? 0;
  const { planetary_positions, house_cusps, aspects } = resultData.chart_data;

  // Build planet lookup by name
  const planetMap = new Map(planetary_positions.map(p => [p.name, p]));

  // ── Download handler ──────────────────────────────────────────────────────
  const handleDownload = useCallback(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    const source = '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `natal-chart-${profileName ?? 'chart'}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }, [profileName]);

  // ── Render helpers ────────────────────────────────────────────────────────

  /** Zodiac outer ring: 12 colored arcs + sign glyph */
  function renderZodiacRing() {
    const items: React.ReactNode[] = [];
    for (let i = 0; i < 12; i++) {
      const startLon = i * 30;       // Aries = 0°
      const endLon   = startLon + 30;
      const startAngle = lonToMathAngle(startLon, ascLon);
      const endAngle   = lonToMathAngle(endLon,   ascLon);

      // Filled arc segment between two radii
      const [ox1, oy1] = toXY(startAngle, R_ZODIAC_OUTER);
      const [ox2, oy2] = toXY(endAngle,   R_ZODIAC_OUTER);
      const [ix2, iy2] = toXY(endAngle,   R_ZODIAC_INNER);
      const [ix1, iy1] = toXY(startAngle, R_ZODIAC_INNER);
      let dAngle = endAngle - startAngle;
      while (dAngle < 0) dAngle += 360;
      while (dAngle >= 360) dAngle -= 360;
      const large = dAngle > 180 ? 1 : 0;

      const path = [
        `M ${ox1} ${oy1}`,
        `A ${R_ZODIAC_OUTER} ${R_ZODIAC_OUTER} 0 ${large} 0 ${ox2} ${oy2}`,
        `L ${ix2} ${iy2}`,
        `A ${R_ZODIAC_INNER} ${R_ZODIAC_INNER} 0 ${large} 1 ${ix1} ${iy1}`,
        'Z',
      ].join(' ');

      const color = ELEMENT_COLORS[ELEMENTS[i]];
      items.push(
        <path key={`z-fill-${i}`} d={path} fill={color} opacity="0.15" />,
        <path key={`z-stroke-${i}`} d={path} fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" />,
      );

      // Sign glyph at mid-arc
      const midAngle = lonToMathAngle(startLon + 15, ascLon);
      const [gx, gy] = toXY(midAngle, (R_ZODIAC_OUTER + R_ZODIAC_INNER) / 2);
      items.push(
        <text key={`z-glyph-${i}`} x={gx} y={gy} textAnchor="middle" dominantBaseline="central"
          fontSize="13" fill={color} fontFamily="serif" opacity="0.9">
          {ZODIAC_SIGNS[i]}
        </text>
      );
    }
    return items;
  }

  /** House cusp lines + house numbers */
  function renderHouses() {
    const items: React.ReactNode[] = [];
    house_cusps.forEach((cusp) => {
      const angle = lonToMathAngle(cusp.absolute_longitude, ascLon);
      const [x1, y1] = toXY(angle, R_ZODIAC_INNER);
      const [x2, y2] = toXY(angle, R_HOUSE_INNER);
      const isAngular = [1, 4, 7, 10].includes(cusp.house);

      items.push(
        <line key={`h-line-${cusp.house}`}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={isAngular ? '#C4B5FD' : 'rgba(196,181,253,0.3)'}
          strokeWidth={isAngular ? 1.5 : 0.8}
        />
      );

      // House number between cusp and next cusp mid-point
      const nextCusp = house_cusps[(cusp.house % 12)]; // wraps
      if (nextCusp) {
        let midLon = (cusp.absolute_longitude + nextCusp.absolute_longitude) / 2;
        // Handle wrap-around
        let diff = nextCusp.absolute_longitude - cusp.absolute_longitude;
        if (diff < 0) diff += 360;
        midLon = cusp.absolute_longitude + diff / 2;
        const midAngle = lonToMathAngle(midLon, ascLon);
        const [nx, ny] = toXY(midAngle, (R_HOUSE_OUTER + R_HOUSE_INNER) / 2);
        items.push(
          <text key={`h-num-${cusp.house}`} x={nx} y={ny} textAnchor="middle"
            dominantBaseline="central" fontSize="9" fill="rgba(196,181,253,0.7)" fontFamily="sans-serif">
            {cusp.house}
          </text>
        );
      }
    });
    return items;
  }

  /** Aspect lines in the center */
  function renderAspects() {
    // Only major aspects
    const major = ['conjunction', 'opposition', 'trine', 'square', 'sextile'];
    return aspects
      .filter(a => major.includes(a.aspect_type))
      .map((asp, i) => {
        const p1 = planetMap.get(asp.point1);
        const p2 = planetMap.get(asp.point2);
        if (!p1 || !p2) return null;
        const a1 = lonToMathAngle(p1.absolute_longitude, ascLon);
        const a2 = lonToMathAngle(p2.absolute_longitude, ascLon);
        const [x1, y1] = toXY(a1, R_ASPECT_OUTER);
        const [x2, y2] = toXY(a2, R_ASPECT_OUTER);
        const style = ASPECT_STYLES[asp.aspect_type] ?? { color: '#888', dash: 'none', opacity: 0.4 };
        return (
          <line key={`asp-${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={style.color}
            strokeWidth="0.8"
            strokeDasharray={style.dash === 'none' ? undefined : style.dash}
            opacity={style.opacity * 0.6}
          />
        );
      });
  }

  /** Planet symbols on the planet ring */
  function renderPlanets() {
    // Avoid overlap: sort by angle and nudge overlapping positions
    const planets = planetary_positions.filter(p =>
      !['Descendant', 'Imum_Coeli'].includes(p.name)
    );

    // Sort by absolute_longitude
    const sorted = [...planets].sort((a, b) => a.absolute_longitude - b.absolute_longitude);

    // Resolve overlaps (simple angular spacing)
    const MIN_DEG = 7;
    const adjusted: { name: string; dispAngle: number; lon: number; retro: boolean }[] = [];
    for (const p of sorted) {
      let angle = lonToMathAngle(p.absolute_longitude, ascLon);
      if (adjusted.length > 0) {
        const prev = adjusted[adjusted.length - 1];
        let diff = angle - prev.dispAngle;
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        if (Math.abs(diff) < MIN_DEG) {
          angle = prev.dispAngle + (diff >= 0 ? MIN_DEG : -MIN_DEG);
        }
      }
      adjusted.push({ name: p.name, dispAngle: angle, lon: p.absolute_longitude, retro: p.is_retrograde ?? false });
    }

    return adjusted.map(p => {
      const [px, py] = toXY(p.dispAngle, R_PLANET);
      const [lx, ly] = toXY(lonToMathAngle(p.lon, ascLon), R_ASPECT_OUTER + 4);
      const color = PLANET_COLORS[p.name] ?? '#E2E0F0';
      const symbol = PLANET_SYMBOLS[p.name] ?? p.name.slice(0, 2);
      const isLabel = ['Ascendant', 'Medium_Coeli'].includes(p.name);
      return (
        <g key={`p-${p.name}`}>
          {/* Tick line from planet track to aspect circle */}
          <line x1={lx} y1={ly} x2={px} y2={py} stroke={color} strokeWidth="0.5" opacity="0.4" />
          {/* Circle bg */}
          <circle cx={px} cy={py} r={isLabel ? 9 : 8} fill="#0F0A1E" />
          {/* Planet glyph */}
          <text x={px} y={py} textAnchor="middle" dominantBaseline="central"
            fontSize={isLabel ? "7" : "11"} fill={color} fontFamily="serif" fontWeight="bold">
            {symbol}
          </text>
          {/* Retrograde indicator */}
          {p.retro && (
            <text x={px + 8} y={py - 5} fontSize="7" fill={color} opacity="0.7" fontFamily="sans-serif">ℛ</text>
          )}
        </g>
      );
    });
  }

  const subjectData = resultData.subject_data as Record<string, unknown>;
  const birthInfo = [
    profileName,
    birthDate,
    typeof subjectData.city === 'string' ? subjectData.city : '',
  ].filter(Boolean).join(' · ');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={handleDownload}
          sx={{ borderColor: 'rgba(124,58,237,0.5)', color: '#C4B5FD', fontSize: 12 }}
        >
          ⬇ Скачать SVG
        </Button>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 600 600"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
          style={{ background: '#0F0A1E', borderRadius: 8 }}
        >
          {/* Background */}
          <rect width="600" height="600" fill="#0F0A1E" />

          {/* Concentric guide circles */}
          <circle cx={CX} cy={CY} r={R_ZODIAC_OUTER} fill="none" stroke="rgba(124,58,237,0.3)" strokeWidth="1" />
          <circle cx={CX} cy={CY} r={R_ZODIAC_INNER} fill="none" stroke="rgba(124,58,237,0.3)" strokeWidth="0.5" />
          <circle cx={CX} cy={CY} r={R_HOUSE_INNER}  fill="none" stroke="rgba(124,58,237,0.2)" strokeWidth="0.5" />
          <circle cx={CX} cy={CY} r={R_ASPECT_OUTER} fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="0.5" />

          {renderZodiacRing()}
          {renderHouses()}
          {renderAspects()}
          {renderPlanets()}

          {/* Center label */}
          {birthInfo && (
            <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central"
              fontSize="9" fill="rgba(196,181,253,0.4)" fontFamily="sans-serif">
              {birthInfo}
            </text>
          )}
        </svg>
      </Box>

      {/* Aspect legend */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 1.5, px: 1 }}>
        {[
          { key: 'conjunction', label: 'Соединение' },
          { key: 'opposition',  label: 'Оппозиция' },
          { key: 'trine',       label: 'Трин' },
          { key: 'square',      label: 'Квадрат' },
          { key: 'sextile',     label: 'Секстиль' },
        ].map(({ key, label }) => {
          const style = ASPECT_STYLES[key];
          return (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{
                width: 24, height: 2,
                background: style.color,
                borderTop: style.dash !== 'none' ? `2px dashed ${style.color}` : `2px solid ${style.color}`,
              }} />
              <Box component="span" sx={{ fontSize: 11, color: 'text.secondary' }}>{label}</Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
