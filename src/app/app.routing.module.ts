import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-flow/product-list/product-list.component';
import { ProductDetailsComponent } from './product-flow/product-details/product-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'product-list', pathMatch: 'full' },
  { path: 'product-list', component: ProductListComponent, 
  //The idea is to be able to instantiate new crud tables by simply adding a small config object to the route. This is the config object for the product list. You could even set up a service to fetch this data.
  data: 
  { 
    displayedColumns: ['name', 'color', 'type', 'price', 'actions'], // full list ['id', 'sku', 'name', 'color', 'type', 'price', 'description', 'actions'],
    serviceURL: '../assets/crud-product.json', //can switch out for a real service. at first, I was gonna host it on jsonbin.io, but I think I'll just use a local file for this assessment
    actions:{
      delete: true,
      edit: true,
    },
    filterOptions: { // very possible to abstract this pattern further and pass an array of filter objects.
      options: ['all', 'blue', 'white', 'black', 'brown', 'green', 'red', 'yellow'],
      seleced: 'all',
      title: 'Color'
    },
    preferDialog:false
  } 
},
  { path: 'product-detail/:sku', component: ProductDetailsComponent, data:{ ignoreList : ['id', 'sku']}} //I would easily be able to route to this new page and pass the sku as a parameter, but I thought the user would not want to lose their place on the table, so I decided to use a dialog instead.
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
