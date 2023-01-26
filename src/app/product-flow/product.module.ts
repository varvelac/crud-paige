import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import {MatButtonModule} from '@angular/material/button';
import { AppRoutingModule } from '../app.routing.module';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
@NgModule({
  imports: [
    MatTableModule,
    MatButtonModule,
    AppRoutingModule,
    MatPaginatorModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,

  ],
  declarations: [ProductListComponent, ProductDetailsComponent],
  exports:[ProductListComponent, ProductDetailsComponent]
})
export class ProductModule { }
