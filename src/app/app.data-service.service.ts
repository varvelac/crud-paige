import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './models/product';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  data:any;
  constructor(private http: HttpClient) { }

  getData(url:string): Observable<any> {
    return this.http.get(url);
  }

  
  setProduct(data: any) {
    this.data = data;
  }

  getProduct() {
    return this.data;
  }
  //demonstrating passing data through a service between components

}
