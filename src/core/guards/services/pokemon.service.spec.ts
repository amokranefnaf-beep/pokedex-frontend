import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// @ts-ignore
import { PokemonService } from './pokemon.service';
// @ts-ignore
import { Pokemon, PokemonType } from '../../shared/models/pokemon.model';

// @ts-ignore
describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  // @ts-ignore
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService]
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // @ts-ignore
  it('should be created', () => {
    // @ts-ignore
    expect(service).toBeTruthy();
  });

  // @ts-ignore
  // @ts-ignore
  it('should fetch pokemons', (done) => {
    const mockPokemons: Pokemon[] = [
      {
        id: 25,
        name: 'pikachu',
        frenchName: 'Pikachu',
        types: [PokemonType.ELECTRIC],
        sprite: 'url',
        officialArtwork: 'url',
        stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
        generation: 1,
        rarity: 'legendary'
      }
    ];

    // @ts-ignore
    service.getPokemons().subscribe(pokemons => {
      // @ts-ignore
      expect(pokemons).toEqual(mockPokemons);
      // @ts-ignore
      expect(service.pokemons()).toEqual(mockPokemons);
      // @ts-ignore
      expect(service.loading()).toBeFalse();
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/pokemons');
    // @ts-ignore
    expect(req.request.method).toBe('GET');
    req.flush(mockPokemons);
  });

  // @ts-ignore
  it('should handle error', (done) => {
    service.getPokemons().subscribe({
      error: () => {
        // @ts-ignore
        expect(service.error()).toBe('Erreur lors du chargement des Pokémon');
        // @ts-ignore
        expect(service.loading()).toBeFalse();
        done();
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/pokemons');
    req.error();
  });
});

function afterEach(arg0: () => void) {
    throw new Error("Function not implemented.");
}
