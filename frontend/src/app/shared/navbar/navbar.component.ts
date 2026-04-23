import {
  Component, OnInit, OnDestroy, inject, signal, computed, HostListener
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

interface NavItem {
  label: string;
  href: string;
  id: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled()" [class.hidden]="isHidden()" role="navigation" aria-label="Main navigation">
      <div class="navbar__container">
        <!-- Logo -->
        <a href="#hero" class="navbar__logo" (click)="scrollTo('hero', $event)" aria-label="Darshan Nayak - Back to top">
          <span class="navbar__logo-text">DN</span>
          <span class="navbar__logo-dot"></span>
        </a>

        <!-- Desktop Nav -->
        <ul class="navbar__links" role="list">
          @for (item of navItems; track item.id) {
            <li>
              <a
                [href]="item.href"
                class="navbar__link"
                [class.active]="activeSection() === item.id"
                (click)="scrollTo(item.id, $event)"
                [attr.aria-current]="activeSection() === item.id ? 'page' : null"
              >
                {{ item.label }}
              </a>
            </li>
          }
        </ul>

        <!-- Actions -->
        <div class="navbar__actions">
          <!-- Theme Toggle -->
          <button
            class="navbar__icon-btn"
            (click)="toggleTheme()"
            [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
            title="Toggle theme"
          >
            @if (isDark()) {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            } @else {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            }
          </button>

          <!-- Hamburger -->

          <button
            class="navbar__hamburger"
            (click)="toggleMenu()"
            [attr.aria-expanded]="menuOpen()"
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <span [class.open]="menuOpen()"></span>
            <span [class.open]="menuOpen()"></span>
            <span [class.open]="menuOpen()"></span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        id="mobile-menu"
        class="navbar__mobile"
        [class.open]="menuOpen()"
        role="dialog"
        aria-label="Mobile navigation"
        [attr.aria-hidden]="!menuOpen()"
      >
        <ul role="list">
          @for (item of navItems; track item.id) {
            <li>
              <a
                [href]="item.href"
                class="navbar__mobile-link"
                [class.active]="activeSection() === item.id"
                (click)="scrollTo(item.id, $event); closeMenu()"
              >
                {{ item.label }}
              </a>
            </li>
          }
          <li>
            <a routerLink="/admin" class="navbar__mobile-link" (click)="closeMenu()">Admin Panel →</a>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);

  isScrolled = signal(false);
  isHidden = signal(false);
  menuOpen = signal(false);
  activeSection = signal('hero');

  isDark = this.themeService.isDark;

  private lastScrollY = 0;
  private observer!: IntersectionObserver;

  readonly navItems: NavItem[] = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Education', href: '#education', id: 'education' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    const currentY = window.scrollY;
    this.isScrolled.set(currentY > 50);
    this.isHidden.set(currentY > this.lastScrollY && currentY > 200);
    this.lastScrollY = currentY;
  }

  ngOnInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupIntersectionObserver(): void {
    const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'contact'];
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    setTimeout(() => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) this.observer.observe(el);
      });
    }, 500);
  }

  scrollTo(sectionId: string, event: Event): void {
    event.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  toggleTheme(): void {
    this.themeService.toggleColorMode();
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
