import { Component } from '@angular/core';

interface CartItem {
  id: string;
  type: 'appointment' | 'refill' | 'lab' | 'consultation';
  title: string;
  subtitle: string;
  date?: string;
}

@Component({
  selector: 'app-health-cart',
  templateUrl: './health-cart.component.html',
  styleUrls: ['./health-cart.component.scss'],
})
export class HealthCartComponent {
  cartItems: CartItem[] = [
    { id: '1', type: 'appointment', title: 'Consultation with Dr. Sarah Jenkins', subtitle: 'Ear Department • General check-up', date: 'Mar 5, 2026 at 10:00 AM' },
    { id: '2', type: 'refill', title: 'Prescription refill request', subtitle: 'Amoxicillin (500mg) • 7 days supply', date: 'Requested Feb 28, 2026' },
    { id: '3', type: 'consultation', title: 'Follow-up with Dr. Elena Rodriguez', subtitle: 'Throat & Vocal • Post-treatment', date: 'Mar 12, 2026 at 02:00 PM' },
  ];

  removeItem(id: string): void {
    this.cartItems = this.cartItems.filter((i) => i.id !== id);
  }

  getIcon(type: CartItem['type']): string {
    switch (type) {
      case 'appointment': return 'calendar_today';
      case 'refill': return 'medication';
      case 'lab': return 'science';
      case 'consultation': return 'stethoscope';
      default: return 'medical_services';
    }
  }

  getIconBg(type: CartItem['type']): string {
    switch (type) {
      case 'appointment': return 'bg-dark-green/10 text-dark-green';
      case 'refill': return 'bg-accent-green/10 text-accent-green';
      case 'lab': return 'bg-blue-500/10 text-blue-600';
      case 'consultation': return 'bg-ent-primary/10 text-ent-primary';
      default: return 'bg-slate-100 text-slate-600';
    }
  }

  proceedToConfirm(): void {
    // Placeholder – wire to checkout/confirm flow later
  }
}
