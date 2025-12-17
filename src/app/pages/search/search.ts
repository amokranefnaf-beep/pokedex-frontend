import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';  // Pour ngModel

// @ts-ignore
import { CardService } from '../../services/card.service';

import { PokemonApi, Card } from '../../models';



@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchQuery = '';
  loading = false;
  error = '';
  successMessage = '';
  foundPokemon: PokemonApi | null = null;
  adding = false;

  constructor(private cardService: CardService) {}

  // le reste de ton code ne change PAS
}
