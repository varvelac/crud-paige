import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './models/product';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  data: Product[] = [];
  products: Product[] = [];
  selectedFilter: string = 'all';
  constructor(private http: HttpClient) { }

  getData(url:string): Observable<any> { return this.http.get(url) }
  
  updateProducts(_data: Product) {
    if (_data) {
      const index = this.products.findIndex((_product) => _product.sku === _data.sku);
      if (index > -1) this.products[index] = _data;
    }
  }

  setProducts(_data: Product[]) { this.products = _data; }

  getProducts():Product[] { return this.products;}

  setProductListState(_data: string) { this.selectedFilter = _data; }

  getProductListState():string { return this.selectedFilter;}
  
  deleteProduct(_sku: string){ return this.products.filter((product) => product.sku !== _sku);}

}
