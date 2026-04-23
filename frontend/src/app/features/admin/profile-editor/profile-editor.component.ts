import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ToastService } from '../../../core/services/toast.service';
import { MapComponent } from '../../../shared/map/map.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  imports: [ReactiveFormsModule, MapComponent],
  template: `
    <div class="admin-page">
      <h1 class="admin-page__title">Edit Profile</h1>

      @if (loading()) {
        <div class="skeleton" style="height: 500px;"></div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="onSave()" class="admin-form">

          <!-- ── Photo Upload ── -->
          <div class="admin-form__section">
            <h2 class="admin-form__section-title">📸 Profile Photo</h2>
            <div class="photo-upload">
              <div class="photo-upload__preview">
                @if (previewUrl()) {
                  <img [src]="previewUrl()" alt="Profile preview" class="photo-upload__img" />
                } @else {
                  <div class="photo-upload__placeholder">DN</div>
                }
              </div>
              <div class="photo-upload__controls">
                <label for="photo-file-input" class="btn btn--outline btn--sm" style="cursor:pointer;display:inline-flex;align-items:center;gap:0.5rem">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                  Upload Photo
                </label>
                <input
                  id="photo-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  (change)="onPhotoSelect($event)"
                  style="display:none"
                />
                <p style="font-size:0.8rem;color:var(--text-muted)">JPG, PNG or WebP, max 5MB</p>
                @if (uploadProgress() > 0 && uploadProgress() < 100) {
                  <div class="upload-progress">
                    <div class="upload-progress__bar" [style.width.%]="uploadProgress()"></div>
                  </div>
                }
                @if (uploadProgress() === 100) {
                  <p style="font-size:0.8rem;color:#10b981">✓ Photo uploaded successfully</p>
                }
                <div class="form-group" style="margin-top:0.75rem">
                  <label class="form-label">Or paste photo URL</label>
                  <input type="url" class="form-input" formControlName="photoUrl" placeholder="https://..." />
                </div>
              </div>
            </div>
          </div>

          <!-- ── Hero & About ── -->
          <div class="admin-form__section">
            <h2 class="admin-form__section-title">Hero &amp; About</h2>
            <div class="admin-form__grid">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" formControlName="name" />
              </div>
              <div class="form-group">
                <label class="form-label">Title (e.g. Software Engineer 2)</label>
                <input type="text" class="form-input" formControlName="title" />
              </div>
              <div class="form-group" style="grid-column: 1 / -1">
                <label class="form-label">Bio</label>
                <textarea class="form-input" formControlName="bio" rows="6"></textarea>
              </div>
            </div>
          </div>

          <!-- ── Typewriter Titles ── -->
          <div class="admin-form__section">
            <h2 class="admin-form__section-title">Typewriter Titles</h2>
            <div formArrayName="typewriterTitles">
              @for (ctrl of typewriterTitles.controls; track $index; let i = $index) {
                <div class="admin-form__array-row">
                  <input type="text" class="form-input" [formControlName]="i" placeholder="e.g. Angular Developer" />
                  <button type="button" class="btn btn--ghost btn--sm" (click)="removeTitle(i)">✕</button>
                </div>
              }
              <button type="button" class="btn btn--outline btn--sm" (click)="addTitle()">+ Add Title</button>
            </div>
          </div>

          <!-- ── Social Links ── -->
          <div class="admin-form__section">
            <h2 class="admin-form__section-title">Social Links</h2>
            <div class="admin-form__grid" formGroupName="socials">
              <div class="form-group">
                <label class="form-label">LinkedIn URL</label>
                <input type="url" class="form-input" formControlName="linkedin" />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" formControlName="email" />
              </div>
              <div class="form-group">
                <label class="form-label">Phone</label>
                <input type="tel" class="form-input" formControlName="phone" />
              </div>
              <div class="form-group">
                <label class="form-label">GitHub</label>
                <input type="url" class="form-input" formControlName="github" />
              </div>
            </div>
          </div>

          <!-- ── Location & Map ── -->
          <div class="admin-form__section">
            <h2 class="admin-form__section-title">📍 Location &amp; Map</h2>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1.25rem">
              These coordinates appear as the map marker in the Contact section of your portfolio.
            </p>
            <div class="admin-form__grid" formGroupName="location">
              <div class="form-group">
                <label class="form-label">City</label>
                <input type="text" class="form-input" formControlName="city" placeholder="e.g. Bengaluru" />
              </div>
              <div class="form-group">
                <label class="form-label">Country</label>
                <input type="text" class="form-input" formControlName="country" placeholder="e.g. India" />
              </div>
              <div class="form-group">
                <label class="form-label">Latitude</label>
                <input type="number" step="0.0001" class="form-input" formControlName="lat" placeholder="12.9716" />
              </div>
              <div class="form-group">
                <label class="form-label">Longitude</label>
                <input type="number" step="0.0001" class="form-input" formControlName="lng" placeholder="77.5946" />
              </div>
            </div>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.75rem;margin-top:1rem">Map preview:</p>
            <app-map
              [lat]="locationLat()"
              [lng]="locationLng()"
              [label]="form.value.name || 'Your Location'"
              [city]="locationCityLabel()"
            />
          </div>

          <!-- ── Appearance ── -->
          <div class="admin-form__section">
            <h2 class="admin-form__section-title">Appearance</h2>
            <div class="admin-form__grid">
              <div class="form-group">
                <label class="form-label">Color Theme</label>
                <select class="form-input" formControlName="themePreset">
                  <option value="midnight-blue">🌙 Midnight Blue</option>
                  <option value="forest-green">🌲 Forest Green</option>
                  <option value="crimson">🔴 Crimson</option>
                  <option value="golden-hour">🌅 Golden Hour</option>
                  <option value="monochrome">⬛ Monochrome</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Font Pair</label>
                <select class="form-input" formControlName="fontPair">
                  <option value="modern-sans">Modern Sans (Inter + DM Sans)</option>
                  <option value="editorial-serif">Editorial Serif (Playfair + Lora)</option>
                  <option value="technical-mono">Technical Mono (JetBrains + Fira)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="admin-form__actions">
            <button type="submit" class="btn btn--primary" [disabled]="saving()">
              @if (saving()) { ⏳ Saving... } @else { 💾 Save Profile }
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .photo-upload {
      display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap;
    }
    .photo-upload__preview {
      width: 120px; height: 120px; border-radius: 16px; overflow: hidden; flex-shrink: 0;
      border: 1px solid rgba(6,182,212,0.2); background: rgba(255,255,255,0.03);
      display: flex; align-items: center; justify-content: center;
    }
    .photo-upload__img { width: 100%; height: 100%; object-fit: cover; }
    .photo-upload__placeholder {
      font-family: 'Cabinet Grotesk',sans-serif; font-size: 2.5rem; font-weight: 800;
      background: linear-gradient(135deg,#06B6D4,#EC4899);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .photo-upload__controls { display: flex; flex-direction: column; gap: 0.75rem; flex: 1; }
    .upload-progress {
      height: 3px; background: rgba(255,255,255,0.08); border-radius: 9999px; overflow: hidden;
    }
    .upload-progress__bar {
      height: 100%; background: linear-gradient(90deg, #06B6D4, #EC4899);
      border-radius: 9999px; transition: width 0.2s;
    }
  `],
  styleUrl: './profile-editor.component.scss',
})
export class ProfileEditorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private portfolioService = inject(PortfolioService);
  private toast = inject(ToastService);

  loading = signal(true);
  saving = signal(false);
  uploadProgress = signal(0);
  previewUrl = signal('');

  locationLat = signal(12.9716);
  locationLng = signal(77.5946);
  locationCityLabel = signal('Bengaluru, India');

  form = this.fb.group({
    name: ['', Validators.required],
    title: ['', Validators.required],
    bio: [''],
    photoUrl: [''],
    typewriterTitles: this.fb.array([]),
    socials: this.fb.group({
      linkedin: [''], email: [''], phone: [''], github: [''],
    }),
    location: this.fb.group({
      lat: [12.9716], lng: [77.5946], city: ['Bengaluru'], country: ['India'],
    }),
    themePreset: ['midnight-blue'],
    fontPair: ['modern-sans'],
  });

  get typewriterTitles() { return this.form.get('typewriterTitles') as FormArray; }

  ngOnInit(): void {
    this.portfolioService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const p = res.data;
          this.form.patchValue({
            name: p.name, title: p.title, bio: p.bio, photoUrl: p.photoUrl,
            socials: p.socials, themePreset: p.themePreset, fontPair: p.fontPair,
            location: p.location || { lat: 12.9716, lng: 77.5946, city: 'Bengaluru', country: 'India' },
          });
          if (p.photoUrl) {
            const src = p.photoUrl.startsWith('http')
              ? p.photoUrl
              : `${environment.apiUrl.replace('/api/v1', '')}${p.photoUrl}`;
            this.previewUrl.set(src);
          }
          this.updateMapSignals();
          (p.typewriterTitles || []).forEach((t: string) => this.typewriterTitles.push(this.fb.control(t)));
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    // Live update map preview as lat/lng changes
    this.form.get('location')?.valueChanges.subscribe((loc: any) => {
      if (loc?.lat) this.locationLat.set(+loc.lat);
      if (loc?.lng) this.locationLng.set(+loc.lng);
      const label = [loc?.city, loc?.country].filter(Boolean).join(', ');
      this.locationCityLabel.set(label || 'Bengaluru, India');
    });
  }

  private updateMapSignals(): void {
    const loc = this.form.get('location')?.value as any;
    if (loc?.lat) this.locationLat.set(+loc.lat);
    if (loc?.lng) this.locationLng.set(+loc.lng);
    const label = [loc?.city, loc?.country].filter(Boolean).join(', ');
    this.locationCityLabel.set(label || 'Bengaluru, India');
  }

  addTitle(): void { this.typewriterTitles.push(this.fb.control('')); }
  removeTitle(i: number): void { this.typewriterTitles.removeAt(i); }

  onPhotoSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.toast.error('File is too large. Max 5MB allowed.');
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to backend
    this.uploadProgress.set(10);
    this.portfolioService.uploadPhoto(file).subscribe({
      next: (res) => {
        if (res.success) {
          this.form.patchValue({ photoUrl: res.data.photoUrl });
          const src = `${environment.apiUrl.replace('/api/v1', '')}${res.data.photoUrl}`;
          this.previewUrl.set(src);
          this.uploadProgress.set(100);
          this.toast.success('Photo uploaded successfully!');
          setTimeout(() => this.uploadProgress.set(0), 3000);
        }
      },
      error: () => {
        this.toast.error('Upload failed. Please try again.');
        this.uploadProgress.set(0);
      },
    });
  }

  onSave(): void {
    this.saving.set(true);
    this.portfolioService.updateProfile(this.form.value).subscribe({
      next: () => { this.toast.success('Profile saved!'); this.saving.set(false); },
      error: () => { this.toast.error('Failed to save.'); this.saving.set(false); },
    });
  }
}
