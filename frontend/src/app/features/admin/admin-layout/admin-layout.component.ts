import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem { label: string; path: string; icon: string; }

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout" [class.sidebar-open]="sidebarOpen()">

      <!-- Sidebar -->
      <aside class="admin-layout__sidebar" role="navigation" aria-label="Admin navigation">
        <div class="admin-layout__sidebar-header">
          <a routerLink="/admin" class="admin-layout__logo">
            <span class="gradient-text">DN</span>
            <span class="admin-layout__logo-label">Admin</span>
          </a>
          <button class="admin-layout__close-btn" (click)="closeSidebar()" aria-label="Close sidebar">✕</button>
        </div>

        <div class="admin-layout__user-info">
          <div class="admin-layout__user-avatar" aria-hidden="true">
            {{ currentUser()?.name?.charAt(0) || 'A' }}
          </div>
          <div>
            <p class="admin-layout__user-name">{{ currentUser()?.name || 'Admin' }}</p>
            <p class="admin-layout__user-role">{{ currentUser()?.email || 'Administrator' }}</p>
          </div>
        </div>

        <nav class="admin-layout__nav">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.path === '/admin' }"
              class="admin-layout__nav-item"
              (click)="closeSidebarOnMobile()"
            >
              <span class="admin-layout__nav-icon" aria-hidden="true">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="admin-layout__sidebar-footer">
          <a routerLink="/" class="btn btn--ghost btn--sm" target="_blank" aria-label="View portfolio" style="width:100%;justify-content:flex-start;gap:.5rem">
            🌐 View Portfolio
          </a>
          <button class="btn btn--ghost btn--sm" (click)="logout()" aria-label="Logout" style="width:100%;justify-content:flex-start;gap:.5rem;margin-top:.25rem">
            🚪 Logout
          </button>
        </div>
      </aside>

      <!-- Mobile Overlay -->
      <div class="admin-layout__overlay" [class.open]="sidebarOpen()" (click)="closeSidebar()" aria-hidden="true"></div>

      <!-- Main Content Area -->
      <div class="admin-layout__main">
        <!-- Top Bar -->
        <header class="admin-layout__topbar">
          <div class="admin-layout__topbar-left">
            <button class="admin-layout__menu-btn" (click)="toggleSidebar()" aria-label="Toggle sidebar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span class="admin-layout__topbar-title">Admin Panel</span>
          </div>
          <div class="admin-layout__topbar-right">
            <a routerLink="/" class="admin-layout__visit-btn" target="_blank">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              View Site
            </a>
          </div>
        </header>

        <!-- Page content -->
        <main class="admin-layout__content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  sidebarOpen = signal(false);
  currentUser = this.auth.currentUser;

  readonly navItems: NavItem[] = [
    { label: 'Dashboard',   path: '/admin',            icon: '📊' },
    { label: 'Profile',     path: '/admin/profile',    icon: '👤' },
    { label: 'Skills',      path: '/admin/skills',     icon: '⚡' },
    { label: 'Experience',  path: '/admin/experience', icon: '💼' },
    { label: 'Projects',    path: '/admin/projects',   icon: '🚀' },
    { label: 'Education',   path: '/admin/education',  icon: '🎓' },
    { label: 'Messages',    path: '/admin/messages',   icon: '✉️' },
    { label: 'Settings',    path: '/admin/settings',   icon: '⚙️' },
  ];

  toggleSidebar(): void    { this.sidebarOpen.update(v => !v); }
  closeSidebar(): void     { this.sidebarOpen.set(false); }
  closeSidebarOnMobile(): void { if (window.innerWidth < 1024) this.sidebarOpen.set(false); }

  logout(): void { this.auth.logout(); }
}
