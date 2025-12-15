import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { CardComponent } from '../../component/card/card.component';

import { CardService } from '../../service/card-service';

// @ts-ignore
import { Card, PageResponse } from '../../models';
// @ts-ignore
export let CollectionComponent = undefined;


@Component({

  selector: 'app-collection',

  standalone: true,

  imports: [CommonModule, CardComponent],

  templateUrl: './collection.component.html',

  styleUrl: './collection.component.css'

})
// @ts-ignore
class CollectionComponent implements OnInit {

  cards: Card[] = [];

  loading = true;

  error: string | null = null;



  // Pagination

  currentPage = 0;

  totalPages = 0;

  totalElements = 0;



  constructor(private cardService: CardService) { }



  ngOnInit(): void {

    this.loadCards();

  }



  loadCards(): void {

    this.loading = true;

    this.error = null;



    this.cardService.getCards(this.currentPage, 20).subscribe({

      next: (response: PageResponse<Card>) => {
        this.cards = response.content;

        this.totalPages = response.totalPages;

        this.totalElements = response.totalElements;

        this.loading = false;

      },

      error: (err: Error) => {

        this.error = 'Erreur lors du chargement des cartes';

        this.loading = false;

        console.error();

      }

    });

  }



  onFavoriteToggle(cardId: number): void {

    this.cardService.toggleFavorite(cardId).subscribe({

      next: (updatedCard: Card) => {

        // Met à jour la carte dans la liste

        const index = this.cards.findIndex(c => c.id === cardId);

        if (index !== -1) {

          this.cards[index] = updatedCard;

        }

      },

      error: (err: Error) => console.error()

    });

  }



  onCardDelete(cardId: number): void {

    if (confirm('Supprimer cette carte de la collection ?')) {

      this.cardService.deleteCard(cardId).subscribe({

        next: () => {

          this.cards = this.cards.filter(c => c.id !== cardId);

          this.totalElements--;

        },

        error: (err: Error) => console.error()

      });

    }

  }



  goToPage(page: number): void {

    this.currentPage = page;

    this.loadCards();

  }

}

export default CollectionComponent
