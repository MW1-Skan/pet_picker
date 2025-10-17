import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';

import { MatchResultsComponent } from './components/match-results/match-results.component';
import { PreferencesFormComponent } from './components/preferences-form/preferences-form.component';
import { DEFAULT_PREFERENCES } from './core/constants/default-preferences';
import { RecommendationService } from './core/services/recommendation.service';
import { BreedMatch } from './core/models/breed';
import { PreferencesFormValue } from './core/models/preferences';

@Component({
  selector: 'app-root',
  imports: [CommonModule, PreferencesFormComponent, MatchResultsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild('resultsSection') private resultsSection?: ElementRef<HTMLElement>;

  private readonly recommendationService = inject(RecommendationService);

  protected readonly preferences = signal<PreferencesFormValue>(DEFAULT_PREFERENCES);
  protected readonly matches = signal<BreedMatch[] | null>(null);
  protected readonly lastUpdated = signal<Date | null>(null);

  protected handleFormSubmit(value: PreferencesFormValue): void {
    const results = this.recommendationService.recommend(value);
    this.matches.set(results);
    this.updatePreferences(value);
    this.lastUpdated.set(new Date());

    queueMicrotask(() => {
      const element = this.resultsSection?.nativeElement;
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  protected updatePreferences(value: PreferencesFormValue): void {
    this.preferences.set(value);
  }
}
