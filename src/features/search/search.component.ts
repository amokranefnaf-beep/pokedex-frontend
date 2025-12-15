import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';  // Pour ngModel

import { CardService } from '../../services/card.service';

import { PokemonApi, Card } from '../../models';



@Component({

  selector: 'app-search',

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './search.component.html',

  styleUrl: './search.component.css'

})

export class SearchComponent {

  // Champ de recherche

  searchQuery: string = '';



  // États

  loading: boolean = false;

  error: string = '';

  successMessage: string = '';



  // Pokémon trouvé (aperçu)

  foundPokemon: PokemonApi | null = null;



  // État d'ajout

  adding: boolean = false;



  constructor(private cardService: CardService) {}



  // Rechercher un Pokémon

  search(): void {

    // Vérifier que le champ n'est pas vide

    if (!this.searchQuery.trim()) {

      this.error = 'Entre un nom ou un numéro de Pokémon';

      return;

    }



    // Reset des messages

    this.error = '';

    this.successMessage = '';

    this.foundPokemon = null;

    this.loading = true;



    // Déterminer si c'est un ID ou un nom

    const query = this.searchQuery.trim().toLowerCase();

    const isNumber = /^\d+$/.test(query);



    if (isNumber) {

      // Recherche par ID

      this.cardService.searchPokemonById(parseInt(query)).subscribe({

        next: (pokemon) => {

          this.foundPokemon = pokemon;

          this.loading = false;

        },

        error: (err) => {

          this.error = 'Pokémon non trouvé avec cet ID';

          this.loading = false;

        }

      });

    } else {

      // Recherche par nom

      this.cardService.searchPokemonByName(query).subscribe({

        next: (pokemon) => {

          this.foundPokemon = pokemon;

          this.loading = false;

        },

        error: (err) => {

          this.error = 'Pokémon non trouvé avec ce nom';

          this.loading = false;

        }

      });

    }

  }
  // Ajouter le Pokémon à la collection

  addToCollection(): void {

    if (!this.foundPokemon) return;



    this.adding = true;

    this.error = '';

    this.successMessage = '';



    this.cardService.addPokemonToCollection(this.foundPokemon.pokeApiId).subscribe({

      next: (card) => {

        this.successMessage = `${card.name} a été ajouté à ta collection ! 🎉`;

        this.adding = false;

        // Effacer l'aperçu après ajout

        this.foundPokemon = null;

        this.searchQuery = '';

      },

      error: (err) => {

        // Gérer le cas "déjà dans la collection"

        if (err.status === 409) {

          this.error = 'Ce Pokémon est déjà dans ta collection !';

        } else {

          this.error = 'Erreur lors de l\'ajout. Réessaie.';

        }

        this.adding = false;

      }

    });

  }



  // Gérer la touche Entrée

  onKeyPress(event: KeyboardEvent): void {

    if (event.key === 'Enter') {

      this.search();

    }

  }



  // Recherche aléatoire (bonus fun)

  searchRandom(): void {

    // Génère un ID entre 1 et 151 (1ère génération)

    const randomId = Math.floor(Math.random() * 151) + 1;

    this.searchQuery = randomId.toString();

    this.search();

  }

}

