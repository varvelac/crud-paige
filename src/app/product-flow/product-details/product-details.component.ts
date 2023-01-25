import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { DataService } from 'src/app/app.data-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_ERROR } from '@angular/material/form-field';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent {
  productForm: FormGroup;
  controls: { key: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private _dataService: DataService,
    private _route: ActivatedRoute,
    private _router: Router,
    public dialogRef: MatDialogRef<ProductDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productForm = this.fb.group({});
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    //I'm trying to keep this generic.  I would only need to add a validation object to the config object in the route.
    const group: any = {};
    for (const key in this.data) {
      group[key] = ['', Validators.required];
      if (key === 'type') {
        group[key] = ['', [Validators.required, Validators.maxLength(56)]];
      }
      if (key === 'price') {
        group[key] = ['', [Validators.required, Validators.min(1)]];
      }
      this.controls.push({ key: key });
    }
    this.productForm = this.fb.group(group);

    Object.keys(this.data).forEach((key) => { //
      this.productForm.get(key)?.setValue(this.data[key]);
    });
  }

  saveProduct() {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      //I would add a live service call here to update the product here and on 200, I'd close the dialog or handle the error.
      this.dialogRef.close(product);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
