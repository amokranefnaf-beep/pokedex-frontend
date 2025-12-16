import { Component, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';



// Interface pour les filtres

export interface FilterOptions {

  searchTerm: string;

  selectedType: string;

  sortBy: string;

  sortOrder: 'asc' | 'desc';

}



@Component({

  selector: 'app-filter-bar',

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './filter-bar.html',

  styleUrl: './filter-bar.css'

})

export class FilterBarComponent {

  // Événement envoyé au parent quand les filtres changent

  @Output() filtersChange = new EventEmitter<FilterOptions>();



  // Valeurs des filtres

  searchTerm: string = '';

  selectedType: string = '';

  sortBy: string = 'pokeApiId';

  sortOrder: 'asc' | 'desc' = 'asc';



  // Liste des types Pokémon

  pokemonTypes: string[] = [

    'normal', 'fire', 'water', 'electric', 'grass', 'ice',

    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',

    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'

  ];



  // Options de tri

  sortOptions = [

    { value: 'pokeApiId', label: '# Numéro' },

    { value: 'name', label: '🔤 Nom' },

    { value: 'hp', label: '❤️ HP' },

    { value: 'attack', label: '⚔️ Attaque' },

    { value: 'defense', label: '🛡️ Défense' },

    { value: 'speed', label: '💨 Vitesse' }

  ];



  // Émettre les changements

  onFilterChange(): void {

    this.filtersChange.emit({

      searchTerm: this.searchTerm,

      selectedType: this.selectedType,

      sortBy: this.sortBy,

      sortOrder: this.sortOrder

    });

  }



  // Inverser l'ordre de tri

  toggleSortOrder(): void {

    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

    this.onFilterChange();

  }



  // Réinitialiser les filtres

  resetFilters(): void {

    this.searchTerm = '';

    this.selectedType = '';

    this.sortBy = 'pokeApiId';

    this.sortOrder = 'asc';

    this.onFilterChange();

  }

}
