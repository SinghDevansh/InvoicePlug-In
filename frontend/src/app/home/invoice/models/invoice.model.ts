import { Product } from "./product.model";


export class Invoice{
  public custName: string;
  public custEmail: string;
  public custAddress: string;
  public products: Product[] = [];
  public custNumber: number;
  public invoiceDate: string;
  public currency: string;
  public region: string;
  public creator: string;
  public totalAmount: number;

}
