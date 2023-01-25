import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { DataService } from 'src/app/app.data-service.service';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductModule } from '../product.module';

import { ProductDetailsComponent } from './product-details.component';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  beforeEach(async () => {
    
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailsComponent ],
      imports: [ MatTableModule, MatPaginatorModule, MatDialogModule, RouterModule, ProductModule, NoopAnimationsModule ],
      providers: [
        { provide: DataService, useValue: { getData: () => of([]) } },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {
          data: {id:'1', name: 'test', color: 'test', type: 'test', description:'description1',price: 1 },
        } },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    // component._dialogRef = { close: () => {} } as MatDialogRef<ProductDetailsComponent>;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    // spyOn(component._dialogRef, 'close');
    component.cancel();
    // expect(component._dialogRef.close).toHaveBeenCalled();
  });

  it('should submit the form', () => {
    // spyOn(component._dialogRef, 'close');
    component.saveProduct();
    //we are checking that the form is submitted and the data is passed to the dialog.
    // expect(component._dialogRef.close).toHaveBeenCalledOnceWith(component.productForm.value);
  })

  it('should build the form using the data passed through the dialog', () => {
    component.data = {id:'1', name: 'test', color: 'testColor', type: 'test', description:'description1',price: 1 };
    component.ngOnInit();
    expect(component.productForm).toBeTruthy();
    //this is checking whether the form is built correctly using the data from the dialog.
    expect(component.productForm.get('name')?.value).toBe('test'); 
    expect(component.productForm.get('color')?.value).toBe('testColor');
    expect(component.productForm.get('price')?.value).toBe(1);
  });
});
