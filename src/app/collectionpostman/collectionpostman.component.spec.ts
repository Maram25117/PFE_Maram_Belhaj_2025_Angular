import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionpostmanComponent } from './collectionpostman.component';

describe('CollectionpostmanComponent', () => {
  let component: CollectionpostmanComponent;
  let fixture: ComponentFixture<CollectionpostmanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionpostmanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionpostmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
