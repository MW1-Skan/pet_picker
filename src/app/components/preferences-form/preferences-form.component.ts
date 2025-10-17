import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { DEFAULT_PREFERENCES } from '../../core/constants/default-preferences';
import {
  ACTIVITY_LEVEL_OPTIONS,
  ALLERGY_SENSITIVITY_OPTIONS,
  BUDGET_COMFORT_OPTIONS,
  COMPANION_GOAL_OPTIONS,
  GROOMING_TOLERANCE_OPTIONS,
  HOUSING_OPTIONS,
  KID_PRESENCE_OPTIONS,
  OTHER_PETS_OPTIONS,
  OUTDOOR_ACCESS_OPTIONS,
  SHEDDING_TOLERANCE_OPTIONS,
  SIZE_PREFERENCE_OPTIONS,
  SPECIES_OPTIONS,
  TEMPERAMENT_TAGS,
  TIME_AT_HOME_OPTIONS,
  TRAINING_EXPERIENCE_OPTIONS,
  TRAVEL_FREQUENCY_OPTIONS,
  VOCAL_TOLERANCE_OPTIONS,
} from '../../core/constants/preferences-options';
import { PreferencesFormValue } from '../../core/models/preferences';
import { generateRandomPreferences } from '../../core/utils/preferences-randomizer';

@Component({
  selector: 'app-preferences-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './preferences-form.component.html',
  styleUrl: './preferences-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesFormComponent {
  @Output() readonly findMatches = new EventEmitter<PreferencesFormValue>();
  @Output() readonly preferencesUpdated = new EventEmitter<PreferencesFormValue>();

  private readonly nnb = inject(NonNullableFormBuilder);

  readonly form = this.nnb.group({
    speciesInterest: [DEFAULT_PREFERENCES.speciesInterest, Validators.required],
    householdAdults: [
      DEFAULT_PREFERENCES.householdAdults,
      [Validators.required, Validators.min(1), Validators.max(12)],
    ],
    householdKids: [DEFAULT_PREFERENCES.householdKids, Validators.required],
    otherPets: [DEFAULT_PREFERENCES.otherPets, Validators.required],
    housingType: [DEFAULT_PREFERENCES.housingType, Validators.required],
    outdoorAccess: [DEFAULT_PREFERENCES.outdoorAccess, Validators.required],
    activityLevel: [DEFAULT_PREFERENCES.activityLevel, Validators.required],
    timeAtHome: [DEFAULT_PREFERENCES.timeAtHome, Validators.required],
    travelFrequency: [DEFAULT_PREFERENCES.travelFrequency, Validators.required],
    groomingTolerance: [DEFAULT_PREFERENCES.groomingTolerance, Validators.required],
    sheddingTolerance: [DEFAULT_PREFERENCES.sheddingTolerance, Validators.required],
    allergySensitivity: [DEFAULT_PREFERENCES.allergySensitivity, Validators.required],
    budgetComfort: [DEFAULT_PREFERENCES.budgetComfort, Validators.required],
    trainingExperience: [DEFAULT_PREFERENCES.trainingExperience, Validators.required],
    temperamentPreferences: [DEFAULT_PREFERENCES.temperamentPreferences],
    companionGoal: [DEFAULT_PREFERENCES.companionGoal, Validators.required],
    sizePreference: [DEFAULT_PREFERENCES.sizePreference, Validators.required],
    vocalTolerance: [DEFAULT_PREFERENCES.vocalTolerance, Validators.required],
    wantsHypoallergenic: [DEFAULT_PREFERENCES.wantsHypoallergenic],
    likesOutdoorAdventures: [DEFAULT_PREFERENCES.likesOutdoorAdventures],
    prefersLowMaintenance: [DEFAULT_PREFERENCES.prefersLowMaintenance],
  });

  protected readonly speciesOptions = SPECIES_OPTIONS;
  protected readonly housingOptions = HOUSING_OPTIONS;
  protected readonly outdoorOptions = OUTDOOR_ACCESS_OPTIONS;
  protected readonly activityOptions = ACTIVITY_LEVEL_OPTIONS;
  protected readonly homeTimeOptions = TIME_AT_HOME_OPTIONS;
  protected readonly travelOptions = TRAVEL_FREQUENCY_OPTIONS;
  protected readonly groomingOptions = GROOMING_TOLERANCE_OPTIONS;
  protected readonly sheddingOptions = SHEDDING_TOLERANCE_OPTIONS;
  protected readonly allergyOptions = ALLERGY_SENSITIVITY_OPTIONS;
  protected readonly budgetOptions = BUDGET_COMFORT_OPTIONS;
  protected readonly trainingOptions = TRAINING_EXPERIENCE_OPTIONS;
  protected readonly temperamentOptions = TEMPERAMENT_TAGS;
  protected readonly companionGoalOptions = COMPANION_GOAL_OPTIONS;
  protected readonly sizeOptions = SIZE_PREFERENCE_OPTIONS;
  protected readonly vocalOptions = VOCAL_TOLERANCE_OPTIONS;
  protected readonly kidPresenceOptions = KID_PRESENCE_OPTIONS;
  protected readonly otherPetsOptions = OTHER_PETS_OPTIONS;

  @Input()
  set model(value: PreferencesFormValue | null) {
    const target = value ?? DEFAULT_PREFERENCES;
    this.form.reset(target);
  }

  resetToDefaults(): void {
    this.form.reset(DEFAULT_PREFERENCES);
    this.preferencesUpdated.emit(this.form.getRawValue());
  }

  fillWithExample(): void {
    const sample = generateRandomPreferences();
    this.form.reset(sample);
    this.preferencesUpdated.emit(this.form.getRawValue());
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.findMatches.emit(this.form.getRawValue());
    this.preferencesUpdated.emit(this.form.getRawValue());
  }

  protected toggleTemperament(tag: PreferencesFormValue['temperamentPreferences'][number], checked: boolean): void {
    const current = new Set(this.form.controls.temperamentPreferences.value);
    if (checked) {
      current.add(tag);
    } else {
      current.delete(tag);
    }
    this.form.controls.temperamentPreferences.setValue(Array.from(current));
  }

  protected temperamentChecked(tag: PreferencesFormValue['temperamentPreferences'][number]): boolean {
    return this.form.controls.temperamentPreferences.value.includes(tag);
  }

  protected invalid(controlName: keyof PreferencesFormValue): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }
}
