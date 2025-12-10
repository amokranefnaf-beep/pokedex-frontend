/**

 * Pokémon venant directement de PokéAPI (avant ajout à la collection)

 */

export interface PokemonApi {

  id: number;

  name: string;

  imageUrl: string;

  types: string[];

  generation: number;

  hp: number;

  attack: number;

  defense: number;

  speed: number;

}
