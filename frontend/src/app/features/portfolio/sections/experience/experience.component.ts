import { Component, OnInit, inject, signal } from '@angular/core';
import { PortfolioService } from '../../../../core/services/portfolio.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  template: `
    <section class="experience section" aria-labelledby="experience-heading">
      <div class="container">
        <p class="section-label">Career Path</p>
        <h2 id="experience-heading" class="section-title">Work <span class="gradient-text">Experience</span></h2>
        <p class="section-subtitle">My professional journey — building products that matter, one sprint at a time.</p>

        @if (loading()) {
          <div class="timeline__skeleton">
            @for (i of [1,2,3,4]; track i) {
              <div class="skeleton" style="height: 160px; margin-bottom: 2rem;"></div>
            }
          </div>
        } @else {
          <div class="timeline" role="list">
            <div class="timeline__line" aria-hidden="true"></div>
            @for (exp of experiences(); track exp._id; let i = $index) {
              <div
                class="timeline__item"
                [class.timeline__item--left]="i % 2 === 0"
                [class.timeline__item--right]="i % 2 !== 0"
                role="listitem"
              >
                <div class="timeline__dot" aria-hidden="true">
                  @if (exp.current) { <div class="timeline__dot-pulse"></div> }
                </div>

                <div class="timeline__card card">
                  <div class="timeline__header">
                    <div>
                      <h3 class="timeline__role">{{ exp.role }}</h3>
                      <p class="timeline__company">{{ exp.company }}</p>
                    </div>
                    <div class="timeline__meta">
                      <span class="badge" [class.badge--current]="exp.current">
                        {{ exp.current ? 'Present' : exp.endDate }}
                      </span>
                      <p class="timeline__date">{{ exp.startDate }}</p>
                    </div>
                  </div>

                  @if (exp.location) {
                    <p class="timeline__location">📍 {{ exp.location }}</p>
                  }

                  <ul class="timeline__bullets">
                    @for (bullet of exp.bullets; track bullet) {
                      <li>{{ bullet }}</li>
                    }
                  </ul>

                  @if (exp.technologies?.length) {
                    <div class="timeline__tech">
                      @for (tech of exp.technologies; track tech) {
                        <span class="badge">{{ tech }}</span>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  experiences = signal<any[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.portfolioService.getExperience().subscribe({
      next: (res) => {
        this.experiences.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
