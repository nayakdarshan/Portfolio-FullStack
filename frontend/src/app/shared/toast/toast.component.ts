import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast toast--{{ toast.type }}"
          role="alert"
          [attr.aria-label]="toast.message"
        >
          <span class="toast__icon" aria-hidden="true">
            @switch (toast.type) {
              @case ('success') { ✅ }
              @case ('error') { ❌ }
              @case ('warning') { ⚠️ }
              @default { ℹ️ }
            }
          </span>
          <span class="toast__message">{{ toast.message }}</span>
          <button
            class="toast__close"
            (click)="toastService.dismiss(toast.id)"
            aria-label="Dismiss notification"
          >✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: var(--space-6);
      right: var(--space-6);
      z-index: var(--z-toast);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      max-width: 380px;
      width: calc(100vw - var(--space-12));

      @media (max-width: 480px) {
        bottom: var(--space-4);
        right: var(--space-4);
        width: calc(100vw - var(--space-8));
      }
    }

    .toast {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-xl);
      animation: fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      backdrop-filter: blur(12px);

      &--success { border-left: 4px solid #10b981; }
      &--error   { border-left: 4px solid #ef4444; }
      &--warning { border-left: 4px solid #f59e0b; }
      &--info    { border-left: 4px solid var(--color-primary); }
    }

    .toast__icon { font-size: 1.1rem; flex-shrink: 0; }

    .toast__message {
      flex: 1;
      font-size: var(--text-sm);
      color: var(--color-text-primary);
      line-height: 1.5;
    }

    .toast__close {
      background: none;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      font-size: var(--text-sm);
      padding: var(--space-1);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      flex-shrink: 0;

      &:hover {
        color: var(--color-text-primary);
        background: var(--color-bg-tertiary);
      }
    }
  `],
})
export class ToastComponent {
  toastService = inject(ToastService);
}
