type Props = {
  exerciseId: string
}

/* ── Shared sub-components for Teddy's body parts ── */

function Head({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      {/* Left floppy ear */}
      <ellipse cx="-16" cy="-2" rx="8" ry="14" fill="#c09060" className="teddy-ear-l" />
      {/* Right floppy ear */}
      <ellipse cx="16" cy="-4" rx="8" ry="14" fill="#c09060" className="teddy-ear-r" />
      {/* Head */}
      <circle cx="0" cy="0" r="20" fill="#d4b07a" />
      {/* Muzzle */}
      <ellipse cx="-4" cy="7" rx="11" ry="8" fill="#e8c88d" />
      {/* Left eye */}
      <circle cx="-7" cy="-4" r="3" fill="#2d1a0e" />
      {/* Right eye */}
      <circle cx="7" cy="-5" r="3" fill="#2d1a0e" />
      {/* Eye shine */}
      <circle cx="-5.5" cy="-5" r="1.2" fill="#fff" />
      <circle cx="8.5" cy="-6" r="1.2" fill="#fff" />
      {/* Nose */}
      <ellipse cx="-2" cy="4" rx="3.5" ry="2.5" fill="#2d1a0e" />
      <ellipse cx="-2.5" cy="3.5" rx="1.3" ry="0.8" fill="#4a3520" />
      {/* Mouth */}
      <path d="M -5 8 Q -2 11 1 8" stroke="#2d1a0e" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Tongue */}
      <ellipse cx="-2" cy="10.5" rx="2.5" ry="3" fill="#e87e7e" className="teddy-tongue" />
      {/* Curly top fur */}
      <path d="M -14 -12 Q -8 -20 0 -18 Q 8 -20 14 -14" stroke="#c09060" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>
  )
}

function Tail({ x1, y1, x2, y2, x3, y3 }: { x1: number; y1: number; x2: number; y2: number; x3: number; y3: number }) {
  return (
    <path
      d={`M ${x1} ${y1} Q ${x2} ${y2} ${x3} ${y3}`}
      stroke="#c09060"
      fill="none"
      strokeWidth="5"
      strokeLinecap="round"
      className="teddy-tail"
    />
  )
}

/* ── Standing Teddy (squats, lunges, jumps, jumping jacks) ── */

function TeddyStanding({ animClass }: { animClass: string }) {
  return (
    <svg viewBox="0 0 160 180" className={`teddy-exercise ${animClass}`} role="img" aria-label="Teddy demonstrating exercise">
      {/* Tail */}
      <g className="teddy-tail-g">
        <Tail x1={105} y1={80} x2={125} y2={65} x3={120} y3={50} />
      </g>
      {/* Body */}
      <ellipse cx="80" cy="88" rx="30" ry="22" fill="#c8a46e" className="teddy-torso" />
      {/* Chest tuft */}
      <ellipse cx="65" cy="82" rx="8" ry="12" fill="#d4b07a" />
      {/* Back legs */}
      <g className="teddy-back-legs">
        <rect x="92" y="104" width="14" height="36" rx="7" fill="#b8883a" className="teddy-leg-bl" />
        <rect x="82" y="104" width="14" height="34" rx="7" fill="#c09060" className="teddy-leg-br" />
        {/* Paws */}
        <ellipse cx="99" cy="140" rx="9" ry="5" fill="#d4b07a" className="teddy-paw-bl" />
        <ellipse cx="89" cy="138" rx="9" ry="5" fill="#d4b07a" className="teddy-paw-br" />
      </g>
      {/* Front legs */}
      <g className="teddy-front-legs">
        <rect x="60" y="102" width="14" height="38" rx="7" fill="#b8883a" className="teddy-leg-fl" />
        <rect x="70" y="102" width="14" height="36" rx="7" fill="#c09060" className="teddy-leg-fr" />
        {/* Paws */}
        <ellipse cx="67" cy="140" rx="9" ry="5" fill="#d4b07a" className="teddy-paw-fl" />
        <ellipse cx="77" cy="138" rx="9" ry="5" fill="#d4b07a" className="teddy-paw-fr" />
      </g>
      {/* Head */}
      <g className="teddy-head">
        <Head cx={58} cy={62} />
      </g>
    </svg>
  )
}

