import { Component, OnInit, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-projects-manager',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmModalComponent, SlicePipe],
  template: `
    <div class="admin-page">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-8)">
        <h1 class="admin-page__title" style="margin-bottom:0">Projects Manager</h1>
        <button class="btn btn--primary" (click)="showForm.set(!showForm())">{{ showForm() ? '✕ Cancel' : '+ Add Project' }}</button>
      </div>

      @if (showForm()) {
        <div class="card" style="margin-bottom:var(--space-6)">
          <h2 style="font-size:var(--text-xl);font-weight:700;margin-bottom:var(--space-5)">{{ editing() ? 'Edit' : 'New' }} Project</h2>
          <form [formGroup]="form" (ngSubmit)="onSave()">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);margin-bottom:var(--space-4)">
              <div class="form-group"><label class="form-label">Title *</label><input type="text" class="form-input" formControlName="title" /></div>
              <div class="form-group"><label class="form-label">Company</label><input type="text" class="form-input" formControlName="company" /></div>
              <div class="form-group"><label class="form-label">Date</label><input type="text" class="form-input" formControlName="date" placeholder="e.g. 2023" /></div>
              <div class="form-group"><label class="form-label">Category</label><input type="text" class="form-input" formControlName="category" /></div>
              <div class="form-group"><label class="form-label">Tech Stack (comma-separated)</label><input type="text" class="form-input" formControlName="techStackText" /></div>
              <div class="form-group"><label class="form-label">Order</label><input type="number" class="form-input" formControlName="order" /></div>
            </div>
            <div class="form-group" style="margin-bottom:var(--space-4)"><label class="form-label">Short Description *</label><textarea class="form-input" formControlName="description" rows="3"></textarea></div>
            <div class="form-group" style="margin-bottom:var(--space-4)"><label class="form-label">Full Description</label><textarea class="form-input" formControlName="longDescription" rows="5"></textarea></div>
            <div style="display:flex;justify-content:flex-end">
              <button type="submit" class="btn btn--primary" [disabled]="saving()">{{ saving() ? '⏳' : '💾 Save' }}</button>
            </div>
          </form>
        </div>
      }

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-5)">
        @for (proj of projects(); track proj._id) {
          <div class="card">
            <h3 style="font-size:var(--text-base);font-weight:700;color:var(--color-text-primary);margin-bottom:var(--space-2)">{{ proj.title }}</h3>
            <p style="font-size:var(--text-sm);color:var(--color-primary);font-weight:500;margin-bottom:var(--space-2)">{{ proj.company }}</p>
            <p style="font-size:var(--text-sm);color:var(--color-text-secondary);margin-bottom:var(--space-4)">{{ proj.description | slice:0:80 }}...</p>
            <div style="display:flex;gap:var(--space-2)">
              <button class="btn btn--ghost btn--sm" (click)="editProject(proj)">✏️ Edit</button>
              <button class="btn btn--ghost btn--sm" style="color:#ef4444" (click)="confirmDelete(proj)">🗑️</button>
            </div>
          </div>
        }
      </div>
    </div>
    <app-confirm-modal [isOpen]="deleteModal()" title="Delete Project" message="Delete this project?" (confirm)="doDelete()" (cancel)="deleteModal.set(false)" />
  `,
  styles: [`.admin-page__title { font-size: var(--text-3xl); font-weight: 800; color: var(--color-text-primary); }`],
})
export class ProjectsManagerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private portfolioService = inject(PortfolioService);
  private toast = inject(ToastService);

  projects = signal<any[]>([]);
  showForm = signal(false);
  editing = signal<any>(null);
  deleteModal = signal(false);
  deletingId = signal('');
  saving = signal(false);

  form = this.fb.group({
    title: ['', Validators.required],
    company: [''],
    date: [''],
    category: ['Web Application'],
    description: ['', Validators.required],
    longDescription: [''],
    techStackText: [''],
    order: [0],
  });

  ngOnInit(): void { this.load(); }
  load(): void { this.portfolioService.getProjects().subscribe({ next: (r) => this.projects.set(r.data || []) }); }

  editProject(proj: any): void {
    this.editing.set(proj);
    this.showForm.set(true);
    this.form.patchValue({ ...proj, techStackText: (proj.techStack || []).join(', ') });
  }

  onSave(): void {
    this.saving.set(true);
    const { techStackText, ...rest } = this.form.value;
    const payload = { ...rest, techStack: (techStackText || '').split(',').map((t: string) => t.trim()).filter(Boolean) };
    const req = this.editing() ? this.portfolioService.updateProject(this.editing()._id, payload) : this.portfolioService.createProject(payload);
    req.subscribe({
      next: () => { this.toast.success('Saved!'); this.showForm.set(false); this.editing.set(null); this.saving.set(false); this.form.reset({ category: 'Web Application', order: 0 }); this.load(); },
      error: () => { this.toast.error('Failed'); this.saving.set(false); },
    });
  }

  confirmDelete(proj: any): void { this.deletingId.set(proj._id); this.deleteModal.set(true); }
  doDelete(): void {
    this.portfolioService.deleteProject(this.deletingId()).subscribe({
      next: () => { this.toast.success('Deleted'); this.deleteModal.set(false); this.load(); },
      error: () => { this.toast.error('Failed'); this.deleteModal.set(false); },
    });
  }
}
