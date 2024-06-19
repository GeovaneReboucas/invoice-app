import type { Invoice } from "@/types/Invoice";
import { defineStore } from "pinia";

interface InvoiceModalState {
  isOpen: boolean;
  invoice?: Invoice;
}

export const useInvoiceModalStore = defineStore('invoiceModal', {
  state: (): InvoiceModalState => ({
    isOpen: false,
    invoice: undefined
  }),

  actions: {
    toggleVisibilityModal() {
      this.isOpen = !this.isOpen;
      if(!this.isOpen){
        this.invoice = undefined
      }
    },

    setInvoice(invoice: Invoice) {
      this.invoice = invoice;
    },
  }
})