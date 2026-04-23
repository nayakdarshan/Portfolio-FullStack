import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-card__header">
          <div class="login-card__logo gradient-text">DN</div>
          <h1 class="login-card__title">Admin Login</h1>
          <p class="login-card__subtitle">Sign in to manage your portfolio</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate class="login-card__form">
          <div class="form-group">
            <label class="form-label" for="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              class="form-input"
              [class.invalid]="f['email'].invalid && f['email'].touched"
              formControlName="email"
              placeholder="admin@portfolio.com"
              autocomplete="email"
              aria-required="true"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="admin-password">Password</label>
            <div class="login-card__password-wrap">
              <input
                id="admin-password"
                [type]="showPassword() ? 'text' : 'password'"
                class="form-input"
                [class.invalid]="f['password'].invalid && f['password'].touched"
                formControlName="password"
                placeholder="••••••••"
                autocomplete="current-password"
                aria-required="true"
              />
              <button
                type="button"
                class="login-card__eye"
                (click)="togglePassword()"
                [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
              >{{ showPassword() ? '🙈' : '👁️' }}</button>
            </div>
          </div>

          @if (error()) {
            <div class="login-card__error" role="alert">
              ❌ {{ error() }}
            </div>
          }

          <button
            type="submit"
            class="btn btn--primary"
            [disabled]="loading()"
            style="width:100%;margin-top:var(--space-4)"
          >
            @if (loading()) { ⏳ Signing in... } @else { 🔐 Sign In }
          </button>
        </form>

        <p class="login-card__back">
          <a routerLink="/" style="color:var(--color-primary)">← Back to Portfolio</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-4);
      background: var(--gradient-hero);
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-2xl);
      padding: var(--space-8);
      box-shadow: var(--shadow-xl);
      animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;

      &__header { text-align: center; margin-bottom: var(--space-8); }

      &__logo {
        font-size: 3rem;
        font-weight: 800;
        font-family: var(--font-heading);
        margin-bottom: var(--space-4);
      }

      &__title {
        font-size: var(--text-2xl);
        font-weight: 700;
        color: var(--color-text-primary);
        margin-bottom: var(--space-2);
      }

      &__subtitle { color: var(--color-text-muted); font-size: var(--text-sm); }

      &__form { display: flex; flex-direction: column; gap: var(--space-2); }

      &__password-wrap { position: relative; }

      &__eye {
        position: absolute;
        right: var(--space-3);
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.1rem;
        padding: var(--space-1);
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
        &:hover { background: var(--color-bg-tertiary); }
      }

      &__error {
        padding: var(--space-3) var(--space-4);
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: var(--radius-md);
        font-size: var(--text-sm);
        color: #ef4444;
        animation: fadeIn 0.2s ease;
      }

      &__back {
        text-align: center;
        margin-top: var(--space-6);
        font-size: var(--text-sm);
        color: var(--color-text-muted);
      }
    }
  `],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get f() { return this.form.controls; }

  togglePassword(): void { this.showPassword.update((v) => !v); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.f['email'].value!, this.f['password'].value!).subscribe({
      next: () => {
        this.toast.success('Welcome back!');
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/admin';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Invalid email or password');
        this.loading.set(false);
      },
    });
  }
}
