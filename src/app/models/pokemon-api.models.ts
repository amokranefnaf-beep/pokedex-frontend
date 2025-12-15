// @ts-ignore
/**

 * Pokémon venant directement de PokéAPI (avant ajout à la collection)

 */

export interface PokemonApi {
  attack: number;

  defense: number;

  generation: number;

  hp: number;

  id: number;

  imageUrl: string;

  name: string;

  pokeApiId:any;

  speed: number;

  types: string[];

}
