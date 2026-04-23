import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/portfolio/portfolio.component').then((m) => m.PortfolioComponent),
    title: 'Darshan Nayak | Software Engineer 2',
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        title: 'Dashboard | Admin',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/admin/profile-editor/profile-editor.component').then(
            (m) => m.ProfileEditorComponent
          ),
        title: 'Edit Profile | Admin',
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./features/admin/skills-manager/skills-manager.component').then(
            (m) => m.SkillsManagerComponent
          ),
        title: 'Skills | Admin',
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./features/admin/experience-manager/experience-manager.component').then(
            (m) => m.ExperienceManagerComponent
          ),
        title: 'Experience | Admin',
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/admin/projects-manager/projects-manager.component').then(
            (m) => m.ProjectsManagerComponent
          ),
        title: 'Projects | Admin',
      },
      {
        path: 'education',
        loadComponent: () =>
          import('./features/admin/education-manager/education-manager.component').then(
            (m) => m.EducationManagerComponent
          ),
        title: 'Education | Admin',
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./features/admin/messages/messages.component').then(
            (m) => m.MessagesComponent
          ),
        title: 'Messages | Admin',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/admin/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
        title: 'Settings | Admin',
      },
    ],
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/login/login.component').then((m) => m.LoginComponent),
    title: 'Admin Login',
  },
  {
    path: 'setup',
    loadComponent: () =>
      import('./features/setup/setup-wizard/setup-wizard.component').then(
        (m) => m.SetupWizardComponent
      ),
    title: 'Setup Wizard',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
