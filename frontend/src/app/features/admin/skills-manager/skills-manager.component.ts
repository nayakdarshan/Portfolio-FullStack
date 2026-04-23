import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-skills-manager',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmModalComponent],
  template: `
    <div class="admin-page">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-8)">
        <h1 class="admin-page__title" style="margin-bottom:0">Skills Manager</h1>
        <button class="btn btn--primary" (click)="showForm.set(!showForm())">
          {{ showForm() ? '✕ Cancel' : '+ Add Skill Group' }}
        </button>
      </div>

      @if (showForm()) {
        <div class="card" style="margin-bottom:var(--space-6)">
          <h2 style="font-size:var(--text-xl);font-weight:700;margin-bottom:var(--space-5)">
            {{ editing() ? 'Edit Skill Group' : 'New Skill Group' }}
          </h2>
          <form [formGroup]="form" (ngSubmit)="onSave()">
            <div class="admin-form__grid">
              <div class="form-group">
                <label class="form-label">Group Name</label>
                <select class="form-input" formControlName="group">
                  <option value="Frontend">🎨 Frontend</option>
                  <option value="Backend">⚙️ Backend</option>
                  <option value="Testing">🧪 Testing</option>
                  <option value="Tools">🛠️ Tools</option>
                  <option value="Cloud">☁️ Cloud</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Order</label>
                <input type="number" class="form-input" formControlName="order" min="1" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Skills (comma-separated)</label>
              <textarea class="form-input" formControlName="skillsText" rows="4"
                placeholder="Angular:95, TypeScript:90, Vue.js:80"></textarea>
              <p class="form-error" style="color:var(--color-text-muted);font-size:var(--text-xs)">
                Format: SkillName:Proficiency (e.g. Angular:95)
              </p>
            </div>
            <div class="admin-form__actions">
              <button type="submit" class="btn btn--primary" [disabled]="saving()">
                {{ saving() ? '⏳ Saving...' : '💾 Save' }}
              </button>
            </div>
          </form>
        </div>
      }

      <div class="skills-table">
        @for (group of skillGroups(); track group._id) {
          <div class="skills-table__row card">
            <div class="skills-table__info">
              <h3 class="skills-table__name">{{ group.group }}</h3>
              <p class="skills-table__count">{{ group.skills?.length || 0 }} skills</p>
              <div class="skills-table__pills">
                @for (s of group.skills?.slice(0, 5); track s.name) {
                  <span class="badge">{{ s.name }}</span>
                }
                @if ((group.skills?.length || 0) > 5) {
                  <span class="badge">+{{ (group.skills?.length || 0) - 5 }}</span>
                }
              </div>
            </div>
            <div class="skills-table__actions">
              <button class="btn btn--ghost btn--sm" (click)="editGroup(group)">✏️ Edit</button>
              <button class="btn btn--ghost btn--sm" style="color:#ef4444" (click)="confirmDelete(group)">🗑️ Delete</button>
            </div>
          </div>
        }
      </div>
    </div>

    <app-confirm-modal
      [isOpen]="deleteModal()"
      title="Delete Skill Group"
      message="Are you sure? This will permanently delete the skill group and all its skills."
      (confirm)="deleteGroup()"
      (cancel)="deleteModal.set(false)"
    />
  `,
  styles: [`
    .admin-page__title { font-size: var(--text-3xl); font-weight: 800; color: var(--color-text-primary); }
    .admin-form__grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-4); }
    .admin-form__actions { display: flex; justify-content: flex-end; }
    .skills-table { display: flex; flex-direction: column; gap: var(--space-4); }
    .skills-table__row { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); flex-wrap: wrap; }
    .skills-table__info { display: flex; flex-direction: column; gap: var(--space-2); flex: 1; }
    .skills-table__name { font-size: var(--text-lg); font-weight: 700; color: var(--color-text-primary); }
    .skills-table__count { font-size: var(--text-sm); color: var(--color-text-muted); }
    .skills-table__pills { display: flex; flex-wrap: wrap; gap: var(--space-2); }
    .skills-table__actions { display: flex; gap: var(--space-2); }
  `],
})
export class SkillsManagerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private portfolioService = inject(PortfolioService);
  private toast = inject(ToastService);

  skillGroups = signal<any[]>([]);
  showForm = signal(false);
  editing = signal<any>(null);
  deleteModal = signal(false);
  deletingId = signal('');
  saving = signal(false);

  form = this.fb.group({
    group: ['Frontend', Validators.required],
    order: [1],
    skillsText: [''],
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.portfolioService.getSkills().subscribe({ next: (r) => this.skillGroups.set(r.data || []) });
  }

  editGroup(group: any): void {
    this.editing.set(group);
    this.showForm.set(true);
    const skillsText = (group.skills || []).map((s: any) => `${s.name}:${s.proficiency}`).join(', ');
    this.form.patchValue({ group: group.group, order: group.order, skillsText });
  }

  onSave(): void {
    this.saving.set(true);
    const { group, order, skillsText } = this.form.value;
    const skills = (skillsText || '').split(',').map((s: string) => {
      const [name, prof] = s.trim().split(':');
      return { name: name?.trim(), proficiency: parseInt(prof) || 80 };
    }).filter((s: any) => s.name);

    const payload = { group, order, skills };
    const req = this.editing()
      ? this.portfolioService.updateSkillGroup(this.editing()._id, payload)
      : this.portfolioService.createSkillGroup(payload);

    req.subscribe({
      next: () => {
        this.toast.success(this.editing() ? 'Updated!' : 'Created!');
        this.form.reset({ group: 'Frontend', order: 1, skillsText: '' });
        this.editing.set(null);
        this.showForm.set(false);
        this.saving.set(false);
        this.load();
      },
      error: () => { this.toast.error('Failed to save'); this.saving.set(false); },
    });
  }

  confirmDelete(group: any): void { this.deletingId.set(group._id); this.deleteModal.set(true); }

  deleteGroup(): void {
    this.portfolioService.deleteSkillGroup(this.deletingId()).subscribe({
      next: () => { this.toast.success('Deleted'); this.deleteModal.set(false); this.load(); },
      error: () => { this.toast.error('Delete failed'); this.deleteModal.set(false); },
    });
  }
}
