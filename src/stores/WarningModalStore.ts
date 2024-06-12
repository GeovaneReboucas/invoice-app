import { defineStore } from "pinia";

interface WarningModalState {
  isOpen: boolean;
}

export const useWarningModalStore = defineStore('warningModal', {
  state: (): WarningModalState => ({
    isOpen: false,
  }),

  actions: {
    toggleVisibilityModal() {
      this.isOpen = !this.isOpen;
    },
  }
})