import { Injectable } from '@angular/core';

import { BREEDS } from '../data/breeds.data';
import {
  Breed,
  BreedMatch,
  CareLevel,
  HousingType,
  LifestyleMatchTag,
  OutdoorAccess,
  Species,
  TemperamentTag,
  VocalityLevel,
} from '../models/breed';
import { PreferencesFormValue } from '../models/preferences';

interface ScoringResult extends BreedMatch {
  penalty: number;
}

const SIZE_ORDER: Array<Breed['size']> = ['toy', 'small', 'medium', 'large', 'giant'];

const ENERGY_WEIGHT = 24;
const SIZE_WEIGHT = 22;
const GROOMING_WEIGHT = 18;
const SHEDDING_WEIGHT = 18;
const TEMPERAMENT_WEIGHT = 8;
const TRAINING_WEIGHT = 16;
const BUDGET_WEIGHT = 12;
const COMPANION_GOAL_WEIGHT = 16;
const OUTDOOR_WEIGHT = 15;
const VOCAL_WEIGHT = 10;
const KID_FRIENDLY_WEIGHT = 20;
const PET_FRIENDLY_WEIGHT = 16;

const HOUSING_FALLBACK: Record<PreferencesFormValue['housingType'], HousingType[]> = {
  apartment: ['apartment', 'small-home'],
  'small-home': ['small-home', 'large-home'],
  'large-home': ['large-home', 'rural-property'],
  'rural-property': ['large-home', 'rural-property'],
};

