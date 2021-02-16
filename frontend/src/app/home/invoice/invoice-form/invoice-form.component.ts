import { Component,  OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { InvoiceService } from '../invoice.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';




@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css'],
})

export class InvoiceFormComponent implements OnInit {
 // @ViewChild(Product) table: []
  buttonPressed = false
  invoiceForm: FormGroup
  in:any
  cgst
  sgst
  igst
  subtotal = 0.00
  discount
  totalTaxedAmount
  editMode = false
  id: any;
  constructor(private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private route:ActivatedRoute,
    private toastr: ToastrService,
  private router:Router) { }


    ngOnInit(): void {
      this.route.params.subscribe(
        (params: Params) => {
          this.id = params['id']

          this.editMode = this.id != null
          //console.log(this.editMode)
          this.createForm()
        }
      )
    }
  // pdfPreview() {
  //   this.router.navigate([`/invoice/genpdf/${this.id}`], { relativeTo: this.route })
  // }
  createForm() {
    let custName = ''
    let custEmail = ''
    let custAddress = ''
    let custNumber = ''
    let creator = ''
    let invoiceNumber = ''
    let date = ' '
    let currency = 'USD'
    let region = ''
    let products = new FormArray([])
    let pointsToRemember
    let totalAmount
    let status = ''
    if (this.editMode) {
      let invoiceNew

      this.invoiceService.getInvoiceById(this.id).subscribe(res => {
        // console.log(res)

        invoiceNew = res
        custName = invoiceNew.custName
        custEmail = invoiceNew.custEmail
        custAddress = invoiceNew.custAddress
        custNumber = invoiceNew.custNumber
        creator = invoiceNew.creator
        invoiceNumber = invoiceNew.invoiceNumber
        date = invoiceNew.date
        currency = invoiceNew.currency
        region = invoiceNew.region
        pointsToRemember = invoiceNew.pointsToRemember
        status = invoiceNew.status
        this.totalTaxedAmount = invoiceNew.totalAmount
        //console.log(pointsToRemember)
        this.invoiceForm = new FormGroup({
          custName: new FormControl(custName, Validators.required),
          custEmail: new FormControl(custEmail, [Validators.required, Validators.email]),
          creator: new FormControl(creator,  Validators.required),
          invoiceNumber: new FormControl(invoiceNumber,  Validators.required),
          date:new FormControl(date.slice(0,10), Validators.required),
          custNumber:new FormControl(custNumber, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
          custAddress:new FormControl(custAddress, Validators.required),
          currency:new FormControl(currency, Validators.required),
          region:new FormControl(region),
          products: products,
          pointsToRemember: new FormControl(pointsToRemember),
          status:new FormControl(status, Validators.required)

        })
        if (invoiceNew['products']) {
          for (let product of invoiceNew.products) {
            products.push(
              new FormGroup({
                'name': new FormControl(product.name,[Validators.required]),
                'quantity': new FormControl(product.quantity,[Validators.required]),
                'price': new FormControl(product.price,[Validators.required])
              })
            )
          }
        }

      })

    }
    //console.log('custName')
      this.invoiceForm = new FormGroup({
        custName: new FormControl(custName, Validators.required),
        custEmail: new FormControl(custEmail, Validators.required),
        creator: new FormControl(creator, Validators.required),
        invoiceNumber: new FormControl(invoiceNumber, Validators.required),
        date:new FormControl(date, Validators.required),
        custNumber:new FormControl(custNumber, [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
        custAddress:new FormControl(custAddress, Validators.required),
        currency:new FormControl(currency, Validators.required),
        region:new FormControl(region),
        products: products,
        pointsToRemember: new FormControl(pointsToRemember, Validators.required),
        status: new FormControl(status, Validators.required)

      })



  }
  onChange() {
    this.invoiceService.generateInvoiceNumber().subscribe(res => {
      this.in = res
      console.log(this.in)
      if (this.invoiceForm.value.creator === 'SocialEngineAddOns') {
        this.invoiceForm.patchValue({
         invoiceNumber: `000${this.in}/SE/20-21`
       })
      } else if (this.invoiceForm.value.creator === 'Prime Messenger/ Channelize.io') {
        this.invoiceForm.patchValue({
          invoiceNumber: `000${this.in}/PM/20-21`
        })
      } else if (this.invoiceForm.value.creator === 'AlmaHub') {
        this.invoiceForm.patchValue({
          invoiceNumber: `000${this.in}/GSTA/20-21`
        })
      } else {
        this.invoiceForm.patchValue({
          invoiceNumber: `000${this.in}/GSTM/20-21`
        })
      }
    })
    //console.log(this.in)


  }
  onSubmit() {
    console.log(this.invoiceForm)
    let id = JSON.parse(localStorage.getItem('user')).id
    let invoiceData = {
      creator: this.invoiceForm.value.creator,
      custName: this.invoiceForm.value.custName,
      custEmail: this.invoiceForm.value.custEmail,
      custNumber: this.invoiceForm.value.custNumber,
      custAddress: this.invoiceForm.value.custAddress,
      currency: this.invoiceForm.value.currency,
      region: this.invoiceForm.value.region,
      products: this.invoiceForm.value.products,
      invoiceNumber: this.invoiceForm.value.invoiceNumber,
      date: this.invoiceForm.value.date,
      pointsToRemember: this.invoiceForm.value.pointsToRemember,
      totalAmount: this.totalTaxedAmount,
      status:this.invoiceForm.value.status
    }
    if (this.editMode) {
      this.invoiceService.updateInvoice(invoiceData, this.id).subscribe(res => {
        this.router.navigate(['/home'], { relativeTo: this.route })
        this.toastr.success('Invoice Updated')
      }, error => {
          this.toastr.error('Invoice not updated')
      })

    } else {
      this.invoiceService.createInvoice(invoiceData, id).subscribe(res => {
        //console.log('form submitted')
        //console.log(res)
        this.router.navigate(['/home'], { relativeTo: this.route })
        this.toastr.success('Invoice Created')
      }, error => {
          this.toastr.error('Invoice not created: Please check all required fields')
      })
    }

    //this.dialogRef.close()
    //this.toastr.success('Invoice Created')
  }
  get controls() { // a getter!
    return (<FormArray>this.invoiceForm.get('products')).controls;
  }
  addProduct() {
    (<FormArray>this.invoiceForm.get('products')).push(
      new FormGroup({
        'name': new FormControl(null,[Validators.required]),
        'quantity': new FormControl(null,[Validators.required]),
        'price': new FormControl(null,[Validators.required])
      })
    );
  }
  onDeleteProduct(index: number) {
    (<FormArray>this.invoiceForm.get('products')).removeAt(index);
  }
  generateTotal() {
    let prodArray = this.invoiceForm.value.products
    //console.log(prodArray)
    let totalAmount = prodArray.reduce((a, b) => a + b.price * b.quantity, 0)
    //console.log(totalAmount)
    if (this.invoiceForm.value.currency === 'USD')
    {
      this.subtotal = totalAmount
      this.discount = Number((0.05 * totalAmount).toFixed(2))
      this.totalTaxedAmount = totalAmount - this.discount
    } else {
      if (this.invoiceForm.value.region === 'Haryana')
      {
        this.subtotal = totalAmount
        this.cgst = Number((0.09 * totalAmount).toFixed(2))
        this.sgst = Number((0.09 * totalAmount).toFixed(2))
        this.discount = Number((0.05 * totalAmount).toFixed(2))
        this.totalTaxedAmount = Number((totalAmount - this.discount + this.cgst + this.sgst).toFixed(2))
      } else {
        this.subtotal = totalAmount
        this.igst = Number((0.18 * totalAmount).toFixed(2))
        this.discount = Number((0.05 * totalAmount).toFixed(2))
        this.totalTaxedAmount = Number((totalAmount - this.discount + this.igst).toFixed(2))
      }


    }
    this.buttonPressed = true


  }
  clearForm() {
    this.invoiceForm.reset()
  }
  closeForm() {
    //this.dialogRef.close()
  }



}
