/**
 * Représente une carte Pokémon
 * Correspond au CardResponse du backend
 */
export interface Card {
  id: number;
  pokeApiId: number;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  generation: number;
  imageUrl: string;
  types: string[];
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY';
  isFavorite: boolean;
  addedAt: string;
}

export default Card;
