import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from '../../models/product';
import { DataService } from 'src/app/app.data-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  filterOptions: string[] = [];
  selectedOption: string = '';

  dataSource = new MatTableDataSource<Product>(this.products);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = [];

  config: any;

  constructor(
    public _dataService: DataService,
    public _route: ActivatedRoute,
    public _dialog: MatDialog,
    public _router: Router
  ) {
    this.config = this._route.snapshot.data;
    this.filterOptions = this.config['filterOptions']['options'];
    this.selectedOption = this.config['filterOptions']['selected'];
    this.displayedColumns = this.config['displayedColumns'];
  }

  ngOnInit() {
    this._dataService.getData(this.config['serviceURL']).subscribe((res) => {
      this.products = res;
      //this is one of the many ways to pass data from different components. 
      const product = this._dataService.getProduct();
      if (product) {
        const index = this.products.findIndex(
          (_product) => _product.sku === product.sku
        );
        if (index > -1) {
          this.products[index] = product;
        }
      }
      this.dataPreparation();
    });
    this.dataSource.filterPredicate = this.filterPredicate;

  }

  dataPreparation() {
    this.dataSource = new MatTableDataSource<Product>(this.products);
    this.dataSource.paginator = this.paginator;
  }

  deleteProduct(_sku: string) {
    this.products = this.products.filter((product) => product.sku !== _sku);
    this.applyFilter();
  }

  editProduct(_product: Product): void {
    if (this.config.preferDialog) {
      const dialogRef = this._dialog.open(ProductDetailsComponent, {
        data: _product,
      });
      //This would instatiate a dialog/modal with the product details component and pass the product as data.  I'm soft disabling this through a config setting. more might need to be done to have both options work.
      dialogRef.afterClosed().subscribe((_result) => {
        console.log(_result);
        if (_result) {
          const index = this.products.findIndex((product) => {
            if (product.sku === _result.sku) {
              return _result;
            }
          });
          this.products[index] = _result;
          // this approach keeps the user from having to re-select the filter option or hunt down the edit they just made.
          this.applyFilter(); 
        }
      });
    } else {
      //we are able to navigate from our logic and even pass data to the next component. There are a lot of ways to navigate and pass data.  This is one of them.
      this._router.navigate(['/product-detail/', _product.sku], {
        state: _product,
      });
    }
  }

  applyFilter() {
    this.dataPreparation();
    this.selectedOption === 'all'
      ? this.dataPreparation()
      : (this.dataSource.filter = this.selectedOption);
  }

  filterPredicate = (_data: Product, _filter: string) => {
    if (_filter === 'all') return true;
    return _data.color === _filter;
  };
}
