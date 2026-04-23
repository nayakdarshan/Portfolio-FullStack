import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../../core/services/portfolio.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard">
      <div class="dashboard__header">
        <h1 class="dashboard__title">Dashboard</h1>
        <p class="dashboard__subtitle">Welcome back! Here's an overview of your portfolio.</p>
      </div>

      <div class="dashboard__stats">
        @for (stat of stats(); track stat.label) {
          <div class="dashboard__stat card">
            <div class="dashboard__stat-icon" aria-hidden="true">{{ stat.icon }}</div>
            <div class="dashboard__stat-body">
              <p class="dashboard__stat-value">{{ stat.value }}</p>
              <p class="dashboard__stat-label">{{ stat.label }}</p>
            </div>
            <a [routerLink]="stat.link" class="dashboard__stat-link" [attr.aria-label]="'Manage ' + stat.label">Manage →</a>
          </div>
        }
      </div>

      <div class="dashboard__quick">
        <h2 class="dashboard__section-title">Quick Actions</h2>
        <div class="dashboard__actions">
          @for (action of quickActions; track action.label) {
            <a [routerLink]="action.path" class="dashboard__action card">
              <span class="dashboard__action-icon" aria-hidden="true">{{ action.icon }}</span>
              <span class="dashboard__action-label">{{ action.label }}</span>
            </a>
          }
        </div>
      </div>

      <div class="dashboard__info card">
        <h2 class="dashboard__section-title">💡 Portfolio Status</h2>
        <div class="dashboard__status-grid">
          <div class="dashboard__status-item">
            <span class="dashboard__status-dot dashboard__status-dot--green"></span>
            Backend API — Online
          </div>
          <div class="dashboard__status-item">
            <span class="dashboard__status-dot dashboard__status-dot--green"></span>
            Database — Connected
          </div>
          <div class="dashboard__status-item">
            <span class="dashboard__status-dot dashboard__status-dot--blue"></span>
            JWT Auth — Active
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard__header { margin-bottom: var(--space-8); }
    .dashboard__title { font-size: var(--text-3xl); font-weight: 800; color: var(--color-text-primary); margin-bottom: var(--space-2); }
    .dashboard__subtitle { color: var(--color-text-secondary); }

    .dashboard__stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: var(--space-5);
      margin-bottom: var(--space-8);
    }

    .dashboard__stat {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      cursor: default;

      &-icon { font-size: 2rem; }
      &-value { font-size: var(--text-2xl); font-weight: 800; color: var(--color-text-primary); line-height: 1; }
      &-label { font-size: var(--text-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
      &-body { flex: 1; }
      &-link { font-size: var(--text-xs); color: var(--color-primary); font-weight: 600; text-decoration: none; white-space: nowrap; &:hover { text-decoration: underline; } }
    }

    .dashboard__section-title { font-size: var(--text-xl); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--space-5); }

    .dashboard__quick { margin-bottom: var(--space-8); }

    .dashboard__actions {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: var(--space-4);
    }

    .dashboard__action {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-3);
      text-align: center;
      text-decoration: none;
      color: var(--color-text-primary);
      padding: var(--space-6);

      &-icon { font-size: 2rem; }
      &-label { font-size: var(--text-sm); font-weight: 600; }
    }

    .dashboard__info { margin-bottom: var(--space-8); }

    .dashboard__status-grid { display: flex; flex-direction: column; gap: var(--space-3); }

    .dashboard__status-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }

    .dashboard__status-dot {
      width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
      &--green { background: #10b981; box-shadow: 0 0 6px rgba(16,185,129,0.5); }
      &--blue { background: var(--color-primary); box-shadow: var(--shadow-glow); }
    }
  `],
})
export class DashboardComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  stats = signal<any[]>([]);

  readonly quickActions = [
    { label: 'Edit Profile', path: '/admin/profile', icon: '👤' },
    { label: 'Add Project', path: '/admin/projects', icon: '🚀' },
    { label: 'Add Experience', path: '/admin/experience', icon: '💼' },
    { label: 'View Messages', path: '/admin/messages', icon: '✉️' },
    { label: 'Edit Skills', path: '/admin/skills', icon: '⚡' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    let projectsCount = 0, messagesCount = 0, skillsCount = 0, experienceCount = 0;

    const update = () => {
      this.stats.set([
        { icon: '🚀', label: 'Projects', value: projectsCount, link: '/admin/projects' },
        { icon: '💼', label: 'Experience', value: experienceCount, link: '/admin/experience' },
        { icon: '⚡', label: 'Skill Groups', value: skillsCount, link: '/admin/skills' },
        { icon: '✉️', label: 'Messages', value: messagesCount, link: '/admin/messages' },
      ]);
    };

    this.portfolioService.getProjects().subscribe({ next: (r) => { projectsCount = r.data?.length || 0; update(); } });
    this.portfolioService.getExperience().subscribe({ next: (r) => { experienceCount = r.data?.length || 0; update(); } });
    this.portfolioService.getSkills().subscribe({ next: (r) => { skillsCount = r.data?.length || 0; update(); } });
    this.portfolioService.getMessages().subscribe({ next: (r) => { messagesCount = (r as any).pagination?.total || 0; update(); } });
  }
}
