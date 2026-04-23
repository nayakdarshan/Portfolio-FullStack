import { Component, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ThemeService, Theme, FontPair } from '../../../core/services/theme.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-setup-wizard',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="setup-page">
      <div class="setup-container">
        <!-- Header -->
        <div class="setup-header">
          <h1 class="setup-header__title gradient-text">Portfolio Setup Wizard</h1>
          <p class="setup-header__subtitle">Personalize your portfolio in 3 easy steps.</p>
          <!-- Progress -->
          <div class="setup-progress" role="progressbar" [attr.aria-valuenow]="step()" aria-valuemin="1" aria-valuemax="3">
            @for (s of [1,2,3]; track s) {
              <div class="setup-progress__step" [class.active]="step() === s" [class.done]="step() > s">{{ s > step() ? s : (step() > s ? '✓' : s) }}</div>
              @if (s < 3) { <div class="setup-progress__line" [class.done]="step() > s"></div> }
            }
          </div>
        </div>

        <!-- Step 1: Personal Info -->
        @if (step() === 1) {
          <div class="setup-step card animate-fade-in-up">
            <h2 class="setup-step__title">Step 1 — Personal Information</h2>
            <form [formGroup]="infoForm">
              <div class="setup-form-grid">
                <div class="form-group"><label class="form-label">Your Full Name *</label><input type="text" class="form-input" formControlName="name" placeholder="{{'{{'}}YOUR_NAME{{'}}'}}" /></div>
                <div class="form-group"><label class="form-label">Job Title *</label><input type="text" class="form-input" formControlName="title" placeholder="{{'{{'}}YOUR_TITLE{{'}}'}}" /></div>
                <div class="form-group" style="grid-column:1/-1"><label class="form-label">Bio *</label><textarea class="form-input" formControlName="bio" rows="4" placeholder="{{'{{'}}YOUR_BIO{{'}}'}}"></textarea></div>
                <div class="form-group"><label class="form-label">LinkedIn URL</label><input type="url" class="form-input" formControlName="linkedin" /></div>
                <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" formControlName="email" /></div>
              </div>
            </form>
            <div class="setup-step__actions">
              <button class="btn btn--primary btn--lg" (click)="nextStep()" [disabled]="infoForm.invalid">Next: Choose Theme →</button>
            </div>
          </div>
        }

        <!-- Step 2: Theme & Font -->
        @if (step() === 2) {
          <div class="setup-step card animate-fade-in-up">
            <h2 class="setup-step__title">Step 2 — Theme & Typography</h2>
            <div class="setup-themes">
              <h3 class="setup-subtitle">Color Theme</h3>
              <div class="setup-theme-grid">
                @for (theme of themes; track theme.value) {
                  <button
                    class="setup-theme-btn"
                    [class.active]="selectedTheme() === theme.value"
                    (click)="selectTheme(theme.value)"
                    [style.--theme-color]="theme.color"
                  >
                    <div class="setup-theme-btn__swatch" [style.background]="theme.gradient"></div>
                    <span>{{ theme.label }}</span>
                  </button>
                }
              </div>
            </div>
            <div class="setup-fonts">
              <h3 class="setup-subtitle">Font Pair</h3>
              <div class="setup-font-grid">
                @for (font of fonts; track font.value) {
                  <button class="setup-font-btn" [class.active]="selectedFont() === font.value" (click)="selectFont(font.value)">
                    <p class="setup-font-btn__heading" [style.font-family]="font.headingFont">{{ font.headingFont }}</p>
                    <p class="setup-font-btn__body" [style.font-family]="font.bodyFont">{{ font.bodyFont }}</p>
                    <span>{{ font.label }}</span>
                  </button>
                }
              </div>
            </div>
            <div class="setup-step__actions">
              <button class="btn btn--ghost btn--lg" (click)="prevStep()">← Back</button>
              <button class="btn btn--primary btn--lg" (click)="nextStep()">Next: Confirm →</button>
            </div>
          </div>
        }

        <!-- Step 3: Confirm & Seed -->
        @if (step() === 3) {
          <div class="setup-step card animate-fade-in-up">
            <h2 class="setup-step__title">Step 3 — Review & Launch</h2>
            <div class="setup-review">
              <div class="setup-review__item"><span class="setup-review__label">Name</span><span>{{ infoForm.value.name }}</span></div>
              <div class="setup-review__item"><span class="setup-review__label">Title</span><span>{{ infoForm.value.title }}</span></div>
              <div class="setup-review__item"><span class="setup-review__label">Theme</span><span>{{ selectedThemeLabel() }}</span></div>
              <div class="setup-review__item"><span class="setup-review__label">Font</span><span>{{ selectedFontLabel() }}</span></div>
            </div>
            <div class="setup-step__actions">
              <button class="btn btn--ghost btn--lg" (click)="prevStep()">← Back</button>
              <button class="btn btn--primary btn--lg" (click)="launch()" [disabled]="launching()">
                @if (launching()) { ⏳ Launching... } @else { 🚀 Launch Portfolio }
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './setup-wizard.component.scss',
})
export class SetupWizardComponent {
  private fb = inject(FormBuilder);
  private portfolioService = inject(PortfolioService);
  private themeService = inject(ThemeService);
  private toast = inject(ToastService);
  private router = inject(Router);

