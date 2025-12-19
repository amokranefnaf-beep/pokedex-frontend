import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Card } from '../../../shared/models/cards.models';



interface TypeCount {

  type: string;

  count: number;

}



@Component({

  selector: 'app-stats-panel',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './stats-panel.component.html',

  styleUrl: './stats-panel.component.css'

})

export class StatsPanelComponent implements OnChanges {

  @Input() cards: Card[] = [];



  // Statistiques calculées

  totalCards: number = 0;

  totalFavorites: number = 0;

  avgHp: number = 0;

  avgAttack: number = 0;

  strongestPokemon: Card | null = null;

  typeDistribution: TypeCount[] = [];



  // Recalculer quand les cartes changent

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['cards']) {

      this.calculateStats();

    }

  }



  calculateStats(): void {

    if (this.cards.length === 0) return;



    this.totalCards = this.cards.length;

    this.totalFavorites = this.cards.filter(c => c.isFavorite).length;



    // Moyennes

    // @ts-ignore
    const totalHp = this.cards.reduce((sum, c) => sum + c.hp, 0);

    const totalAtk = this.cards.reduce((sum, c) => sum + c.attack, 0);

    // @ts-ignore
    this.avgHp = Math.round(totalHp / this.cards.length);

    this.avgAttack = Math.round(totalAtk / this.cards.length);



    // Pokémon le plus fort (total stats)

    this.strongestPokemon = this.cards.reduce((max, card) => {

      const cardTotal = card.hp + card.attack + card.defense + card.speed;

      const maxTotal = max.hp + max.attack + max.defense + max.speed;

      return cardTotal > maxTotal ? card : max;

    });



    // Distribution par type

    const typeCounts: { [key: string]: number } = {};

    this.cards.forEach(card => {

      card.types.forEach(type => {

        typeCounts[type] = (typeCounts[type] || 0) + 1;

      });

    });



    this.typeDistribution = Object.entries(typeCounts)

      .map(([type, count]) => ({ type, count }))

      .sort((a, b) => b.count - a.count)

      .slice(0, 5); // Top 5 types

  }

}
