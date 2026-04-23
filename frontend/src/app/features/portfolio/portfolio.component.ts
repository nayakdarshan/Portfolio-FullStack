import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { BackToTopComponent } from '../../shared/back-to-top/back-to-top.component';
import { HeroComponent } from './sections/hero/hero.component';
import { AboutComponent } from './sections/about/about.component';
import { SkillsComponent } from './sections/skills/skills.component';
import { ExperienceComponent } from './sections/experience/experience.component';
import { ProjectsComponent } from './sections/projects/projects.component';
import { EducationComponent } from './sections/education/education.component';
import { ContactComponent } from './sections/contact/contact.component';
import { MetaService } from '../../core/services/meta.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    BackToTopComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    EducationComponent,
    ContactComponent,
  ],
  template: `
    <app-navbar />
    <main id="main-content">
      <app-hero id="hero" />
      <app-about id="about" />
      <app-skills id="skills" />
      <app-experience id="experience" />
      <app-projects id="projects" />
      <app-education id="education" />
      <app-contact id="contact" />
    </main>
    <app-footer />
    <app-back-to-top />
  `,
  styles: [`
    main { display: block; }
  `],
})
export class PortfolioComponent implements OnInit {
  private meta = inject(MetaService);

  ngOnInit(): void {
    this.meta.setDefault();
  }
}
