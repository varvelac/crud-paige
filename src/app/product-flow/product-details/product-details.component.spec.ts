import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { DataService } from 'src/app/product-flow/product.service';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductModule } from '../product.module';
import { ProductDetailsComponent } from './product-details.component';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let router: Router;
  let dataService: DataService;
  beforeEach(async () => {
    
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailsComponent ],
      imports: [ MatTableModule, MatPaginatorModule, MatDialogModule, RouterModule, ProductModule, NoopAnimationsModule, ],
      providers: [ DataService,
        { provide: DataService, useValue: { updateProducts: () => of([]) } },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    router = TestBed.get(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should on calcel navigate to product list', () => {
    spyOn(router, 'navigate');
    component.cancel();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should submit the form', () => {
     spyOn(router, 'navigate');
    component.saveProduct();
    expect(router.navigate).toHaveBeenCalled();
  })

  it('should build the form using the data passed through the dialog', () => {
    component.data = {id:'1', name: 'test', color: 'testColor', type: 'test', description:'description1',price: 1 };
    component.ngOnInit();
    expect(component.productForm).toBeTruthy();
    expect(component.productForm.get('name')?.value).toBe('test'); 
    expect(component.productForm.get('color')?.value).toBe('testColor');
    expect(component.productForm.get('price')?.value).toBe(1);
  });
});
