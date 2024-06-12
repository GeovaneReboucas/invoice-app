<template>
  <div class="modal flex">
    <div class="modal-container">
      <p>Você tem certeza que gostaria de sair do formulário? Existem alterações não salvas</p>
      <div class="actions flex">
        <button @click="closeModal" class="purple">Retornar</button>
        <button @click="closeInvoice" class="red">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWarningModalStore, useInvoiceModalStore } from '@/stores';

const useInvoiceModal = useInvoiceModalStore();
const useWarningModal = useWarningModalStore();

function closeModal(){
  useWarningModal.toggleVisibilityModal();
}
function closeInvoice(){
  useWarningModal.toggleVisibilityModal();
  useInvoiceModal.toggleVisibilityModal();
}
</script>

<style scoped lang="scss">
.modal{
  z-index: 10;
  position: fixed;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  .modal-container{
    border-radius: 20px;
    padding: 48px 32px;
    max-width: 450px;
    background-color: #252945;
    color: #fff;

    p{
      text-align: center;
    }

    .actions{
      margin-top: 24px;

      button{
        flex: 1;
      }
    }
  }
}
</style>