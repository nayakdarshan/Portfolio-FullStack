import { Component, OnInit, inject, signal } from '@angular/core';
import { PortfolioService } from '../../../../core/services/portfolio.service';

@Component({
  selector: 'app-education',
  standalone: true,
  template: `
    <section class="education section" aria-labelledby="education-heading">
      <div class="container">
        <p class="section-tag">Academic Background</p>
        <h2 id="education-heading" class="section-title">Education & <span class="gradient-text">Qualifications</span></h2>

        @if (loading()) {
          <div class="education__grid">
            @for (i of [1,2,3]; track i) {
              <div class="skeleton" style="height:200px; border-radius:18px;"></div>
            }
          </div>
        } @else {
          <div class="education__grid">
            @for (edu of education(); track edu._id) {
              <div class="education__card">
                <div class="education__year">{{ edu.startYear }} – {{ edu.endYear }}</div>
                <div class="education__icon" aria-hidden="true">🎓</div>
                <h3 class="education__degree">{{ edu.degree }}</h3>
                @if (edu.field) { <p class="education__field">{{ edu.field }}</p> }
                <p class="education__institution">{{ edu.institution }}</p>
                @if (edu.grade) { <p class="education__grade">{{ edu.grade }}</p> }
                @if (edu.location) { <p class="education__location">📍 {{ edu.location }}</p> }
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
  styleUrl: './education.component.scss',
})
export class EducationComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  education = signal<any[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.portfolioService.getEducation().subscribe({
      next: (res) => {
        this.education.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
