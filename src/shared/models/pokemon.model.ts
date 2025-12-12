/**
 * Représente un Pokémon avec toutes ses caractéristiques
 */
export interface Pokemon {
  id: number;
  name: string;
  frenchName?: string;
  types: PokemonType[];
  sprite: string;
  officialArtwork: string;
  stats: PokemonStats;
  generation: number;
  rarity: Rarity;
  isFavorite?: boolean;
  isOwned?: boolean;
}

/**
 * Types de Pokémon disponibles
 */
export enum PokemonType {
  FIRE = 'fire',
  WATER = 'water',
  GRASS = 'grass',
  ELECTRIC = 'electric',
  PSYCHIC = 'psychic',
  DRAGON = 'dragon',
  FAIRY = 'fairy',
  NORMAL = 'normal',
  FIGHTING = 'fighting',
  GHOST = 'ghost',
  ICE = 'ice',
  POISON = 'poison',
  GROUND = 'ground',
  FLYING = 'flying',
  BUG = 'bug',
  ROCK = 'rock',
  STEEL = 'steel',
  DARK = 'dark'
}

/**
 * Mapping des types vers leurs émojis
 */
export const TYPE_EMOJI: Record<PokemonType, string> = {
  [PokemonType.FIRE]: '🔥',
  [PokemonType.WATER]: '💧',
  [PokemonType.GRASS]: '🌿',
  [PokemonType.ELECTRIC]: '⚡',
  [PokemonType.PSYCHIC]: '🔮',
  [PokemonType.DRAGON]: '🐲',
  [PokemonType.FAIRY]: '🧚',
  [PokemonType.NORMAL]: '⚪',
  [PokemonType.FIGHTING]: '👊',
  [PokemonType.GHOST]: '👻',
  [PokemonType.ICE]: '❄️',
  [PokemonType.POISON]: '☠️',
  [PokemonType.GROUND]: '⛰️',
  [PokemonType.FLYING]: '🕊️',
  [PokemonType.BUG]: '🐛',
  [PokemonType.ROCK]: '🪨',
  [PokemonType.STEEL]: '⚙️',
  [PokemonType.DARK]: '🌙'
};

/**
 * Statistiques d'un Pokémon
 */
export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

/**
 * Niveaux de rareté
 */
export enum Rarity {
  COMMON = 'common',
  RARE = 'rare',
  LEGENDARY = 'legendary'
}

/**
 * Informations sur l'évolution
 */
export interface Evolution {
  from: Pokemon | null;
  current: Pokemon;
  to: Pokemon | null;
}
