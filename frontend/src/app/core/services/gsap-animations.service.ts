import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GsapAnimationsService {
  private gsap: any;
  private ScrollTrigger: any;
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    const gsapModule = await import('gsap');
    const stModule = await import('gsap/ScrollTrigger');
    this.gsap = gsapModule.gsap;
    this.ScrollTrigger = stModule.ScrollTrigger;
    this.gsap.registerPlugin(this.ScrollTrigger);
    this.initialized = true;
  }

  async animateHero(): Promise<void> {
    await this.init();
    const tl = this.gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero__greeting', { y: 40, opacity: 0, duration: 0.7, delay: 0.3 })
      .from('.hero__name', { y: 100, opacity: 0, duration: 0.9, skewY: 3 }, '-=0.3')
      .from('.hero__badge-row', { scale: 0.7, opacity: 0, duration: 0.5 }, '-=0.4')
      .from('.hero__typewriter', { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
      .from('.hero__title', { y: 20, opacity: 0, duration: 0.5 }, '-=0.4')
      .from('.hero__actions .btn', { y: 30, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.3')
      .from('.hero__stat', { scale: 0, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' }, '-=0.3')
      .from('.hero__scroll-hint', { opacity: 0, duration: 0.5 }, '-=0.1');
  }

  async initScrollAnimations(): Promise<void> {
    await this.init();
    const g = this.gsap;
    const ST = this.ScrollTrigger;

    // Section tags slide in
    g.utils.toArray('.section-tag').forEach((el: any) => {
      g.from(el, {
        x: -30, opacity: 0, duration: 0.6,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    // Section titles reveal
    g.utils.toArray('.section-title').forEach((el: any) => {
      g.from(el, {
        y: 40, opacity: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });

    // About stats count-up handled by CountUp lib
    // Skill pills stagger
    g.utils.toArray('.skills__group').forEach((group: any, i: number) => {
      g.from(group, {
        y: 40, opacity: 0, duration: 0.6, delay: i * 0.08,
        scrollTrigger: { trigger: group, start: 'top 88%', once: true }
      });
    });

    // Timeline items alternating slide
    g.utils.toArray('.timeline__item').forEach((item: any, i: number) => {
      const xDir = i % 2 === 0 ? -50 : 50;
      g.from(item, {
        x: xDir, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 85%', once: true }
      });
    });

    // Project cards 3D reveal
    g.utils.toArray('.project-card').forEach((card: any, i: number) => {
      g.from(card, {
        y: 60, opacity: 0, duration: 0.7, delay: (i % 3) * 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%', once: true }
      });
    });

    // Education cards
    g.utils.toArray('.education__card').forEach((card: any, i: number) => {
      g.from(card, {
        y: 40, opacity: 0, duration: 0.6, delay: i * 0.1,
        scrollTrigger: { trigger: card, start: 'top 88%', once: true }
      });
    });

    // Contact section
    g.from('.contact__info', {
      x: -50, opacity: 0, duration: 0.8,
      scrollTrigger: { trigger: '.contact__info', start: 'top 82%', once: true }
    });
    g.from('.contact__form', {
      x: 50, opacity: 0, duration: 0.8,
      scrollTrigger: { trigger: '.contact__form', start: 'top 82%', once: true }
    });
  }

  async initParallax(): Promise<void> {
    await this.init();
    // Hero name scroll parallax
    this.gsap.to('.hero__name', {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });
  }

  refreshScrollTrigger(): void {
    this.ScrollTrigger?.refresh();
  }
}
