import { Component, OnInit, inject, signal } from '@angular/core';
import { PortfolioService } from '../../../../core/services/portfolio.service';

const GROUP_ICONS: Record<string, string> = {
  Frontend: '🎨',
  Backend: '⚙️',
  Testing: '🧪',
  Tools: '🛠️',
  Cloud: '☁️',
};

@Component({
  selector: 'app-skills',
  standalone: true,
  template: `
    <section class="skills section" aria-labelledby="skills-heading">
      <div class="container">
        <p class="section-label">What I Know</p>
        <h2 id="skills-heading" class="section-title">Technical <span class="gradient-text">Skills</span></h2>
        <p class="section-subtitle">A comprehensive view of my technical toolkit — built over 4+ years of hands-on experience.</p>

        @if (loading()) {
          <div class="skills__skeleton">
            @for (i of [1,2,3,4]; track i) {
              <div class="skeleton" style="height: 120px; border-radius: 18px;"></div>
            }
          </div>
        } @else if (skillGroups().length === 0) {
          <p style="color:rgba(156,163,175,0.5);margin-top:2rem;">No skill groups configured yet.</p>
        } @else {
          <div class="skills__groups">
            @for (group of skillGroups(); track group._id) {
              <div class="skills__group">
                <div class="skills__group-header">
                  <span class="skills__group-icon" aria-hidden="true">{{ getIcon(group.group) }}</span>
                  <h3 class="skills__group-name">{{ group.group }}</h3>
                </div>
                <div class="skills__pills" role="list">
                  @for (skill of group.skills; track skill.name) {
                    <div class="skills__pill" role="listitem" [title]="skill.name + ' - ' + skill.proficiency + '%'">
                      <span>{{ skill.name }}</span>
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
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  skillGroups = signal<any[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.portfolioService.getSkills().subscribe({
      next: (res) => {
        this.skillGroups.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getIcon(group: string): string {
    return GROUP_ICONS[group] || '📦';
  }
}
