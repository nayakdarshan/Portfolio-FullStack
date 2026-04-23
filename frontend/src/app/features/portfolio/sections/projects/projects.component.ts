import { Component, OnInit, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { TiltDirective } from '../../../../shared/directives/tilt.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [SlicePipe, TiltDirective],
  template: `
    <section class="projects section" aria-labelledby="projects-heading">
      <div class="container">
        <p class="section-label">What I've Built</p>
        <h2 id="projects-heading" class="section-title">Featured <span class="gradient-text">Projects</span></h2>
        <p class="section-subtitle">Real-world applications built for enterprises and startups — from concept to production.</p>

        @if (loading()) {
          <div class="projects__grid">
            @for (i of [1,2,3,4,5]; track i) {
              <div class="skeleton" style="height: 320px;"></div>
            }
          </div>
        } @else {
          <div class="projects__grid">
            @for (project of projects(); track project._id; let i = $index) {
              <article
                class="project-card"
                [class.project-card--featured]="project.featured"
                appTilt [tiltMaxAngle]="7" [tiltGlare]="true"
                (click)="openModal(project)"
                (keydown.enter)="openModal(project)"
                tabindex="0"
                role="button"
                [attr.aria-label]="'View details for ' + project.title"
              >
                <!-- Image / Placeholder -->
                <div class="project-card__image" aria-hidden="true">
                  <div class="project-card__image-placeholder">
                    <span>{{ project.title.charAt(0) }}</span>
                  </div>
                  <div class="project-card__overlay">
                    <span class="project-card__cta">View Details →</span>
                  </div>
                </div>

                <!-- Content -->
                <div class="project-card__body">
                  @if (project.featured) {
                    <span class="project-card__featured-badge">⭐ Featured</span>
                  }
                  <p class="project-card__category">{{ project.category }}</p>
                  <h3 class="project-card__title">{{ project.title }}</h3>
                  <p class="project-card__company">{{ project.company }} · {{ project.date }}</p>
                  <p class="project-card__desc">{{ project.description | slice:0:120 }}...</p>
                  <div class="project-card__tech">
                    @for (tech of project.techStack.slice(0, 4); track tech) {
                      <span class="badge">{{ tech }}</span>
                    }
                    @if (project.techStack.length > 4) {
                      <span class="badge">+{{ project.techStack.length - 4 }}</span>
                    }
                  </div>
                </div>
              </article>
            }
          </div>
        }

        <!-- Modal -->
        @if (selectedProject()) {
          <div
            class="project-modal-overlay"
            (click)="closeModal()"
            role="dialog"
            aria-modal="true"
            [attr.aria-label]="selectedProject()?.title"
          >
            <div class="project-modal" (click)="$event.stopPropagation()" role="document">
              <button class="project-modal__close" (click)="closeModal()" aria-label="Close modal">✕</button>

              <div class="project-modal__header">
                <div>
                  <p class="project-card__category">{{ selectedProject()?.category }}</p>
                  <h2 class="project-modal__title">{{ selectedProject()?.title }}</h2>
                  <p class="project-card__company">{{ selectedProject()?.company }} · {{ selectedProject()?.date }}</p>
                </div>
              </div>

              <p class="project-modal__desc">{{ selectedProject()?.longDescription || selectedProject()?.description }}</p>

              <div class="project-modal__tech">
                @for (tech of selectedProject()?.techStack; track tech) {
                  <span class="badge">{{ tech }}</span>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  projects = signal<any[]>([]);
  loading = signal(true);
  selectedProject = signal<any>(null);

  ngOnInit(): void {
    this.portfolioService.getProjects().subscribe({
      next: (res) => {
        this.projects.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openModal(project: any): void { this.selectedProject.set(project); document.body.style.overflow = 'hidden'; }
  closeModal(): void { this.selectedProject.set(null); document.body.style.overflow = ''; }
}
