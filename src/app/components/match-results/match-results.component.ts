import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreedMatch } from '../../core/models/breed';

@Component({
  selector: 'app-match-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-results.component.html',
  styleUrl: './match-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchResultsComponent {
  @Input({ required: true }) matches: BreedMatch[] | null = null;
  @Input() lastUpdated: Date | null = null;
}
