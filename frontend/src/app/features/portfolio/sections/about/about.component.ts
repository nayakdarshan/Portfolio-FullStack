import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { environment } from '../../../../../environments/environment';

interface Stat { label: string; value: number; suffix: string; displayed: number; }

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section class="about section" id="about" aria-labelledby="about-heading">
      <div class="container">
        <div class="about__grid">
          <!-- Photo column -->
          <div class="about__photo-col">
            <div class="about__photo-wrap">
              <div class="about__photo" aria-label="Darshan Nayak profile photo">
                @if (photoSrc()) {
                  <img [src]="photoSrc()" alt="Darshan Nayak" class="about__photo-img" />
                } @else {
                  <div class="about__photo-placeholder">DN</div>
                }
              </div>
              <div class="about__photo-deco about__photo-deco--1" aria-hidden="true"></div>
              <div class="about__photo-deco about__photo-deco--2" aria-hidden="true"></div>
            </div>
          </div>

          <!-- Content column -->
          <div class="about__content">
            <p class="section-tag">Who I Am</p>
            <h2 id="about-heading" class="section-title">
              Crafting Digital<br>
              <span class="gradient-text">Experiences</span>
            </h2>

            <p class="about__bio">
              {{ profile()?.bio || defaultBio }}
            </p>

            <!-- Animated stats -->
            <div class="about__stats">
              @for (stat of stats; track stat.label) {
                <div class="about__stat-card card">
                  <span class="about__stat-number gradient-text">
                    {{ stat.displayed }}{{ stat.suffix }}
                  </span>
                  <span class="about__stat-label">{{ stat.label }}</span>
                </div>
              }
            </div>

            <!-- Tech pills -->
            <div class="about__tech">
              @for (tech of topTech; track tech) {
                <span class="badge">{{ tech }}</span>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  private portfolioService = inject(PortfolioService);

  profile = signal<any>(null);
  photoSrc = computed<string>(() => {
    const url = this.profile()?.photoUrl;
    if (!url) return '';
    // If relative path, prepend backend origin
    return url.startsWith('http') ? url : `${environment.apiUrl.replace('/api/v1', '')}${url}`;
  });

  readonly defaultBio = `I'm a passionate Software Engineer with 4+ years of experience building scalable,
  high-performance web applications. I specialize in Angular and the broader JavaScript ecosystem,
  with a proven track record delivering micro-frontend architectures, enterprise CRM tools,
  and seamless user experiences across fintech, real estate, retail, and hospitality domains.`;

  readonly topTech = [
    'Angular', 'TypeScript', 'Vue.js', 'React', 'Node.js',
    'NgRx', 'Micro Frontend', 'SCSS', 'MongoDB', 'Jest',
  ];

  stats: Stat[] = [
    { label: 'Years Experience', value: 4, suffix: '+', displayed: 0 },
    { label: 'Projects Delivered', value: 5, suffix: '+', displayed: 0 },
    { label: 'Companies', value: 3, suffix: '', displayed: 0 },
    { label: 'Satisfaction', value: 100, suffix: '%', displayed: 0 },
  ];

  ngOnInit(): void {
    this.portfolioService.getProfile().subscribe({
      next: (res) => { if (res.success) this.profile.set(res.data); },
      error: () => {},
    });
    this.setupCounterObserver();
  }

  private setupCounterObserver(): void {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.animateCounters();
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    setTimeout(() => {
      const el = document.querySelector('.about__stats');
      if (el) obs.observe(el);
    }, 800);
  }

  private animateCounters(): void {
    this.stats.forEach((stat, i) => {
      let current = 0;
      const duration = 2000;
      const step = duration / stat.value;
      setTimeout(() => {
        const iv = setInterval(() => {
          current += 1;
          stat.displayed = current;
          if (current >= stat.value) clearInterval(iv);
        }, step);
      }, i * 150);
    });
  }
}
