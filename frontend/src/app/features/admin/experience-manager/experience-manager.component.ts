import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-experience-manager',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmModalComponent],
  template: `
    <div class="admin-page">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-8)">
        <h1 class="admin-page__title" style="margin-bottom:0">Experience Manager</h1>
        <button class="btn btn--primary" (click)="showForm.set(!showForm())">{{ showForm() ? '✕ Cancel' : '+ Add Experience' }}</button>
      </div>

      @if (showForm()) {
        <div class="card" style="margin-bottom:var(--space-6)">
          <h2 style="font-size:var(--text-xl);font-weight:700;margin-bottom:var(--space-5)">{{ editing() ? 'Edit' : 'New' }} Experience</h2>
          <form [formGroup]="form" (ngSubmit)="onSave()">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);margin-bottom:var(--space-4)">
              <div class="form-group"><label class="form-label">Company</label><input type="text" class="form-input" formControlName="company" /></div>
              <div class="form-group"><label class="form-label">Role</label><input type="text" class="form-input" formControlName="role" /></div>
              <div class="form-group"><label class="form-label">Type</label>
                <select class="form-input" formControlName="type">
                  <option value="full-time">Full-time</option>
                  <option value="intern">Intern</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
              <div class="form-group"><label class="form-label">Location</label><input type="text" class="form-input" formControlName="location" /></div>
              <div class="form-group"><label class="form-label">Start Date</label><input type="text" class="form-input" formControlName="startDate" placeholder="e.g. Nov 2024" /></div>
              <div class="form-group"><label class="form-label">End Date (leave blank if current)</label><input type="text" class="form-input" formControlName="endDate" placeholder="e.g. Aug 2024" /></div>
            </div>
            <div class="form-group" style="margin-bottom:var(--space-4)">
              <label class="form-label">Technologies (comma-separated)</label>
              <input type="text" class="form-input" formControlName="technologiesText" placeholder="Angular, TypeScript, NgRx" />
            </div>
            <div class="form-group" style="margin-bottom:var(--space-4)">
              <label class="form-label">Bullet Points (one per line)</label>
              <textarea class="form-input" formControlName="bulletsText" rows="5"></textarea>
            </div>
            <div style="display:flex;justify-content:flex-end">
              <button type="submit" class="btn btn--primary" [disabled]="saving()">{{ saving() ? '⏳' : '💾 Save' }}</button>
            </div>
          </form>
        </div>
      }

      <div style="display:flex;flex-direction:column;gap:var(--space-4)">
        @for (exp of experiences(); track exp._id) {
          <div class="card" style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-4)">
            <div>
              <h3 style="font-size:var(--text-lg);font-weight:700;color:var(--color-text-primary)">{{ exp.role }}</h3>
              <p style="color:var(--color-primary);font-weight:600">{{ exp.company }}</p>
              <p style="font-size:var(--text-sm);color:var(--color-text-muted)">{{ exp.startDate }} – {{ exp.current ? 'Present' : exp.endDate }}</p>
            </div>
            <div style="display:flex;gap:var(--space-2)">
              <button class="btn btn--ghost btn--sm" (click)="editExp(exp)">✏️</button>
              <button class="btn btn--ghost btn--sm" style="color:#ef4444" (click)="confirmDelete(exp)">🗑️</button>
            </div>
          </div>
        }
      </div>
    </div>
    <app-confirm-modal [isOpen]="deleteModal()" title="Delete Experience" message="Delete this experience entry?" (confirm)="doDelete()" (cancel)="deleteModal.set(false)" />
  `,
  styles: [`.admin-page__title { font-size: var(--text-3xl); font-weight: 800; color: var(--color-text-primary); }`],
})
export class ExperienceManagerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private portfolioService = inject(PortfolioService);
  private toast = inject(ToastService);

  experiences = signal<any[]>([]);
  showForm = signal(false);
  editing = signal<any>(null);
  deleteModal = signal(false);
  deletingId = signal('');
  saving = signal(false);

  form = this.fb.group({
    company: ['', Validators.required],
    role: ['', Validators.required],
    type: ['full-time'],
    location: [''],
    startDate: ['', Validators.required],
    endDate: [''],
    technologiesText: [''],
    bulletsText: [''],
  });

  ngOnInit(): void { this.load(); }
  load(): void { this.portfolioService.getExperience().subscribe({ next: (r) => this.experiences.set(r.data || []) }); }

  editExp(exp: any): void {
    this.editing.set(exp);
    this.showForm.set(true);
    this.form.patchValue({
      company: exp.company, role: exp.role, type: exp.type, location: exp.location,
      startDate: exp.startDate, endDate: exp.endDate,
      technologiesText: (exp.technologies || []).join(', '),
      bulletsText: (exp.bullets || []).join('\n'),
    });
  }

  onSave(): void {
    this.saving.set(true);
    const { company, role, type, location, startDate, endDate, technologiesText, bulletsText } = this.form.value;
    const payload = {
      company, role, type, location, startDate, endDate: endDate || '',
      current: !endDate,
      technologies: (technologiesText || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      bullets: (bulletsText || '').split('\n').map((b: string) => b.trim()).filter(Boolean),
    };
    const req = this.editing() ? this.portfolioService.updateExperience(this.editing()._id, payload) : this.portfolioService.createExperience(payload);
    req.subscribe({
      next: () => { this.toast.success('Saved!'); this.showForm.set(false); this.editing.set(null); this.saving.set(false); this.form.reset(); this.load(); },
      error: () => { this.toast.error('Failed'); this.saving.set(false); },
    });
  }

  confirmDelete(exp: any): void { this.deletingId.set(exp._id); this.deleteModal.set(true); }
  doDelete(): void {
    this.portfolioService.deleteExperience(this.deletingId()).subscribe({
      next: () => { this.toast.success('Deleted'); this.deleteModal.set(false); this.load(); },
      error: () => { this.toast.error('Failed'); this.deleteModal.set(false); },
    });
  }
}
