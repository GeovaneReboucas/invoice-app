<template>
  <Loading v-if="loading" />
  <div class="invoices container" v-else>
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Faturas</h1>
        <span>Há {{ invoices.length }} faturas no total</span>
      </div>
      <div class="right flex">
        <div class="filter flex" @click="toggleFilterMenu">
          <span>Filtrar por status</span>
          <img src="/icon-arrow-down.svg">

          <ul class="filter-menu" v-show="filterMenu">
            <li>Draft</li>
            <li>Pendente</li>
            <li>Pago</li>
            <li>Limpar Filtros</li>
          </ul>
        </div>

        <div class="button flex" @click="newInvoice">
          <div class="inner-button flex">
            <img src="/icon-plus.svg" alt="">
          </div>

          <span>Nova Fatura</span>
        </div>
      </div>
    </div>

    <div v-if="invoices.length">
      <invoice v-for="(invoice, index) in invoices" :key="index" :invoice="invoice" />
    </div>
    <div class="empty flex flex-column" v-else>
      <img src="/illustration-empty.svg">
      <h3>Nenhuma fatura criada.</h3>
      <p>Crie uma nova fatura clicando no botão de Nova Fatura e preencha o formulário.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';

import { useInvoiceModalStore } from '@/stores/index';

import Invoice from '@/components/Invoice.vue';
import Loading from '@/components/Loading.vue';
import type { Invoice as InvoiceType } from '@/types/Invoice';

const loading = ref(true)
const filterMenu = ref(false)
function toggleFilterMenu() {
  filterMenu.value = !filterMenu.value
}

const invoiceModal = useInvoiceModalStore()
function newInvoice() {
  invoiceModal.toggleVisibilityModal();
}

const invoices = ref<InvoiceType[]>([])
async function getInvoices() {
  loading.value = true;
  try{
    return new Promise((resolve) => {
      const collRefQuery = query(
        collection(db, 'invoices'),
        orderBy('createdAt')
      );
      const unsub = onSnapshot(collRefQuery, (snapShot) => {
        const invoicesData = snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as InvoiceType));
        invoices.value = invoicesData;
        resolve(invoices);
        loading.value = false;
      });
      return () => unsub();
    });
  }catch(error){
    loading.value = false;
    console.error(error)
  }
};
onBeforeMount(async () => {
  await getInvoices();
})

</script>

<style lang="scss" scoped>
.invoices {
  color: #fff;

  .header {
    margin-bottom: 65px;

    .left,
    .right {
      flex: 1;
    }

    .right {
      justify-content: flex-end;
      align-items: center;

      .button,
      .filter {
        align-items: center;

        span {
          font-size: 12px;
        }
      }

      .filter {
        cursor: pointer;
        position: relative;
        margin-right: 40px;

        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu {
          width: 120px;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover {
              color: #1e2139;
              background-color: #fff;
            }
          }
        }
      }

      .button {
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;

        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;

          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .empty{
    margin-top: 16px;
    align-items: center;

    img{
      width: 214px;
      width: 200px;
    }

    h3{
      font-size: 20px;
      margin-top: 24px;
    }

    p{
      text-align: center;
      max-width: 224px;
      font-size: 14px;
      font-weight: 300;
      margin-top: 12px;
    }
  }
}
</style>