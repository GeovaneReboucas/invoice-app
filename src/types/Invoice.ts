import type { InvoiceItem } from "./InvoiceItem";

export interface Invoice {
  id: string;
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
  invoicePaid: boolean;
  invoicePending: boolean;
  invoiceDraft: boolean;
  invoiceItemList: InvoiceItem[];
  invoiceTotal: number;
}