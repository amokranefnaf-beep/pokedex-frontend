// @ts-ignore
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 }))
  ])
]);

export const slideUp = trigger('slideUp', [
  transition(':enter', [
    style({ transform: 'translateY(50px)', opacity: 0 }),
    animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ])
]);

export const staggerList = trigger('staggerList', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('50ms', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);
// @ts-ignore
@Component({
  selector: 'app-collection',
  animations: [fadeIn, slideUp, staggerList],
  template: `
    <div @staggerList>
      @for (pokemon of pokemons(); track pokemon.id) {
        <div class="pokemon-card" @slideUp>
          <!-- Contenu de la carte -->
        </div>
      }
    </div>
  `
})
export class CollectionComponent {}
