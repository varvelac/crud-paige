export interface Product {
  id: number;
  sku: string;
  name: string;
  type: string;
  description: string;
  color: string;
  price: number;
}

export class Product{
constructor(public id:number, public sku:string, public name: string,  public type:string,  public description:string, public color:string, public price: number) {}

}