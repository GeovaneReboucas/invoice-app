<template>
  <Loading v-if="loading" />
  <div class="invoice-view container" v-else>
    <router-link class="nav-link flex" :to="{ name: 'Invoices' }">
      <img src="/icon-arrow-left.svg"> Voltar
    </router-link>

    <!-- Header -->
    <div class="header flex">
      <div class="left flex">
        <p>Status</p>

        <div class="status-button flex" :class='{
          paid: invoice.invoicePaid,
          draft: invoice.invoiceDraft,
          pending: invoice.invoicePending
        }'>
          <span v-if="invoice.invoicePaid">Pago</span>
          <span v-if="invoice.invoiceDraft">Rascunho</span>
          <span v-if="invoice.invoicePending">Pendente</span>
        </div>
      </div>

      <div class="right flex">
        <button class="dark-purple" @click="openEditInvoiceModal">
          Editar
        </button>
        <button class="red" @click="deleteInvoice(invoice.id)">
          Deletar
        </button>
        <button class="green" v-if="invoice.invoicePending" @click="updateStatusToPaid(invoice.id)">
          Marcar como pago
        </button>
        <button class="orange" v-if="invoice.invoiceDraft || invoice.invoicePaid"
          @click="updateStatusToPending(invoice.id)">
          Marcar como pendente
        </button>
      </div>
    </div>

    <!-- Invoice Details -->
    <div class="invoice-details flex flex-column">
      <div class="top flex">
        <div class="left flex flex-column">
          <p><span>#</span>{{ invoice.id }}</p>
          <p>{{ invoice.productDescription }}</p>
        </div>

        <div class="right flex flex-column">
          <p>{{ invoice.billerStreetAddress }}</p>
          <p>{{ invoice.billerCity }}</p>
          <p>{{ invoice.billerZipCode }}</p>
          <p>{{ invoice.billerCountry }}</p>
        </div>
      </div>

      <div class="middle flex">
        <div class="payment flex flex-column">
          <h4>Data de emissão</h4>
          <p>{{ moment(invoice.invoiceDate).format('DD/MM/YYYY') }}</p>

          <h4>Data de vencimento</h4>
          <p>{{ moment(invoice.paymentDueDate).format('DD/MM/YYYY') }}</p>
        </div>

        <div class="bill flex flex-column">
          <h4>Fatura para</h4>
          <p>{{ invoice.clientName }}</p>
          <p>{{ invoice.clientStreetAddress }}</p>
          <p>{{ invoice.clientCity }}</p>
          <p>{{ invoice.clientZipCode }}</p>
          <p>{{ invoice.clientCountry }}</p>
        </div>

        <div class="send-to flex flex-column">
          <h4>Enviar para</h4>
          <p>{{ invoice.clientEmail }}</p>
        </div>
      </div>

      <div class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Item Name</p>
            <p>QTY</p>
            <p>Price</p>
            <p>Total</p>
          </div>
          <div class="item flex" v-for="(item, index) in invoice.invoiceItemList" :key="index">
            <p>{{ item.itemName }}</p>
            <p>{{ item.qty }}</p>
            <p>{{ item.price }}</p>
            <p>${{ item.qty * item.price }}</p>
          </div>
        </div>

        <div class="total flex">
          <p>Valor da Fatura</p>
          <p>${{ invoice.invoiceTotal }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import moment from 'moment';
import { deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';

import { useInvoiceModalStore } from '@/stores';
import type { Invoice as InvoiceType } from '@/types/Invoice';

import Loading from '@/components/Loading.vue';

const { params } = useRoute()
const router = useRouter()
const loading = ref(true)
const invoice = reactive<InvoiceType>({
  id: '',
  billerStreetAddress: '',
  billerCity: '',
  billerZipCode: '',
  billerCountry: '',
  clientName: '',
  clientEmail: '',
  clientStreetAddress: '',
  clientCity: '',
  clientZipCode: '',
  clientCountry: '',
  // invoiceDateUnix: '',
  invoiceDate: '',
  paymentTerms: 30,
  // paymentDueDateUnix: '',
  paymentDueDate: '',
  productDescription: '',
  invoicePaid: false,
  invoicePending: false,
  invoiceDraft: false,
  invoiceItemList: [],
  invoiceTotal: 0,
})

async function findInvoiceById(id: InvoiceType['id']) {
  return new Promise<InvoiceType>((resolve) => {
    const documentRef = doc(db, 'invoices', id);
    const unsub = onSnapshot(documentRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const invoiceData = { id: docSnapshot.id, ...docSnapshot.data() } as InvoiceType;
        resolve(invoiceData);
      }
    });
    return () => unsub();
  });
};

