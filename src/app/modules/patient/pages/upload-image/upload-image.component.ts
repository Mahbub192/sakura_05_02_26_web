import { Component } from '@angular/core';

interface UploadedItem {
  id: string;
  name: string;
  date: string;
  size: string;
  thumb?: string;
  pending?: boolean;
  progress?: number;
}

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent {
  recentImages: UploadedItem[] = [
    { id: '1', name: 'endoscopy_throat_01.jpg', date: 'Oct 24, 2023', size: '2.4 MB', thumb: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=100' },
    { id: '2', name: 'sinus_xray_final.png', date: 'Oct 22, 2023', size: '5.1 MB', thumb: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=100' },
    { id: '3', name: 'ear_canal_left.jpg', date: 'Upload pending...', size: '', pending: true, progress: 66 },
  ];

  discardAll(): void {
    this.recentImages = [];
  }

  saveToRecords(): void {
    // Placeholder – wire to API later
  }

  removeItem(id: string): void {
    this.recentImages = this.recentImages.filter((i) => i.id !== id);
  }
}
