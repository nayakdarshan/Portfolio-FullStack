import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer__inner">
          <div class="footer__brand">
            <span class="footer__logo">DN<span class="footer__dot">.</span></span>
            <p class="footer__tagline">Crafting digital experiences with passion & precision.</p>
          </div>

          <div class="footer__links">
            <a href="https://bit.ly/darshanlinkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" class="footer__social">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="mailto:nayakdarshan22@gmail.com" aria-label="Send email" class="footer__social">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
            <a href="#contact" aria-label="Contact form" class="footer__social">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </a>
          </div>

          <p class="footer__copy">
            &copy; {{ year }} Darshan Nayak. Built with ❤️ using Angular &amp; Node.js.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-bg-secondary);
      border-top: 1px solid var(--color-border);
      padding: var(--space-12) 0;
    }

    .footer__inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-6);
      text-align: center;
    }

    .footer__brand { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }

    .footer__logo {
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: var(--text-2xl);
      background: var(--gradient-primary);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .footer__dot { -webkit-text-fill-color: var(--color-accent); }

    .footer__tagline {
      color: var(--color-text-muted);
      font-size: var(--text-sm);
    }

    .footer__links {
      display: flex;
      gap: var(--space-4);
    }

    .footer__social {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-full);
      background: var(--color-bg-tertiary);
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
      transition: all var(--transition-base);
      text-decoration: none;

      &:hover {
        background: var(--color-primary-alpha);
        color: var(--color-primary);
        border-color: var(--color-border-focus);
        transform: translateY(-3px);
        box-shadow: var(--shadow-glow);
      }
    }

    .footer__copy {
      color: var(--color-text-muted);
      font-size: var(--text-xs);
    }
  `],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
