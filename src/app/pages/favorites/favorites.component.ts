import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import { CardService } from '../../../services/card.service';

import { CardComponent } from '../../components/card/card.component';

import { Card } from '../../models';



@Component({

  selector: 'app-favorites',

  standalone: true,

  imports: [CommonModule, RouterLink, CardComponent],

  templateUrl: './favorites.component.html',

  styleUrl: './favorites.component.css'

})

export class FavoritesComponent implements OnInit {

  favorites: Card[] = [];

  loading: boolean = true;

  error: string = '';



  constructor(private cardService: CardService) {}



  ngOnInit(): void {

    this.loadFavorites();

  }



  loadFavorites(): void {

    this.loading = true;

    this.cardService.getFavorites().subscribe({

      error: (err: any) => {

        this.error = 'Erreur lors du chargement des favoris';

        this.loading = false;

      },

      next: (cards: Card[]) => {

        this.favorites = cards;

        this.loading = false;

      }

    });

  }



  onFavoriteToggle(cardId: number): void {

    this.cardService.toggleFavorite(cardId).subscribe({

      next: () => {

        // Retirer de la liste des favoris

        this.favorites = this.favorites.filter(c => c.id !== cardId);

      }

    });

  }



  onCardDelete(cardId: number): void {

    if (confirm('Supprimer ce Pokémon de ta collection ?')) {

      this.cardService.deleteCard(cardId).subscribe({

        next: () => {

          this.favorites = this.favorites.filter(c => c.id !== cardId);

        }

      });

    }

  }

}
