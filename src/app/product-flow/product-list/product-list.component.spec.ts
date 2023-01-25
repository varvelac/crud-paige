import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductListComponent } from './product-list.component';
import { Product } from '../../models/product';
import { DataService } from 'src/app/app.data-service.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProductModule } from '../product.module';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductDetailsComponent } from '../product-details/product-details.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let dataService: DataService;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        ProductModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
      declarations: [ProductListComponent],
      providers: [
        { provide: DataService, useValue: { getData: () => of([]) } },
        //This was a pain to figure out.  I had to mock the ActivatedRoute and provide the data I needed.
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                displayedColumns: ['name', 'color', 'type', 'price', 'actions'],
                serviceURL: '../assets/crud-product.json',
                actions: {
                  delete: true,
                  edit: true,
                },
                filterOptions: {
                  options: [
                    'all',
                    'blue',
                    'white',
                    'black',
                    'brown',
                    'green',
                    'red',
                    'yellow',
                  ],
                  seleced: 'all',
                  title: 'Color',
                },
              },
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    dataService = TestBed.get(DataService);
    route = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call data service to get products', () => {
    spyOn(dataService, 'getData').and.callThrough();
    component.ngOnInit();
    expect(dataService.getData).toHaveBeenCalled();
  });

  it('should set filter options and display columns from route data', () => {
    component.ngOnInit();
    //since we are going data driven, we need to make sure the data gets set correctly
    expect(component.filterOptions).toEqual([
      'all',
      'blue',
      'white',
      'black',
      'brown',
      'green',
      'red',
      'yellow',
    ]);
    expect(component.displayedColumns).toEqual([
      'name',
      'color',
      'type',
      'price',
      'actions',
    ]);
    expect(component.config['serviceURL']).toEqual('../assets/crud-product.json');
  });

  it('should create a dialog when editProduct is called', () => {
    component.products = [
      new Product(1, 'sku1', 'name1', 'type1', 'description1', 'color1', 50),
    ];
    spyOn(component._dialog, 'open').and.callThrough();
    component.editProduct(component.products[0]);
    expect(component._dialog.open).toHaveBeenCalled();
    expect(component._dialog.open).toHaveBeenCalledWith(ProductDetailsComponent, {data:component.products[0]}); //specifically asking it to open the product details component with the data of the product we passed in.
  });

  it('should delete a product when deleteProduct is called', () => {
    component.products = [
      new Product(1, 'sku1', 'name1', 'type1', 'description1', 'color1', 50),
      new Product(2, 'sku2', 'name2', 'type2', 'description2', 'color2', 50),
    ];
    component.deleteProduct('sku1');
    console.log(component.products);
    expect(component.products.length).toEqual(1);
    expect(component.products[0].sku).toEqual('sku2'); //This is just showing that the pevious product was deleted.
  });
});
