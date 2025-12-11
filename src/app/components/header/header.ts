import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.component.css',
})
export class Header {
  // TODO: Ajouter la gestion de l'active link basée sur le router
}
