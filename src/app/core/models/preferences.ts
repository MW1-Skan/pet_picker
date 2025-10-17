export type ActivityLevel = 'low' | 'moderate' | 'high';
export type TimeAtHome = 'mostly-home' | 'balanced' | 'away-often';
export type TravelFrequency = 'rarely' | 'sometimes' | 'frequently';
export type GroomingTolerance = 'minimal' | 'weekly' | 'daily';
export type SheddingTolerance = 'low' | 'moderate' | 'no-preference';
export type AllergySensitivity = 'none' | 'mild' | 'severe';
export type BudgetComfort = 'tight' | 'average' | 'flexible';
export type TrainingExperience = 'first-timer' | 'some-experience' | 'seasoned';
export type TemperamentPreference = 'affectionate' | 'independent' | 'protective' | 'playful' | 'calm';
export type CompanionGoal = 'cozy-companion' | 'adventure-buddy' | 'therapy-emotional';
export type SizePreference = 'toy' | 'small' | 'medium' | 'large' | 'giant' | 'no-preference';
export type VocalTolerance = 'prefer-quiet' | 'okay-chatty' | 'love-talkative';

export interface PreferencesFormValue {
  speciesInterest: 'dog' | 'cat' | 'either';
  householdAdults: number;
  householdKids: 'none' | 'under10' | 'mixed-ages';
  otherPets: 'none' | 'dog' | 'cat' | 'mixed';
  housingType: 'apartment' | 'small-home' | 'large-home' | 'rural-property';
  outdoorAccess: 'none' | 'shared' | 'private-yard' | 'open-land';
  activityLevel: ActivityLevel;
  timeAtHome: TimeAtHome;
  travelFrequency: TravelFrequency;
  groomingTolerance: GroomingTolerance;
  sheddingTolerance: SheddingTolerance;
  allergySensitivity: AllergySensitivity;
  budgetComfort: BudgetComfort;
  trainingExperience: TrainingExperience;
  temperamentPreferences: TemperamentPreference[];
  companionGoal: CompanionGoal;
  sizePreference: SizePreference;
  vocalTolerance: VocalTolerance;
  wantsHypoallergenic: boolean;
  likesOutdoorAdventures: boolean;
  prefersLowMaintenance: boolean;
}
