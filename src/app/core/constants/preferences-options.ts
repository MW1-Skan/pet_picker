import { PreferencesFormValue, TemperamentPreference } from '../models/preferences';

export const SPECIES_OPTIONS: Array<{ label: string; value: PreferencesFormValue['speciesInterest'] }> = [
  { label: 'Dogs', value: 'dog' },
  { label: 'Cats', value: 'cat' },
  { label: 'Either', value: 'either' },
];

export const HOUSING_OPTIONS = [
  { label: 'Apartment / Condo', value: 'apartment' },
  { label: 'Small Home / Townhouse', value: 'small-home' },
  { label: 'Spacious Home', value: 'large-home' },
  { label: 'Rural Property / Farm', value: 'rural-property' },
];

export const OUTDOOR_ACCESS_OPTIONS = [
  { label: 'No outdoor space', value: 'none' },
  { label: 'Shared courtyard / balcony', value: 'shared' },
  { label: 'Private fenced yard', value: 'private-yard' },
  { label: 'Acreage / open land', value: 'open-land' },
];

export const ACTIVITY_LEVEL_OPTIONS = [
  { label: 'Relaxed', value: 'low' },
  { label: 'Balanced', value: 'moderate' },
  { label: 'High-energy', value: 'high' },
];

export const TIME_AT_HOME_OPTIONS = [
  { label: 'Mostly at home', value: 'mostly-home' },
  { label: 'Split between home and away', value: 'balanced' },
  { label: 'Away from home often', value: 'away-often' },
];

export const TRAVEL_FREQUENCY_OPTIONS = [
  { label: 'Rarely travel', value: 'rarely' },
  { label: 'Sometimes travel', value: 'sometimes' },
  { label: 'Travel frequently', value: 'frequently' },
];

export const GROOMING_TOLERANCE_OPTIONS = [
  { label: 'Minimal brushing', value: 'minimal' },
  { label: 'Weekly brushing', value: 'weekly' },
  { label: 'Daily grooming is fine', value: 'daily' },
];

export const SHEDDING_TOLERANCE_OPTIONS = [
  { label: 'Prefer very low shedding', value: 'low' },
  { label: 'Some shedding is fine', value: 'moderate' },
  { label: 'No preference', value: 'no-preference' },
];

export const ALLERGY_SENSITIVITY_OPTIONS = [
  { label: 'No allergies', value: 'none' },
  { label: 'Mild allergies', value: 'mild' },
  { label: 'Severe allergies', value: 'severe' },
];

export const BUDGET_COMFORT_OPTIONS = [
  { label: 'Tight budget', value: 'tight' },
  { label: 'Average pet budget', value: 'average' },
  { label: 'Flexible budget', value: 'flexible' },
];

export const TRAINING_EXPERIENCE_OPTIONS = [
  { label: 'First-time pet parent', value: 'first-timer' },
  { label: 'Some experience', value: 'some-experience' },
  { label: 'Seasoned trainer', value: 'seasoned' },
];

export const TEMPERAMENT_TAGS = [
  { label: 'Affectionate', value: 'affectionate' },
  { label: 'Calm', value: 'calm' },
  { label: 'Independent', value: 'independent' },
  { label: 'Playful', value: 'playful' },
  { label: 'Protective', value: 'protective' },
] as const satisfies ReadonlyArray<{ label: string; value: TemperamentPreference }>;

export const COMPANION_GOAL_OPTIONS = [
  { label: 'Cozy companion', value: 'cozy-companion' },
  { label: 'Adventure partner', value: 'adventure-buddy' },
  { label: 'Therapy or emotional support', value: 'therapy-emotional' },
];

export const SIZE_PREFERENCE_OPTIONS = [
  { label: 'Toy', value: 'toy' },
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Giant', value: 'giant' },
  { label: 'No preference', value: 'no-preference' },
];

export const VOCAL_TOLERANCE_OPTIONS = [
  { label: 'Prefer a quiet companion', value: 'prefer-quiet' },
  { label: 'Some vocalizing is fine', value: 'okay-chatty' },
  { label: 'I enjoy talkative pets', value: 'love-talkative' },
];

export const KID_PRESENCE_OPTIONS = [
  { label: 'No kids', value: 'none' },
  { label: 'Kids under 10', value: 'under10' },
  { label: 'Kids of different ages', value: 'mixed-ages' },
];

export const OTHER_PETS_OPTIONS = [
  { label: 'No other pets', value: 'none' },
  { label: 'Another dog', value: 'dog' },
  { label: 'Another cat', value: 'cat' },
  { label: 'Multiple pets', value: 'mixed' },
];
