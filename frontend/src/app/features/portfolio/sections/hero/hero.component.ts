import {
  Component, OnInit, OnDestroy, inject, signal, computed
} from '@angular/core';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { HeroCanvasComponent } from '../../../../shared/hero-canvas/hero-canvas.component';
import { MagneticDirective } from '../../../../shared/directives/magnetic.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [HeroCanvasComponent, MagneticDirective],
  template: `
    <section class="hero" aria-labelledby="hero-heading">
      <!-- Three.js WebGL Background (desktop) -->
      <app-hero-canvas class="hero__canvas-bg" aria-hidden="true"></app-hero-canvas>

      <!-- CSS Fallback Orbs (mobile / SSR) -->
      <div class="hero__bg hero__bg--orbs" aria-hidden="true">
        <div class="hero__orb hero__orb--1"></div>
        <div class="hero__orb hero__orb--2"></div>
        <div class="hero__orb hero__orb--3"></div>
      </div>

      <div class="hero__container">
        <!-- Content column -->
        <div class="hero__content">
          <span class="hero__greeting">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#06B6D4" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            Software Engineer 2
          </span>

          <h1 id="hero-heading" class="hero__name">DARSHAN<br>NAYAK</h1>

          <div class="hero__badge-row">
            <span class="hero__exp-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
              4+ Years Experience
            </span>
            <span class="hero__exp-badge hero__exp-badge--fuchsia">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              Open to Roles
            </span>
          </div>

          <div class="hero__typewriter" aria-live="polite" [attr.aria-label]="'Currently: ' + currentTitle()">
            <span class="hero__typewriter-text">{{ displayedText() }}</span>
            <span class="hero__cursor" aria-hidden="true">|</span>
          </div>

          <p class="hero__title">
            Building scalable enterprise products with Angular, TypeScript,
            and modern web technologies.
          </p>

          <div class="hero__actions">
            <a href="#projects" class="btn btn--primary btn--lg" appMagnetic
               (click)="scrollTo('projects', $event)" aria-label="View my work">
              View My Work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a [href]="resumeUrl" class="btn btn--secondary btn--lg" appMagnetic
               target="_blank" rel="noopener noreferrer" aria-label="Download resume PDF">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download CV
            </a>
          </div>

          <div class="hero__scroll-hint" aria-hidden="true">
            <span>Scroll to explore</span>
            <div class="hero__scroll-arrow"></div>
          </div>
        </div>

        <!-- Visual column -->
        <div class="hero__visual">
          <div class="hero__avatar-wrap">
            <div class="hero__avatar">
              <div class="hero__avatar-initials">DN</div>
              <div class="hero__avatar-ring"></div>
            </div>
          </div>
          <div class="hero__stat hero__stat--1" aria-hidden="true">
            <span class="hero__stat-number">4+</span>
            <span class="hero__stat-label">Years Exp.</span>
          </div>
          <div class="hero__stat hero__stat--2" aria-hidden="true">
            <span class="hero__stat-number">5+</span>
            <span class="hero__stat-label">Projects</span>
          </div>
          <div class="hero__stat hero__stat--3" aria-hidden="true">
            <span class="hero__stat-number">3</span>
            <span class="hero__stat-label">Companies</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, OnDestroy {
  private portfolioService = inject(PortfolioService);

  readonly titles = ['Angular Developer', 'Frontend Architect', 'Full-Stack Engineer', 'TypeScript Expert'];
  readonly currentTitleIdx = signal(0);
  readonly currentTitle = computed(() => this.titles[this.currentTitleIdx()]);
  readonly displayedText = signal('');
  readonly resumeUrl = this.portfolioService.getResumeDownloadUrl();

  private typeTimer: any;
  private isDeleting = false;
  private charIdx = 0;

  ngOnInit(): void { this.runTypewriter(); }

  ngOnDestroy(): void { clearTimeout(this.typeTimer); }

  private runTypewriter(): void {
    const title = this.currentTitle();
    const speed = this.isDeleting ? 50 : 100;
    const pauseTime = 2000;

    if (!this.isDeleting && this.charIdx <= title.length) {
      this.displayedText.set(title.substring(0, this.charIdx++));
      this.typeTimer = setTimeout(() => this.runTypewriter(), speed);
    } else if (this.isDeleting && this.charIdx >= 0) {
      this.displayedText.set(title.substring(0, this.charIdx--));
      this.typeTimer = setTimeout(() => this.runTypewriter(), speed);
    } else if (!this.isDeleting) {
      this.isDeleting = true;
      this.typeTimer = setTimeout(() => this.runTypewriter(), pauseTime);
    } else {
      this.isDeleting = false;
      this.charIdx = 0;
      this.currentTitleIdx.update((i) => (i + 1) % this.titles.length);
      this.typeTimer = setTimeout(() => this.runTypewriter(), 300);
    }
  }

  scrollTo(sectionId: string, event: Event): void {
    event.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}
