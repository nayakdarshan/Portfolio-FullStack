import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    @if (isOpen) {
      <div class="modal-overlay" (click)="onOverlayClick($event)" role="dialog" aria-modal="true" [attr.aria-label]="title">
        <div class="modal-content" role="document">
          <div class="modal-icon">⚠️</div>
          <h2 class="modal-title">{{ title }}</h2>
          <p class="modal-message">{{ message }}</p>
          <div class="modal-actions">
            <button class="btn btn--ghost" (click)="cancel.emit()" aria-label="Cancel">
              {{ cancelLabel }}
            </button>
            <button class="btn btn--primary" style="background: #ef4444;" (click)="confirm.emit()" aria-label="Confirm action">
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      z-index: var(--z-modal);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-4);
      animation: fadeIn 0.2s ease both;
    }

    .modal-content {
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-2xl);
      padding: var(--space-8);
      max-width: 420px;
      width: 100%;
      text-align: center;
      animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      box-shadow: var(--shadow-xl);
    }

    .modal-icon { font-size: 3rem; margin-bottom: var(--space-4); }

    .modal-title {
      font-size: var(--text-xl);
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: var(--space-3);
    }

    .modal-message {
      color: var(--color-text-secondary);
      font-size: var(--text-base);
      line-height: 1.6;
      margin-bottom: var(--space-6);
    }

    .modal-actions {
      display: flex;
      gap: var(--space-3);
      justify-content: center;
    }
  `],
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmLabel = 'Delete';
  @Input() cancelLabel = 'Cancel';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cancel.emit();
    }
  }
}
