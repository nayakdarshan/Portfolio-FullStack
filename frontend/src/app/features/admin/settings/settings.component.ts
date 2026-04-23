import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ToastService } from '../../../core/services/toast.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="admin-page">
      <h1 style="font-size:var(--text-3xl);font-weight:800;color:var(--color-text-primary);margin-bottom:var(--space-8)">Settings</h1>

      <!-- Change Password -->
      <div class="card" style="margin-bottom:var(--space-6)">
        <h2 style="font-size:var(--text-xl);font-weight:700;margin-bottom:var(--space-5);padding-bottom:var(--space-3);border-bottom:1px solid var(--color-border)">🔐 Change Password</h2>
        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);margin-bottom:var(--space-4)">
            <div class="form-group"><label class="form-label">Current Password</label><input type="password" class="form-input" formControlName="currentPassword" /></div>
            <div class="form-group"><label class="form-label">New Password</label><input type="password" class="form-input" formControlName="newPassword" /></div>
          </div>
          <div style="display:flex;justify-content:flex-end">
            <button type="submit" class="btn btn--primary" [disabled]="savingPassword()">{{ savingPassword() ? '⏳' : '🔒 Update Password' }}</button>
          </div>
        </form>
      </div>

      <!-- Theme & Font -->
      <div class="card" style="margin-bottom:var(--space-6)">
        <h2 style="font-size:var(--text-xl);font-weight:700;margin-bottom:var(--space-5);padding-bottom:var(--space-3);border-bottom:1px solid var(--color-border)">🎨 Appearance</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-6)">
          <div>
            <p class="form-label" style="margin-bottom:var(--space-3)">Color Theme</p>
            <div style="display:flex;flex-direction:column;gap:var(--space-2)">
              @for (theme of themes; track theme.value) {
                <label style="display:flex;align-items:center;gap:var(--space-3);cursor:pointer;padding:var(--space-3);border-radius:var(--radius-lg);border:1px solid var(--color-border);transition:all 0.2s" [style.border-color]="selectedTheme() === theme.value ? 'var(--color-primary)' : ''">
                  <input type="radio" name="theme" [value]="theme.value" (change)="setTheme(theme.value)" [checked]="selectedTheme() === theme.value" style="accent-color:var(--color-primary)" />
                  <span>{{ theme.label }}</span>
                </label>
              }
            </div>
          </div>
          <div>
            <p class="form-label" style="margin-bottom:var(--space-3)">Font Pair</p>
            <div style="display:flex;flex-direction:column;gap:var(--space-2)">
              @for (font of fonts; track font.value) {
                <label style="display:flex;align-items:center;gap:var(--space-3);cursor:pointer;padding:var(--space-3);border-radius:var(--radius-lg);border:1px solid var(--color-border);transition:all 0.2s" [style.border-color]="selectedFont() === font.value ? 'var(--color-primary)' : ''">
                  <input type="radio" name="font" [value]="font.value" (change)="setFont(font.value)" [checked]="selectedFont() === font.value" style="accent-color:var(--color-primary)" />
                  <span>{{ font.label }}</span>
                </label>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private portfolioService = inject(PortfolioService);
  private toast = inject(ToastService);
  private themeService = inject(ThemeService);

  savingPassword = signal(false);
  selectedTheme = this.themeService.theme;
  selectedFont = this.themeService.fontPair;

  readonly themes = [
    { value: 'midnight-blue', label: '🌙 Midnight Blue' },
    { value: 'forest-green', label: '🌲 Forest Green' },
    { value: 'crimson', label: '🔴 Crimson' },
    { value: 'golden-hour', label: '🌅 Golden Hour' },
    { value: 'monochrome', label: '⬛ Monochrome' },
  ];

  readonly fonts = [
    { value: 'modern-sans', label: 'Modern Sans (Inter + DM Sans)' },
    { value: 'editorial-serif', label: 'Editorial Serif (Playfair + Lora)' },
    { value: 'technical-mono', label: 'Technical Mono (JetBrains + Fira)' },
  ];

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  changePassword(): void {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    this.savingPassword.set(true);
    const { currentPassword, newPassword } = this.passwordForm.value;
    this.portfolioService.changePassword(currentPassword!, newPassword!).subscribe({
      next: () => { this.toast.success('Password updated!'); this.passwordForm.reset(); this.savingPassword.set(false); },
      error: (err) => { this.toast.error(err?.error?.message || 'Failed'); this.savingPassword.set(false); },
    });
  }

  setTheme(theme: any): void { this.themeService.setTheme(theme); }
  setFont(font: any): void { this.themeService.setFontPair(font); }
}
