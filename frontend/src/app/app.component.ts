import { Component, OnInit, inject, signal } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { ToastComponent } from './shared/toast/toast.component';
import { CursorComponent } from './shared/cursor/cursor.component';
import { ScrollProgressComponent } from './shared/scroll-progress/scroll-progress.component';
import { PageLoaderComponent } from './shared/page-loader/page-loader.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, CursorComponent, ScrollProgressComponent, PageLoaderComponent],
  template: `
    <app-page-loader />
    <app-scroll-progress />
    <app-cursor />
    <router-outlet />
    <app-toast />
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `],
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.init();
  }
}
