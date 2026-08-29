import React, { useState } from 'react';
import { BodyRegion, BodyView, BiologicalSex } from '../types';
import { BODY_REGIONS_CONFIG } from '../data/symptomsData';
import { RotateCw, Sparkles, CheckCircle2, User, Info, Layers } from 'lucide-react';

interface BodyMapProps {
  selectedRegion: BodyRegion | null;
  onSelectRegion: (region: BodyRegion) => void;
  selectedSymptomRegionCounts: Record<BodyRegion, number>;
  language: 'en' | 'hi';
  biologicalSex: BiologicalSex;
  onToggleSex?: (sex: BiologicalSex) => void;
}

export const BodyMap: React.FC<BodyMapProps> = ({
  selectedRegion,
  onSelectRegion,
  selectedSymptomRegionCounts,
  language,
  biologicalSex,
  onToggleSex,
}) => {
  const [view, setView] = useState<BodyView>('front');
  const [hoveredRegion, setHoveredRegion] = useState<BodyRegion | null>(null);

  const isHindi = language === 'hi';

  const getRegionStyle = (region: BodyRegion) => {
    const isSelected = selectedRegion === region;
    const isHovered = hoveredRegion === region;
    const count = selectedSymptomRegionCounts[region] || 0;

    let fill = '#CBD5E1'; // slate-300
    let stroke = '#94A3B8'; // slate-400
    let strokeWidth = '1.5';

    if (count > 0) {
      fill = '#60A5FA'; // blue-400
      stroke = '#1D4ED8'; // blue-700
      strokeWidth = '2.5';
    }

    if (isSelected) {
      fill = '#3B82F6'; // blue-500
      stroke = '#1E3A8A'; // blue-900
      strokeWidth = '3';
    } else if (isHovered) {
      fill = '#93C5FD'; // blue-300
      stroke = '#2563EB'; // blue-600
    }

    return {
      fill,
      stroke,
      strokeWidth,
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer',
    };
  };

  const handleRegionClick = (region: BodyRegion) => {
    onSelectRegion(region);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col h-full">
      {/* Top Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <User className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {isHindi ? 'इंटरएक्टिव शारीरिक मानचित्र' : 'Interactive Anatomical Body Map'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHindi ? 'शरीर के उस अंग पर क्लिक करें जहां लक्षण महसूस हो रहे हैं' : 'Click on any body part where you are experiencing symptoms'}
          </p>
        </div>

        {/* View & Model Toggles */}
        <div className="flex items-center gap-2">
          {/* Front / Back Toggle */}
          <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => setView('front')}
              className={`px-3 py-1 rounded-md transition-all ${
                view === 'front'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isHindi ? 'आगे (Front)' : 'Front'}
            </button>
            <button
              type="button"
              onClick={() => setView('back')}
              className={`px-3 py-1 rounded-md transition-all ${
                view === 'back'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isHindi ? 'पीछे (Back)' : 'Back'}
            </button>
          </div>

          {/* Sex Silhouette Selector if callback provided */}
          {onToggleSex && (
            <div className="hidden sm:inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => onToggleSex('male')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  biologicalSex === 'male'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHindi ? 'पुरुष' : 'Male'}
              </button>
              <button
                type="button"
                onClick={() => onToggleSex('female')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  biologicalSex === 'female'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHindi ? 'महिला' : 'Female'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Body Map SVG Visualization Stage */}
      <div className="relative flex-1 flex items-center justify-center my-3 min-h-[360px] sm:min-h-[420px] bg-radial from-blue-50/40 via-slate-50/60 to-slate-100/80 rounded-xl border border-slate-100 p-2 overflow-hidden select-none">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />

        {/* Anatomical SVG Body */}
        <svg
          viewBox="0 0 340 540"
          className="w-full max-w-[280px] sm:max-w-[320px] max-h-[480px] h-auto drop-shadow-md z-10"
        >
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="selectedGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>

          {/* FRONT VIEW ANATOMICAL SILHOUETTES */}
          {view === 'front' && (
            <g id="body-front-group">
              {/* HEAD & CRANIUM */}
              <g
                id="region-head-front"
                onClick={() => handleRegionClick('head')}
                onMouseEnter={() => setHoveredRegion('head')}
                onMouseLeave={() => setHoveredRegion(null)}
                className="group transition-transform"
              >
                <path
                  d="M 170 30 C 145 30 135 50 135 75 C 135 100 148 115 170 115 C 192 115 205 100 205 75 C 205 50 195 30 170 30 Z"
                  style={getRegionStyle('head')}
                />
                {/* Visual landmark: Forehead & Brain contour */}
                <path
                  d="M 148 55 C 158 45 182 45 192 55"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </g>

              {/* EYES & ENT (FACIAL / NOSE / THROAT ZONE) */}
              <g
                id="region-eyes-ent"
                onClick={() => handleRegionClick('eyes_ent')}
                onMouseEnter={() => setHoveredRegion('eyes_ent')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <circle
                  cx="158"
                  cy="70"
                  r="4.5"
                  style={getRegionStyle('eyes_ent')}
                />
                <circle
                  cx="182"
                  cy="70"
                  r="4.5"
                  style={getRegionStyle('eyes_ent')}
                />
                <path
                  d="M 167 76 L 170 86 L 173 86"
                  fill="none"
                  stroke={selectedRegion === 'eyes_ent' ? '#1E3A8A' : '#475569'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 163 94 C 167 98 173 98 177 94"
                  fill="none"
                  stroke={selectedRegion === 'eyes_ent' ? '#1E3A8A' : '#475569'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>

              {/* NECK & THYROID */}
              <g
                id="region-neck-front"
                onClick={() => handleRegionClick('neck')}
                onMouseEnter={() => setHoveredRegion('neck')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d="M 158 114 L 154 135 C 162 138 178 138 186 135 L 182 114 Z"
                  style={getRegionStyle('neck')}
                />
                {/* Adam's apple / Thyroid notch */}
                <circle
                  cx="170"
                  cy="124"
                  r="2"
                  fill="#94A3B8"
                />
              </g>

              {/* CHEST & LUNGS / HEART */}
              <g
                id="region-chest-front"
                onClick={() => handleRegionClick('chest')}
                onMouseEnter={() => setHoveredRegion('chest')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d={
                    biologicalSex === 'female'
                      ? "M 154 135 L 132 152 C 122 172 120 195 125 210 C 145 220 195 220 215 210 C 220 195 218 172 208 152 L 186 135 C 178 138 162 138 154 135 Z"
                      : "M 154 135 L 126 150 C 118 170 118 190 124 210 C 145 218 195 218 216 210 C 222 190 222 170 214 150 L 186 135 C 178 138 162 138 154 135 Z"
                  }
                  style={getRegionStyle('chest')}
                />
                {/* Sternum / Pectoral guide */}
                <line x1="170" y1="142" x2="170" y2="195" stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                <path d="M 142 165 C 152 172 164 170 170 166 C 176 170 188 172 198 165" fill="none" stroke="#64748B" strokeWidth="1" opacity="0.4" />
              </g>

              {/* ABDOMEN & DIGESTIVE */}
              <g
                id="region-abdomen-front"
                onClick={() => handleRegionClick('abdomen')}
                onMouseEnter={() => setHoveredRegion('abdomen')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d="M 124 210 C 122 235 124 260 128 280 C 148 290 192 290 212 280 C 216 260 218 235 216 210 C 195 218 145 218 124 210 Z"
                  style={getRegionStyle('abdomen')}
                />
                {/* Umbilicus / Navel */}
                <circle cx="170" cy="252" r="2.5" fill="#475569" opacity="0.6" />
                {/* Quadrants guide line */}
                <path d="M 150 230 C 170 234 190 230 190 230" fill="none" stroke="#64748B" strokeWidth="0.8" opacity="0.4" />
              </g>

              {/* PELVIS, GROIN & HIPS */}
              <g
                id="region-pelvis-front"
                onClick={() => handleRegionClick('pelvis')}
                onMouseEnter={() => setHoveredRegion('pelvis')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d="M 128 280 C 126 298 132 320 148 335 L 170 335 L 192 335 C 208 320 214 298 212 280 C 192 290 148 290 128 280 Z"
                  style={getRegionStyle('pelvis')}
                />
                {/* Inguinal creases */}
                <path d="M 144 295 L 164 324" fill="none" stroke="#64748B" strokeWidth="1" opacity="0.4" />
                <path d="M 196 295 L 176 324" fill="none" stroke="#64748B" strokeWidth="1" opacity="0.4" />
              </g>

              {/* LEFT ARM & HAND (Viewer's Left = anatomical Right) */}
              <g
                id="region-arms-left"
                onClick={() => handleRegionClick('arms_hands')}
                onMouseEnter={() => setHoveredRegion('arms_hands')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* Shoulder & Bicep */}
                <path
                  d="M 126 150 L 102 165 C 92 185 90 220 92 245 L 115 245 C 118 215 120 185 125 160 Z"
                  style={getRegionStyle('arms_hands')}
                />
                {/* Forearm & Hand */}
                <path
                  d="M 92 245 L 85 305 C 80 325 78 345 76 360 C 82 364 92 360 96 350 L 108 305 L 115 245 Z"
                  style={getRegionStyle('arms_hands')}
                />
              </g>

              {/* RIGHT ARM & HAND (Viewer's Right = anatomical Left) */}
              <g
                id="region-arms-right"
                onClick={() => handleRegionClick('arms_hands')}
                onMouseEnter={() => setHoveredRegion('arms_hands')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* Shoulder & Bicep */}
                <path
                  d="M 214 150 L 238 165 C 248 185 250 220 248 245 L 225 245 C 222 215 220 185 215 160 Z"
                  style={getRegionStyle('arms_hands')}
                />
                {/* Forearm & Hand */}
                <path
                  d="M 248 245 L 255 305 C 260 325 262 345 264 360 C 258 364 248 360 244 350 L 232 305 L 225 245 Z"
                  style={getRegionStyle('arms_hands')}
                />
              </g>

              {/* LEFT LEG & FOOT (Viewer's Left) */}
              <g
                id="region-legs-left"
                onClick={() => handleRegionClick('legs_feet')}
                onMouseEnter={() => setHoveredRegion('legs_feet')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* Thigh */}
                <path
                  d="M 148 335 L 138 410 C 142 425 158 425 162 410 L 168 335 Z"
                  style={getRegionStyle('legs_feet')}
                />
                {/* Knee cap */}
                <circle cx="150" cy="415" r="7" style={getRegionStyle('legs_feet')} />
                {/* Shin / Calf & Foot */}
                <path
                  d="M 143 422 L 140 485 C 130 495 125 508 122 516 C 135 520 155 520 158 514 L 157 485 L 157 422 Z"
                  style={getRegionStyle('legs_feet')}
                />
              </g>

              {/* RIGHT LEG & FOOT (Viewer's Right) */}
              <g
                id="region-legs-right"
                onClick={() => handleRegionClick('legs_feet')}
                onMouseEnter={() => setHoveredRegion('legs_feet')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* Thigh */}
                <path
                  d="M 192 335 L 202 410 C 198 425 182 425 178 410 L 172 335 Z"
                  style={getRegionStyle('legs_feet')}
                />
                {/* Knee cap */}
                <circle cx="190" cy="415" r="7" style={getRegionStyle('legs_feet')} />
                {/* Shin / Calf & Foot */}
                <path
                  d="M 197 422 L 200 485 C 210 495 215 508 218 516 C 205 520 185 520 182 514 L 183 485 L 183 422 Z"
                  style={getRegionStyle('legs_feet')}
                />
              </g>
            </g>
          )}

          {/* BACK VIEW ANATOMICAL SILHOUETTES */}
          {view === 'back' && (
            <g id="body-back-group">
              {/* OCCIPITAL / BACK OF HEAD */}
              <g
                id="region-head-back"
                onClick={() => handleRegionClick('head')}
                onMouseEnter={() => setHoveredRegion('head')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d="M 170 30 C 145 30 135 50 135 75 C 135 100 148 115 170 115 C 192 115 205 100 205 75 C 205 50 195 30 170 30 Z"
                  style={getRegionStyle('head')}
                />
                {/* Occipital base curve */}
                <path d="M 152 95 C 160 102 180 102 188 95" fill="none" stroke="#64748B" strokeWidth="1.2" opacity="0.5" />
              </g>

              {/* CERVICAL / BACK OF NECK */}
              <g
                id="region-neck-back"
                onClick={() => handleRegionClick('neck')}
                onMouseEnter={() => setHoveredRegion('neck')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d="M 158 114 L 152 135 C 162 138 178 138 188 135 L 182 114 Z"
                  style={getRegionStyle('neck')}
                />
                {/* C7 Vertebra Prominens node */}
                <circle cx="170" cy="132" r="3" fill="#64748B" opacity="0.6" />
              </g>

              {/* UPPER BACK & SPINE (Thoracic & Lumbar) */}
              <g
                id="region-spine-back"
                onClick={() => handleRegionClick('spine_back')}
                onMouseEnter={() => setHoveredRegion('spine_back')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* Upper back & Scapular region */}
                <path
                  d="M 152 135 L 126 150 C 118 175 120 215 125 240 C 145 245 195 245 215 240 C 220 215 222 175 214 150 L 188 135 Z"
                  style={getRegionStyle('spine_back')}
                />
                {/* Lower Back / Lumbar Spine */}
                <path
                  d="M 125 240 C 124 260 126 278 130 290 C 150 295 190 295 210 290 C 214 278 216 260 215 240 Z"
                  style={getRegionStyle('spine_back')}
                />
                {/* Vertebral column midline line */}
                <line x1="170" y1="135" x2="170" y2="295" stroke="#334155" strokeWidth="2.5" strokeDasharray="5 3" opacity="0.6" />
                {/* Left Scapula Wing */}
                <path d="M 140 160 C 148 160 152 185 145 195 C 138 190 135 175 140 160 Z" fill="none" stroke="#64748B" strokeWidth="1" opacity="0.5" />
                {/* Right Scapula Wing */}
                <path d="M 200 160 C 192 160 188 185 195 195 C 202 190 205 175 200 160 Z" fill="none" stroke="#64748B" strokeWidth="1" opacity="0.5" />
              </g>

              {/* GLUTEAL / LOWER PELVIS BACK */}
              <g
                id="region-pelvis-back"
                onClick={() => handleRegionClick('pelvis')}
                onMouseEnter={() => setHoveredRegion('pelvis')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d="M 130 290 C 128 312 134 338 152 345 C 164 345 168 335 170 330 C 172 335 176 345 188 345 C 206 338 212 312 210 290 Z"
                  style={getRegionStyle('pelvis')}
                />
                <path d="M 170 295 L 170 330" fill="none" stroke="#64748B" strokeWidth="1.5" opacity="0.5" />
              </g>

              {/* BACK OF ARMS (Left & Right) */}
              <g
                id="region-arms-back-left"
                onClick={() => handleRegionClick('arms_hands')}
                onMouseEnter={() => setHoveredRegion('arms_hands')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d="M 126 150 L 102 165 C 92 185 90 220 92 245 L 115 245 L 85 305 C 80 325 78 345 76 360 C 82 364 92 360 96 350 L 108 305 L 125 240 Z"
                  style={getRegionStyle('arms_hands')}
                />
              </g>
              <g
                id="region-arms-back-right"
                onClick={() => handleRegionClick('arms_hands')}
                onMouseEnter={() => setHoveredRegion('arms_hands')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d="M 214 150 L 238 165 C 248 185 250 220 248 245 L 225 245 L 255 305 C 260 325 262 345 264 360 C 258 364 248 360 244 350 L 232 305 L 215 240 Z"
                  style={getRegionStyle('arms_hands')}
                />
              </g>

              {/* BACK OF LEGS (Hamstrings, Calves, Achilles & Heels) */}
              <g
                id="region-legs-back-left"
                onClick={() => handleRegionClick('legs_feet')}
                onMouseEnter={() => setHoveredRegion('legs_feet')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d="M 152 345 L 138 410 C 138 430 142 450 140 485 C 134 498 128 510 126 518 C 138 520 156 520 158 514 L 157 485 L 160 410 L 168 345 Z"
                  style={getRegionStyle('legs_feet')}
                />
                {/* Popliteal fossa (back of knee) */}
                <line x1="142" y1="412" x2="158" y2="412" stroke="#64748B" strokeWidth="1" opacity="0.5" />
              </g>
              <g
                id="region-legs-back-right"
                onClick={() => handleRegionClick('legs_feet')}
                onMouseEnter={() => setHoveredRegion('legs_feet')}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <path
                  d="M 188 345 L 202 410 C 202 430 198 450 200 485 C 206 498 212 510 214 518 C 202 520 184 520 182 514 L 183 485 L 180 410 L 172 345 Z"
                  style={getRegionStyle('legs_feet')}
                />
                {/* Popliteal fossa (back of knee) */}
                <line x1="182" y1="412" x2="198" y2="412" stroke="#64748B" strokeWidth="1" opacity="0.5" />
              </g>
            </g>
          )}
        </svg>

        {/* Hover / Active floating badge indicator */}
        {(hoveredRegion || selectedRegion) && (
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs shadow-md border border-slate-700 flex items-center gap-2 pointer-events-none z-20">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-semibold">
              {(() => {
                const r = hoveredRegion || selectedRegion;
                const config = BODY_REGIONS_CONFIG.find((c) => c.id === r);
                return isHindi ? config?.hindiLabel : config?.label;
              })()}
            </span>
            {(() => {
              const r = hoveredRegion || selectedRegion;
              const count = r ? selectedSymptomRegionCounts[r] || 0 : 0;
              if (count > 0) {
                return (
                  <span className="bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
                    {count} {isHindi ? 'लक्षण' : 'selected'}
                  </span>
                );
              }
              return null;
            })()}
          </div>
        )}
      </div>

      {/* Whole Body / Systemic Fast Selector Pill */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onSelectRegion('skin_general')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
            selectedRegion === 'skin_general'
              ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="p-1 bg-white rounded-md text-blue-600 border border-slate-200">
              <Layers className="w-3.5 h-3.5" />
            </span>
            <span>
              {isHindi ? 'पूरे शरीर के सामान्य लक्षण (बुखार, कमजोरी, चकत्ते)' : 'Whole Body / Systemic (Fever, Fatigue, Rashes)'}
            </span>
          </div>
          {selectedSymptomRegionCounts['skin_general'] ? (
            <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
              {selectedSymptomRegionCounts['skin_general']}
            </span>
          ) : (
            <span className="text-slate-400 text-[10px]">
              {isHindi ? 'चुनें' : 'Select'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
