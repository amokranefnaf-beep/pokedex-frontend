/**
 * Représente un utilisateur de l'application
 */
export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  badges: Badge[];
  stats: UserStats;
  createdAt: Date;
}

/**
 * Statistiques d'un utilisateur
 */
export interface UserStats {
  totalPokemons: number;
  totalTrades: number;
  successfulTrades: number;
  failedTrades: number;
  favoriteCount: number;
  wishlistCount: number;
  rank: number;
  completionPercentage: number;
}

/**
 * Badge obtenu par l'utilisateur
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}
