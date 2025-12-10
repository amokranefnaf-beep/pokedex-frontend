/**

 * Représente une carte Pokémon

 * Correspond au CardResponse du backend

 */

interface Card {
  // @ts-ignore
  hp: string;

  // @ts-ignore
  name: string;
  // @ts-ignore
  imageUrl: any;

  addedAt: string;
  attack: number;

  defense: number;

  generation: number;

  // @ts-ignore
  hp: number;

  id: number;

  // @ts-ignore
  imageUrl: any;

  // @ts-ignore
  imageUrl: string;

  // @ts-ignore
  isFavorite: string;

  // @ts-ignore
  isFavorite: boolean;

  // @ts-ignore
  name: string;

  pokeApiId: number;

  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY';

  speed: number;

  types: string[];  // Date au format ISO



}

export default Card
