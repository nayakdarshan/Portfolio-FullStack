import {
  Directive, ElementRef, Input, AfterViewInit, OnDestroy, inject, NgZone
} from '@angular/core';

@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective implements AfterViewInit, OnDestroy {
  @Input() magneticStrength = 0.35;
  @Input() magneticRange = 80;

  private el = inject(ElementRef);
  private zone = inject(NgZone);

  private gsap: any;
  private onMouseMove = (e: MouseEvent) => this.handleMove(e);
  private onMouseLeave = () => this.handleLeave();

  async ngAfterViewInit(): Promise<void> {
    if (window.innerWidth < 768) return; // Disable on mobile
    const m = await import('gsap');
    this.gsap = m.gsap;
    const el = this.el.nativeElement as HTMLElement;
    this.zone.runOutsideAngular(() => {
      el.addEventListener('mousemove', this.onMouseMove);
      el.addEventListener('mouseleave', this.onMouseLeave);
    });
  }

  private handleMove(e: MouseEvent): void {
    if (!this.gsap) return;
    const el = this.el.nativeElement as HTMLElement;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < this.magneticRange) {
      this.gsap.to(el, {
        x: dx * this.magneticStrength,
        y: dy * this.magneticStrength,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }

  private handleLeave(): void {
    if (!this.gsap) return;
    this.gsap.to(this.el.nativeElement, {
      x: 0, y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)',
    });
  }

  ngOnDestroy(): void {
    const el = this.el.nativeElement as HTMLElement;
    el.removeEventListener('mousemove', this.onMouseMove);
    el.removeEventListener('mouseleave', this.onMouseLeave);
  }
}
