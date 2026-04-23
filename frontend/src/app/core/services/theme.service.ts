import { Injectable, signal, computed } from '@angular/core';

export type Theme = 'midnight-blue' | 'forest-green' | 'crimson' | 'golden-hour' | 'monochrome';
export type FontPair = 'modern-sans' | 'editorial-serif' | 'technical-mono';
export type ColorMode = 'dark' | 'light';

const STORAGE_KEYS = {
  MODE: 'portfolio_color_mode',
  THEME: 'portfolio_theme',
  FONT: 'portfolio_font',
} as const;

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly colorMode = signal<ColorMode>('dark');
  readonly theme = signal<Theme>('midnight-blue');
  readonly fontPair = signal<FontPair>('modern-sans');

  readonly isDark = computed(() => this.colorMode() === 'dark');

  init(): void {
    const savedMode = (localStorage.getItem(STORAGE_KEYS.MODE) as ColorMode) || 'dark';
    const savedTheme = (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || 'midnight-blue';
    const savedFont = (localStorage.getItem(STORAGE_KEYS.FONT) as FontPair) || 'modern-sans';

    this.applyMode(savedMode);
    this.applyTheme(savedTheme);
    this.applyFont(savedFont);
  }

  toggleColorMode(): void {
    const next: ColorMode = this.colorMode() === 'dark' ? 'light' : 'dark';
    this.applyMode(next);
    localStorage.setItem(STORAGE_KEYS.MODE, next);
  }

  setTheme(theme: Theme): void {
    this.applyTheme(theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  setFontPair(font: FontPair): void {
    this.applyFont(font);
    localStorage.setItem(STORAGE_KEYS.FONT, font);
  }

  private applyMode(mode: ColorMode): void {
    this.colorMode.set(mode);
    document.documentElement.setAttribute('data-mode', mode);
  }

  private applyTheme(theme: Theme): void {
    this.theme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  private applyFont(font: FontPair): void {
    this.fontPair.set(font);
    document.documentElement.setAttribute('data-font', font);
  }
}
