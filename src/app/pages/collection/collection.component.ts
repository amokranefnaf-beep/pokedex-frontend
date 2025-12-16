import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { CardService } from '../../service/card-service';

import { CardComponent } from '../../component/card/card.component';

import { FilterBarComponent, FilterOptions } from '../../components/filter-bar/filter-bar';

import { Card } from '../../models';

import { StatsPanelComponent } from '../../components/stats-panel/stats-panel';

@Component({

  selector: 'app-collection',

  standalone: true,

  imports: [CommonModule, CardComponent, FilterBarComponent],

  templateUrl: './collection.component.html',

  styleUrl: './collection.component.css'

})
export class CollectionComponent implements OnInit {

  // Toutes les cartes (non filtrées)

  allCards: Card[] = [];

  // Cartes filtrées à afficher

  filteredCards: Card[] = [];



  loading: boolean = true;

  error: string = '';



  // Filtres actuels

  currentFilters: FilterOptions = {

    searchTerm: '',

    selectedType: '',

    sortBy: 'pokeApiId',

    sortOrder: 'asc'

  };

  private cardService = inject(CardService);

  ngOnInit(): void {

    this.loadCards();

  }



  loadCards(): void {

    this.loading = true;

    // Charger TOUTES les cartes (pas de pagination ici)

    this.cardService.getAllCards().subscribe({

      next: (cards: Card[]) => {

        this.allCards = cards;

        this.applyFilters();

        this.loading = false;

      },

      error: () => {

        this.error = 'Erreur lors du chargement';

        this.loading = false;

      }

    });

  }

  // Appelé quand les filtres changent

  onFiltersChange(filters: FilterOptions): void {

    this.currentFilters = filters;

    this.applyFilters();

  }



  // Appliquer les filtres et le tri

  applyFilters(): void {

    let result = [...this.allCards];



    // Filtre par recherche

    if (this.currentFilters.searchTerm) {

      const term = this.currentFilters.searchTerm.toLowerCase();

      result = result.filter(card =>

        card.name.toLowerCase().includes(term)

      );

    }



    // Filtre par type

    if (this.currentFilters.selectedType) {

      const type = this.currentFilters.selectedType.toLowerCase();

      result = result.filter(card =>

        card.types.some(t => t.toLowerCase() === type)

      );

    }



    // Tri

    result.sort((a, b) => {

      let valueA: any = a[this.currentFilters.sortBy as keyof Card];

      let valueB: any = b[this.currentFilters.sortBy as keyof Card];



      // Tri alphabétique pour les strings

      if (typeof valueA === 'string') {

        valueA = valueA.toLowerCase();

        valueB = valueB.toLowerCase();

      }



      if (valueA < valueB) return this.currentFilters.sortOrder === 'asc' ? -1 : 1;

      if (valueA > valueB) return this.currentFilters.sortOrder === 'asc' ? 1 : -1;

      return 0;

    });



    this.filteredCards = result;

  }



  // Toggle favori

  onFavoriteToggle(cardId: number): void {

    this.cardService.toggleFavorite(cardId).subscribe({

      next: (updated: Card) => {

        // Mettre à jour dans allCards

        const index = this.allCards.findIndex(c => c.id === cardId);

        if (index !== -1) {

          this.allCards[index] = updated;

        }

        this.applyFilters();

      }

    });

  }



  // Supprimer carte

  onCardDelete(cardId: number): void {

    if (confirm('Supprimer ce Pokémon ?')) {

      this.cardService.deleteCard(cardId).subscribe({

        next: () => {

          this.allCards = this.allCards.filter(c => c.id !== cardId);

          this.applyFilters();

        }

      });

    }

  }

}
