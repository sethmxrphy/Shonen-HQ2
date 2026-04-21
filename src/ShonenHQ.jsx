import { useState, useEffect, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;600;700&display=swap');
  @keyframes flicker { 0%,100%{opacity:1;text-shadow:0 0 10px #FF6B00,0 0 20px #FF6B00} 50%{opacity:0.85;text-shadow:0 0 5px #FF6B00} }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 40%{transform:translateX(4px)} 60%{transform:translateX(-2px)} 80%{transform:translateX(2px)} }
  @keyframes popIn { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes glow { 0%,100%{box-shadow:0 0 8px #FF6B0066} 50%{box-shadow:0 0 20px #FF6B00AA,0 0 40px #FF6B0044} }
  @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
  @keyframes auraFloat { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.08);opacity:1} }
  @keyframes sparkle { 0%{opacity:0;transform:scale(0) rotate(0deg)} 50%{opacity:1;transform:scale(1) rotate(180deg)} 100%{opacity:0;transform:scale(0) rotate(360deg)} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes weaponGlow { 0%,100%{filter:drop-shadow(0 0 2px #FF6B00)} 50%{filter:drop-shadow(0 0 8px #FF6B00) drop-shadow(0 0 16px #FFB347)} }
  @keyframes legendAura { 0%,100%{transform:scale(1) rotate(0deg);opacity:0.8} 50%{transform:scale(1.12) rotate(180deg);opacity:1} }
  @keyframes slideUp { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes scarfWave { 0%,100%{d:path("M 0 0 Q 8 6 4 14 Q 0 22 6 28")} 50%{d:path("M 0 0 Q 10 4 6 12 Q 2 20 8 28")} }
  .stat-bar { transition: width 0.8s cubic-bezier(.4,0,.2,1); }
  .nav-btn:hover { background: rgba(255,107,0,0.12) !important; }
  .log-btn:active { animation: shake 0.3s ease; }
  .ninja-float { animation: float 3s ease-in-out infinite; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
`;

// ── NINJA TIERS ───────────────────────────────────────────────────────────────
const NINJA_TIERS = [
  { minLevel:1,  name:"Genin",  rankColor:"#9CA3AF", suitColor:"#1A1A2E", maskColor:"#111122", trimColor:"#4A4A6A", eyeColor:"#9CA3AF", hasScarf:false, hasWeapon:false, hasDual:false, hasAura:false, particles:false, aura:null },
  { minLevel:3,  name:"Chunin", rankColor:"#3B82F6", suitColor:"#0F1E3A", maskColor:"#0A1528", trimColor:"#3B82F6", eyeColor:"#60A5FA", hasScarf:false, hasWeapon:true,  hasDual:false, hasAura:false, particles:false, aura:null },
  { minLevel:6,  name:"Jonin",  rankColor:"#8B5CF6", suitColor:"#1A1040", maskColor:"#110A30", trimColor:"#8B5CF6", eyeColor:"#A78BFA", hasScarf:true,  hasWeapon:true,  hasDual:false, hasAura:true,  particles:false, aura:"#8B5CF633" },
  { minLevel:10, name:"ANBU",   rankColor:"#EF4444", suitColor:"#1A0A0A", maskColor:"#0A0505", trimColor:"#EF4444", eyeColor:"#FCA5A5", hasScarf:true,  hasWeapon:true,  hasDual:false, hasAura:true,  particles:true,  aura:"#EF444433" },
  { minLevel:15, name:"Kage",   rankColor:"#F59E0B", suitColor:"#1C0A00", maskColor:"#120600", trimColor:"#F59E0B", eyeColor:"#FDE68A", hasScarf:true,  hasWeapon:true,  hasDual:true,  hasAura:true,  particles:true,  aura:"#F59E0B44" },
  { minLevel:20, name:"LEGEND", rankColor:"#FF6B00", suitColor:"#0A0000", maskColor:"#050000", trimColor:"#FF6B00", eyeColor:"#FF6B00", hasScarf:true,  hasWeapon:true,  hasDual:true,  hasAura:true,  particles:true,  aura:"#FF6B0066" },
];

function getNinjaTier(lvl) {
  let t = NINJA_TIERS[0];
  for (const tier of NINJA_TIERS) { if (lvl >= tier.minLevel) t = tier; }
  return t;
}

// ── NINJA AVATAR ──────────────────────────────────────────────────────────────
function NinjaAvatar({ level, size = 160 }) {
  const tier = getNinjaTier(level);
  const s = size, cx = s / 2;

  return (
    <div style={{ position:"relative", width:s, height:s, margin:"0 auto" }}>
      {/* Aura rings */}
      {level >= 15 && <div style={{ position:"absolute", inset:-10, borderRadius:"50%", border:`1.5px solid ${tier.rankColor}`, animation:"legendAura 2s ease-in-out infinite", opacity:0.4 }}/>}
      {level >= 20 && <div style={{ position:"absolute", inset:-22, borderRadius:"50%", border:`1px solid ${tier.rankColor}`, animation:"legendAura 3s ease-in-out infinite reverse", opacity:0.2 }}/>}
      {tier.hasAura && <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:`radial-gradient(ellipse at 50% 65%, ${tier.aura} 0%, transparent 70%)`, animation:"auraFloat 2.8s ease-in-out infinite" }}/>}
      {tier.particles && [0,1,2,3,4].map(i => (
        <div key={i} style={{ position:"absolute", width:3, height:3, borderRadius:"50%", background:tier.rankColor, top:`${20+i*12}%`, left:i%2===0?`${4+i*2}%`:`${76+i*2}%`, animation:`sparkle ${1.6+i*0.35}s ease-in-out infinite`, animationDelay:`${i*0.28}s`, boxShadow:`0 0 5px ${tier.rankColor}` }}/>
      ))}

      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ position:"relative", zIndex:2 }}>
        <defs>
          <filter id="shadow"><feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#00000055"/></filter>
          <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        {/* ── SCARF (behind body, Jonin+) ── */}
        {tier.hasScarf && (
          <g filter="url(#shadow)">
            {/* Left tail */}
            <path d={`M ${cx-6} ${s*0.35} C ${cx-14} ${s*0.42} ${cx-18} ${s*0.58} ${cx-14} ${s*0.72} C ${cx-10} ${s*0.82} ${cx-16} ${s*0.88} ${cx-12} ${s*0.95}`}
              stroke={tier.rankColor} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.85"
            />
            {/* Right tail — shorter */}
            <path d={`M ${cx+6} ${s*0.35} C ${cx+10} ${s*0.42} ${cx+8} ${s*0.52} ${cx+12} ${s*0.6}`}
              stroke={tier.rankColor} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7"
            />
            {/* Scarf wrap around neck */}
            <ellipse cx={cx} cy={s*0.355} rx={s*0.1} ry={s*0.03} fill={tier.rankColor} opacity="0.9"/>
          </g>
        )}

        {/* ── LEGS ── */}
        <path d={`M ${cx-13} ${s*0.68} L ${cx-15} ${s*0.95} L ${cx-6} ${s*0.95} L ${cx-5} ${s*0.68} Z`}
          fill={tier.suitColor} filter="url(#shadow)"
        />
        <path d={`M ${cx+5} ${s*0.68} L ${cx+6} ${s*0.95} L ${cx+15} ${s*0.95} L ${cx+13} ${s*0.68} Z`}
          fill={tier.suitColor} filter="url(#shadow)"
        />
        {/* Boot wraps */}
        <line x1={cx-15} y1={s*0.87} x2={cx-6} y2={s*0.87} stroke={tier.trimColor} strokeWidth="1.2" opacity="0.5"/>
        <line x1={cx+6}  y1={s*0.87} x2={cx+15} y2={s*0.87} stroke={tier.trimColor} strokeWidth="1.2" opacity="0.5"/>
        {/* Boot toe */}
        <ellipse cx={cx-10} cy={s*0.955} rx={5} ry={2} fill={tier.suitColor}/>
        <ellipse cx={cx+10} cy={s*0.955} rx={5} ry={2} fill={tier.suitColor}/>

        {/* ── TORSO — shorter ── */}
        <path d={`M ${cx-15} ${s*0.42} C ${cx-16} ${s*0.37} ${cx-12} ${s*0.34} ${cx} ${s*0.34} C ${cx+12} ${s*0.34} ${cx+16} ${s*0.37} ${cx+15} ${s*0.42} L ${cx+13} ${s*0.68} L ${cx-13} ${s*0.68} Z`}
          fill={tier.suitColor} filter="url(#shadow)"
        />
        {/* Chest panel */}
        <path d={`M ${cx-9} ${s*0.43} C ${cx-9} ${s*0.40} ${cx} ${s*0.38} ${cx+9} ${s*0.43} L ${cx+7} ${s*0.61} L ${cx-7} ${s*0.61} Z`}
          fill={tier.maskColor} stroke={tier.trimColor} strokeWidth="0.4" opacity="0.8"
        />
        {/* Rank symbol */}
        {level >= 6 && (
          <text x={cx} y={s*0.545} textAnchor="middle" fontSize={s*0.072} fill={tier.rankColor} opacity="0.8" fontFamily="serif" fontWeight="bold">
            {level>=20?"卍":level>=15?"忍":level>=10?"闇":"忍"}
          </text>
        )}
        {/* Belt */}
        <rect x={cx-13} y={s*0.665} width={26} height={s*0.022} rx={2} fill={tier.trimColor} opacity="0.8"/>
        <rect x={cx-3.5} y={s*0.658} width={7} height={s*0.032} rx={1.5} fill={tier.trimColor} opacity="0.9"/>

        {/* ── LEFT ARM — symmetric ── */}
        <path d={`M ${cx-13} ${s*0.44} C ${cx-19} ${s*0.45} ${cx-25} ${s*0.54} ${cx-23} ${s*0.66} L ${cx-17} ${s*0.66} C ${cx-16} ${s*0.53} ${cx-11} ${s*0.47} ${cx-9} ${s*0.44} Z`}
          fill={tier.suitColor}
        />
        {/* Left glove */}
        <ellipse cx={cx-20} cy={s*0.675} rx={4.5} ry={3} fill={tier.maskColor} stroke={tier.trimColor} strokeWidth="0.4"/>

        {/* ── RIGHT ARM — matching left ── */}
        <path d={`M ${cx+13} ${s*0.44} C ${cx+19} ${s*0.45} ${cx+25} ${s*0.54} ${cx+23} ${s*0.66} L ${cx+17} ${s*0.66} C ${cx+16} ${s*0.53} ${cx+11} ${s*0.47} ${cx+9} ${s*0.44} Z`}
          fill={tier.suitColor}
        />
        {/* Right glove */}
        <ellipse cx={cx+20} cy={s*0.675} rx={4.5} ry={3} fill={tier.maskColor} stroke={tier.trimColor} strokeWidth="0.4"/>

        {/* Arm trim lines */}
        <line x1={cx-24} y1={s*0.57} x2={cx-16} y2={s*0.55} stroke={tier.trimColor} strokeWidth="1" opacity="0.35" strokeLinecap="round"/>
        <line x1={cx+16} y1={s*0.55} x2={cx+24} y2={s*0.57} stroke={tier.trimColor} strokeWidth="1" opacity="0.35" strokeLinecap="round"/>

        {/* ── NECK ── */}
        <rect x={cx-5} y={s*0.325} width={10} height={s*0.04} rx={2} fill={tier.maskColor}/>

        {/* ── HEAD ── */}
        {/* Head shape */}
        <ellipse cx={cx} cy={s*0.245} rx={s*0.125} ry={s*0.135} fill={tier.suitColor} filter="url(#shadow)"/>

        {/* ── FULL NINJA MASK (all levels) ── */}
        {/* Upper mask — forehead/top */}
        <path d={`M ${cx-s*0.125} ${s*0.225} Q ${cx-s*0.125} ${s*0.11} ${cx} ${s*0.108} Q ${cx+s*0.125} ${s*0.11} ${cx+s*0.125} ${s*0.225}`}
          fill={tier.maskColor}
        />
        {/* Lower mask — covers nose/mouth */}
        <path d={`M ${cx-s*0.12} ${s*0.255} Q ${cx-s*0.12} ${s*0.33} ${cx} ${s*0.335} Q ${cx+s*0.12} ${s*0.33} ${cx+s*0.12} ${s*0.255}`}
          fill={tier.maskColor}
        />
        {/* Mask seam line */}
        <line x1={cx-s*0.12} y1={s*0.257} x2={cx+s*0.12} y2={s*0.257} stroke={tier.trimColor} strokeWidth="0.5" opacity="0.3"/>

        {/* ── EYES (always glowing through mask) ── */}
        <ellipse cx={cx-s*0.042} cy={s*0.245} rx={s*0.028} ry={s*0.018}
          fill={tier.eyeColor} style={{filter:`drop-shadow(0 0 ${level>=10?5:2}px ${tier.eyeColor})`}}
        />
        <ellipse cx={cx+s*0.042} cy={s*0.245} rx={s*0.028} ry={s*0.018}
          fill={tier.eyeColor} style={{filter:`drop-shadow(0 0 ${level>=10?5:2}px ${tier.eyeColor})`}}
        />
        {/* Eye shine */}
        <ellipse cx={cx-s*0.036} cy={s*0.241} rx={s*0.008} ry={s*0.006} fill="#fff" opacity="0.5"/>
        <ellipse cx={cx+s*0.048} cy={s*0.241} rx={s*0.008} ry={s*0.006} fill="#fff" opacity="0.5"/>

        {/* Battle scar — visible on mask, Jonin+ */}
        {level >= 6 && (
          <line x1={cx-s*0.07} y1={s*0.215} x2={cx-s*0.025} y2={s*0.278}
            stroke={tier.rankColor} strokeWidth="0.9" opacity="0.5" strokeLinecap="round"
          />
        )}

        {/* ── HEADBAND ── */}
        {level < 15 ? (
          /* Standard headband */
          <>
            <rect x={cx-s*0.13} y={s*0.185} width={s*0.26} height={s*0.044} rx={3.5}
              fill={tier.trimColor} opacity="0.9"
            />
            {/* Metal plate */}
            <rect x={cx-s*0.07} y={s*0.189} width={s*0.14} height={s*0.034} rx={2}
              fill={tier.maskColor} stroke={tier.rankColor} strokeWidth="0.6"
            />
            {/* Plate symbol */}
            <text x={cx} y={s*0.216} textAnchor="middle" fontSize={s*0.048}
              fill={tier.rankColor} opacity="0.9"
            >{level>=10?"闇":level>=6?"忍":level>=3?"火":"木"}</text>
            {/* Bandana tails */}
            <path d={`M ${cx+s*0.13} ${s*0.2} C ${cx+s*0.16} ${s*0.215} ${cx+s*0.175} ${s*0.27} ${cx+s*0.155} ${s*0.33}`}
              stroke={tier.trimColor} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.8"
            />
          </>
        ) : (
          /* Kage hat — level 15+ */
          <>
            <ellipse cx={cx} cy={s*0.163} rx={s*0.2} ry={s*0.036} fill={tier.suitColor} stroke={tier.rankColor} strokeWidth="0.5"/>
            <path d={`M ${cx-s*0.085} ${s*0.163} L ${cx} ${s*0.075} L ${cx+s*0.085} ${s*0.163}`}
              fill={tier.suitColor} stroke={tier.rankColor} strokeWidth="0.5"
            />
            <line x1={cx-s*0.2} y1={s*0.163} x2={cx+s*0.2} y2={s*0.163} stroke={tier.rankColor} strokeWidth="0.8" opacity="0.5"/>
            <text x={cx} y={s*0.147} textAnchor="middle" fontSize={s*0.044} fill={tier.rankColor} opacity="0.8">影</text>
          </>
        )}

        {/* ── WEAPONS ── */}
        {tier.hasWeapon && (
          <g style={{animation:"weaponGlow 2.2s ease-in-out infinite"}}>
            {level < 10 ? (
              /* Kunai — Chunin */
              <g transform={`translate(${cx+27},${s*0.58}) rotate(22)`}>
                <path d={`M 0 ${-s*0.13} L -1.4 ${-s*0.01} L 0 ${s*0.018} L 1.4 ${-s*0.01} Z`}
                  fill={tier.trimColor} style={{filter:`drop-shadow(0 0 2px ${tier.rankColor})`}}
                />
                <rect x={-1} y={s*0.018} width={2} height={s*0.035} rx={0.5} fill="#3A2A14"/>
                <rect x={-2} y={s*0.053} width={4} height={s*0.018} rx={1} fill="#5A4020"/>
                <rect x={-0.8} y={s*0.071} width={1.6} height={s*0.04} rx={0.5} fill="#4A3520"/>
              </g>
            ) : level < 15 ? (
              /* Katana — ANBU */
              <g transform={`translate(${cx+19},${s*0.33}) rotate(26)`}>
                <path d={`M 0 ${-s*0.3} L -1.3 ${-s*0.01} L 1.3 ${-s*0.01} Z`}
                  fill={tier.trimColor} style={{filter:`drop-shadow(0 0 3px ${tier.rankColor}55)`}}
                />
                <line x1={-0.3} y1={-s*0.3} x2={-0.3} y2={-s*0.01} stroke="#fff" strokeWidth="0.35" opacity="0.35"/>
                <ellipse cx={0} cy={-s*0.01} rx={4.5} ry={2.2} fill="#1A0A00" stroke={tier.rankColor} strokeWidth="0.5"/>
                <rect x={-1.6} y={-s*0.01} width={3.2} height={s*0.075} rx={1.4} fill="#2A1408"/>
                <line x1={-1.6} y1={s*0.022} x2={1.6} y2={s*0.022} stroke={tier.rankColor} strokeWidth="0.4" opacity="0.35"/>
                <line x1={-1.6} y1={s*0.046} x2={1.6} y2={s*0.046} stroke={tier.rankColor} strokeWidth="0.4" opacity="0.35"/>
              </g>
            ) : (
              /* Legendary dual blades — Kage/Legend */
              <>
                <g transform={`translate(${cx+21},${s*0.31}) rotate(24)`}>
                  <path d={`M 0 ${-s*0.34} L -1.6 ${-s*0.01} L 1.6 ${-s*0.01} Z`}
                    fill={tier.trimColor} style={{filter:`drop-shadow(0 0 5px ${tier.rankColor})`}}
                  />
                  <line x1={0} y1={-s*0.34} x2={0} y2={-s*0.01} stroke="#fff" strokeWidth="0.4" opacity="0.3"/>
                  <ellipse cx={0} cy={-s*0.01} rx={5} ry={2.2} fill="#0A0500" stroke={tier.rankColor} strokeWidth="0.5"/>
                  <rect x={-1.8} y={-s*0.01} width={3.6} height={s*0.072} rx={1.4} fill="#100500"/>
                </g>
                {tier.hasDual && (
                  <g transform={`translate(${cx-21},${s*0.36}) rotate(-20)`}>
                    <path d={`M 0 ${-s*0.26} L -1.3 ${-s*0.01} L 1.3 ${-s*0.01} Z`}
                      fill={tier.trimColor} opacity="0.88" style={{filter:`drop-shadow(0 0 4px ${tier.rankColor})`}}
                    />
                    <ellipse cx={0} cy={-s*0.01} rx={4} ry={2} fill="#0A0500" stroke={tier.rankColor} strokeWidth="0.5"/>
                    <rect x={-1.5} y={-s*0.01} width={3} height={s*0.062} rx={1.2} fill="#100500"/>
                  </g>
                )}
              </>
            )}
          </g>
        )}

        {/* Orbiting ring — Legend */}
        {level >= 20 && (
          <g style={{transformOrigin:`${cx}px ${s*0.52}px`, animation:"spin 5s linear infinite"}}>
            <ellipse cx={cx} cy={s*0.52} rx={s*0.43} ry={s*0.095}
              fill="none" stroke={tier.rankColor} strokeWidth="1.2"
              strokeDasharray="3 4" opacity="0.45"
            />
          </g>
        )}
      </svg>

      {/* Rank badge */}
      <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", background:tier.rankColor, borderRadius:20, padding:"2px 12px", fontFamily:"'Bebas Neue',sans-serif", fontSize:11, letterSpacing:2, color:"#fff", whiteSpace:"nowrap", boxShadow:`0 0 10px ${tier.rankColor}88`, zIndex:10 }}>
        {tier.name}
      </div>
    </div>
  );
}

// ── STATIC DATA ───────────────────────────────────────────────────────────────
const ARC_NAMES  = ["Origin Arc","Awakening Arc","Ascension Arc","Breakthrough Arc","Hero Arc"];
const ARC_COLORS = ["#6B7280","#3B82F6","#8B5CF6","#F59E0B","#EF4444"];
const ARC_RANKS  = ["E","D","C","B","A"];
const ARC_DESCS  = [
  "The body awakens. Every rep plants a seed.",
  "Muscle memory stirs. The body remembers what it once was.",
  "True growth begins. Others start to notice.",
  "The wall breaks. Strength compounds. Form sharpens.",
  "The peak approaches. Every rep forges the final form.",
];
function buildArcs(startW, goalW) {
  const step = (goalW - startW) / 5;
  return ARC_NAMES.map((name, i) => ({ name, color:ARC_COLORS[i], rank:ARC_RANKS[i], desc:ARC_DESCS[i], range:[Math.round(startW+step*i), Math.round(startW+step*(i+1))] }));
}

const BASE_ATTRS = [
  { key:"str", label:"STRENGTH",   icon:"⚔️", color:"#EF4444", tip:"Lift PRs" },
  { key:"end", label:"ENDURANCE",  icon:"🔥", color:"#F59E0B", tip:"Consistency" },
  { key:"vit", label:"VITALITY",   icon:"💚", color:"#10B981", tip:"Recovery" },
  { key:"agi", label:"AGILITY",    icon:"⚡", color:"#3B82F6", tip:"Mobility" },
  { key:"int", label:"DISCIPLINE", icon:"🧠", color:"#8B5CF6", tip:"Meals logged" },
];

const DAYS = [
  { day:"MON", tag:"PUSH", icon:"🛡️", color:"#3B82F6", focus:"Chest + Shoulders", exercises:["Incline DB Press 4x10-12","Flat DB Press 3x12","Cable Lateral Raises 4x15","Seated OHP 3x10","Cable Face Pulls 3x15","DB Front Raise 3x12"], mobility:["Chest opener 2x30s","Shoulder circles 10x","Cat-cow 10x","Hip flexor 2x30s"] },
  { day:"TUE", tag:"PULL", icon:"⚡", color:"#8B5CF6", focus:"Back + Biceps", exercises:["Lat Pulldown wide 4x10-12","Seated Cable Row 4x12","DB Row 3x12ea","Assisted Pull-Ups 3x8-10","EZ Bar Curl 3x12","Hammer Curl 3x12"], mobility:["Cat-cow 10x","Thread-needle 8ea","Lat stretch 2x30s","Piriformis 30s ea"] },
  { day:"WED", tag:"LEGS", icon:"🦵", color:"#EF4444", focus:"Legs", exercises:["Leg Press 4x12","Romanian DL 4x12","Seated Leg Curl 3x15","Leg Extension 3x15","Hip Abductor 3x20","Glute Bridge 3x15","Calf Raise 4x15"], mobility:["Knee hug 30s x2","Clamshells 15ea","TKE band 2x15","Ham stretch 30s ea"] },
  { day:"THU", tag:"ARMS", icon:"💪", color:"#F59E0B", focus:"Arms + Core", exercises:["Incline DB Curl 3x12","Cable Curl 3x15","OH Tri Extension 3x15","Tri Pushdown rope 3x15","Ab Wheel 3x10","Cable Woodchop 3x12ea","Hanging Knee Raise 3x12","Plank 3x45s"], mobility:["Wrist circles 10x","OH tri stretch 30s","Dead bug 8ea","90/90 hip 30s ea"] },
  { day:"FRI", tag:"FULL", icon:"🏃", color:"#10B981", focus:"Full Body + Mobility", exercises:["Push-Up Variations 3x15ea","RDL 3x12","Goblet Squat 3x12","Cable Row wide 3x12","Arnold Press 3x10","Farmer Carry 3x40m"], mobility:["Worlds greatest 5ea","Thoracic rotation 10ea","Hip flexor 30s ea","Ankle circles 10x"] },
];

const MEALS = [
  { time:"7:00",  name:"Breakfast",   cal:600, pro:45, icon:"🌅", desc:"Overnight oats + 2 eggs + creatine" },
  { time:"10:30", name:"Mid-Morning", cal:500, pro:52, icon:"⚡", desc:"2-scoop whey shake + whole milk + fruit" },
  { time:"1:00",  name:"Lunch",       cal:800, pro:65, icon:"🍚", desc:"Prepped protein + rice + veggies" },
  { time:"3:30",  name:"Pre-Workout", cal:420, pro:22, icon:"🏋️", desc:"Rice cakes + PB + string cheese x2" },
  { time:"6:30",  name:"Dinner",      cal:780, pro:58, icon:"🍽️", desc:"High protein meal — scale portion to goal" },
  { time:"9:00",  name:"Night Gains", cal:280, pro:26, icon:"🌙", desc:"Cottage cheese + frozen fruit + honey" },
];

const GROCERY = {
  costco:    { label:"Costco",      color:"#E31837", badge:"Bi-weekly, Bulk",    items:["Kirkland Chicken Breasts 6-7lb","Ground Beef 93/7 6lb","Salmon Fillets 3lb","Rotisserie Chickens x2","Kirkland Whey Protein 5lb","Large Eggs 5 dozen","Jasmine White Rice 25lb","Old Fashioned Oats 10lb","Pasta 8lb","Greek Yogurt plain 2% 3lb","Cottage Cheese 2% 3lb","Whole Milk 2 gal","Peanut Butter natural 2-pack","Frozen Blueberries 5lb","Frozen Broccoli 5lb","Black Beans canned 8-pack","Honey 5lb jug","Olive Oil 2L"] },
  traderjoes:{ label:"Trader Joes", color:"#C8232C", badge:"Weekly, Fresh",      items:["Just Chicken frozen strips","Organic Ground Turkey","String Cheese 12-pack","Babybel Cheese 9-pack","Beef Jerky","Rice Cakes","Acai Packets 4-pack","Whole Wheat Naan","Avocados 4-pack","Broccoli and Asparagus","Cherry Tomatoes","Teriyaki Sauce","Sriracha","Frozen Sweet Potato Fries","EBTB Seasoning","Dark Chocolate Chips","Granola","Frozen Stir Fry Blend"] },
  fredmeyer: { label:"Fred Meyer",  color:"#005DAA", badge:"Fill gaps and supps", items:["Pop Tarts pre-workout","Bagels 6-pack","Gatorade variety pack","Chocolate Milk half gal","Parmesan shredded","Cream Cheese","Nutella","Canned Tuna 12-pack","Creatine Monohydrate","Vitamin D3 5000 IU","Fish Oil Omega-3","Sesame Oil"] },
};

const PR_LIFTS = [
  { key:"bench",   name:"Bench Press",    icon:"🏋️", color:"#3B82F6" },
  { key:"squat",   name:"Squat",          icon:"🦵", color:"#EF4444" },
  { key:"deadlift",name:"Deadlift / RDL", icon:"⚡", color:"#8B5CF6" },
];

const SUPPS = [
  { key:"creatine", name:"Creatine",   icon:"⚗️", time:"Any time",     color:"#3B82F6" },
  { key:"protein",  name:"Protein",    icon:"🥛", time:"Post workout", color:"#10B981" },
  { key:"vitd",     name:"Vitamin D3", icon:"☀️", time:"Morning",      color:"#F59E0B" },
  { key:"fish",     name:"Fish Oil",   icon:"🐟", time:"With food",    color:"#8B5CF6" },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function load(key, fallback) { try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; } }
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
function todayKey() { return new Date().toISOString().split("T")[0]; }
function mondayKey() { const d = new Date(); d.setDate(d.getDate() - ((d.getDay()+6)%7)); return d.toISOString().split("T")[0]; }

// ── INPUT STYLE ───────────────────────────────────────────────────────────────
const iStyle = { width:"100%", background:"#150A02", border:"1px solid #FF6B0044", borderRadius:10, padding:"14px 16px", color:"#F0E6D3", fontSize:18, fontWeight:700, fontFamily:"'Rajdhani',sans-serif", boxSizing:"border-box", outline:"none" };

// ── SETUP SCREEN ──────────────────────────────────────────────────────────────
function SetupScreen({ onComplete }) {
  const [step, setStep]     = useState(0);
  const [name, setName]     = useState("");
  const [age, setAge]       = useState("");
  const [height, setHeight] = useState("");
  const [startW, setStartW] = useState("");
  const [goalW, setGoalW]   = useState("");

  const steps = [
    { label:"NINJA NAME",           field:<input value={name}   onChange={e=>setName(e.target.value)}   placeholder="Your name"              style={iStyle}/>, valid:name.trim().length>0 },
    { label:"YOUR AGE",             field:<input type="number" value={age} onChange={e=>setAge(e.target.value)} placeholder="Age"            style={iStyle}/>, valid:age>0 },
    { label:"HEIGHT",               field:<input value={height} onChange={e=>setHeight(e.target.value)} placeholder="e.g. 5ft 10in"          style={iStyle}/>, valid:height.trim().length>0 },
    { label:"CURRENT WEIGHT (lbs)", field:<input type="number" value={startW} onChange={e=>setStartW(e.target.value)} placeholder="Current weight" style={iStyle}/>, valid:startW>0 },
    { label:"GOAL WEIGHT (lbs)",    field:<input type="number" value={goalW}  onChange={e=>setGoalW(e.target.value)}  placeholder="Goal weight"    style={iStyle}/>, valid:goalW>0&&parseFloat(goalW)>parseFloat(startW) },
  ];
  const cur = steps[step];

  function next() {
    if (!cur.valid) return;
    if (step < steps.length-1) { setStep(s=>s+1); return; }
    const profile = { name:name.trim(), age:parseInt(age), height:height.trim(), startW:parseFloat(startW), goalW:parseFloat(goalW) };
    save("shq_profile", profile);
    onComplete(profile);
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0A0208", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Rajdhani',sans-serif" }}>
      <style>{CSS}</style>
      <div style={{ width:"100%", maxWidth:400, animation:"slideUp 0.4s ease" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ marginBottom:20 }}><NinjaAvatar level={1} size={100}/></div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:40, color:"#FF6B00", letterSpacing:4, animation:"flicker 3s infinite" }}>TRAINING LOG</div>
          <div style={{ fontSize:12, color:"#4A3020", letterSpacing:4, marginTop:4 }}>INITIALIZE YOUR CHARACTER</div>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:28 }}>
          {steps.map((_,i)=><div key={i} style={{ width:i===step?24:8, height:8, borderRadius:4, background:i<=step?"#FF6B00":"#1A0A02", transition:"all 0.3s" }}/>)}
        </div>
        <div style={{ background:"#0F0608", border:"1px solid #FF6B0033", borderRadius:16, padding:"28px 24px", animation:"glow 3s infinite" }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:13, color:"#FF6B00", letterSpacing:4, marginBottom:16 }}>{cur.label}</div>
          {cur.field}
          <button onClick={next} disabled={!cur.valid} style={{ width:"100%", marginTop:20, padding:"14px", background:cur.valid?"linear-gradient(135deg,#FF6B00,#CC5500)":"#1A0A02", border:"none", borderRadius:10, color:cur.valid?"#fff":"#4A3020", fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:3, cursor:cur.valid?"pointer":"default", boxShadow:cur.valid?"0 0 20px #FF6B0066":"none", transition:"all 0.2s" }}>
            {step<steps.length-1?"NEXT":"BEGIN TRAINING"}
          </button>
        </div>
        {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{ display:"block", margin:"16px auto 0", background:"transparent", border:"none", color:"#4A3020", fontSize:12, cursor:"pointer", letterSpacing:2, fontFamily:"'Bebas Neue',sans-serif" }}>BACK</button>}
      </div>
    </div>
  );
}

// ── SHARE CARD ────────────────────────────────────────────────────────────────
function ShareCard({ profile, weight, level, streak, arc, tier, tPct, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:340, background:"linear-gradient(135deg,#1E0C04,#130408)", border:`2px solid ${tier.rankColor}`, borderRadius:20, overflow:"hidden", boxShadow:`0 0 40px ${tier.rankColor}44` }}>
        <div style={{ background:`linear-gradient(135deg,${tier.rankColor}33,${tier.rankColor}0A)`, padding:"20px 20px 14px", textAlign:"center", borderBottom:`1px solid ${tier.rankColor}22` }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:10, color:"#FF6B00", letterSpacing:4, marginBottom:4 }}>TRAINING LOG</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, color:"#F0E6D3", letterSpacing:2 }}>{profile.name.toUpperCase()}</div>
          <div style={{ fontSize:11, color:"#FF6B0099", letterSpacing:2, marginTop:2 }}>AGE {profile.age} · {profile.height}</div>
        </div>
        <div style={{ padding:"16px 0 8px", display:"flex", justifyContent:"center" }}>
          <NinjaAvatar level={level} size={110}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, padding:"8px 16px 16px" }}>
          {[
            { label:"WEIGHT",   val:`${weight} lbs`, color:"#FF6B00" },
            { label:"RANK",     val:tier.name,        color:tier.rankColor },
            { label:"STREAK",   val:`${streak}d`,     color:"#F59E0B" },
            { label:"LEVEL",    val:`LVL ${level}`,   color:"#8B5CF6" },
            { label:"ARC",      val:arc.rank,          color:arc.color },
            { label:"PROGRESS", val:`${tPct.toFixed(0)}%`, color:"#10B981" },
          ].map(s=>(
            <div key={s.label} style={{ background:"#1A0A04", border:`1px solid ${s.color}33`, borderRadius:10, padding:"9px 6px", textAlign:"center" }}>
              <div style={{ fontSize:8, color:"#FF6B00", letterSpacing:2, marginBottom:3 }}>{s.label}</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:15, color:s.color, letterSpacing:1 }}>{s.val}</div>
            </div>
          ))}
        </div>
        <div style={{ padding:"0 16px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:"#FF6B0066", marginBottom:4 }}>
            <span>{profile.startW} lbs</span><span>{arc.name.toUpperCase()}</span><span>{profile.goalW} lbs</span>
          </div>
          <div style={{ height:7, background:"#1A0A02", borderRadius:4, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${tPct}%`, background:`linear-gradient(90deg,#6B728066,${arc.color})`, borderRadius:4, boxShadow:`0 0 6px ${arc.color}55` }}/>
          </div>
        </div>
        <div style={{ padding:"10px 16px 16px", borderTop:`1px solid ${tier.rankColor}18`, textAlign:"center" }}>
          <div style={{ fontSize:9, color:"#4A3020", letterSpacing:2, marginBottom:10 }}>SCREENSHOT TO SHARE</div>
          <button onClick={onClose} style={{ background:"transparent", border:`1px solid #2A1A0A`, borderRadius:8, padding:"6px 20px", color:"#4A3020", fontSize:11, cursor:"pointer", fontFamily:"'Bebas Neue',sans-serif", letterSpacing:2 }}>CLOSE</button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function ShonenHQ() {
  const [profile, setProfile]   = useState(()=>load("shq_profile",null));
  const [tab, setTab]           = useState("status");
  const [fuelTab, setFuelTab]   = useState("meals");
  const [trainDay, setTrainDay] = useState(0);
  const [trainView, setTrainView] = useState("workout");
  const [groceryStore, setGroceryStore] = useState("costco");
  const [showShare, setShowShare] = useState(false);
  const [notifs, setNotifs]     = useState([]);

  const [weight, setWeight]       = useState(()=>load("shq_weight",135));
  const [weightInput, setWeightInput] = useState(()=>String(load("shq_weight",135)));
  const [weightLog, setWeightLog] = useState(()=>load("shq_weightLog",null));
  const [attrs, setAttrs]         = useState(()=>load("shq_attrs",{str:0,end:0,vit:0,agi:0,int:0}));
  const [xp, setXp]               = useState(()=>load("shq_xp",0));
  const [level, setLevel]         = useState(()=>load("shq_level",1));
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpNum, setLevelUpNum]   = useState(1);
  const [checkedEx, setCheckedEx]     = useState(()=>load("shq_checkedEx",{}));
  const [checkedMeals, setCheckedMeals] = useState(()=>load("shq_checkedMeals",{}));
  const [checkedGrocery, setCheckedGrocery] = useState(()=>load("shq_checkedGrocery",{}));
  const [calToday, setCalToday]   = useState(()=>load("shq_calToday",0));
  const [proToday, setProToday]   = useState(()=>load("shq_proToday",0));
  const [streak, setStreak]       = useState(()=>load("shq_streak",0));
  const [prs, setPrs]             = useState(()=>load("shq_prs",{}));
  const [prInputs, setPrInputs]   = useState({});
  const [water, setWater]         = useState(()=>load("shq_water",0));
  const [supps, setSupps]         = useState(()=>load("shq_supps",{}));
  const [lastWeekReset, setLastWeekReset] = useState(()=>load("shq_lastWeekReset",""));
  const [lastDayReset, setLastDayReset]   = useState(()=>load("shq_lastDayReset",""));
  const nid = useRef(0);

  const startW = profile?.startW || 135;
  const goalW  = profile?.goalW  || 160;
  const ARCS   = buildArcs(startW, goalW);

  function getArc(w) {
    for (const a of ARCS) if (w>=a.range[0]&&w<a.range[1]) return a;
    if (w>=goalW) return {...ARCS[4], name:"LEGEND", desc:"Goal achieved. The journey never ends."};
    return ARCS[0];
  }

  const arc      = getArc(weight);
  const xpToNext = level * 100;
  const xpPct    = Math.min(100,(xp/xpToNext)*100);
  const day      = DAYS[trainDay];
  const tier     = getNinjaTier(level);
  const nextTier = NINJA_TIERS.find(t=>t.minLevel>level);
  const tPct     = Math.min(100,Math.max(0,((weight-startW)/(goalW-startW))*100));
  const arcPct   = (()=>{ const a=getArc(weight); return Math.min(100,Math.max(0,((weight-a.range[0])/(a.range[1]-a.range[0]))*100)); })();
  const store    = GROCERY[groceryStore];

  // Water goal: 2 fills of 40oz Hydroflask = 80oz
  const WATER_GOAL = 2;

  // Weekly reset
  useEffect(()=>{
    const mk=mondayKey();
    if(lastWeekReset!==mk){ setCheckedEx({}); setLastWeekReset(mk); save("shq_lastWeekReset",mk); save("shq_checkedEx",{}); }
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

  // Daily reset
  useEffect(()=>{
    const dk=todayKey();
    if(lastDayReset!==dk){ setCheckedMeals({}); setWater(0); setSupps({}); setCalToday(0); setProToday(0); setLastDayReset(dk); save("shq_checkedMeals",{}); save("shq_water",0); save("shq_supps",{}); save("shq_calToday",0); save("shq_proToday",0); save("shq_lastDayReset",dk); }
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

  // Init weight log
  useEffect(()=>{
    if(profile&&!load("shq_weightLog",null)){ const log=[{date:"Start",w:profile.startW}]; setWeightLog(log); save("shq_weightLog",log); }
    else if(!weightLog){ setWeightLog([{date:"Start",w:startW}]); }
  },[profile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Level up
  useEffect(()=>{
    if(xp>=xpToNext){ const nl=level+1; setLevel(nl); setXp(x=>x-xpToNext); setLevelUpNum(nl); setShowLevelUp(true); setTimeout(()=>setShowLevelUp(false),3000); pushNotif(`LEVEL UP - ${getNinjaTier(nl).name}!`,"#F59E0B"); }
  },[xp]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist
  useEffect(()=>{save("shq_weight",weight);},[weight]);
  useEffect(()=>{if(weightLog)save("shq_weightLog",weightLog);},[weightLog]);
  useEffect(()=>{save("shq_attrs",attrs);},[attrs]);
  useEffect(()=>{save("shq_xp",xp);},[xp]);
  useEffect(()=>{save("shq_level",level);},[level]);
  useEffect(()=>{save("shq_checkedEx",checkedEx);},[checkedEx]);
  useEffect(()=>{save("shq_checkedMeals",checkedMeals);},[checkedMeals]);
  useEffect(()=>{save("shq_checkedGrocery",checkedGrocery);},[checkedGrocery]);
  useEffect(()=>{save("shq_calToday",calToday);},[calToday]);
  useEffect(()=>{save("shq_proToday",proToday);},[proToday]);
  useEffect(()=>{save("shq_streak",streak);},[streak]);
  useEffect(()=>{save("shq_prs",prs);},[prs]);
  useEffect(()=>{save("shq_water",water);},[water]);
  useEffect(()=>{save("shq_supps",supps);},[supps]);

  if(!profile) return <SetupScreen onComplete={p=>{setProfile(p);setWeight(p.startW);setWeightInput(String(p.startW));setWeightLog([{date:"Start",w:p.startW}]);}}/>;

  function pushNotif(msg,color="#10B981"){ const id=nid.current++; setNotifs(n=>[...n,{id,msg,color}]); setTimeout(()=>setNotifs(n=>n.filter(x=>x.id!==id)),2800); }
  function logWeight(){ const w=parseFloat(weightInput); if(isNaN(w)||w<50||w>500)return; const gained=w-weight; setWeight(w); const today=new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}); setWeightLog(l=>[...(l||[]).slice(-19),{date:today,w}]); if(gained>0){const earned=Math.round(gained*40);setXp(x=>x+earned);setAttrs(a=>({...a,vit:Math.min(99,a.vit+1)}));pushNotif(`+${gained.toFixed(1)} lbs! +${earned} XP!`,"#10B981");} }
  function toggleEx(i){ const k=`${trainDay}-${i}`,was=checkedEx[k]; setCheckedEx(c=>({...c,[k]:!c[k]})); if(!was){setXp(x=>x+10);setAttrs(a=>({...a,str:Math.min(99,a.str+0.5),end:Math.min(99,a.end+0.3)})); const allDone=day.exercises.every((_,idx)=>idx===i||checkedEx[`${trainDay}-${idx}`]); if(allDone){setStreak(s=>s+1);setXp(x=>x+50);pushNotif("FULL WORKOUT! +50 XP!","#EF4444");}else pushNotif("+10 XP","#3B82F6");} }
  function toggleMeal(i){ const was=checkedMeals[i]; setCheckedMeals(c=>({...c,[i]:!c[i]})); if(!was){setCalToday(c=>c+MEALS[i].cal);setProToday(p=>p+MEALS[i].pro);setXp(x=>x+8);setAttrs(a=>({...a,int:Math.min(99,a.int+0.4)}));pushNotif(`${MEALS[i].name} logged! +8 XP`,"#10B981");}else{setCalToday(c=>Math.max(0,c-MEALS[i].cal));setProToday(p=>Math.max(0,p-MEALS[i].pro));} }
  function logPR(key){ const val=parseFloat(prInputs[key]); if(isNaN(val)||val<=0)return; const prev=prs[key]?.current||0; const isNew=val>prev; setPrs(p=>({...p,[key]:{current:val,baseline:p[key]?.baseline||val,best:Math.max(val,p[key]?.best||0)}})); setPrInputs(p=>({...p,[key]:""})); if(isNew){const bonus=Math.round((val-prev)*2);setXp(x=>x+25+bonus);setAttrs(a=>({...a,str:Math.min(99,a.str+1)}));pushNotif(`NEW PR! ${val}lbs! +${25+bonus} XP`,"#EF4444");}else{pushNotif(`Logged ${val}lbs`,"#6B7280");} }
  function toggleSupp(key){ const was=supps[key]; setSupps(s=>({...s,[key]:!s[key]})); if(!was){setXp(x=>x+5);pushNotif(`${SUPPS.find(s=>s.key===key)?.name} done! +5 XP`,"#10B981");} }
  function addWater(){ if(water>=WATER_GOAL)return; const next=water+1; setWater(next); setXp(x=>x+5); if(next===WATER_GOAL)pushNotif("HYDRATION COMPLETE! +5 XP","#3B82F6"); else pushNotif(`${next}/${WATER_GOAL} fills! +5 XP`,"#3B82F6"); }

  const NAV=[{id:"status",label:"STATUS",icon:"⚔️"},{id:"train",label:"TRAIN",icon:"🏋️"},{id:"fuel",label:"FUEL",icon:"🍚"},{id:"log",label:"LOG",icon:"📜"}];

  return (
    <div style={{ minHeight:"100vh", background:"#0A0208", color:"#F0E6D3", fontFamily:"'Rajdhani',sans-serif", paddingBottom:90, position:"relative", overflow:"hidden" }}>
      <style>{CSS}</style>
      <div style={{ position:"fixed", inset:0, backgroundImage:"radial-gradient(ellipse at 20% 20%, rgba(255,107,0,0.05) 0%, transparent 60%)", pointerEvents:"none" }}/>
      <div style={{ position:"fixed", inset:0, backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)", pointerEvents:"none", zIndex:1 }}/>

      {/* Notifs */}
      <div style={{ position:"fixed", top:95, right:12, zIndex:100, display:"flex", flexDirection:"column", gap:6 }}>
        {notifs.map(n=><div key={n.id} style={{ background:"#0A0208", border:`1px solid ${n.color}`, borderRadius:8, padding:"7px 12px", fontSize:12, fontWeight:700, color:n.color, animation:"popIn 0.3s ease", boxShadow:`0 0 12px ${n.color}44` }}>{n.msg}</div>)}
      </div>

      {/* Level up overlay */}
      {showLevelUp&&(
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.88)", backdropFilter:"blur(6px)" }}>
          <div style={{ textAlign:"center", animation:"popIn 0.4s ease", padding:"0 20px" }}>
            <div style={{ marginBottom:16 }}><NinjaAvatar level={levelUpNum} size={140}/></div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"#F59E0B", animation:"flicker 0.8s infinite", letterSpacing:4 }}>LEVEL UP</div>
            <div style={{ fontSize:20, color:"#F0E6D3", letterSpacing:3, marginTop:4 }}>LVL {levelUpNum} — {getNinjaTier(levelUpNum).name}</div>
            <div style={{ fontSize:12, color:"#8B7355", marginTop:8, letterSpacing:2 }}>NEW POWER UNLOCKED</div>
          </div>
        </div>
      )}

      {showShare&&<ShareCard profile={profile} weight={weight} level={level} streak={streak} arc={arc} tier={tier} tPct={tPct} onClose={()=>setShowShare(false)}/>}

      {/* Header */}
      <div style={{ background:"linear-gradient(180deg,#150A02 0%,#0A0208 100%)", borderBottom:"1px solid #FF6B0022", padding:"14px 20px 0", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ maxWidth:520, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, color:"#FF6B00", letterSpacing:3, lineHeight:1, animation:"flicker 3s infinite" }}>{profile.name.toUpperCase()}</div>
              <div style={{ fontSize:10, color:"#6B4C2A", letterSpacing:2 }}>AGE {profile.age} · {profile.height} · {arc.name.toUpperCase()}</div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <button onClick={()=>setShowShare(true)} style={{ background:"#FF6B0018", border:"1px solid #FF6B0033", borderRadius:8, padding:"5px 10px", color:"#FF6B00", fontFamily:"'Bebas Neue',sans-serif", fontSize:11, letterSpacing:2, cursor:"pointer" }}>SHARE</button>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, color:arc.color, letterSpacing:2 }}>{weight} LBS</div>
                <div style={{ fontSize:10, color:"#6B4C2A" }}>LVL {level} {tier.name} · {streak}🔥</div>
              </div>
            </div>
          </div>
          <div style={{ marginBottom:4 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
              <span style={{ fontSize:9, color:"#FF6B00", fontWeight:700, letterSpacing:2 }}>XP {xp}/{xpToNext}</span>
              <span style={{ fontSize:9, color:"#4A3020" }}>NEXT {nextTier?.name||"MAX"}</span>
            </div>
            <div style={{ height:5, background:"#1A0A02", borderRadius:3, overflow:"hidden" }}>
              <div className="stat-bar" style={{ height:"100%", width:`${xpPct}%`, background:"linear-gradient(90deg,#FF6B00,#FFB347)", borderRadius:3, boxShadow:"0 0 6px #FF6B0066" }}/>
            </div>
          </div>
          <div style={{ display:"flex" }}>
            {NAV.map(n=><button key={n.id} className="nav-btn" onClick={()=>setTab(n.id)} style={{ flex:1, padding:"7px 4px 9px", border:"none", background:"transparent", borderBottom:`2px solid ${tab===n.id?"#FF6B00":"transparent"}`, color:tab===n.id?"#FF6B00":"#4A3020", fontSize:9, fontWeight:700, cursor:"pointer", letterSpacing:2, textTransform:"uppercase" }}><div style={{ fontSize:15, marginBottom:1 }}>{n.icon}</div>{n.label}</button>)}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:520, margin:"0 auto", padding:"18px 18px 0", position:"relative", zIndex:2 }}>

        {/* ── STATUS ── */}
        {tab==="status"&&(
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {/* Avatar card */}
            <div style={{ background:"#0F0608", border:`1px solid ${tier.rankColor}33`, borderRadius:16, padding:"20px 16px 28px", textAlign:"center", animation:"glow 3s infinite", position:"relative", overflow:"hidden" }}>
              <div className="ninja-float"><NinjaAvatar level={level} size={160}/></div>
              <div style={{ marginTop:10, fontFamily:"'Bebas Neue',sans-serif", fontSize:11, color:tier.rankColor, letterSpacing:3 }}>
                {nextTier?`${nextTier.minLevel-level} LEVELS TO ${nextTier.name}`:"MAX RANK ACHIEVED"}
              </div>
              {nextTier && (
                <div style={{ fontSize:10, color:"#4A3020", marginTop:4 }}>
                  {nextTier.minLevel===3?"Unlock: Kunai weapon":nextTier.minLevel===6?"Unlock: Rank scarf + Jonin suit":nextTier.minLevel===10?"Unlock: Katana + ANBU mask":nextTier.minLevel===15?"Unlock: Dual blades + Kage hat":nextTier.minLevel===20?"Unlock: Legendary weapon + orbit ring":""}
                </div>
              )}
            </div>

            {/* Weight logger */}
            <div style={{ background:"#0F0608", border:"1px solid #FF6B0033", borderRadius:14, padding:"14px" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:16, color:"#FF6B00", letterSpacing:3, marginBottom:10 }}>LOG BODY WEIGHT</div>
              <div style={{ display:"flex", gap:8 }}>
                <input type="number" value={weightInput} onChange={e=>setWeightInput(e.target.value)} style={{ flex:1, background:"#150A02", border:"1px solid #FF6B0044", borderRadius:8, padding:"10px 12px", color:"#F0E6D3", fontSize:18, fontWeight:700, fontFamily:"'Rajdhani',sans-serif" }} placeholder="lbs"/>
                <button className="log-btn" onClick={logWeight} style={{ background:"linear-gradient(135deg,#FF6B00,#CC5500)", border:"none", borderRadius:8, padding:"10px 18px", color:"#fff", fontFamily:"'Bebas Neue',sans-serif", fontSize:15, letterSpacing:2, cursor:"pointer", boxShadow:"0 0 14px #FF6B0066" }}>LOG IT</button>
              </div>
            </div>

            {/* Progress */}
            <div style={{ background:"#0F0608", border:`1px solid ${arc.color}33`, borderRadius:14, padding:"14px" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:14, color:arc.color, letterSpacing:3, marginBottom:10 }}>MISSION PROGRESS</div>
              <div style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#6B4C2A", marginBottom:3 }}><span>TOTAL {startW} to {goalW} lbs</span><span>{tPct.toFixed(1)}%</span></div>
                <div style={{ height:8, background:"#1A0A02", borderRadius:4, overflow:"hidden" }}><div className="stat-bar" style={{ height:"100%", width:`${tPct}%`, background:`linear-gradient(90deg,#6B728066,${arc.color})`, borderRadius:4, boxShadow:`0 0 8px ${arc.color}55` }}/></div>
              </div>
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#6B4C2A", marginBottom:3 }}><span>ARC {arc.name}</span><span>{arcPct.toFixed(1)}%</span></div>
                <div style={{ height:6, background:"#1A0A02", borderRadius:3, overflow:"hidden" }}><div className="stat-bar" style={{ height:"100%", width:`${arcPct}%`, background:arc.color, borderRadius:3, boxShadow:`0 0 5px ${arc.color}` }}/></div>
              </div>
              <div style={{ display:"flex", gap:6, marginTop:10, overflowX:"auto" }}>
                {ARCS.map((a,i)=><div key={i} style={{ flexShrink:0, textAlign:"center", opacity:weight>=a.range[0]?1:0.25 }}><div style={{ width:28, height:28, borderRadius:"50%", border:`2px solid ${a.color}`, background:weight>=a.range[1]?`${a.color}33`:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:11, color:a.color }}>{a.rank}</span></div><div style={{ fontSize:7, color:"#6B4C2A", marginTop:2 }}>{a.range[0]}</div></div>)}
              </div>
            </div>

            {/* Water + Supps */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {/* Water — 40oz Hydroflask */}
              <div style={{ background:"#0F0608", border:"1px solid #3B82F633", borderRadius:14, padding:"14px" }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:12, color:"#3B82F6", letterSpacing:3, marginBottom:4 }}>HYDROFLASK</div>
                <div style={{ fontSize:9, color:"#4A3020", marginBottom:10 }}>40oz · goal: 2 fills</div>
                <div style={{ display:"flex", justifyContent:"center", gap:10, marginBottom:10 }}>
                  {[0,1].map(i=>(
                    <div key={i} style={{ width:36, height:48, borderRadius:6, border:`2px solid ${i<water?"#3B82F6":"#1A0A02"}`, background:i<water?"#3B82F622":"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s" }}>
                      <span style={{ fontSize:18 }}>💧</span>
                    </div>
                  ))}
                </div>
                <button onClick={addWater} disabled={water>=WATER_GOAL} style={{ width:"100%", background:water>=WATER_GOAL?"#0A1A0A":"#3B82F622", border:`1px solid ${water>=WATER_GOAL?"#10B98133":"#3B82F644"}`, borderRadius:8, padding:"7px", color:water>=WATER_GOAL?"#10B981":"#3B82F6", fontFamily:"'Bebas Neue',sans-serif", fontSize:12, letterSpacing:2, cursor:water>=WATER_GOAL?"default":"pointer" }}>
                  {water>=WATER_GOAL?"DONE":"+ FILL"}
                </button>
                {water>0&&<button onClick={()=>setWater(w=>Math.max(0,w-1))} style={{ width:"100%", marginTop:4, background:"transparent", border:"none", color:"#4A3020", fontSize:9, cursor:"pointer" }}>undo last fill</button>}
              </div>

              {/* Supps */}
              <div style={{ background:"#0F0608", border:"1px solid #10B98133", borderRadius:14, padding:"14px" }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:12, color:"#10B981", letterSpacing:3, marginBottom:10 }}>SUPPS</div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {SUPPS.map(s=>{
                    const done=!!supps[s.key];
                    return <div key={s.key} onClick={()=>toggleSupp(s.key)} style={{ display:"flex", gap:8, alignItems:"center", cursor:"pointer" }}>
                      <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${done?s.color:"#2A1A0A"}`, background:done?s.color:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>{done&&<span style={{ color:"#fff", fontSize:9 }}>✓</span>}</div>
                      <div><div style={{ fontSize:11, fontWeight:700, color:done?s.color:"#8B7355", textDecoration:done?"line-through":"none" }}>{s.name}</div><div style={{ fontSize:8, color:"#4A3020" }}>{s.time}</div></div>
                    </div>;
                  })}
                </div>
              </div>
            </div>

            {/* Attributes */}
            <div style={{ background:"#0F0608", border:"1px solid #1A0A02", borderRadius:14, padding:"14px" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:16, color:"#FF6B00", letterSpacing:3, marginBottom:12 }}>CHARACTER STATS</div>
              {BASE_ATTRS.map(attr=>(
                <div key={attr.key} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                    <div style={{ display:"flex", gap:6, alignItems:"center" }}><span>{attr.icon}</span><span style={{ fontSize:11, fontWeight:700, color:attr.color, letterSpacing:2 }}>{attr.label}</span><span style={{ fontSize:9, color:"#4A3020" }}>{attr.tip}</span></div>
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:17, color:attr.color }}>{Math.floor(attrs[attr.key])}</span>
                  </div>
                  <div style={{ height:4, background:"#1A0A02", borderRadius:2, overflow:"hidden" }}><div className="stat-bar" style={{ height:"100%", width:`${Math.min(100,attrs[attr.key])}%`, background:`linear-gradient(90deg,${attr.color}44,${attr.color})`, borderRadius:2 }}/></div>
                </div>
              ))}
            </div>

            {/* Reset */}
            <button onClick={()=>{if(window.confirm("Reset all progress and start over?")){ localStorage.clear(); window.location.reload();}}} style={{ background:"transparent", border:"1px solid #1A0A02", borderRadius:8, padding:"8px", color:"#4A3020", fontSize:11, cursor:"pointer", fontFamily:"'Bebas Neue',sans-serif", letterSpacing:2, width:"100%" }}>RESET PROFILE</button>
          </div>
        )}

        {/* ── TRAIN ── */}
        {tab==="train"&&(
          <div>
            <div style={{ display:"flex", gap:6, marginBottom:12, overflowX:"auto", paddingBottom:4 }}>
              {DAYS.map((d,i)=><button key={i} onClick={()=>{setTrainDay(i);setTrainView("workout");}} style={{ flexShrink:0, padding:"7px 12px", borderRadius:8, border:"1px solid", borderColor:trainDay===i?d.color:"#1A0A02", background:trainDay===i?`${d.color}18`:"#0F0608", color:trainDay===i?d.color:"#4A3020", fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:2, cursor:"pointer" }}>{d.day}</button>)}
            </div>
            <div style={{ background:`linear-gradient(135deg,${day.color}18,${day.color}04)`, border:`1px solid ${day.color}44`, borderRadius:14, padding:"14px 16px", marginBottom:12 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:24 }}>{day.icon}</span>
                <div>
                  <div style={{ background:day.color, color:"#fff", borderRadius:4, padding:"2px 8px", display:"inline-block", fontFamily:"'Bebas Neue',sans-serif", fontSize:12, letterSpacing:2 }}>{day.tag}</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, color:"#F0E6D3", letterSpacing:1, marginTop:2 }}>{day.focus}</div>
                </div>
              </div>
              {(()=>{ const done=day.exercises.filter((_,i)=>checkedEx[`${trainDay}-${i}`]).length; return <div><div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:day.color, marginBottom:3 }}><span>SESSION</span><span>{done}/{day.exercises.length}</span></div><div style={{ height:4, background:"#1A0A02", borderRadius:2, overflow:"hidden" }}><div className="stat-bar" style={{ height:"100%", width:`${(done/day.exercises.length)*100}%`, background:day.color, borderRadius:2, boxShadow:`0 0 5px ${day.color}` }}/></div></div>; })()}
            </div>
            <div style={{ display:"flex", gap:4, background:"#0F0608", borderRadius:10, padding:4, border:"1px solid #1A0A02", marginBottom:12 }}>
              {["workout","mobility"].map(t=><button key={t} onClick={()=>setTrainView(t)} style={{ flex:1, padding:"7px", borderRadius:7, border:"none", background:trainView===t?day.color:"transparent", color:trainView===t?"#fff":"#4A3020", fontFamily:"'Bebas Neue',sans-serif", fontSize:12, letterSpacing:2, cursor:"pointer" }}>{t==="workout"?"EXERCISES":"WARM-UP"}</button>)}
            </div>
            {trainView==="workout"&&(
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {day.exercises.map((ex,i)=>{
                  const done=checkedEx[`${trainDay}-${i}`];
                  const parts=ex.split(" — "); const name=parts[0],sets=parts[1]||"";
                  return <div key={i} onClick={()=>toggleEx(i)} style={{ background:done?`${day.color}12`:"#0F0608", border:`1px solid ${done?day.color+"44":"#1A0A02"}`, borderRadius:10, padding:"11px 14px", display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
                    <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${done?day.color:"#2A1A0A"}`, background:done?day.color:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>{done&&<span style={{ color:"#fff", fontSize:11 }}>✓</span>}</div>
                    <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, color:done?day.color:"#F0E6D3", textDecoration:done?"line-through":"none" }}>{name}</div>{sets&&<div style={{ fontSize:10, color:done?day.color+"66":"#4A3020", letterSpacing:1 }}>{sets}</div>}</div>
                    {!done&&<span style={{ fontSize:10, color:"#4A3020" }}>+10XP</span>}
                  </div>;
                })}
              </div>
            )}
            {trainView==="mobility"&&(
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                <div style={{ fontSize:10, color:"#6B4C2A", letterSpacing:2, marginBottom:4 }}>10 MIN - DO NOT SKIP</div>
                {day.mobility.map((m,i)=><div key={i} style={{ background:"#0F0608", border:"1px solid #1A0A02", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#8B7355", display:"flex", gap:8 }}><span style={{ color:"#FF6B00" }}>&#9656;</span> {m}</div>)}
              </div>
            )}

            {/* PR Tracker */}
            <div style={{ marginTop:16, background:"#0F0608", border:"1px solid #EF444422", borderRadius:14, padding:"14px" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:16, color:"#EF4444", letterSpacing:3, marginBottom:12 }}>PR TRACKER</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {PR_LIFTS.map(lift=>{
                  const pr=prs[lift.key];
                  const gained=pr&&pr.baseline?pr.current-pr.baseline:0;
                  return <div key={lift.key} style={{ background:"#0A0208", border:`1px solid ${lift.color}18`, borderRadius:12, padding:"12px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ fontSize:16 }}>{lift.icon}</span>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700, color:"#F0E6D3" }}>{lift.name}</div>
                          {pr?<div style={{ fontSize:10, color:lift.color }}>BEST: {pr.best} lbs {gained>0&&<span style={{ color:"#10B981" }}>+{gained.toFixed(0)} from start</span>}</div>:<div style={{ fontSize:10, color:"#4A3020" }}>No PR logged yet</div>}
                        </div>
                      </div>
                      {pr&&<div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:lift.color }}>{pr.current}</div>}
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <input type="number" value={prInputs[lift.key]||""} onChange={e=>setPrInputs(p=>({...p,[lift.key]:e.target.value}))} placeholder="lbs" style={{ flex:1, background:"#150A02", border:`1px solid ${lift.color}22`, borderRadius:6, padding:"7px 10px", color:"#F0E6D3", fontSize:14, fontWeight:700, fontFamily:"'Rajdhani',sans-serif" }}/>
                      <button onClick={()=>logPR(lift.key)} style={{ background:`${lift.color}18`, border:`1px solid ${lift.color}33`, borderRadius:6, padding:"7px 14px", color:lift.color, fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:1, cursor:"pointer" }}>LOG</button>
                    </div>
                  </div>;
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── FUEL ── */}
        {tab==="fuel"&&(
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ display:"flex", gap:4, background:"#0F0608", borderRadius:10, padding:4, border:"1px solid #1A0A02" }}>
              {[{id:"meals",label:"MEALS"},{id:"grocery",label:"GROCERY"}].map(t=><button key={t.id} onClick={()=>setFuelTab(t.id)} style={{ flex:1, padding:"8px", borderRadius:7, border:"none", background:fuelTab===t.id?"#FF6B00":"transparent", color:fuelTab===t.id?"#fff":"#4A3020", fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:2, cursor:"pointer" }}>{t.label}</button>)}
            </div>
            {fuelTab==="meals"&&(
              <>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[{label:"CALORIES",val:calToday,target:3400,color:"#FF6B00",unit:"kcal"},{label:"PROTEIN",val:proToday,target:220,color:"#3B82F6",unit:"g"}].map(s=>(
                    <div key={s.label} style={{ background:"#0F0608", border:`1px solid ${s.color}18`, borderRadius:12, padding:"12px" }}>
                      <div style={{ fontSize:9, letterSpacing:3, color:s.color, marginBottom:3 }}>{s.label}</div>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, color:s.color }}>{s.val}<span style={{ fontSize:11 }}>{s.unit}</span></div>
                      <div style={{ height:4, background:"#1A0A02", borderRadius:2, marginTop:5, overflow:"hidden" }}><div className="stat-bar" style={{ height:"100%", width:`${Math.min(100,(s.val/s.target)*100)}%`, background:s.color, borderRadius:2 }}/></div>
                      <div style={{ fontSize:9, color:"#4A3020", marginTop:2 }}>of {s.target}{s.unit}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {MEALS.map((m,i)=>{
                    const done=checkedMeals[i];
                    return <div key={i} onClick={()=>toggleMeal(i)} style={{ background:done?"#0A1A0A":"#0F0608", border:`1px solid ${done?"#10B98122":"#1A0A02"}`, borderRadius:10, padding:"11px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }}>
                      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                        <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${done?"#10B981":"#2A1A0A"}`, background:done?"#10B981":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{done&&<span style={{ color:"#fff", fontSize:10 }}>✓</span>}</div>
                        <div>
                          <div style={{ display:"flex", gap:5, alignItems:"center" }}><span style={{ fontSize:14 }}>{m.icon}</span><span style={{ fontSize:13, fontWeight:700, color:done?"#10B981":"#F0E6D3", textDecoration:done?"line-through":"none" }}>{m.name}</span></div>
                          <div style={{ fontSize:10, color:"#4A3020", marginTop:1 }}>{m.time} · {m.pro}g protein · {m.desc}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}><div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:17, color:done?"#10B981":"#FF6B00" }}>{m.cal}</div><div style={{ fontSize:9, color:"#4A3020" }}>cal</div></div>
                    </div>;
                  })}
                </div>
              </>
            )}
            {fuelTab==="grocery"&&(
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div style={{ background:"#0F0608", border:"1px solid #FF6B0018", borderRadius:10, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontSize:10, color:"#6B4C2A", letterSpacing:2 }}>WEEKLY BUDGET</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, color:"#FF6B00" }}>$150-195</div>
                </div>
                <div style={{ display:"flex", gap:4 }}>
                  {Object.entries(GROCERY).map(([key,s])=><button key={key} onClick={()=>setGroceryStore(key)} style={{ flex:1, padding:"7px 4px", borderRadius:8, border:`1px solid ${groceryStore===key?s.color:"#1A0A02"}`, background:groceryStore===key?`${s.color}18`:"#0F0608", color:groceryStore===key?s.color:"#4A3020", fontFamily:"'Bebas Neue',sans-serif", fontSize:9, letterSpacing:1, cursor:"pointer", lineHeight:1.4 }}>{s.label.split(" ")[0]}<br/>{s.label.split(" ").slice(1).join(" ")}</button>)}
                </div>
                <div style={{ background:store.color, borderRadius:10, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div><div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:15, color:"#fff" }}>{store.label}</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.65)", marginTop:1 }}>{store.badge}</div></div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:"#fff" }}>{store.items.filter((_,i)=>checkedGrocery[`${groceryStore}-${i}`]).length}/{store.items.length}</div>
                </div>
                <div style={{ height:3, background:"#1A0A02", borderRadius:2, overflow:"hidden", marginTop:-8 }}><div className="stat-bar" style={{ height:"100%", width:`${(store.items.filter((_,i)=>checkedGrocery[`${groceryStore}-${i}`]).length/store.items.length)*100}%`, background:store.color, borderRadius:2 }}/></div>
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  {store.items.map((item,i)=>{
                    const k=`${groceryStore}-${i}`,done=!!checkedGrocery[k];
                    return <div key={i} onClick={()=>setCheckedGrocery(c=>({...c,[k]:!c[k]}))} style={{ display:"flex", gap:10, alignItems:"center", padding:"9px 12px", background:done?"#0A120A":"#0F0608", border:`1px solid ${done?store.color+"22":"#1A0A02"}`, borderRadius:8, cursor:"pointer" }}>
                      <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${done?store.color:"#2A1A0A"}`, background:done?store.color:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>{done&&<svg width="9" height="7" viewBox="0 0 12 9" fill="none"><path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                      <span style={{ fontSize:12, color:done?"#4A3020":"#C0A882", textDecoration:done?"line-through":"none" }}>{item}</span>
                    </div>;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── LOG ── */}
        {tab==="log"&&(
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ background:"#0F0608", border:"1px solid #1A0A02", borderRadius:14, padding:"14px" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:16, color:"#FF6B00", letterSpacing:3, marginBottom:10 }}>WEIGHT HISTORY</div>
              {!weightLog||weightLog.length<=1?(
                <div style={{ fontSize:12, color:"#4A3020", textAlign:"center", padding:"20px 0" }}>Log weight daily to build your chart</div>
              ):(
                <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:80, marginBottom:8 }}>
                  {weightLog.slice(-12).map((e,i,arr)=>{
                    const min=Math.min(...arr.map(x=>x.w)),max=Math.max(...arr.map(x=>x.w))||min+1;
                    const h=((e.w-min)/(max-min||1))*60+10,isLast=i===arr.length-1;
                    return <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:1 }}>
                      {isLast&&<div style={{ fontSize:7, color:"#FF6B00" }}>{e.w}</div>}
                      <div style={{ width:"100%", height:h, background:isLast?"#FF6B00":"#2A1A0A", borderRadius:"2px 2px 0 0", boxShadow:isLast?"0 0 5px #FF6B0055":"none" }}/>
                      <div style={{ fontSize:6, color:"#4A3020", textAlign:"center" }}>{e.date}</div>
                    </div>;
                  })}
                </div>
              )}
              <div style={{ display:"flex", flexDirection:"column", gap:5, maxHeight:160, overflowY:"auto" }}>
                {[...(weightLog||[])].reverse().map((e,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 10px", background:i===0?"#1A0A02":"transparent", borderRadius:6, border:i===0?"1px solid #FF6B0018":"none" }}>
                    <span style={{ fontSize:11, color:"#8B7355" }}>{e.date}</span>
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:14, color:i===0?"#FF6B00":"#4A3020" }}>{e.w} LBS</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arc milestones */}
            <div style={{ background:"#0F0608", border:"1px solid #1A0A02", borderRadius:14, padding:"14px" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:16, color:"#FF6B00", letterSpacing:3, marginBottom:10 }}>ARC MILESTONES</div>
              {ARCS.map((a,i)=>{
                const unlocked=weight>=a.range[0],complete=weight>=a.range[1];
                return <div key={i} style={{ display:"flex", gap:10, marginBottom:9, alignItems:"center", opacity:unlocked?1:0.25 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", border:`2px solid ${a.color}`, background:complete?`${a.color}22`:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:14, color:a.color }}>{a.rank}</span></div>
                  <div style={{ flex:1 }}><div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ fontSize:13, fontWeight:700, color:a.color }}>{a.name}</span><span style={{ fontSize:10, color:"#4A3020" }}>{a.range[0]}-{a.range[1]}</span></div><div style={{ fontSize:10, color:"#6B4C2A" }}>{a.desc}</div></div>
                  {complete&&<span style={{ color:"#10B981", fontSize:14 }}>✓</span>}
                </div>;
              })}
            </div>

            {/* Ninja rank ladder */}
            <div style={{ background:"#0F0608", border:"1px solid #1A0A02", borderRadius:14, padding:"14px" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:16, color:"#FF6B00", letterSpacing:3, marginBottom:10 }}>NINJA RANK LADDER</div>
              {NINJA_TIERS.map((t,i)=>{
                const unlocked=level>=t.minLevel;
                return <div key={i} style={{ display:"flex", gap:10, marginBottom:9, alignItems:"center", opacity:unlocked?1:0.25 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", border:`2px solid ${t.rankColor}`, background:unlocked?`${t.rankColor}18`:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:unlocked?`0 0 6px ${t.rankColor}33`:"none" }}><span style={{ fontSize:9, fontWeight:900, color:t.rankColor }}>Lv{t.minLevel}</span></div>
                  <div style={{ flex:1 }}>
                    <span style={{ fontSize:14, fontWeight:800, color:t.rankColor, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:2 }}>{t.name}</span>
                    <div style={{ fontSize:10, color:"#4A3020" }}>{["Full black ninja suit, mask on","+ Kunai weapon, blue trim","+ Rank scarf, Jonin suit navy","+ Katana, ANBU suit, bright eyes","+ Dual blades, Kage hat, crimson suit","+ Legendary weapon, orbit ring, max aura"][i]}</div>
                  </div>
                  {unlocked&&tier.name===t.name&&<span style={{ fontSize:10, color:t.rankColor, fontWeight:700 }}>NOW</span>}
                </div>;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
