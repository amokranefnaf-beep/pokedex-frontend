import { Component, Input, Output, EventEmitter } from '@angular/core';

import {CommonModule, NgOptimizedImage} from '@angular/common';

// @ts-ignore
import { Card } from '../../models';



@Component({

  selector: 'app-card',

  standalone: true,

  imports: [CommonModule, NgOptimizedImage],

  templateUrl: './card.component.html',

  styleUrl: './card.component.css'

})

export class CardComponent {

  // Input: données reçues du parent

  @Input() card!: Card;



  // Outputs: événements envoyés au parent

  @Output() favoriteToggle = new EventEmitter<number>();

  @Output() cardDelete = new EventEmitter<number>();



  // Méthode pour obtenir la classe CSS du type

  getTypeClass(type: string): string {

    return `type-${type.toLowerCase()}`;

  }



  // Méthode pour obtenir la classe CSS de la rareté
  protected isInWishlist: string | undefined;

  getRarityClass(): string {

    // @ts-ignore
    return `rarity-${this.card.rarity.toLowerCase()}`;

  }



  onFavoriteClick(): void {

    this.favoriteToggle.emit(this.card.id);

  }



  onDeleteClick(): void {

    this.cardDelete.emit(this.card.id);


  }

  protected toggleWishlist() {

  }
}
