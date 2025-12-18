import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollectionService } from '../../core/guards/services/collection.service';
import { PokemonService } from '../../core/guards/services/pokemon.service';
import { Pokemon, PokemonType, Rarity } from '../../shared/models/pokemon.model';
import { CollectionFilters } from '../../shared/models/collection.model';

/**
 * Composant d'affichage de la collection utilisateur
 * Utilise les directives Angular 20 (@if, @for, @defer)
 */
@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css'
})
class CollectionComponent implements OnInit {
  private collectionService = inject(CollectionService);
  private pokemonService = inject(PokemonService);

  // Signals pour l'état du composant
  pokemons = signal<Pokemon[]>([]);
  filteredPokemons = computed(() => this.applyFilters());
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Filtres
  selectedType = signal<PokemonType | null>(null);
  selectedRarity = signal<Rarity | null>(null);
  favoriteOnly = signal<boolean>(false);
  searchTerm = signal<string>('');

  // Pagination
  currentPage = signal<number>(1);
  pageSize = signal<number>(20);
  totalPages = computed(() =>
    Math.ceil(this.filteredPokemons().length / this.pageSize())
  );
  paginatedPokemons = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredPokemons().slice(start, end);
  });

  // Énumérations pour le template
  readonly PokemonType = PokemonType;
  readonly Rarity = Rarity;

  ngOnInit(): void {
    this.loadCollection();
  }

  /**
   * Charge la collection de l'utilisateur
   */
  loadCollection(): void {
    this.loading.set(true);
    this.error.set(null);

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    this.collectionService.getUserCollection().subscribe({
      error: (err: any) => {
        console.error();
        this.error.set('Impossible de charger la collection. Veuillez réessayer.');
        this.loading.set(false);
      },
      next: (collection: { pokemons: any[]; }) => {
        // @ts-ignore
        this.pokemons.set(collection.pokemons.map(cp => cp.pokemon));
        this.loading.set(false);
      }
    });
  }

  /**
   * Applique les filtres sur les Pokémon
   */
  private applyFilters(): Pokemon[] {
    let filtered = this.pokemons();

    // Filtre par type
    if (this.selectedType()) {
      filtered = filtered.filter(p => p.types.includes(this.selectedType()!));
    }

    // Filtre par rareté
    if (this.selectedRarity()) {
      filtered = filtered.filter(p => p.rarity === this.selectedRarity());
    }

    // Filtre favoris uniquement
    if (this.favoriteOnly()) {
      filtered = filtered.filter(p => p.isFavorite);
    }

    // Filtre par recherche
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.frenchName?.toLowerCase().includes(search) ||
        p.id.toString().includes(search)
      );
    }

    return filtered;
  }

  /**
   * Change le filtre de type
   */
  filterByType(type: PokemonType | null): void {
    this.selectedType.set(type);
    this.currentPage.set(1);
  }

  /**
   * Change le filtre de rareté
   */
  filterByRarity(rarity: Rarity | null): void {
    this.selectedRarity.set(rarity);
    this.currentPage.set(1);
  }

  /**
   * Toggle le filtre favoris
   */
  toggleFavoriteFilter(): void {
    this.favoriteOnly.update(value => !value);
    this.currentPage.set(1);
  }

  /**
   * Met à jour le terme de recherche
   */
  updateSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  /**
   * Change de page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Toggle favori d'un Pokémon
   */
  toggleFavorite(pokemon: Pokemon): void {
    // @ts-ignore
    this.collectionService.toggleFavorite(pokemon.id).subscribe({
      next: () => {
        // Mettre à jour localement
        this.pokemons.update(pokemons =>
          pokemons.map(p =>
            p.id === pokemon.id
              ? { ...p, isFavorite: !p.isFavorite }
              : p
          )
        );
      },
      error: (err: any) => console.error()
    });
  }

  /**
   * Supprime un Pokémon de la collection
   */
  removePokemon(pokemon: Pokemon): void {
    if (confirm(`Voulez-vous vraiment retirer ${pokemon.frenchName || pokemon.name} de votre collection ?`)) {
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      // @ts-ignore
      this.collectionService.removePokemon(pokemon.id).subscribe({
        'next': () => {
          this.pokemons.update(pokemons =>
            pokemons.filter(p => p.id !== pokemon.id)
          );
        },
        error() {
        }
      });
    }
  }

  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    this.selectedType.set(null);
    this.selectedRarity.set(null);
    this.favoriteOnly.set(false);
    this.searchTerm.set('');
    this.currentPage.set(1);
  }

  protected readonly event = event;
}

export default CollectionComponent
