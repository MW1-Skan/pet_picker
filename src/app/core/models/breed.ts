export type Species = 'dog' | 'cat';

export type SizeCategory = 'toy' | 'small' | 'medium' | 'large' | 'giant';
export type EnergyLevel = 'low' | 'moderate' | 'high';
export type CareLevel = 'low' | 'moderate' | 'high';
export type CompatibilityLevel = 'low' | 'moderate' | 'high';
export type VocalityLevel = 'quiet' | 'moderate' | 'chatty';

export type HousingType = 'apartment' | 'small-home' | 'large-home' | 'rural-property';
export type OutdoorAccess = 'indoors-only' | 'small-patio' | 'fenced-yard' | 'acreage';

export type TemperamentTag =
  | 'affectionate'
  | 'independent'
  | 'protective'
  | 'playful'
  | 'calm'
  | 'sensitive'
  | 'curious'
  | 'gentle'
  | 'energetic'
  | 'loyal'
  | 'vocal'
  | 'adaptable';

export type LifestyleMatchTag =
  | 'great-with-kids'
  | 'good-with-other-pets'
  | 'suits-first-time-owner'
  | 'needs-experienced-handler'
  | 'travel-friendly'
  | 'homebody-companion'
  | 'apartment-friendly'
  | 'space-loving'
  | 'hypoallergenic'
  | 'low-shedding'
  | 'outdoor-adventurer'
  | 'therapy-suitable';

export interface Breed {
  id: string;
  name: string;
  species: Species;
  size: SizeCategory;
  energyLevel: EnergyLevel;
  groomingLevel: CareLevel;
  sheddingLevel: CareLevel;
  trainingLevel: CareLevel;
  exerciseNeeds: CareLevel;
  vocality: VocalityLevel;
  hypoallergenic: boolean;
  coatType: 'short' | 'medium' | 'long' | 'hairless' | 'wire' | 'curly';
  kidFriendly: CompatibilityLevel;
  petFriendly: CompatibilityLevel;
  housing: HousingType[];
  outdoorAccess: OutdoorAccess[];
  temperament: TemperamentTag[];
  lifestyleMatches: LifestyleMatchTag[];
  budget: CareLevel;
  indoorPreference: 'indoor' | 'flexible' | 'outdoor-companion';
  summary: string;
  description: string;
  imageUrl: string;
  origin?: string;
}

export interface BreedMatch {
  breed: Breed;
  score: number;
  reasons: string[];
  nearMiss?: boolean;
}
