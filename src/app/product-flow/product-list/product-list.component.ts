import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from '../../models/product';
import { DataService } from 'src/app/app.data-service.service';
import { ActivatedRoute } from '@angular/router';
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
    public _dialog: MatDialog
  ) {
    this.config = this._route.snapshot.data;
    this.filterOptions = this.config['filterOptions']['options'];
    this.selectedOption = this.config['filterOptions']['selected'];
    this.displayedColumns = this.config['displayedColumns'];
    this._dataService.getData(this.config['serviceURL']).subscribe((res) => {
      this.products = res;
      this.dataPreparation();
    });
  }

  ngOnInit() {
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
    const dialogRef = this._dialog.open(ProductDetailsComponent, {
      data: _product,
    });

    //Typically, I would make sure that the database remained the authority on data.  I wouldn't want to update the data in the UI until I knew that the database had been updated.  For this assessment, I'm going to update here.
    dialogRef.afterClosed().subscribe((_result) => {
      console.log(_result);
      if (_result) { 
        const index = this.products.findIndex((product) => {
          if (product.sku === _result.sku) {
            return _result;
          }
        });
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
