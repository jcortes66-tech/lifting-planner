export type ExerciseGuide = {
  name: string;
  description: string;
  equipment: string;
  difficulty: string;
  primaryMuscles: string;
  setup: string[];
  movement: string[];
  commonMistakes: string[];
};

export type GuideGroup = {
  muscleGroup: string;
  exercises: ExerciseGuide[];
};

export const EXERCISE_GUIDES: GuideGroup[] = [
  {
    muscleGroup: 'Legs',
    exercises: [
      {
        name: 'Barbell Back Squat',
        description:
          'A compound lower-body exercise that strengthens the quadriceps, glutes, and core while improving overall lower-body strength and stability.',
        equipment: 'Barbell, Squat Rack',
        difficulty: 'Intermediate',
        primaryMuscles: 'Quadriceps, Glutes',
        setup: [
          'Position the barbell across your upper back, resting securely on your upper traps.',
          'Stand with your feet approximately shoulder-width apart.',
          'Point your toes slightly outward.',
          'Brace your core and maintain a neutral spine.',
        ],
        movement: [
          'Unrack the bar and take a few controlled steps backward.',
          'Bend your hips and knees to lower into a squat.',
          'Keep your knees tracking in the same direction as your toes.',
          'Lower until your thighs are approximately parallel to the floor, or as deep as you can comfortably maintain proper form.',
          'Push through your feet to return to the standing position.',
        ],
        commonMistakes: [
          'Allowing your knees to collapse inward.',
          'Lifting your heels off the ground.',
          'Rounding your lower back.',
          'Using excessively heavy weights.',
          'Leaning too far forward during the movement.',
        ],
      },
      {
        name: 'Romanian Deadlift (RDL)',
        description:
          'A hip-hinge exercise that targets the hamstrings and glutes while improving posterior-chain strength and hip mobility.',
        equipment: 'Barbell or Dumbbells',
        difficulty: 'Beginner',
        primaryMuscles: 'Hamstrings, Glutes',
        setup: [
          'Stand with your feet hip-width apart.',
          'Hold a barbell or dumbbells in front of your thighs.',
          'Maintain a slight bend in your knees.',
          'Keep your shoulders stable and spine neutral.',
        ],
        movement: [
          'Push your hips backward while keeping the weights close to your legs.',
          'Lower the weights slowly along your thighs and shins.',
          'Maintain a slight bend in your knees throughout the movement.',
          'Stop when you feel a comfortable stretch in your hamstrings without rounding your back.',
          'Drive your hips forward to return to the starting position.',
        ],
        commonMistakes: [
          'Rounding your back.',
          'Bending your knees excessively.',
          'Allowing the weights to drift too far away from your legs.',
          'Lowering the weights beyond your available hip mobility.',
          'Leaning backward excessively at the top.',
        ],
      },
    ],
  },
  {
    muscleGroup: 'Back',
    exercises: [
      {
        name: 'Lat Pulldown',
        description:
          'An upper-body pulling exercise that primarily targets the latissimus dorsi, helping develop back width, strength, and pulling control.',
        equipment: 'Lat Pulldown Machine',
        difficulty: 'Beginner',
        primaryMuscles: 'Lats (Upper Back)',
        setup: [
          'Sit at a lat pulldown machine.',
          'Adjust the thigh pad to secure your legs.',
          'Grip the bar slightly wider than shoulder-width.',
          'Keep your chest lifted and core engaged.',
        ],
        movement: [
          'Begin with your arms fully extended overhead.',
          'Pull your elbows downward toward your sides.',
          'Bring the bar toward your upper chest.',
          'Pause briefly while squeezing your back muscles.',
          'Slowly return the bar overhead with control.',
        ],
        commonMistakes: [
          'Pulling the bar behind your neck.',
          'Leaning excessively backward.',
          'Using momentum to move the weight.',
          'Shrugging your shoulders during the pull.',
          'Releasing the weight too quickly.',
        ],
      },
      {
        name: 'Seated Cable Row',
        description:
          'A compound pulling exercise targeting the middle back and lats to build upper-body strength and improve posture.',
        equipment: 'Cable Row Machine',
        difficulty: 'Beginner',
        primaryMuscles: 'Middle Back, Lats',
        setup: [
          'Sit at a cable row machine with your feet secured.',
          'Grab the handle with both hands.',
          'Keep your knees slightly bent.',
          'Sit tall with your spine neutral and shoulders relaxed.',
        ],
        movement: [
          'Begin with your arms extended in front of you.',
          'Pull the handle toward your lower ribs or upper abdomen.',
          'Drive your elbows backward close to your body.',
          'Squeeze your shoulder blades together briefly.',
          'Slowly extend your arms to return to the starting position.',
        ],
        commonMistakes: [
          'Rounding your back.',
          'Rocking your torso excessively.',
          'Pulling primarily with your arms instead of engaging your back.',
          'Shrugging your shoulders.',
          'Using more weight than you can control.',
        ],
      },
    ],
  },
  {
    muscleGroup: 'Chest',
    exercises: [
      {
        name: 'Incline Dumbbell Press',
        description:
          'An upper-body pressing exercise that emphasizes the upper chest while strengthening the shoulders and triceps.',
        equipment: 'Dumbbells, Incline Bench',
        difficulty: 'Intermediate',
        primaryMuscles: 'Upper Chest',
        setup: [
          'Adjust a bench to a 15–30° incline.',
          'Sit with a dumbbell in each hand.',
          'Position the dumbbells near your upper chest.',
          'Plant your feet firmly on the ground.',
          'Keep your shoulder blades stable against the bench.',
        ],
        movement: [
          'Press the dumbbells upward until your arms are nearly straight.',
          'Keep your wrists aligned with your forearms.',
          'Slowly lower the weights toward your upper chest.',
          'Maintain a comfortable elbow angle throughout the movement.',
          'Press the dumbbells upward to return to the starting position.',
        ],
        commonMistakes: [
          'Setting the bench too upright.',
          'Flaring your elbows excessively.',
          'Bouncing or rushing through repetitions.',
          'Allowing your wrists to bend backward.',
          'Using weights that are too heavy to control.',
        ],
      },
      {
        name: 'Cable Chest Fly',
        description:
          'A chest isolation exercise that strengthens the chest muscles through controlled movement and consistent cable resistance.',
        equipment: 'Cable Machine, Cable Handles',
        difficulty: 'Beginner',
        primaryMuscles: 'Chest',
        setup: [
          'Adjust both cable pulleys to approximately chest height.',
          'Attach a handle to each pulley.',
          'Stand centered between the cables with one foot slightly forward.',
          'Maintain a slight bend in your elbows.',
          'Engage your core and keep your torso stable.',
        ],
        movement: [
          'Begin with your arms open to your sides.',
          'Bring both handles together in front of your chest.',
          'Keep a consistent slight bend in your elbows.',
          'Squeeze your chest muscles briefly.',
          'Slowly return your arms to the starting position.',
        ],
        commonMistakes: [
          'Using excessively heavy weights.',
          'Straightening and bending your elbows repeatedly.',
          'Stretching your arms too far behind your body.',
          'Using momentum to bring the handles together.',
          'Rounding your shoulders excessively.',
        ],
      },
      {
        name: 'Barbell Bench Press',
        description:
          'A classic compound upper-body press that develops chest strength while engaging the shoulders and triceps.',
        equipment: 'Barbell, Flat Bench, Rack',
        difficulty: 'Intermediate',
        primaryMuscles: 'Chest',
        setup: [
          'Lie on the bench with your eyes directly under the bar.',
          'Squeeze your shoulder blades together and down.',
          'Plant your feet firmly on the ground.',
          'Maintain a slight natural arch in your lower back.',
          'Position your hands slightly wider than shoulder-width apart.',
        ],
        movement: [
          'Grip the bar and unrack it with straight arms.',
          'Lower the bar slowly toward your lower chest.',
          'Keep your elbows at approximately 45° from your torso.',
          'Press the bar upward and slightly backward toward your starting position.',
          'Extend your arms without losing your shoulder-blade position.',
        ],
        commonMistakes: [
          'Flaring your elbows straight out to the sides.',
          'Bouncing the bar off your chest.',
          'Lifting your hips off the bench.',
          'Allowing your wrists to bend excessively.',
          'Using excessively heavy weights without appropriate safety precautions.',
        ],
      },
    ],
  },
  {
    muscleGroup: 'Shoulders',
    exercises: [
      {
        name: 'Dumbbell Shoulder Press',
        description:
          'An overhead pressing exercise that targets the shoulders and triceps to build strength, stability, and upper-body control.',
        equipment: 'Dumbbells, Bench (Optional)',
        difficulty: 'Beginner',
        primaryMuscles: 'Shoulders (Front and Side)',
        setup: [
          'Sit on a bench with back support or stand upright.',
          'Hold a dumbbell in each hand at shoulder height.',
          'Position your palms facing forward or slightly inward.',
          'Keep your wrists straight.',
          'Engage your core and maintain a stable torso.',
        ],
        movement: [
          'Press both dumbbells upward above your head.',
          'Keep your forearms approximately vertical.',
          'Extend your arms overhead without forcing a hard elbow lockout.',
          'Slowly lower the dumbbells to shoulder level.',
          'Repeat while maintaining a stable torso.',
        ],
        commonMistakes: [
          'Arching your lower back excessively.',
          'Using momentum to lift the weights.',
          'Flaring your elbows into an uncomfortable position.',
          'Lowering the weights too quickly.',
          'Using weights that compromise your range of motion.',
        ],
      },
      {
        name: 'Dumbbell Lateral Raise',
        description:
          'A shoulder isolation exercise primarily targeting the side shoulders to develop shoulder width, definition, and control.',
        equipment: 'Dumbbells',
        difficulty: 'Beginner',
        primaryMuscles: 'Side Shoulders',
        setup: [
          'Stand with your feet hip-width apart.',
          'Hold a dumbbell in each hand at your sides.',
          'Maintain a slight bend in your elbows.',
          'Keep your chest lifted and core engaged.',
        ],
        movement: [
          'Raise both arms outward to your sides.',
          'Lead with your upper arms while maintaining a slight elbow bend.',
          'Lift until your arms reach approximately shoulder height.',
          'Pause briefly at the top.',
          'Slowly lower the dumbbells to your sides.',
        ],
        commonMistakes: [
          'Swinging your body to lift the weights.',
          'Shrugging your shoulders excessively.',
          'Raising the dumbbells far above shoulder height.',
          'Using weights that are too heavy.',
          'Lowering the weights without control.',
        ],
      },
    ],
  },
  {
    muscleGroup: 'Arms',
    exercises: [
      {
        name: 'Dumbbell Bicep Curl',
        description:
          'An isolation exercise that targets the biceps to improve arm strength, muscular development, and elbow control.',
        equipment: 'Dumbbells',
        difficulty: 'Beginner',
        primaryMuscles: 'Biceps',
        setup: [
          'Stand upright with your feet hip-width apart.',
          'Hold a dumbbell in each hand.',
          'Position your palms facing forward.',
          'Keep your elbows close to your sides.',
          'Engage your core and maintain an upright posture.',
        ],
        movement: [
          'Bend your elbows to curl the dumbbells upward.',
          'Keep your upper arms relatively stationary.',
          'Lift until the dumbbells approach your shoulders.',
          'Squeeze your biceps briefly at the top.',
          'Slowly lower the dumbbells until your arms are extended.',
        ],
        commonMistakes: [
          'Swinging the dumbbells.',
          'Moving your elbows excessively forward.',
          'Leaning backward to lift heavier weights.',
          'Lowering the weights too quickly.',
          'Using excessive weight instead of proper technique.',
        ],
      },
      {
        name: 'Tricep Rope Pushdown',
        description:
          'A cable isolation exercise that targets the triceps to build arm strength, definition, and control.',
        equipment: 'Cable Machine, Rope Attachment',
        difficulty: 'Beginner',
        primaryMuscles: 'Triceps',
        setup: [
          'Attach a rope handle to a high cable pulley.',
          'Stand facing the machine.',
          'Hold each end of the rope with a neutral grip.',
          'Keep your elbows close to your torso.',
          'Maintain a stable stance with your core engaged.',
        ],
        movement: [
          'Begin with your elbows bent and hands near your upper chest.',
          'Push the rope downward by extending your elbows.',
          'Separate the rope ends slightly near the bottom.',
          'Squeeze your triceps briefly when your arms are straight.',
          'Slowly return to the starting position.',
        ],
        commonMistakes: [
          'Allowing your elbows to swing forward.',
          'Using your body weight to push the cable.',
          'Rounding your shoulders excessively.',
          'Allowing the weight to pull your hands upward too quickly.',
          'Using excessive momentum.',
        ],
      },
    ],
  },
  {
    muscleGroup: 'Core',
    exercises: [
      {
        name: 'Plank',
        description:
          'A bodyweight core exercise that strengthens the abdominal muscles, improves stability, and develops muscular endurance.',
        equipment: 'Bodyweight, Exercise Mat (Optional)',
        difficulty: 'Beginner',
        primaryMuscles: 'Abs, Core',
        setup: [
          'Position your forearms on the floor.',
          'Align your elbows directly beneath your shoulders.',
          'Extend your legs behind you with your toes on the ground.',
          'Keep your body in a straight line from head to heels.',
          'Brace your abdominal muscles.',
        ],
        movement: [
          'Engage your core to maintain a stable position.',
          'Squeeze your glutes to prevent your hips from sagging.',
          'Keep your neck neutral and look toward the floor.',
          'Hold the position while breathing steadily.',
          'Lower your knees to the floor when you can no longer maintain proper form.',
        ],
        commonMistakes: [
          'Allowing your hips to sag.',
          'Raising your hips excessively.',
          'Holding your breath.',
          'Looking upward and straining your neck.',
          'Continuing the exercise after losing proper alignment.',
        ],
      },
      {
        name: 'Hanging Knee Raise',
        description:
          'A core exercise that targets the abdominal muscles through controlled knee and hip movement while improving core stability.',
        equipment: 'Pull-Up Bar',
        difficulty: 'Intermediate',
        primaryMuscles: 'Abs, Hip Flexors',
        setup: [
          'Hang from a pull-up bar with your hands approximately shoulder-width apart.',
          'Keep your arms straight and shoulders engaged.',
          'Allow your legs to hang naturally.',
          'Brace your core to minimize swinging.',
        ],
        movement: [
          'Bend your knees and slowly raise them toward your chest.',
          'Gently curl your pelvis upward to engage your abdominal muscles.',
          'Pause briefly at the top.',
          'Lower your legs slowly to the starting position.',
          'Repeat without swinging your body.',
        ],
        commonMistakes: [
          'Using momentum to lift your knees.',
          'Swinging your legs excessively.',
          'Dropping your legs too quickly.',
          'Failing to engage your abdominal muscles.',
          'Allowing your shoulders to become unstable while hanging.',
        ],
      },
    ],
  },
];