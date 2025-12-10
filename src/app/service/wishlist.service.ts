import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishlist: number[] = [];
  private wishlistSubject = new BehaviorSubject<number[]>([]);

  wishlist$ = this.wishlistSubject.asObservable();

  add(pokeId: number) {
    if (!this.wishlist.includes(pokeId)) {
      this.wishlist.push(pokeId);
      this.wishlistSubject.next(this.wishlist);
    }
  }

  remove(pokeId: number) {
    this.wishlist = this.wishlist.filter(id => id !== pokeId);
    this.wishlistSubject.next(this.wishlist);
  }

  exists(pokeId: number): boolean {
    return this.wishlist.includes(pokeId);
  }
}
