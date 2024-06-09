import { defineStore } from "pinia";

interface countInterface{
  count: number;
  message: string;
}

export const useCounterStore = defineStore('counter', {
  state: (): countInterface => ({
    count: 0,
    message: 'hellio'
  }),

  actions: {
    increment() {
      this.count++;
    }
  },

  getters: {
    showCount(): any {
      return 'O valor do count é ' + this.count
    }
  },
})