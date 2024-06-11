import { defineStore } from "pinia";

interface InvoiceModalState {
  isOpen: boolean;
  invoiceId: string | null;
}

export const useInvoiceModalStore = defineStore('invoiceModal', {
  state: (): InvoiceModalState => ({
    isOpen: false,
    invoiceId: null
  }),

  actions: {
    toggleVisibilityModal() {
      this.isOpen = !this.isOpen;
    },
  }
})