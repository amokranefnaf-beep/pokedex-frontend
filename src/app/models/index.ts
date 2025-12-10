// Exporte tous les modèles depuis un seul fichier

// @ts-ignore
export * from './card.model';

// @ts-ignore
export * from './pokemon-api.model';

export * from './page.model';

export class Card {
  [x: string]: any;
  id!: number;
}

export class PokemonApi {
}
