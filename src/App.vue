<template>
  <div>
    <div v-if="!isMobile" class="app flex flex-column">
      <Navigation />

      <div class="app-content flex flex-column" :style="overlayDynamicStyles">
        <WarningModal v-if="useWarningModal.isOpen" />
        <transition name="invoice">
          <InvoiceModal v-if="useInvoiceModal.isOpen" />
        </transition>
        <RouterView />
      </div>
    </div>

    <div v-else class="mobile-message flex flex-column">
      <h2>Desculpe, a aplicação não tem suporte para dispositivos celulares!</h2>
      <p>Para usar esse sistema, por favor use um computador ou tablet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import { useInvoiceModalStore, useWarningModalStore } from './stores/index';

import Navigation from './components/Navigation.vue';
import InvoiceModal from './components/InvoiceModal.vue';
import WarningModal from './components/WarningModal.vue';

//Modal State
const useInvoiceModal = useInvoiceModalStore();
const useWarningModal = useWarningModalStore();

//Modal overlay style
const overlayDynamicStyles = computed(() => ({
  'background-color': useInvoiceModal.isOpen ? 'rgba(0, 0, 0, 0.5)' : 'transparent'
}));

//Check Mobile Screen
const isMobile = ref(false)
function checkScreen() {
  const windowWidth = window.innerWidth;
  if (windowWidth <= 750) {
    return isMobile.value = true
  }

  isMobile.value = false
}

checkScreen();
window.addEventListener('resize', checkScreen)
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #1E2139;
}

::-webkit-scrollbar-thumb {
  background: #7C5DFA;
  border-radius: 8px;
}

.app {
  background-color: #141625;
  min-height: 100vh;

  @media(min-width: 900px) {
    flex-direction: row !important;
  }

  .app-content {
    padding: 0 20px;
    flex: 1;
    position: relative;
  }
}

.mobile-message {
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141625;
  color: #fff;

  p {
    margin-top: 16px;
  }
}

//Animated Invoice Modal
.invoice-enter-active, .invoice-leave-active{
  transition: 0.8s ease all;
}

.invoice-enter-from, .invoice-leave-to{
  transform: translateX(-700px);
}
//

button,
.button {
  cursor: pointer;
  padding: 16px 24px;
  border-radius: 30px;
  border: none;
  font-size: 12px;
  margin-right: 8px;
  color: #fff;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(0.8);
  }
}

.dark-purple {
  background-color: #252945;
}

.red {
  background-color: #ec5757;
}

.purple {
  background-color: #7c5dfa;
}

.green {
  background-color: #33d69f;
}

.orange {
  background-color: #ff8f00;
}

// utility classes

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.container {
  width: 100%;
  padding: 40px 10px;
  max-width: 850px;
  margin: 0 auto;

  @media (min-width: 900px) {
    padding-top: 72px;
  }
}

.nav-link {
  text-decoration: none;
  color: initial;
}

// Status Button Styling

.status-button {
  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }

  font-size: 12px;
  margin-right: 30px;
  align-items: center;
  padding: 8px 30px;
  border-radius: 10px;
}

.paid {
  &::before {
    background-color: #33d69f;
  }

  color: #33d69f;
  background-color: rgba(51, 214, 160, 0.1);
}

.pending {
  &::before {
    background-color: #ff8f00;
  }

  color: #ff8f00;
  background-color: rgba(255, 145, 0, 0.1);
}

.draft {
  &::before {
    background-color: #dfe3fa;
  }

  color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.1);
}
</style>
