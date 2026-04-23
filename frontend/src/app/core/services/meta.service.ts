import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
}

@Injectable({ providedIn: 'root' })
export class MetaService {
  private title = inject(Title);
  private meta = inject(Meta);

  setMeta(config: SeoConfig): void {
    if (config.title) {
      this.title.setTitle(config.title);
      this.meta.updateTag({ property: 'og:title', content: config.ogTitle || config.title });
      this.meta.updateTag({ name: 'twitter:title', content: config.ogTitle || config.title });
    }

    if (config.description) {
      this.meta.updateTag({ name: 'description', content: config.description });
      this.meta.updateTag({ property: 'og:description', content: config.ogDescription || config.description });
      this.meta.updateTag({ name: 'twitter:description', content: config.description });
    }

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }
  }

  setDefault(): void {
    this.setMeta({
      title: 'Darshan Nayak | Software Engineer 2',
      description: 'Portfolio of Darshan Nayak — Software Engineer 2 specializing in Angular, React, Vue.js and full-stack development with 4+ years of experience.',
      keywords: 'Darshan Nayak, Software Engineer, Angular Developer, Frontend Architect',
    });
  }
}
