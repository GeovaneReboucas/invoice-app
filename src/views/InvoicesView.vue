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
          <span>
            Filtrar por status<span v-if="filteredStatus">: </span>
            <span class="filtered-status" v-if="filteredStatus">{{ filteredStatus }}</span>
          </span>
          <img src="/icon-arrow-down.svg">

          <ul class="filter-menu" v-show="filterMenu">
            <li v-for="(item, index) in invoiceStatus" :key="index" @click="handleFilterMenu(item)">
              {{ item.label }}
            </li>
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

import { useInvoiceModalStore } from '@/stores/index';
import { firebaseService } from '@/firebase/firebaseService';
import type { Invoice as InvoiceType } from '@/types/Invoice';
import type { SearchBy } from '@/firebase/types';

import Invoice from '@/components/Invoice.vue';
import Loading from '@/components/Loading.vue';

//Invoice Modal
const invoiceModal = useInvoiceModalStore()
function newInvoice() {
  invoiceModal.toggleVisibilityModal();
}
//

// Function that returns list of invoices
const loading = ref(true)
const invoices = ref<InvoiceType[]>([])
async function getInvoices(searchBy?: SearchBy) {
  try {
    loading.value = true;
    const resp = await firebaseService.findList('invoices', {
      searchBy
    }) as InvoiceType[];
    if (resp) {
      invoices.value = resp;
    }
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.error(error)
  }
};
//

onBeforeMount(async () => {
  await getInvoices();
})

// Status filter
const filterMenu = ref(false);
function toggleFilterMenu() {
  filterMenu.value = !filterMenu.value
}

const invoiceStatus = ref([
  { label: 'Pago', property: 'invoicePaid' },
  { label: 'Pendente', property: 'invoicePending' },
  { label: 'Rascunho', property: 'invoiceDraft' },
  { label: 'Limpar Filtro', property: undefined },
]);
const filteredStatus = ref<string | undefined>(undefined);
async function handleFilterMenu(status: { label: string, property?: string }) {
  filteredStatus.value = status.label;
  if (!status.property) {
    return await getInvoices();
  }

  return await getInvoices({
    field: status.property,
    condicion: '==',
    value: true,
  });
}
//
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

        .filtered-status {
          color: #7c5dfa;
          font-weight: 600;
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

  .empty {
    margin-top: 16px;
    align-items: center;

    img {
      width: 214px;
      width: 200px;
    }

    h3 {
      font-size: 20px;
      margin-top: 24px;
    }

    p {
      text-align: center;
      max-width: 224px;
      font-size: 14px;
      font-weight: 300;
      margin-top: 12px;
    }
  }
}
</style>