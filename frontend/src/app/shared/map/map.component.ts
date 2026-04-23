import {
  Component, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, ViewChild,
  ElementRef, PLATFORM_ID, inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  template: `
    <div class="map-container">
      <div #mapEl id="portfolio-map-{{uid}}" class="map-container__inner"></div>
      <div class="map-container__overlay">
        <div class="map-container__badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          {{ city || 'Bengaluru, India' }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-container {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .map-container__inner {
      height: 320px;
      width: 100%;
    }
    .map-container__overlay {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      z-index: 900;
      pointer-events: none;
    }
    .map-container__badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(10,10,10,0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(6,182,212,0.3);
      color: #06B6D4;
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 9999px;
    }
  `]
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() lat = 12.9716;
  @Input() lng = 77.5946;
  @Input() zoom = 14;
  @Input() label = 'Darshan Nayak';
  @Input() city = 'Bengaluru, India';
  @ViewChild('mapEl') mapEl!: ElementRef;

  private platform = inject(PLATFORM_ID);
  private map: any;
  uid = Math.random().toString(36).slice(2, 8);

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platform)) return;
    await this.initMap();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (!isPlatformBrowser(this.platform)) return;
    if ((changes['lat'] || changes['lng']) && this.map) {
      this.map.setView([this.lat, this.lng], this.zoom);
    }
  }

  private async initMap(): Promise<void> {
    const L = await import('leaflet');

    // Fix default icon path (bundler issue)
    (L as any).Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    this.map = L.map(`portfolio-map-${this.uid}`, {
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: false,
    }).setView([this.lat, this.lng], this.zoom);

    // Dark CartoDB tile layer
    (L as any).tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      { maxZoom: 19 }
    ).addTo(this.map);

    // Custom cyan marker
    const markerIcon = (L as any).divIcon({
      html: `
        <div style="
          position:relative; width:20px; height:20px;
          display:flex; align-items:center; justify-content:center;">
          <div style="
            width:14px; height:14px; background:#06B6D4;
            border-radius:50%; border:3px solid #0A0A0A;
            box-shadow:0 0 0 4px rgba(6,182,212,0.25);
            animation:none;"></div>
          <div style="
            position:absolute; width:32px; height:32px;
            border-radius:50%; border:1px solid rgba(6,182,212,0.4);
            top:50%; left:50%; transform:translate(-50%,-50%);"></div>
        </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      className: '',
    });

    (L as any).marker([this.lat, this.lng], { icon: markerIcon })
      .addTo(this.map)
      .bindPopup(`
        <div style="
          font-family:'Cabinet Grotesk',sans-serif; color:#fff;
          min-width:140px; text-align:center;">
          <strong style="font-size:1rem">${this.label}</strong><br>
          <span style="color:#06B6D4;font-size:0.8rem">Open to opportunities</span>
        </div>`)
      .openPopup();

    // Pulse circle
    (L as any).circle([this.lat, this.lng], {
      radius: 500, color: '#06B6D4', fillColor: '#06B6D4',
      fillOpacity: 0.06, weight: 1, opacity: 0.35,
    }).addTo(this.map);
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
