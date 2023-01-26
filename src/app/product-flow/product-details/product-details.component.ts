import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/product-flow/product.service';
import { CustomValidators } from 'src/app/validators/customValidators';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent {
  productForm: FormGroup;
  controls: { key: string }[] = [];
  disabledFields: string[] = [];
  data:any;
  constructor(
    private _fb: FormBuilder,
    public _route: ActivatedRoute,
    public _router: Router,
    public _dataService : DataService,
  ) {
    this.productForm = this._fb.group({}); // to initialize the form
    //What would be preferred is a service call to get the product by id or sku.  access the sku or id through the route.snapshot.params, and pass through a service call to get the product.  This ensures that the data is fresh.  But for this, I will demonstrate a different way data can be passed
    this.data = this._router.getCurrentNavigation()?.extras.state
    this.disabledFields = this._route.snapshot.data['disabledFields'];
  }

  ngOnInit() {
    if(this.data){
      this.buildForm();
    }
  }

  buildForm() {
    //I'm trying to keep this generic.  I would only need to add a validation object to the config object in the route.

    const group: any = {};
    for (const key in this.data) {
      if(key === 'id') continue; //I don't want to show the id in the form
      group[key] = ['', Validators.required];
      if (key === 'type') {
        group[key] = ['', [Validators.required, Validators.maxLength(56)]];
      }
      if (key === 'price') {
        group[key] = ['', [Validators.required, Validators.min(1), CustomValidators.isNumber]];
      }
      this.controls.push({ key: key });
    }
    this.productForm = this._fb.group(group);

    Object.keys(this.data).forEach((key) => {
      this.productForm.get(key)?.setValue(this.data[key]);
    });
  }

  saveProduct() {
    if (this.productForm.valid) {
      //I would add a live service call here to update the product here and on 200, I'd close the dialog or handle the error.
      this._dataService.updateProducts(this.productForm.value);
      this._router.navigate(['/product-list/']);
    }
  }

  cancel() {
    this._router.navigate(['/product-list/']);
  }
}