/* ── Plank Teddy (pushups, planks, mountain climbers) ── */

function TeddyPlank({ animClass }: { animClass: string }) {
  return (
    <svg viewBox="0 0 200 140" className={`teddy-exercise ${animClass}`} role="img" aria-label="Teddy demonstrating exercise">
      {/* Tail */}
      <g className="teddy-tail-g">
        <Tail x1={170} y1={58} x2={188} y2={40} x3={182} y3={28} />
      </g>
      {/* Body — horizontal */}
      <ellipse cx="110" cy="65" rx="52" ry="18" fill="#c8a46e" className="teddy-torso" />
      {/* Belly fur */}
      <ellipse cx="100" cy="70" rx="20" ry="8" fill="#d4b07a" />
      {/* Back legs — straight down */}
      <g className="teddy-back-legs">
        <rect x="148" y="76" width="12" height="32" rx="6" fill="#b8883a" className="teddy-leg-bl" />
        <rect x="138" y="76" width="12" height="30" rx="6" fill="#c09060" className="teddy-leg-br" />
        <ellipse cx="154" cy="108" rx="8" ry="4" fill="#d4b07a" className="teddy-paw-bl" />
        <ellipse cx="144" cy="106" rx="8" ry="4" fill="#d4b07a" className="teddy-paw-br" />
      </g>
      {/* Front legs — straight down */}
      <g className="teddy-front-legs">
        <rect x="68" y="76" width="12" height="32" rx="6" fill="#b8883a" className="teddy-leg-fl" />
        <rect x="78" y="76" width="12" height="30" rx="6" fill="#c09060" className="teddy-leg-fr" />
        <ellipse cx="74" cy="108" rx="8" ry="4" fill="#d4b07a" className="teddy-paw-fl" />
        <ellipse cx="84" cy="106" rx="8" ry="4" fill="#d4b07a" className="teddy-paw-fr" />
      </g>
      {/* Head */}
      <g className="teddy-head">
        <Head cx={55} cy={50} scale={0.9} />
      </g>
    </svg>
  )
}

/* ── On-back Teddy (sit-ups, hip bridges) ── */

function TeddyOnBack({ animClass }: { animClass: string }) {
  return (
    <svg viewBox="0 0 200 140" className={`teddy-exercise ${animClass}`} role="img" aria-label="Teddy demonstrating exercise">
      {/* Body — on back, belly up */}
      <ellipse cx="105" cy="80" rx="48" ry="18" fill="#c8a46e" className="teddy-torso" />
      {/* Belly — lighter */}
      <ellipse cx="105" cy="75" rx="30" ry="12" fill="#e8c88d" />
      {/* Back legs — bent up */}
      <g className="teddy-back-legs">
        <rect x="140" y="58" width="12" height="28" rx="6" fill="#b8883a" transform="rotate(30 146 72)" className="teddy-leg-bl" />
        <rect x="150" y="60" width="12" height="26" rx="6" fill="#c09060" transform="rotate(20 156 73)" className="teddy-leg-br" />
        <ellipse cx="155" cy="56" rx="8" ry="4" fill="#d4b07a" className="teddy-paw-bl" />
        <ellipse cx="164" cy="60" rx="8" ry="4" fill="#d4b07a" className="teddy-paw-br" />
      </g>
      {/* Front legs — up in the air */}
      <g className="teddy-front-legs">
        <rect x="62" y="56" width="12" height="28" rx="6" fill="#b8883a" transform="rotate(-30 68 70)" className="teddy-leg-fl" />
        <rect x="72" y="58" width="12" height="26" rx="6" fill="#c09060" transform="rotate(-20 78 71)" className="teddy-leg-fr" />
        <ellipse cx="55" cy="52" rx="8" ry="4" fill="#d4b07a" className="teddy-paw-fl" />
        <ellipse cx="68" cy="56" rx="8" ry="4" fill="#d4b07a" className="teddy-paw-fr" />
      </g>
      {/* Tail */}
      <g className="teddy-tail-g">
        <Tail x1={155} y1={86} x2={172} y2={92} x3={175} y3={82} />
      </g>
      {/* Head */}
      <g className="teddy-head">
        <Head cx={52} cy={68} scale={0.9} />
      </g>
    </svg>
  )
}

