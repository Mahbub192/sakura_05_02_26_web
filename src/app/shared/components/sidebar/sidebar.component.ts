import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() menuItems: MenuItem[] = [];
  @Input() isCollapsed = false;
  @Input() isOpen = false; // For mobile toggle
  @Output() closeSidebar = new EventEmitter<void>();

  constructor(private router: Router) { }

  ngOnInit(): void { }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  onCloseSidebar(): void {
    this.closeSidebar.emit();
  }
}


