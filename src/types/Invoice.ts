import type { InvoiceItem } from "./InvoiceItem";

export interface Invoice {
  billerStreetAddress: string;
  billerCity: string;
  billerZipCode: string;
  billerCountry: string;
  clientName: string;
  clientEmail: string;
  clientStreetAddress: string;
  clientCity: string;
  clientZipCode: string;
  clientCountry: string;
  invoiceDate: string;
  paymentTerms: string;
  paymentDueDate: string;
  productDescription: string;
  invoicePending: string;
  invoiceDraft: string;
  invoiceItemList: InvoiceItem[];
  invoiceTotal: number;
}