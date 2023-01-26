import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductListComponent } from './product-list.component';
import { Product } from '../../models/product';
import { DataService } from 'src/app/product-flow/product.service';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModule } from '../product.module';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import {RouterTestingModule} from '@angular/router/testing';


describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let dataService: DataService;
  let route: ActivatedRoute;
  let router: Router;
  let products: Product[];


  const dataServiceMock = {
    getData: () => of([]),
    setProductListState: jasmine.createSpy(),
    getProducts: jasmine.createSpy()
};


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        ProductModule,
        MatSelectModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [ProductListComponent],
      providers: [
        DataService,
        { 
          provide: DataService, 
          useValue: {getProductListState : () => {}, getProducts: () => {}, getData: () => {}, setProductListState : () => {}, deleteProduct : () => {},
          setProducts : () => {},
          },
        },
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
    router = TestBed.get(Router);
    fixture.detectChanges();
  });


    it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call data service to get products', () => {
    spyOn(dataService, 'getProducts').and.callThrough();
    component.ngOnInit();
    expect(dataService.getProducts).toHaveBeenCalled();
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
    component.products = [new Product(1, 'sku1', 'name1', 'type1', 'description1', 'color1', 50)];
    component.selectedOption = 'blue';
    component.config.preferDialog = false;
    spyOn(router, 'navigate');
    component.editProduct(component.products[0]);
    dataService.setProductListState('blue');
    expect(router.navigate).toHaveBeenCalledWith(['/product-detail/', component.products[0].sku], {
      state: component.products[0],
    });
});

it('should delete a product when deleteProduct is called', () => {
  component.products = [ 
  new Product(1, 'sku1', 'name1', 'type1', 'description1', 'color1', 50),
  new Product(2, 'sku2', 'name2', 'type2', 'description2', 'color2', 50)];
  spyOn(dataService, 'deleteProduct').and.callThrough();
  component.deleteProduct('sku1');
  expect(dataService.deleteProduct).toHaveBeenCalledWith('sku1');
});
});
