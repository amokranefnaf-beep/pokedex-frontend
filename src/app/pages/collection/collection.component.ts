import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { CardComponent } from '../../component/card/card.component';

import { CardService } from '../../service/card-service';

// @ts-ignore
import { Card, PageResponse } from '../../models';


@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
})
export class CollectionComponent implements OnInit {
  cards: Card[] = [];
  loading = true;
  error: string | null = null;

  currentPage = 0;
  totalPages = 0;
  totalElements = 0;

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.loadCards();
  }

  // le reste inchangé
  loadCards(): void {

  }
}
