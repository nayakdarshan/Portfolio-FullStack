import { Component, OnInit, OnDestroy, signal, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  template: `
    <div
      class="scroll-progress"
      [style.width.%]="progress()"
      role="progressbar"
      [attr.aria-valuenow]="progress()"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Page scroll progress"
    ></div>
  `,
  styles: [`
    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: var(--gradient-primary);
      z-index: calc(var(--z-navbar) + 1);
      transition: width 0.1s linear;
      border-radius: 0 var(--radius-full) var(--radius-full) 0;
      box-shadow: 0 0 8px var(--color-primary-alpha);
    }
  `],
})
export class ScrollProgressComponent implements OnInit {
  progress = signal(0);

  @HostListener('window:scroll')
  onScroll(): void {
    const el = document.documentElement;
    const scrolled = el.scrollTop || document.body.scrollTop;
    const total = el.scrollHeight - el.clientHeight;
    this.progress.set(total > 0 ? (scrolled / total) * 100 : 0);
  }

  ngOnInit(): void {
    this.onScroll();
  }
}
