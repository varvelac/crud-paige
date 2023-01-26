import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from '../models/product';
import { DataService } from 'src/app/product-flow/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

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
    this.dataSource.filterPredicate = this.filterPredicate;
    //currently using this service to hold the changes of the user when a live service isn't available.
    this.revertState();
    this.getDataFromApi();
    this.applyFilter();
  }

  revertState() {
    this.products = this._dataService.getProducts() //because I don't have a real service, I'm going to data from the service if it exists, otherwise I will get it from the json file.
    this.selectedOption = this._dataService.getProductListState();
  }

  getDataFromApi(){
    if(this.products?.length === 0) {
      this._dataService.getData(this.config['serviceURL']).subscribe((res) => {
        this.products = res;
        this._dataService.setProducts(res);
        this.dataPreparation();
      });
    }
  }

  dataPreparation() {
    this.dataSource = new MatTableDataSource<Product>(this.products);
    this.dataSource.paginator = this.paginator;
  }

  deleteProduct(_sku: string) {
   this.products = this._dataService.deleteProduct(_sku);
   this._dataService.setProducts(this.products);
   this.applyFilter();
  }

  editProduct(_product: Product): void {
    if (this.config.preferDialog) {
      this.openModal(_product);
    } else {
      //even without a modal, I still want the user to not lose there place in their work.  So I'm going to save the filter state in the service.
      this._dataService.setProductListState(this.selectedOption);
      //we are able to navigate from our logic and even pass data to the next component. There are a lot of ways to navigate and pass data.  This is one of them.
      this._router.navigate(['/product-detail/', _product.sku], {
        state: _product,
      });
    }
  }

  openModal(_product: Product) {
    const dialogRef = this._dialog.open(ProductDetailsComponent, {data: _product,});
    //This would instatiate a dialog/modal with the product details component and pass the product as data.  I'm soft disabling this through a config setting.
    dialogRef.afterClosed().subscribe((_result) => {
      console.log(_result);
      if (_result) {
        const index = this.products.findIndex((product) => {return product.sku === _result.sku});
        this.products[index] = _result;
        this.applyFilter(); // this approach keeps the user from having to re-select the filter option or hunt down the edit they just made.
      }
    });
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