/* ── Flying Teddy (supermans) ── */

function TeddyFlying({ animClass }: { animClass: string }) {
  return (
    <svg viewBox="0 0 200 120" className={`teddy-exercise ${animClass}`} role="img" aria-label="Teddy demonstrating exercise">
      {/* Cape / motion lines */}
      <line x1="160" y1="40" x2="185" y2="42" stroke="#ff6b6b" strokeWidth="2" opacity="0.5" className="teddy-speed-line" />
      <line x1="155" y1="52" x2="190" y2="55" stroke="#ff6b6b" strokeWidth="2" opacity="0.4" className="teddy-speed-line" />
      <line x1="158" y1="64" x2="182" y2="66" stroke="#ff6b6b" strokeWidth="2" opacity="0.3" className="teddy-speed-line" />
      {/* Tail — streaming back */}
      <g className="teddy-tail-g">
        <Tail x1={145} y1={55} x2={168} y2={48} x3={175} y3={38} />
      </g>
      {/* Body — horizontal, flying */}
      <ellipse cx="100" cy="55" rx="48" ry="16" fill="#c8a46e" className="teddy-torso" />
      <ellipse cx="90" cy="50" rx="18" ry="8" fill="#d4b07a" />
      {/* Back legs — stretched back */}
      <g className="teddy-back-legs">
        <rect x="135" y="50" width="10" height="28" rx="5" fill="#b8883a" transform="rotate(60 140 64)" className="teddy-leg-bl" />
        <rect x="130" y="52" width="10" height="26" rx="5" fill="#c09060" transform="rotate(50 135 65)" className="teddy-leg-br" />
      </g>
      {/* Front legs — stretched forward */}
      <g className="teddy-front-legs">
        <rect x="55" y="42" width="10" height="28" rx="5" fill="#b8883a" transform="rotate(-50 60 56)" className="teddy-leg-fl" />
        <rect x="62" y="44" width="10" height="26" rx="5" fill="#c09060" transform="rotate(-40 67 57)" className="teddy-leg-fr" />
      </g>
      {/* Head — looking forward/up */}
      <g className="teddy-head">
        <Head cx={48} cy={42} scale={0.85} />
      </g>
    </svg>
  )
}

/* ── Jumping Teddy (tuck jumps, jump squats) ── */

function TeddyJumping({ animClass }: { animClass: string }) {
  return (
    <svg viewBox="0 0 160 180" className={`teddy-exercise ${animClass}`} role="img" aria-label="Teddy demonstrating exercise">
      {/* Ground shadow */}
      <ellipse cx="80" cy="170" rx="30" ry="5" fill="rgba(0,0,0,0.15)" className="teddy-shadow" />
      {/* Tail */}
      <g className="teddy-tail-g">
        <Tail x1={108} y1={72} x2={128} y2={58} x3={122} y3={44} />
      </g>
      {/* Body */}
      <ellipse cx="80" cy="80" rx="28" ry="20" fill="#c8a46e" className="teddy-torso" />
      <ellipse cx="68" cy="76" rx="8" ry="10" fill="#d4b07a" />
      {/* Legs — tucked up */}
      <g className="teddy-back-legs">
        <rect x="92" y="88" width="13" height="22" rx="6.5" fill="#b8883a" transform="rotate(40 98 99)" className="teddy-leg-bl" />
        <rect x="84" y="90" width="13" height="20" rx="6.5" fill="#c09060" transform="rotate(30 90 100)" className="teddy-leg-br" />
      </g>
      <g className="teddy-front-legs">
        <rect x="58" y="86" width="13" height="22" rx="6.5" fill="#b8883a" transform="rotate(-40 64 97)" className="teddy-leg-fl" />
        <rect x="68" y="88" width="13" height="20" rx="6.5" fill="#c09060" transform="rotate(-30 74 98)" className="teddy-leg-fr" />
      </g>
      {/* Head */}
      <g className="teddy-head">
        <Head cx={60} cy={55} />
      </g>
    </svg>
  )
}

