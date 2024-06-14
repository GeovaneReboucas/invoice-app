import type { Invoice } from "@/types/Invoice";
import { defineStore } from "pinia";

interface InvoiceModalState {
  isOpen: boolean;
  invoice?: Invoice;
  isSubmitEdit: boolean;
}

export const useInvoiceModalStore = defineStore('invoiceModal', {
  state: (): InvoiceModalState => ({
    isOpen: false,
    invoice: undefined,
    isSubmitEdit: false,
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

    toggleIsSubmitEdit() {
      this.isSubmitEdit = !this.isSubmitEdit;
    },
  }
})