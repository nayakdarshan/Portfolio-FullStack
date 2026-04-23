import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent],
  template: `
    <div class="admin-page">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-8)">
        <h1 class="admin-page__title" style="margin-bottom:0">Messages</h1>
        <span class="badge" style="font-size:var(--text-sm)">{{ unreadCount() }} unread</span>
      </div>
      @if (loading()) { <div class="skeleton" style="height:400px;"></div> }
      @else if (messages().length === 0) { <div class="card" style="text-align:center;padding:var(--space-12);color:var(--color-text-muted);font-size:var(--text-xl)">📭 No messages yet</div> }
      @else {
        <div style="display:flex;flex-direction:column;gap:var(--space-4)">
          @for (msg of messages(); track msg._id) {
            <div class="card" [style.border-left]="!msg.read ? '3px solid var(--color-primary)' : ''">
              <div style="display:flex;justify-content:space-between;gap:var(--space-4);flex-wrap:wrap;margin-bottom:var(--space-3)">
                <div>
                  <h3 style="font-size:var(--text-base);font-weight:600;color:var(--color-text-primary)">{{ msg.name }}</h3>
                  <p style="font-size:var(--text-sm);color:var(--color-primary);font-weight:500">{{ msg.subject }}</p>
                  <p style="font-size:var(--text-xs);color:var(--color-text-muted)">{{ msg.email }}</p>
                </div>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:var(--space-2)">
                  @if (!msg.read) { <span class="badge">New</span> }
                </div>
              </div>
              <p style="color:var(--color-text-secondary);font-size:var(--text-sm);line-height:1.7;margin-bottom:var(--space-4)">{{ msg.message }}</p>
              <div style="display:flex;gap:var(--space-3)">
                @if (!msg.read) { <button class="btn btn--ghost btn--sm" (click)="markRead(msg)">✅ Mark Read</button> }
                <a [href]="'mailto:' + msg.email" class="btn btn--outline btn--sm">↩ Reply</a>
                <button class="btn btn--ghost btn--sm" style="color:#ef4444" (click)="confirmDelete(msg)">🗑️ Delete</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
    <app-confirm-modal [isOpen]="deleteModal()" title="Delete Message" message="Permanently delete this message?" (confirm)="doDelete()" (cancel)="deleteModal.set(false)" />
  `,
  styles: [`.admin-page__title { font-size: var(--text-3xl); font-weight: 800; color: var(--color-text-primary); }`],
})
export class MessagesComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private toast = inject(ToastService);

  messages = signal<any[]>([]);
  loading = signal(true);
  deleteModal = signal(false);
  deletingId = signal('');
  unreadCount = signal(0);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.portfolioService.getMessages().subscribe({
      next: (r: any) => { this.messages.set(r.data || []); this.unreadCount.set(r.data?.filter((m: any) => !m.read).length || 0); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  markRead(msg: any): void {
    this.portfolioService.markMessageRead(msg._id).subscribe({ next: () => { msg.read = true; this.unreadCount.update((c) => Math.max(0, c - 1)); } });
  }

  confirmDelete(msg: any): void { this.deletingId.set(msg._id); this.deleteModal.set(true); }

  doDelete(): void {
    this.portfolioService.deleteMessage(this.deletingId()).subscribe({
      next: () => { this.toast.success('Deleted'); this.deleteModal.set(false); this.messages.update((l) => l.filter((m) => m._id !== this.deletingId())); },
      error: () => { this.toast.error('Delete failed'); this.deleteModal.set(false); },
    });
  }
}