/* ── Burpee Teddy — uses standing/plank via CSS class switching ── */

function TeddyBurpee() {
  return (
    <svg viewBox="0 0 160 180" className="teddy-exercise teddy-anim-burpee" role="img" aria-label="Teddy demonstrating exercise">
      {/* Ground shadow */}
      <ellipse cx="80" cy="170" rx="30" ry="5" fill="rgba(0,0,0,0.15)" className="teddy-shadow" />
      {/* Tail */}
      <g className="teddy-tail-g">
        <Tail x1={108} y1={80} x2={126} y2={65} x3={122} y3={50} />
      </g>
      {/* Body */}
      <ellipse cx="80" cy="88" rx="30" ry="22" fill="#c8a46e" className="teddy-torso" />
      <ellipse cx="66" cy="82" rx="8" ry="12" fill="#d4b07a" />
      {/* Back legs */}
      <g className="teddy-back-legs">
        <rect x="92" y="104" width="14" height="36" rx="7" fill="#b8883a" className="teddy-leg-bl" />
        <rect x="82" y="104" width="14" height="34" rx="7" fill="#c09060" className="teddy-leg-br" />
        <ellipse cx="99" cy="140" rx="9" ry="5" fill="#d4b07a" className="teddy-paw-bl" />
        <ellipse cx="89" cy="138" rx="9" ry="5" fill="#d4b07a" className="teddy-paw-br" />
      </g>
      {/* Front legs */}
      <g className="teddy-front-legs">
        <rect x="60" y="102" width="14" height="38" rx="7" fill="#b8883a" className="teddy-leg-fl" />
        <rect x="70" y="102" width="14" height="36" rx="7" fill="#c09060" className="teddy-leg-fr" />
        <ellipse cx="67" cy="140" rx="9" ry="5" fill="#d4b07a" className="teddy-paw-fl" />
        <ellipse cx="77" cy="138" rx="9" ry="5" fill="#d4b07a" className="teddy-paw-fr" />
      </g>
      {/* Head */}
      <g className="teddy-head">
        <Head cx={58} cy={62} />
      </g>
    </svg>
  )
}

/* ── Main Component ── */

export function TeddyExercise({ exerciseId }: Props) {
  switch (exerciseId) {
    // Standing exercises
    case 'squats':
      return <TeddyStanding animClass="teddy-anim-squat" />
    case 'lunges':
      return <TeddyStanding animClass="teddy-anim-lunge" />
    case 'jumping-jacks':
      return <TeddyStanding animClass="teddy-anim-jacks" />

    // Jumping exercises
    case 'jumps':
      return <TeddyJumping animClass="teddy-anim-jump" />
    case 'jump-squats':
      return <TeddyJumping animClass="teddy-anim-jumpsquat" />

    // Plank/floor exercises
    case 'pushups':
      return <TeddyPlank animClass="teddy-anim-pushup" />
    case 'planks':
      return <TeddyPlank animClass="teddy-anim-plank" />
    case 'mountain-climbers':
      return <TeddyPlank animClass="teddy-anim-climb" />

    // On-back exercises
    case 'situps':
      return <TeddyOnBack animClass="teddy-anim-situp" />
    case 'hip-bridges':
      return <TeddyOnBack animClass="teddy-anim-bridge" />

    // Flying
    case 'supermans':
      return <TeddyFlying animClass="teddy-anim-superman" />

    // Multi-phase
    case 'burpees':
      return <TeddyBurpee />

    default:
      return <TeddyStanding animClass="teddy-anim-squat" />
  }
}
