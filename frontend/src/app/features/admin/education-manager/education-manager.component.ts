import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-education-manager',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="admin-page">
      <h1 style="font-size:var(--text-3xl);font-weight:800;color:var(--color-text-primary);margin-bottom:var(--space-8)">Education Manager</h1>
      @if (loading()) { <div class="skeleton" style="height:300px;"></div> }
      @else {
        <div style="display:flex;flex-direction:column;gap:var(--space-6)">
          @for (edu of education(); track edu._id) {
            <div class="card">
              <h3 style="font-size:var(--text-lg);font-weight:700;color:var(--color-text-primary);margin-bottom:var(--space-4)">{{ edu.institution }}</h3>
              <form [formGroup]="getForms()[edu._id]" (ngSubmit)="save(edu._id)">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);margin-bottom:var(--space-4)">
                  <div class="form-group"><label class="form-label">Institution</label><input type="text" class="form-input" formControlName="institution" /></div>
                  <div class="form-group"><label class="form-label">Degree</label><input type="text" class="form-input" formControlName="degree" /></div>
                  <div class="form-group"><label class="form-label">Field</label><input type="text" class="form-input" formControlName="field" /></div>
                  <div class="form-group"><label class="form-label">Location</label><input type="text" class="form-input" formControlName="location" /></div>
                  <div class="form-group"><label class="form-label">Start Year</label><input type="number" class="form-input" formControlName="startYear" /></div>
                  <div class="form-group"><label class="form-label">End Year</label><input type="number" class="form-input" formControlName="endYear" /></div>
                </div>
                <button type="submit" class="btn btn--primary btn--sm">💾 Save</button>
              </form>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [],
})
export class EducationManagerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private portfolioService = inject(PortfolioService);
  private toast = inject(ToastService);

  education = signal<any[]>([]);
  loading = signal(true);
  private forms: Record<string, any> = {};

  ngOnInit(): void {
    this.portfolioService.getEducation().subscribe({
      next: (r) => {
        this.education.set(r.data || []);
        r.data?.forEach((edu: any) => {
          this.forms[edu._id] = this.fb.group({ institution: [edu.institution], degree: [edu.degree], field: [edu.field], location: [edu.location], startYear: [edu.startYear], endYear: [edu.endYear] });
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getForms() { return this.forms; }
  save(id: string) { this.portfolioService.updateEducation(id, this.forms[id].value).subscribe({ next: () => this.toast.success('Saved!'), error: () => this.toast.error('Failed') }); }
}
