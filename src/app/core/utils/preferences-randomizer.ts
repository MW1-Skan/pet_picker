import { DEFAULT_PREFERENCES } from '../constants/default-preferences';
import {
  CompanionGoal,
  PreferencesFormValue,
  TemperamentPreference,
} from '../models/preferences';

const SPECIES_VALUES = ['dog', 'cat', 'either'] as const satisfies ReadonlyArray<
  PreferencesFormValue['speciesInterest']
>;
const HOUSING_VALUES = ['apartment', 'small-home', 'large-home', 'rural-property'] as const satisfies ReadonlyArray<
  PreferencesFormValue['housingType']
>;
const OUTDOOR_VALUES = ['none', 'shared', 'private-yard', 'open-land'] as const satisfies ReadonlyArray<
  PreferencesFormValue['outdoorAccess']
>;
const ACTIVITY_VALUES = ['low', 'moderate', 'high'] as const satisfies ReadonlyArray<
  PreferencesFormValue['activityLevel']
>;
const HOME_TIME_VALUES = ['mostly-home', 'balanced', 'away-often'] as const satisfies ReadonlyArray<
  PreferencesFormValue['timeAtHome']
>;
const TRAVEL_VALUES = ['rarely', 'sometimes', 'frequently'] as const satisfies ReadonlyArray<
  PreferencesFormValue['travelFrequency']
>;
const GROOMING_VALUES = ['minimal', 'weekly', 'daily'] as const satisfies ReadonlyArray<
  PreferencesFormValue['groomingTolerance']
>;
const SHEDDING_VALUES = ['low', 'moderate', 'no-preference'] as const satisfies ReadonlyArray<
  PreferencesFormValue['sheddingTolerance']
>;
const ALLERGY_VALUES = ['none', 'mild', 'severe'] as const satisfies ReadonlyArray<
  PreferencesFormValue['allergySensitivity']
>;
const BUDGET_VALUES = ['tight', 'average', 'flexible'] as const satisfies ReadonlyArray<
  PreferencesFormValue['budgetComfort']
>;
const EXPERIENCE_VALUES = ['first-timer', 'some-experience', 'seasoned'] as const satisfies ReadonlyArray<
  PreferencesFormValue['trainingExperience']
>;
const KID_VALUES = ['none', 'under10', 'mixed-ages'] as const satisfies ReadonlyArray<
  PreferencesFormValue['householdKids']
>;
const OTHER_PETS_VALUES = ['none', 'dog', 'cat', 'mixed'] as const satisfies ReadonlyArray<
  PreferencesFormValue['otherPets']
>;
const COMPANION_VALUES = ['cozy-companion', 'adventure-buddy', 'therapy-emotional'] as const satisfies ReadonlyArray<
  CompanionGoal
>;
const SIZE_VALUES = ['toy', 'small', 'medium', 'large', 'giant', 'no-preference'] as const satisfies ReadonlyArray<
  PreferencesFormValue['sizePreference']
>;
const VOCAL_VALUES = ['prefer-quiet', 'okay-chatty', 'love-talkative'] as const satisfies ReadonlyArray<
  PreferencesFormValue['vocalTolerance']
>;
const TEMPERAMENT_VALUES: readonly TemperamentPreference[] = [
  'affectionate',
  'calm',
  'independent',
  'playful',
  'protective',
];

function pick<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)]!;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickTemperaments(): TemperamentPreference[] {
  const shuffled = [...TEMPERAMENT_VALUES].sort(() => Math.random() - 0.5);
  const count = randomInt(1, Math.min(3, TEMPERAMENT_VALUES.length));
  return shuffled.slice(0, count);
}

export function generateRandomPreferences(): PreferencesFormValue {
  return {
    ...DEFAULT_PREFERENCES,
    speciesInterest: pick(SPECIES_VALUES),
    householdAdults: randomInt(1, 4),
    householdKids: pick(KID_VALUES),
    otherPets: pick(OTHER_PETS_VALUES),
    housingType: pick(HOUSING_VALUES),
    outdoorAccess: pick(OUTDOOR_VALUES),
    activityLevel: pick(ACTIVITY_VALUES),
    timeAtHome: pick(HOME_TIME_VALUES),
    travelFrequency: pick(TRAVEL_VALUES),
    groomingTolerance: pick(GROOMING_VALUES),
    sheddingTolerance: pick(SHEDDING_VALUES),
    allergySensitivity: pick(ALLERGY_VALUES),
    budgetComfort: pick(BUDGET_VALUES),
    trainingExperience: pick(EXPERIENCE_VALUES),
    temperamentPreferences: pickTemperaments(),
    companionGoal: pick(COMPANION_VALUES),
    sizePreference: pick(SIZE_VALUES),
    vocalTolerance: pick(VOCAL_VALUES),
    wantsHypoallergenic: Math.random() < 0.35,
    likesOutdoorAdventures: Math.random() < 0.5,
    prefersLowMaintenance: Math.random() < 0.5,
  };
}
