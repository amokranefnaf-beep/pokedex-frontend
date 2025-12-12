import {User} from './user.model';
import {Pokemon} from './pokemon.model';

/**
 * Représente un échange entre utilisateurs
 */
export interface Trade {
  id: number;
  fromUser: User;
  toUser: User;
  offeredPokemons: Pokemon[];
  requestedPokemons: Pokemon[];
  status: TradeStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Statut d'un échange
 */
export enum TradeStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

/**
 * Requête de création d'échange
 */
export interface TradeRequest {
  toUserId: number;
  offeredPokemonIds: number[];
  requestedPokemonIds: number[];
}