const OUTDOOR_MAP: Record<PreferencesFormValue['outdoorAccess'], OutdoorAccess[]> = {
  none: ['indoors-only'],
  shared: ['indoors-only', 'small-patio'],
  'private-yard': ['small-patio', 'fenced-yard'],
  'open-land': ['fenced-yard', 'acreage'],
};

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  recommend(preferences: PreferencesFormValue): BreedMatch[] {
    const speciesPool = this.resolveSpeciesPool(preferences.speciesInterest);
    const enforceHypo = preferences.wantsHypoallergenic || preferences.allergySensitivity === 'severe';

    let filtered = BREEDS.filter((breed) => speciesPool.includes(breed.species));
    filtered = this.applyCoreFilters(filtered, preferences, enforceHypo);

    if (!filtered.length) {
      // Relax housing/outdoor constraints slightly to find near-miss options.
      filtered = BREEDS.filter((breed) => speciesPool.includes(breed.species)).filter((breed) =>
        this.matchesHousingFallback(breed, preferences)
      );
      if (enforceHypo) {
        filtered = filtered.filter((breed) => breed.hypoallergenic);
      }
    }

    const scored = filtered
      .map((breed) => this.scoreBreed(breed, preferences))
      .sort((a, b) => b.score - a.score);

    const topMatches = scored.slice(0, 5).map(({ penalty, ...match }) => ({
      ...match,
      nearMiss: match.score < 55 || penalty >= 20,
    }));

    if (topMatches.length) {
      return topMatches;
    }

    // Fallback: return a general selection to avoid empty results.
    return BREEDS.filter((breed) => speciesPool.includes(breed.species))
      .slice(0, 5)
      .map((breed) => ({
        breed,
        score: 30,
        reasons: ['General fit picked due to limited matches.'],
        nearMiss: true,
      }));
  }

  private resolveSpeciesPool(interest: PreferencesFormValue['speciesInterest']): Species[] {
    if (interest === 'either') {
      return ['dog', 'cat'];
    }
    return [interest];
  }

  private applyCoreFilters(
    breeds: Breed[],
    preferences: PreferencesFormValue,
    enforceHypo: boolean
  ): Breed[] {
    return breeds.filter((breed) => {
      if (enforceHypo && !breed.hypoallergenic) {
        return false;
      }

      if (!breed.housing.includes(preferences.housingType)) {
        return false;
      }

      const allowedOutdoor = OUTDOOR_MAP[preferences.outdoorAccess] ?? OUTDOOR_MAP.shared;
      if (!breed.outdoorAccess.some((access) => allowedOutdoor.includes(access))) {
        return false;
      }

      if (preferences.allergySensitivity === 'mild' && breed.sheddingLevel === 'high') {
        return false;
      }

      if (preferences.prefersLowMaintenance && breed.groomingLevel === 'high' && breed.trainingLevel !== 'low') {
        return false;
      }

      return true;
    });
  }

  private matchesHousingFallback(breed: Breed, preferences: PreferencesFormValue): boolean {
    const fallbackHousing = HOUSING_FALLBACK[preferences.housingType] ?? [preferences.housingType];
    const allowedOutdoor = OUTDOOR_MAP[preferences.outdoorAccess] ?? OUTDOOR_MAP.shared;
    return (
      breed.housing.some((option) => fallbackHousing.includes(option)) &&
      breed.outdoorAccess.some((option) => allowedOutdoor.includes(option))
    );
  }

  private scoreBreed(breed: Breed, preferences: PreferencesFormValue): ScoringResult {
    let score = 35; // base score to keep ordering positive
    let penalty = 0;
    const reasons: string[] = [];

    const addReason = (reason: string) => {
      if (!reasons.includes(reason)) {
        reasons.push(reason);
      }
    };

    // Size preference
    if (preferences.sizePreference !== 'no-preference') {
      const prefIndex = SIZE_ORDER.indexOf(preferences.sizePreference);
      const breedIndex = SIZE_ORDER.indexOf(breed.size);
      const diff = Math.abs(prefIndex - breedIndex);
      if (diff === 0) {
        score += SIZE_WEIGHT;
        addReason(`Matches your preferred size (${breed.size}).`);
      } else if (diff === 1) {
        score += Math.round(SIZE_WEIGHT * 0.55);
        addReason(`Close to your preferred size (${breed.size}).`);
      } else {
        penalty += 8;
        score -= 6;
      }
    } else {
      score += 6;
    }

    // Activity vs energy level
    score += this.matchEnergy(preferences.activityLevel, breed.energyLevel, addReason);

    // Kids in household
    if (preferences.householdKids !== 'none') {
      if (breed.kidFriendly === 'high') {
        score += KID_FRIENDLY_WEIGHT;
        addReason('Great record with children.');
      } else if (breed.kidFriendly === 'moderate') {
        score += Math.round(KID_FRIENDLY_WEIGHT * 0.6);
        addReason('Generally tolerant with mindful supervision around kids.');
      } else {
        penalty += 25;
        score -= 18;
      }
    } else if (breed.kidFriendly === 'low') {
      score += 6;
      addReason('Prefers calmer, adult households.');
    }

    // Other pets
    if (preferences.otherPets !== 'none') {
      if (breed.petFriendly === 'high') {
        score += PET_FRIENDLY_WEIGHT;
        addReason('Known to integrate well with other pets.');
      } else if (breed.petFriendly === 'moderate') {
        score += Math.round(PET_FRIENDLY_WEIGHT * 0.6);
        addReason('Can live with other pets with introductions.');
      } else {
        penalty += 18;
        score -= 12;
      }
    }

    // Grooming tolerance
    score += this.matchCareLevel(
      preferences.groomingTolerance,
      breed.groomingLevel,
      GROOMING_WEIGHT,
      addReason,
      penaltyTracker => (penalty += penaltyTracker)
    );

    // Shedding tolerance
    score += this.matchShedding(
      preferences.sheddingTolerance,
      breed.sheddingLevel,
      addReason,
      penaltyTracker => (penalty += penaltyTracker)
    );

    // Allergy sensitivity mild preference
    if (preferences.allergySensitivity === 'mild') {
      if (breed.hypoallergenic || breed.sheddingLevel === 'low') {
        score += 12;
        addReason('Friendlier for mild allergies.');
      } else if (breed.sheddingLevel === 'high') {
        penalty += 10;
        score -= 8;
      }
    }

    // Training experience vs breed needs
    score += this.matchTraining(
      preferences.trainingExperience,
      breed.lifestyleMatches,
      breed.trainingLevel,
      addReason,
      penaltyTracker => (penalty += penaltyTracker)
    );

    // Temperament preferences
    if (preferences.temperamentPreferences.length) {
      preferences.temperamentPreferences.forEach((tag) => {
        if (breed.temperament.includes(tag as TemperamentTag)) {
          score += TEMPERAMENT_WEIGHT;
          addReason(`Delivers on your ${tag} temperament preference.`);
        }
      });
    }

    // Companion goal
    score += this.matchCompanionGoal(preferences.companionGoal, breed.lifestyleMatches, addReason);

    // Outdoor adventures
    if (preferences.likesOutdoorAdventures && breed.lifestyleMatches.includes('outdoor-adventurer')) {
      score += OUTDOOR_WEIGHT;
      addReason('Ready for outdoor adventures with you.');
    } else if (preferences.likesOutdoorAdventures) {
      penalty += 12;
      score -= 9;
    }

    // Low maintenance
    if (preferences.prefersLowMaintenance) {
      if (breed.groomingLevel === 'low' && breed.trainingLevel !== 'high') {
        score += 12;
        addReason('Designed for low-maintenance care routines.');
      }
    }

    // Budget comfort
    score += this.matchBudget(preferences.budgetComfort, breed.budget, addReason);

    // Time at home
    score += this.matchHomeTime(preferences.timeAtHome, breed, addReason, (value) => {
      penalty += value;
      score -= value;
    });

    // Travel frequency
    if (preferences.travelFrequency === 'frequently') {
      if (breed.lifestyleMatches.includes('travel-friendly')) {
        score += 12;
        addReason('Adapts well to travel or changing environments.');
      } else {
        penalty += 6;
        score -= 6;
      }
    } else if (preferences.travelFrequency === 'rarely' && breed.lifestyleMatches.includes('homebody-companion')) {
      score += 6;
    }

    // Vocal tolerance
    score += this.matchVocality(preferences.vocalTolerance, breed.vocality, addReason);

    return {
      breed,
      score,
      reasons,
      penalty,
    };
  }

  private matchEnergy(
    preference: PreferencesFormValue['activityLevel'],
    energy: Breed['energyLevel'],
    addReason: (reason: string) => void
  ): number {
    const scale = { low: 1, moderate: 2, high: 3 };
    const diff = Math.abs(scale[preference] - scale[energy]);
    if (diff === 0) {
      addReason('Energy level aligns with your activity style.');
      return ENERGY_WEIGHT;
    }
    if (diff === 1) {
      addReason('Energy level is adaptable to your activity goals.');
      return Math.round(ENERGY_WEIGHT * 0.6);
    }
    return -12;
  }

  private matchCareLevel(
    tolerance: PreferencesFormValue['groomingTolerance'],
    grooming: Breed['groomingLevel'],
    weight: number,
    addReason: (reason: string) => void,
    addPenalty: (penalty: number) => void
  ): number {
    const toleranceMap: Record<typeof tolerance, CareLevel[]> = {
      minimal: ['low'],
      weekly: ['low', 'moderate'],
      daily: ['low', 'moderate', 'high'],
    };

    if (toleranceMap[tolerance].includes(grooming)) {
      if (grooming === 'low') {
        addReason('Minimal grooming keeps upkeep simple.');
      } else if (grooming === 'moderate') {
        addReason('Manageable grooming routine fits your comfort.');
      } else {
        addReason('You are comfortable supporting a higher grooming routine.');
      }
      return weight;
    }

    addPenalty(12);
    return -12;
  }

  private matchShedding(
    tolerance: PreferencesFormValue['sheddingTolerance'],
    shedding: Breed['sheddingLevel'],
    addReason: (reason: string) => void,
    addPenalty: (penalty: number) => void
  ): number {
    if (tolerance === 'no-preference') {
      return 6;
    }
    if (tolerance === 'low') {
      if (shedding === 'low') {
        addReason('Low shedding supports your preference for a cleaner space.');
        return SHEDDING_WEIGHT;
      }
      if (shedding === 'moderate') {
        addReason('Moderate shedding can be managed with routine brushing.');
        return Math.round(SHEDDING_WEIGHT * 0.6);
      }
      addPenalty(16);
      return -16;
    }

    // tolerance moderate
    if (shedding !== 'high') {
      addReason('Shedding level remains within your comfort zone.');
      return Math.round(SHEDDING_WEIGHT * 0.75);
    }
    return Math.round(SHEDDING_WEIGHT * 0.4);
  }

  private matchTraining(
    experience: PreferencesFormValue['trainingExperience'],
    lifestyleMatches: LifestyleMatchTag[],
    trainingLevel: Breed['trainingLevel'],
    addReason: (reason: string) => void,
    addPenalty: (penalty: number) => void
  ): number {
    if (experience === 'first-timer') {
      if (lifestyleMatches.includes('suits-first-time-owner') && trainingLevel !== 'high') {
        addReason('Supportive for first-time handlers.');
        return TRAINING_WEIGHT;
      }
      if (lifestyleMatches.includes('needs-experienced-handler') || trainingLevel === 'high') {
        addPenalty(20);
        return -20;
      }
      addReason('Manageable with basic training commitment.');
      return Math.round(TRAINING_WEIGHT * 0.6);
    }

    if (experience === 'some-experience') {
      if (trainingLevel === 'low' || trainingLevel === 'moderate') {
        addReason('Training needs align with your experience.');
        return Math.round(TRAINING_WEIGHT * 0.75);
      }
      if (lifestyleMatches.includes('needs-experienced-handler')) {
        addPenalty(10);
        return -8;
      }
      return Math.round(TRAINING_WEIGHT * 0.5);
    }

    // seasoned handler
    if (trainingLevel === 'high') {
      addReason('You can embrace the challenge of advanced training.');
      return TRAINING_WEIGHT;
    }
    return Math.round(TRAINING_WEIGHT * 0.6);
  }

  private matchCompanionGoal(
    goal: PreferencesFormValue['companionGoal'],
    lifestyleMatches: LifestyleMatchTag[],
    addReason: (reason: string) => void
  ): number {
    if (goal === 'cozy-companion') {
      if (lifestyleMatches.includes('homebody-companion') || lifestyleMatches.includes('therapy-suitable')) {
        addReason('Perfect for cozy companionship and emotional support.');
        return COMPANION_GOAL_WEIGHT;
      }
      return Math.round(COMPANION_GOAL_WEIGHT * 0.4);
    }

    if (goal === 'adventure-buddy') {
      if (lifestyleMatches.includes('outdoor-adventurer') || lifestyleMatches.includes('space-loving')) {
        addReason('Eager to join you on outdoor adventures.');
        return COMPANION_GOAL_WEIGHT;
      }
      return Math.round(COMPANION_GOAL_WEIGHT * 0.4);
    }

    // therapy-emotional
    if (lifestyleMatches.includes('therapy-suitable') || lifestyleMatches.includes('great-with-kids')) {
      addReason('Naturally tuned for supportive and soothing roles.');
      return COMPANION_GOAL_WEIGHT;
    }
    return Math.round(COMPANION_GOAL_WEIGHT * 0.4);
  }

  private matchBudget(
    comfort: PreferencesFormValue['budgetComfort'],
    breedBudget: CareLevel,
    addReason: (reason: string) => void
  ): number {
    const budgetValue = { low: 1, moderate: 2, high: 3 };
    const prefTarget = { tight: 1, average: 2, flexible: 3 };
    const diff = Math.abs(prefTarget[comfort] - budgetValue[breedBudget]);

    if (diff === 0) {
      addReason('Ongoing care budget aligns with your comfort.');
      return BUDGET_WEIGHT;
    }
    if (comfort === 'flexible') {
      addReason('You have flexibility to support this breed’s care costs.');
      return Math.round(BUDGET_WEIGHT * 0.7);
    }
    if (diff === 1) {
      return Math.round(BUDGET_WEIGHT * 0.4);
    }
    return -8;
  }

  private matchHomeTime(
    availability: PreferencesFormValue['timeAtHome'],
    breed: Breed,
    addReason: (reason: string) => void,
    addPenalty: (penalty: number) => void
  ): number {
    if (availability === 'mostly-home') {
      if (breed.temperament.includes('affectionate') || breed.lifestyleMatches.includes('homebody-companion')) {
        addReason('Enjoys spending most of the day alongside you.');
        return 12;
      }
      return 6;
    }

    if (availability === 'balanced') {
      return 6;
    }

    // away-often
    if (breed.temperament.includes('independent') || breed.lifestyleMatches.includes('travel-friendly')) {
      addReason('Comfortable with some alone time or travel.');
      return 10;
    }

    if (breed.temperament.includes('sensitive') || breed.lifestyleMatches.includes('homebody-companion')) {
      addPenalty(12);
      return -12;
    }

    return 0;
  }

  private matchVocality(
    tolerance: PreferencesFormValue['vocalTolerance'],
    breedVocality: VocalityLevel,
    addReason: (reason: string) => void
  ): number {
    if (tolerance === 'prefer-quiet') {
      if (breedVocality === 'quiet') {
        addReason('Stays on the quieter side as you prefer.');
        return VOCAL_WEIGHT;
      }
      if (breedVocality === 'moderate') {
        return Math.round(VOCAL_WEIGHT * 0.5);
      }
      return -8;
    }

    if (tolerance === 'okay-chatty') {
      if (breedVocality !== 'chatty') {
        return Math.round(VOCAL_WEIGHT * 0.5);
      }
      addReason('You are comfortable with friendly conversations.');
      return VOCAL_WEIGHT;
    }

    // love talkative
    if (breedVocality === 'chatty') {
      addReason('Will happily chat back and engage vocally.');
      return VOCAL_WEIGHT;
    }
    return Math.round(VOCAL_WEIGHT * 0.4);
  }
}
