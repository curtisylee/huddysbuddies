type Props = {
  exerciseId: string
}

const ANIM_MAP: Record<string, string> = {
  'situps': 'teddy-anim-situp',
  'lunges': 'teddy-anim-lunge',
  'planks': 'teddy-anim-plank',
  'squats': 'teddy-anim-squat',
  'jumps': 'teddy-anim-jump',
  'pushups': 'teddy-anim-pushup',
  'burpees': 'teddy-anim-burpee',
  'jump-squats': 'teddy-anim-squat',
  'jumping-jacks': 'teddy-anim-jacks',
  'mountain-climbers': 'teddy-anim-climb',
  'hip-bridges': 'teddy-anim-bridge',
  'supermans': 'teddy-anim-superman',
}

export function TeddyExercise({ exerciseId }: Props) {
  const animClass = ANIM_MAP[exerciseId] ?? 'teddy-anim-squat'

  return (
    <svg
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
      className={`teddy-exercise ${animClass}`}
      aria-label="Teddy the goldendoodle demonstrating the exercise"
      role="img"
    >
      <g className="teddy-body">
        {/* Tail — curly */}
        <path
          d="M 120 100 Q 138 92 134 76 Q 130 62 120 66"
          stroke="#c09060"
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Body */}
        <ellipse cx="80" cy="108" rx="38" ry="26" fill="#c8a46e" />

        {/* Back left leg */}
        <rect x="100" y="126" width="12" height="22" rx="6" fill="#b8883a" />
        {/* Back right leg */}
        <rect x="88" y="128" width="12" height="20" rx="6" fill="#c09060" />
        {/* Front left leg */}
        <rect x="58" y="126" width="12" height="22" rx="6" fill="#b8883a" />
        {/* Front right leg */}
        <rect x="70" y="128" width="12" height="20" rx="6" fill="#c09060" />

        {/* Chest tuft */}
        <ellipse cx="62" cy="102" rx="10" ry="14" fill="#d4b07a" />

        {/* Head */}
        <circle cx="52" cy="78" r="24" fill="#d4b07a" />

        {/* Left floppy ear */}
        <ellipse cx="34" cy="76" rx="9" ry="16" fill="#c09060" transform="rotate(-10 34 76)" />
        {/* Right floppy ear */}
        <ellipse cx="70" cy="74" rx="9" ry="16" fill="#c09060" transform="rotate(10 70 74)" />

        {/* Face fur — lighter muzzle */}
        <ellipse cx="46" cy="86" rx="12" ry="9" fill="#e8c88d" />

        {/* Left eye */}
        <circle cx="44" cy="74" r="3.5" fill="#2d1a0e" />
        {/* Right eye */}
        <circle cx="60" cy="73" r="3.5" fill="#2d1a0e" />
        {/* Eye shine */}
        <circle cx="45.5" cy="73" r="1.2" fill="#fff" />
        <circle cx="61.5" cy="72" r="1.2" fill="#fff" />

        {/* Nose */}
        <ellipse cx="48" cy="83" rx="4" ry="3" fill="#2d1a0e" />
        {/* Nose shine */}
        <ellipse cx="47" cy="82" rx="1.5" ry="1" fill="#4a3520" />

        {/* Mouth */}
        <path
          d="M 44 87 Q 48 91 52 87"
          stroke="#2d1a0e"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Tongue — cute detail */}
        <ellipse cx="48" cy="90" rx="3" ry="3.5" fill="#e87e7e" />

        {/* Curly top fur */}
        <path
          d="M 34 66 Q 40 56 48 58 Q 56 56 64 62"
          stroke="#c09060"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
