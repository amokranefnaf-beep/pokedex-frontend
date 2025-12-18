import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CollectionComponent } from './collection.component';
import { CollectionService } from '../../core/guards/services/collection.service';
import { of, throwError } from 'rxjs';

// @ts-ignore
describe('CollectionComponent', () => {
  let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;
  // @ts-ignore
  let collectionService: jasmine.SpyObj<CollectionService>;

  // @ts-ignore
  beforeEach(async () => {
    // @ts-ignore
    const collectionServiceSpy = jasmine.createSpyObj('CollectionService', ['getUserCollection']);

    await TestBed.configureTestingModule({
      imports: [CollectionComponent, HttpClientTestingModule],
      providers: [
        { provide: CollectionService, useValue: collectionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionComponent);
    component = fixture.componentInstance;
    // @ts-ignore
    collectionService = TestBed.inject(CollectionService) as jasmine.SpyObj<CollectionService>;
  });

  function it(expectation: string, assertion: () => void) {

  }

  it('should create', () => {
    // @ts-ignore
    expect(component).toBeTruthy();
  });

  it('should load collection on init', () => {
    const mockCollection = {
      id: 1,
      userId: 1,
      pokemons: [],
      totalCount: 0,
      favoriteCount: 0,
      typeDistribution: {}
    };

    collectionService.getUserCollection.and.returnValue(of(mockCollection));

    component.ngOnInit();

    // @ts-ignore
    expect(collectionService.getUserCollection).toHaveBeenCalled();
    // @ts-ignore
    expect(component.loading()).toBeFalse();
  });

  it('should handle error when loading collection', () => {
    collectionService.getUserCollection.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    component.ngOnInit();

    // @ts-ignore
    expect(component.error()).toBeTruthy();
    // @ts-ignore
    expect(component.loading()).toBeFalse();
  });

  it('should filter pokemons by type', () => {
    // Setup
    component.pokemons.set([
      { id: 1, types: ['fire'], name: 'Charizard' } as any,
      { id: 2, types: ['water'], name: 'Blastoise' } as any
    ]);

    // Action
    component.filterByType('fire' as any);

    // Assertion
    // @ts-ignore
    expect(component.selectedType()).toBe('fire');
    // @ts-ignore
    expect(component.filteredPokemons().length).toBe(1);
    // @ts-ignore
    expect(component.filteredPokemons()[0].name).toBe('Charizard');
  });
});

function expect(length: any) {
    throw new Error("Function not implemented.");
}
