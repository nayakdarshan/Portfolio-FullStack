import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { ToastService } from '../../../../core/services/toast.service';
import { MapComponent } from '../../../../shared/map/map.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, MapComponent],
  template: `
    <section class="contact section" id="contact" aria-labelledby="contact-heading">
      <div class="container">
        <p class="section-tag">Get In Touch</p>
        <h2 id="contact-heading" class="section-title">
          Got a Wild<br>
          <span class="gradient-text">Idea?</span>
        </h2>
        <p class="section-subtitle">Have a project in mind or want to chat? I'd love to hear from you.</p>

        <div class="contact__grid">
          <!-- Left column: Info + Map -->
          <div class="contact__info">
            <h3 class="contact__info-title">Contact Information</h3>
            <div class="contact__links">
              <a href="mailto:nayakdarshan22@gmail.com" class="contact__link" aria-label="Send email">
                <span class="contact__link-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <div>
                  <p class="contact__link-label">Email</p>
                  <p class="contact__link-value">nayakdarshan22&#64;gmail.com</p>
                </div>
              </a>
              <a href="https://bit.ly/darshanlinkedin" target="_blank" rel="noopener noreferrer" class="contact__link" aria-label="LinkedIn profile">
                <span class="contact__link-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#06B6D4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </span>
                <div>
                  <p class="contact__link-label">LinkedIn</p>
                  <p class="contact__link-value">bit.ly/darshanlinkedin</p>
                </div>
              </a>
              <div class="contact__link">
                <span class="contact__link-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#06B6D4"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </span>
                <div>
                  <p class="contact__link-label">Location</p>
                  <p class="contact__link-value">{{ locationCity() }}</p>
                </div>
              </div>
            </div>

            <div class="contact__availability">
              <span class="contact__status-dot" aria-hidden="true"></span>
              <span>Open to new opportunities</span>
            </div>

            <!-- Leaflet Map -->
            <app-map
              [lat]="locationLat()"
              [lng]="locationLng()"
              [label]="'Darshan Nayak'"
              [city]="locationCity()"
              class="contact__map"
            />
          </div>

          <!-- Right column: Form -->
          <form
            class="contact__form"
            [formGroup]="form"
            (ngSubmit)="onSubmit()"
            novalidate
            aria-label="Contact form"
          >
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="contact-name">Name *</label>
                <input
                  id="contact-name" type="text" class="form-input"
                  [class.invalid]="f['name'].invalid && f['name'].touched"
                  formControlName="name" placeholder="Your full name"
                  autocomplete="name" aria-required="true"
                />
                @if (f['name'].invalid && f['name'].touched) {
                  <p class="form-error" role="alert">Name is required</p>
                }
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-email">Email *</label>
                <input
                  id="contact-email" type="email" class="form-input"
                  [class.invalid]="f['email'].invalid && f['email'].touched"
                  formControlName="email" placeholder="your@email.com"
                  autocomplete="email" aria-required="true"
                />
                @if (f['email'].invalid && f['email'].touched) {
                  <p class="form-error" role="alert">Valid email required</p>
                }
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="contact-subject">Subject *</label>
              <input
                id="contact-subject" type="text" class="form-input"
                [class.invalid]="f['subject'].invalid && f['subject'].touched"
                formControlName="subject" placeholder="What's this about?"
                aria-required="true"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="contact-message">Message *</label>
              <textarea
                id="contact-message" class="form-input"
                [class.invalid]="f['message'].invalid && f['message'].touched"
                formControlName="message" rows="6"
                placeholder="Tell me about your project, idea, or opportunity..."
                aria-required="true"
              ></textarea>
              @if (f['message'].invalid && f['message'].touched) {
                <p class="form-error" role="alert">Message is required (min 10 chars)</p>
              }
            </div>

            <button
              type="submit"
              class="btn btn--primary btn--lg"
              [disabled]="submitting()"
              [attr.aria-busy]="submitting()"
              style="width: 100%"
            >
              @if (submitting()) {
                <span aria-hidden="true" style="animation: spin 1s linear infinite; display:inline-block">↻</span>
                Sending...
              } @else {
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Send Message →
              }
            </button>
          </form>
        </div>
      </div>
    </section>
  `,
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private fb = inject(FormBuilder);
  private portfolioService = inject(PortfolioService);
  private toast = inject(ToastService);

  submitting = signal(false);
  locationLat = signal(12.9716);
  locationLng = signal(77.5946);
  locationCity = signal('Bengaluru, India');

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.maxLength(200)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
  });

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.portfolioService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data?.location) {
          const loc = res.data.location;
          if (loc.lat) this.locationLat.set(loc.lat);
          if (loc.lng) this.locationLng.set(loc.lng);
          const city = [loc.city, loc.country].filter(Boolean).join(', ');
          if (city) this.locationCity.set(city);
        }
      },
      error: () => {},
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);

    this.portfolioService.submitContact(this.form.value as any).subscribe({
      next: (res) => {
        this.toast.success(res.message || "Message sent! I'll get back to you soon.");
        this.form.reset();
        this.submitting.set(false);
      },
      error: (err) => {
        this.toast.error(err?.error?.message || 'Failed to send. Please try again.');
        this.submitting.set(false);
      },
    });
  }
}
