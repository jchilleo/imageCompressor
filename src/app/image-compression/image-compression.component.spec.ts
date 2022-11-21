import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCompressionComponent } from './image-compression.component';

describe('ImageCompressionComponent', () => {
  let component: ImageCompressionComponent;
  let fixture: ComponentFixture<ImageCompressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageCompressionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageCompressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
