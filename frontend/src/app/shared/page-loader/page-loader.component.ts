import {
  Component, OnInit, AfterViewInit, signal, inject
} from '@angular/core';
import { LenisService } from '../../core/services/lenis.service';
import { GsapAnimationsService } from '../../core/services/gsap-animations.service';

@Component({
  selector: 'app-page-loader',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="page-loader" [class.hide]="hiding()">
        <div class="page-loader__inner">
          <div class="page-loader__logo">DN</div>
          <div class="page-loader__bar">
            <div class="page-loader__bar-fill" [style.width.%]="progress()"></div>
          </div>
          <span class="page-loader__text">Loading portfolio...</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .page-loader {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: #0A0A0A;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 2rem;
      transition: transform 0.9s cubic-bezier(0.76, 0, 0.24, 1),
                  opacity 0.5s ease;
    }
    .page-loader.hide {
      transform: translateY(-100%);
      opacity: 0;
      pointer-events: none;
    }
    .page-loader__inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    .page-loader__logo {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: 4rem;
      font-weight: 800;
      background: linear-gradient(135deg, #06B6D4, #EC4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: pulseLogo 1.2s ease-in-out infinite alternate;
    }
    @keyframes pulseLogo {
      from { opacity: 0.6; transform: scale(0.96); }
      to   { opacity: 1;   transform: scale(1.04); }
    }
    .page-loader__bar {
      width: 200px;
      height: 2px;
      background: rgba(255,255,255,0.08);
      border-radius: 9999px;
      overflow: hidden;
    }
    .page-loader__bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #06B6D4, #EC4899);
      border-radius: 9999px;
      transition: width 0.12s linear;
    }
    .page-loader__text {
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(156,163,175,0.6);
    }
  `]
})
export class PageLoaderComponent implements OnInit {
  private lenis = inject(LenisService);
  private gsapService = inject(GsapAnimationsService);

  visible = signal(true);
  hiding = signal(false);
  progress = signal(0);

  ngOnInit(): void {
    // Simulate progress
    const interval = setInterval(() => {
      this.progress.update(p => Math.min(p + Math.random() * 15, 90));
    }, 120);

    setTimeout(() => {
      clearInterval(interval);
      this.progress.set(100);
      setTimeout(() => {
        this.hiding.set(true);
        setTimeout(() => {
          this.visible.set(false);
          // Initialize Lenis and GSAP after loader hides
          this.lenis.init();
          this.gsapService.animateHero();
          this.gsapService.initScrollAnimations();
          this.gsapService.initParallax();
        }, 900);
      }, 300);
    }, 1600);
  }
}
