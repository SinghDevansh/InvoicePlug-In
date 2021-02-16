import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Invoice } from "./models/invoice.model";
import numwords from 'num-words'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  ROOT_URL = environment.APP_URL

  constructor(private http: HttpClient) { }
  createInvoice(invoiceData: object, id) {
    let invoice = invoiceData
    return this.http.post<Invoice>(`${this.ROOT_URL}/api/invoices/createinvoice/${id}`, invoice)
  }
  generateInvoiceNumber() {
    return this.http.get(`${this.ROOT_URL}/api/invoices/invoicenumber`)
  }
  getInvoices() {
    return this.http.get<Invoice[]>(`${this.ROOT_URL}/api/invoices/getinvoices`)

  }
  getAllInvoices() {
    return this.http.get<Invoice[]>(`${this.ROOT_URL}/api/invoices/getallinvoices`)
  }
  getInvoiceById(id) {
    return this.http.get(`${this.ROOT_URL}/api/invoices/invoice/${id}`)
  }
  updateInvoice(invoiceData: object, id) {
    let invoice = invoiceData
    return this.http.put<Invoice>(`${this.ROOT_URL}/api/invoices/${id}`, invoice)
  }
  deleteInvoice(id) {
    return this.http.delete(`${this.ROOT_URL}/api/invoices/${id}`)
  }
  async genratePdf(invoice) {
    let docDefinition = {
      content: [
        // {

        //   canvas: [
        //   {
        //     type: 'line',
        //     x1: 0,
        //     y1: 5,
        //     x2: 535,
        //     y2: 5,
        //     lineWidth: 0.3,
        //     opacity : 0.5,

        //   }
        // ]
        // },

        {

          image: await this.getBase64ImageFromURL("https://media-exp1.licdn.com/dms/image/C510BAQEerg9Php-ljw/company-logo_200_200/0/1547621657300?e=2159024400&v=beta&t=uw4iG6hRSu-zRds7iG22wZ_sKoPOYvfY67jslKI4gF0"),
          fit: [80, 80],
          alignment:'right'
        },
        {
          text:'\n'
        },
        // {

        //   canvas: [
        //   {
        //   type: 'line',
        //   x1: 0,
        //   y1: 5,
        //   x2: 535,
        //   y2: 5,
        //   lineWidth: 0.3,
        //   opacity : 0.5,
        //   // margin : [15,15,15,70]
        //   }
        //   ]
        //   },

        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: `Customer Name: ${invoice.custName}`,
                bold: true
              },
              { text: `Customer Address:  ${invoice.custAddress}` },
              { text: ` Email: ${invoice.custEmail}` },
              { text: `Contact No:  ${invoice.custNumber}` },
              {text: `Invoice No: ${invoice.invoiceNumber}`}
            ],
            [
              {
                text: invoice.date.slice(0,10),
                alignment: 'right'
              },

            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Quantity', 'Amount'],
              ...invoice.products.map(p =>
                ([p.name, p.price, p.quantity, (p.price * p.quantity).toFixed(2)])),
              [{ text: 'Total Amount (including taxes)', colSpan: 3 }, {}, {},invoice.totalAmount]
            ]
          }
        },
        {
          text: [
            { text: `\n Rupees: ${numwords(Math.floor(invoice.totalAmount))} only`, bold: true },
            '\n\n PAN No.:AADCD0760G',
            '\n GST No.:12ABCDEF1X1056G',
            '\n LUT No.:154/CGST/Division-North/GGN/2017-18'

          ]
        },
        {
          text: [
            { text: '\n Bank Details', bold: true },
            '\n\n Account Name :', { text: 'Bigstep Technologies', bold: true },
            '\n Account No. :', { text: '1002256000199', bold: true },
            '\n Bank: ', { text: 'HDFC Bank Ltd.', bold: true },
            '\n Account Address :', { text: 'HDFC Bank Ltd.DSS 13, Old Judicial Complex, Civil  ', bold: true },
            '\n', { text: 'Lines, Gurgaon-122001, Haryana, India', bold: true },
            '\n IFSC Code: ', { text: 'HDFC0009113', bold: true }

          ]
        },
        {
          text:'\n\n\n\n'
        },
        {

          canvas: [
          {
          type: 'line',
          x1: 0,
          y1: 5,
          x2: 535,
          y2: 5,
          lineWidth: 0.3,
          opacity : 0.5,
          // margin : [15,15,15,70]
          }
          ]
          },
          {

          columns: [
          [
          {
          text: `Bigstep Technologies Private Limited. `,

          bold:true,
          margin : [0,30,0,0],
          fontSize : 10
          },
          { text: ` Judicial Complex, Sector 15`,fontSize : 10},
          { text: `Gurgaon-122001, Haryana,India`,fontSize : 10 },
          { text: `Email :- info@bigstep.com`,fontSize : 10 },
          { text: `CIN:UN76E82726892GVDHSVWVYBHVY` ,fontSize : 10}
          ],
          [
          {
          text: `2nd Floor,SCO-63,Old`,
          alignment: 'right',
          margin : [0,30,0,0],
          fontSize : 10
          },
          {
          text: `Phone No. :- 91-9414xxxx62`,
          alignment: 'right',
          margin : [0,12],
          fontSize : 10
          },
          {
          text: `http://www.bigstep.com`,
          alignment: 'right',
          fontSize : 10
          }
          ],

          // { canvas: [{ type: 'line', x1: 10, y1: 10, x2: 595-10, y2: 10, lineWidth: 0.5 }] }

          ],

          },

      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        }
      }
    }
    pdfMake.createPdf(docDefinition).download()
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }
}


