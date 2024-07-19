<template>
  <div class="modal flex">
    <div class="modal-container">
      <h2>Confirmar Ação</h2>
      <hr>
      <p>Você tem certeza que gostaria de sair do formulário? Existem alterações não salvas</p>
      <div class="actions flex">
        <button @click="closeModal" class="purple">Cancelar</button>
        <button @click="closeInvoice" class="red">Confirmar</button>
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
    border-radius: 12px;
    padding: 24px 24px;
    max-width: 450px;
    background-color: #252945;
    color: #fff;

    h2{
      font-size: 18px;
    }

    hr{
      margin: 18px 0;
      border: 0;
      height: 0.5px;
      background: #504b4b;
    }

    .actions{
      margin-top: 28px;
      justify-content: flex-end;

      button{
        font-weight: 600;
        border-radius: 14px;
        padding: 12px 22px;
      }
    }
  }
}
</style>