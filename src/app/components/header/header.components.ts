import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';

// @ts-ignore
import {CardService} from 'src/app/services/card.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  totalCards: number = 0;

  // ✔ injection correct du service Angular
  private readonly cardService: CardService;

  ngOnInit(): void {
    this.loadTotalCards();
  }

  loadTotalCards(): void {
    const {getCards} = this.cardService;
    getCards(0, 1).subscribe({
      next: (response: { totalElements: number }) => {
        this.totalCards = response.totalElements;
      }
    });
  }
}

export default HeaderComponent;
