import {Pokemon, PokemonType, Rarity} from './pokemon.model';

/**
 * Représente la collection d'un utilisateur
 */
export interface Collection {
  id: number;
  userId: number;
  pokemons: CollectionPokemon[];
  totalCount: number;
  favoriteCount: number;
  typeDistribution: TypeDistribution;
}

/**
 * Pokémon dans une collection avec métadonnées
 */
export interface CollectionPokemon {
  pokemon: Pokemon;
  acquiredAt: Date;
  isFavorite: boolean;
  quantity: number;
}

/**
 * Répartition par type
 */
export interface TypeDistribution {
  [key: string]: number;
}

/**
 * Filtres pour la collection
 */
export interface CollectionFilters {
  type?: PokemonType;
  rarity?: Rarity;
  generation?: number;
  favoriteOnly?: boolean;
  searchTerm?: string;
}

/**
 * Options de pagination
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
  total: number;
}