async function onRefresh(){
  loading.value = true;
  const invoiceId = params.id as string;
  const invoiceData = await findInvoiceById(invoiceId)
  if (!!invoiceData) {
    Object.assign(invoice, invoiceData);
  }
  loading.value = false;
}

onBeforeMount(async () => {
  await onRefresh();
})

const useInvoiceModal = useInvoiceModalStore();
function openEditInvoiceModal() {
  useInvoiceModal.setInvoice(invoice);
  useInvoiceModal.toggleVisibilityModal();
}

watch([() => useInvoiceModal.isSubmitEdit], async () => {
  await onRefresh();
});

//Actions Header
async function deleteInvoice(id: InvoiceType['id']) {
  try{
    loading.value = true;
    await deleteDoc(doc(db, 'invoices', id));
    alert('Fatura deletado com sucesso')
    router.push({ name: 'Invoices' })
    loading.value = false;
  }catch(error){ console.log('error', error) }
}

async function updateStatusToPaid(id: InvoiceType['id']) {
  loading.value = true
  const docRef = doc(db, 'invoices', id)
  invoice.invoiceDraft = false;
  invoice.invoicePending = false;
  invoice.invoicePaid = true;
  await setDoc(docRef, invoice);
  loading.value = false
}

async function updateStatusToPending(id: InvoiceType['id']) {
  loading.value = true
  const docRef = doc(db, 'invoices', id)
  invoice.invoiceDraft = false;
  invoice.invoicePending = true;
  invoice.invoicePaid = false;
  await setDoc(docRef, invoice);
  loading.value = false
}
//
</script>

<style lang="scss" scoped>
  .invoice-view{
    .nav-link{
      margin-bottom: 32px;
      align-items: center;
      color: #fff;
      font-size: 12px;

      img{
        margin-right: 16px;
        width: 7px;
        height: 10px;
      }
    }

    .header, .invoice-details{
      background-color: #1e2139;
      border-radius: 20px;
    }

    .header{
      align-items: center;
      padding: 24px 32px;
      font-size: 12px;

      .left{
        align-items: center;

        p{
          color: #dfe3fa;
          margin-right: 16px;
        }
      }

      .right{
        flex: 1;
        justify-content: flex-end;

        button{
          color: #fff;
        }
      }
    }

    .invoice-details{
      padding: 48px;
      margin-top: 24px;

      .top{
        div{
          color: #dfe3fa;
          flex: 1;
        }

        .left{
          font-size: 12px;

          p:first-child{
            font-size: 24px;
            text-transform: uppercase;
            color: #fff;
            margin-bottom: 8px;
          }

          p:nth-child(2){
            font-size: 16px;
          }

          span{
            color: #888eb0;
          }
        }

        .right{
          font-size: 12px;
          align-items: flex-end;
        }
      }

      .middle{
        margin-top: 50px;
        color: #dfe3fa;
        gap: 16px;

        h4{
          font-size: 12px;
          font-weight: 400;
          margin-bottom: 8px;
        }

        p{
          font-size: 16px;
        }

        .bill, .payment{
          flex: 1;
        }

        .payment{
          h4:nth-child(3){
            margin-top: 32px;
          }

          p{
            font-weight: 600;
          }
        }

        .bill{
          p:nth-child(2){
            font-size: 16px;
          }
          p:nth-child(3){
            margin-top: auto;
          }
          p{
            font-size: 12px;
          }
        }

        .send-to{
          flex: 2;
        }
      }

      .bottom{
        margin-top: 50px;

        .billing-items{
          padding: 32px;
          border-radius: 20px 20px 0 0;
          background-color: #252945;

          .heading{
            color: #dfe3fa;
            font-size: 12px;
            margin-bottom: 32px;

            p:first-child{
              flex: 3;
              text-align: left;
            }

            p{
              flex: 1;
              text-align: right;
            }
          }

          .item{
            margin-bottom: 32px;
            font-size: 13px;
            color: #fff;

            &:last-child{
              margin-bottom: 0;
            }

            p:first-child{
              flex: 3;
              text-align: left;
            }

            p{
              flex: 1;
              text-align: right;
            }
          }
        }

        .total{
          color: #fff;
          padding: 32px;
          background-color: rgba(12, 14, 22, 0.7);
          align-items: center;
          border-radius: 0 0 20px 20px;

          p{
            flex: 1;
            font-size: 12px;
          }

          p:nth-child(2){
            font-size: 28px;
            text-align: right;
          }
        }
      }
    }
  }
</style>