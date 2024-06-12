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
  paymentTerms: number;
  paymentDueDate: string;
  productDescription: string;
  invoicePending: boolean;
  invoiceDraft: boolean;
  invoiceItemList: InvoiceItem[];
  invoiceTotal: number;
}