  step = signal(1);
  launching = signal(false);
  selectedTheme = signal<Theme>('midnight-blue');
  selectedFont = signal<FontPair>('modern-sans');

  readonly selectedThemeLabel = computed(() =>
    this.themes.find((t) => t.value === this.selectedTheme())?.label ?? ''
  );

  readonly selectedFontLabel = computed(() =>
    this.fonts.find((f) => f.value === this.selectedFont())?.label ?? ''
  );

  readonly themes = [
    { value: 'midnight-blue' as Theme, label: '🌙 Midnight Blue', color: '#4f8ef7', gradient: 'linear-gradient(135deg, #0f172a, #4f8ef7)' },
    { value: 'forest-green' as Theme, label: '🌲 Forest Green', color: '#10b981', gradient: 'linear-gradient(135deg, #042f2e, #10b981)' },
    { value: 'crimson' as Theme, label: '🔴 Crimson', color: '#ef4444', gradient: 'linear-gradient(135deg, #0c0404, #ef4444)' },
    { value: 'golden-hour' as Theme, label: '🌅 Golden Hour', color: '#f59e0b', gradient: 'linear-gradient(135deg, #0c0a00, #f59e0b)' },
    { value: 'monochrome' as Theme, label: '⬛ Monochrome', color: '#e2e8f0', gradient: 'linear-gradient(135deg, #0a0a0a, #64748b)' },
  ];

  readonly fonts = [
    { value: 'modern-sans' as FontPair, label: 'Modern Sans', headingFont: 'Inter', bodyFont: 'DM Sans' },
    { value: 'editorial-serif' as FontPair, label: 'Editorial Serif', headingFont: 'Playfair Display', bodyFont: 'Lora' },
    { value: 'technical-mono' as FontPair, label: 'Technical Mono', headingFont: 'JetBrains Mono', bodyFont: 'Fira Code' },
  ];

  infoForm = this.fb.group({
    name: ['', Validators.required],
    title: ['', Validators.required],
    bio: ['', Validators.required],
    linkedin: [''],
    email: ['', Validators.email],
  });

  nextStep(): void { if (this.step() < 3) this.step.update((s) => s + 1); }
  prevStep(): void { if (this.step() > 1) this.step.update((s) => s - 1); }

  selectTheme(theme: Theme): void {
    this.selectedTheme.set(theme);
    this.themeService.setTheme(theme);
  }

  selectFont(font: FontPair): void {
    this.selectedFont.set(font);
    this.themeService.setFontPair(font);
  }

  launch(): void {
    this.launching.set(true);
    const { name, title, bio, linkedin, email } = this.infoForm.value;
    const profileData = {
      name, title, bio,
      socials: { linkedin, email },
      themePreset: this.selectedTheme(),
      fontPair: this.selectedFont(),
      templateMode: false,
    };

    this.portfolioService.updateProfile(profileData).subscribe({
      next: () => {
        this.toast.success('Portfolio launched! 🎉');
        this.router.navigate(['/']);
      },
      error: () => { this.toast.error('Failed to launch. Make sure backend is running.'); this.launching.set(false); },
    });
  }
}
