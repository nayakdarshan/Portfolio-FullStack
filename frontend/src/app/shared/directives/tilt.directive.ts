import {
  Directive, ElementRef, Input, AfterViewInit, OnDestroy, inject, NgZone
} from '@angular/core';

@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective implements AfterViewInit, OnDestroy {
  @Input() tiltMaxAngle = 10;
  @Input() tiltPerspective = 1000;
  @Input() tiltGlare = false;

  private el = inject(ElementRef);
  private zone = inject(NgZone);
  private glareEl?: HTMLElement;

  private onMouseMove = (e: MouseEvent) => this.handleMouseMove(e);
  private onMouseLeave = () => this.handleMouseLeave();

  ngAfterViewInit(): void {
    const el = this.el.nativeElement as HTMLElement;
    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';
    el.style.transition = 'transform 0.1s ease-out';

    if (this.tiltGlare) {
      this.glareEl = document.createElement('div');
      Object.assign(this.glareEl.style, {
        position: 'absolute', inset: '0', borderRadius: 'inherit',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
        opacity: '0', pointerEvents: 'none', transition: 'opacity 0.3s',
        zIndex: '1',
      });
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.appendChild(this.glareEl);
    }

    this.zone.runOutsideAngular(() => {
      el.addEventListener('mousemove', this.onMouseMove);
      el.addEventListener('mouseleave', this.onMouseLeave);
    });
  }

  private handleMouseMove(e: MouseEvent): void {
    const el = this.el.nativeElement as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * this.tiltMaxAngle * 2;
    const tiltY = -(x - 0.5) * this.tiltMaxAngle * 2;
    el.style.transform = `perspective(${this.tiltPerspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`;
    if (this.glareEl) this.glareEl.style.opacity = `${x * 0.3}`;
  }

  private handleMouseLeave(): void {
    const el = this.el.nativeElement as HTMLElement;
    el.style.transform = `perspective(${this.tiltPerspective}px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    if (this.glareEl) this.glareEl.style.opacity = '0';
    setTimeout(() => { el.style.transition = 'transform 0.1s ease-out'; }, 600);
  }

  ngOnDestroy(): void {
    const el = this.el.nativeElement as HTMLElement;
    el.removeEventListener('mousemove', this.onMouseMove);
    el.removeEventListener('mouseleave', this.onMouseLeave);
    this.glareEl?.remove();
  }
}
