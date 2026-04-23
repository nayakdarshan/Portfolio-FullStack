import { Injectable, NgZone, OnDestroy } from '@angular/core';
import Lenis from 'lenis';

@Injectable({ providedIn: 'root' })
export class LenisService implements OnDestroy {
  private lenis!: Lenis;
  private rafId!: number;

  init(): void {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
    } as any);
    this.raf(0);

    // Pause on hidden tab
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.lenis.stop();
      } else {
        this.lenis.start();
      }
    });
  }

  private raf(time: number): void {
    this.lenis.raf(time);
    this.rafId = requestAnimationFrame((t) => this.raf(t));
  }

  scrollTo(target: string, options?: any): void {
    this.lenis?.scrollTo(target, { offset: -80, duration: 1.4, ...options });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.lenis?.destroy();
  }
}
