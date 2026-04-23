import { Component, OnInit, OnDestroy, signal } from '@angular/core';

@Component({
  selector: 'app-cursor',
  standalone: true,
  template: `
    @if (isDesktop()) {
      <div
        class="cursor-ring"
        [style.transform]="'translate(' + x() + 'px, ' + y() + 'px)'"
        [class.cursor-ring--hover]="isHovering()"
        aria-hidden="true"
      ></div>
      <div
        class="cursor-dot"
        [style.transform]="'translate(' + x() + 'px, ' + y() + 'px)'"
        aria-hidden="true"
      ></div>
    }
  `,
  styles: [`
    .cursor-ring,
    .cursor-dot {
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: var(--z-cursor);
      border-radius: 50%;
      will-change: transform;
    }

    .cursor-ring {
      width: 36px;
      height: 36px;
      border: 2px solid var(--color-primary);
      opacity: 0.5;
      margin-left: -18px;
      margin-top: -18px;
      transition: transform 0.12s ease, opacity 0.2s ease, width 0.2s ease, height 0.2s ease;

      &--hover {
        width: 52px;
        height: 52px;
        margin-left: -26px;
        margin-top: -26px;
        opacity: 0.8;
        border-color: var(--color-accent);
        background: var(--color-primary-alpha);
      }
    }

    .cursor-dot {
      width: 6px;
      height: 6px;
      background: var(--color-primary);
      margin-left: -3px;
      margin-top: -3px;
      transition: none;
    }
  `],
})
export class CursorComponent implements OnInit, OnDestroy {
  x = signal(0);
  y = signal(0);
  isHovering = signal(false);
  isDesktop = signal(false);

  private onMouseMove = (e: MouseEvent) => {
    this.x.set(e.clientX);
    this.y.set(e.clientY);
  };

  private onMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    this.isHovering.set(
      !!(target.closest('a, button, [role="button"], .card, .btn'))
    );
  };

  ngOnInit(): void {
    this.isDesktop.set(window.matchMedia('(pointer: fine)').matches);
    if (this.isDesktop()) {
      document.addEventListener('mousemove', this.onMouseMove, { passive: true });
      document.addEventListener('mouseover', this.onMouseOver, { passive: true });
      document.documentElement.style.cursor = 'none';
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseover', this.onMouseOver);
    document.documentElement.style.cursor = '';
  }
}
