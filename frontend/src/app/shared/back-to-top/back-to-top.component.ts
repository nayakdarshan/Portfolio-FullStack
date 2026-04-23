import { Component, signal, HostListener } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  template: `
    @if (isVisible()) {
      <button
        class="back-to-top"
        (click)="scrollToTop()"
        aria-label="Back to top"
        title="Back to top"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    }
  `,
  styles: [`
    .back-to-top {
      position: fixed;
      bottom: var(--space-8);
      right: var(--space-8);
      z-index: var(--z-above);
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full);
      background: var(--gradient-primary);
      color: #fff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-lg), var(--shadow-glow);
      transition: all var(--transition-base);
      animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

      &:hover {
        transform: translateY(-4px) scale(1.1);
        box-shadow: var(--shadow-xl), var(--shadow-glow-lg);
      }

      &:active { transform: translateY(0) scale(0.95); }

      @media (max-width: 768px) {
        bottom: var(--space-6);
        right: var(--space-4);
        width: 42px;
        height: 42px;
      }
    }
  `],
})
export class BackToTopComponent {
  isVisible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.isVisible.set(window.scrollY > 300);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
