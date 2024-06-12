<template>
  <div class="invoice-wrap flex flex-column" @click="checkClick" ref="invoiceWrap">
    <form class="invoice-content" @submit.prevent="submitForm">
      <Loading v-if="loading" />
      <h1>Nova Fatura</h1>

      <!-- Bill from -->
      <div class="bill-from flex flex-column">
        <h4>Fatura de</h4>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Endereço</label>
          <input required type="text" id="billerStreetAddress" v-model="invoice.billerStreetAddress">
        </div>

        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billerCity">Cidade</label>
            <input required type="text" id="billerCity" v-model="invoice.billerCity">
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">CEP</label>
            <input required type="text" id="billerZipCode" v-model="invoice.billerZipCode">
          </div>
          <div class="input flex flex-column">
            <label for="billerCountry">País</label>
            <input required type="text" id="billerCountry" v-model="invoice.billerCountry">
          </div>
        </div>
      </div>

      <!-- Bill to -->
      <div class="bill-to flex flex-column">
        <h4>Fatura para</h4>
        <div class="input flex flex-column">
          <label for="clientName">Nome do Cliente</label>
          <input required type="text" id="clientName" v-model="invoice.clientName">
        </div>

        <div class="input flex flex-column">
          <label for="clientEmail">Email do Cliente</label>
          <input required type="text" id="clientEmail" v-model="invoice.clientEmail">
        </div>

        <div class="input flex flex-column">
          <label for="clientStreetAddress">Endereço do Cliente</label>
          <input required type="text" id="clientStreetAddress" v-model="invoice.clientStreetAddress">
        </div>

        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">Cidade</label>
            <input required type="text" id="clientCity" v-model="invoice.clientCity">
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">CEP</label>
            <input required type="text" id="clientZipCode" v-model="invoice.clientZipCode">
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">País</label>
            <input required type="text" id="clientCountry" v-model="invoice.clientCountry">
          </div>
        </div>
      </div>

      <!-- Invoice Work Details -->
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Data da Fatura</label>
            <input type="date" id="invoiceDate" v-model="invoice.invoiceDate">
          </div>

          <div class="input flex flex-column">
            <label for="paymentDueDate">Data do Vencimento</label>
            <input disabled type="date" id="paymentDueDate" v-model="invoice.paymentDueDate">
          </div>
        </div>

        <div class="input flex flex-column">
          <label for="paymentTerms">Termos do Pagamento</label>
          <select id="paymentTerms" required v-model="invoice.paymentTerms">
            <option value="30">30 dias líquidos</option>
            <option value="60">60 dias líquidos</option>
          </select>
        </div>

        <div class="input flex flex-column">
          <label for="productDescription">Descrição do Produto</label>
          <input required type="text" id="productDescription" v-model="invoice.productDescription">
        </div>

        <div class="work-items">
          <h3>Lista de Itens</h3>

          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Nome do Item</th>
              <th class="qty">Qty</th>
              <th class="price">Preço</th>
              <th class="total">Total</th>
            </tr>

            <tr class="table-items flex" v-for="(item, index) in invoice.invoiceItemList" :key="index">
              <td class="item-name">
                <input type="text" v-model="item.itemName">
              </td>
              <td class="qty">
                <input type="number" v-model="item.qty">
              </td>
              <td class="price">
                <input type="number" step="any" v-model="item.price">
              </td>
              <td class="total flex">${{ (item.qty * item.price) }}</td>
              <img src="/icon-delete.svg" @click="deleteInvoiceItem(item.id)">
            </tr>
          </table>

          <div class="flex button" @click="addNewInvoiceItem">
            <img src="/icon-plus.svg">
            Adicionar novo Item
          </div>
        </div>
      </div>

      <!-- Save/Exit -->
      <div class="save flex">
        <div class="left">
          <button type="button" class="red" @click="closeInvoice">Cancel</button>
        </div>

        <div class="right flex">
          <button type="submit" class="dark-purple" @click="saveDraft">Salvar Draft</button>
          <button type="submit" class="purple" @click="publishInvoice">Criar Fatura</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/firebase/firebaseInit';
import { useInvoiceModalStore, useWarningModalStore } from '@/stores/index';
import type { Invoice } from '@/types/Invoice';
import { addDoc, collection } from 'firebase/firestore';

import Loading from './Loading.vue';

const loading = ref(false);
const invoiceWrap = ref(false);

const invoice = reactive<Omit<Invoice, 'id'>>({
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
});

const useInvoiceModal = useInvoiceModalStore();
const useWarningModal = useWarningModalStore();

//Invoice Items functions
function deleteInvoiceItem(id: string) {
  invoice.invoiceItemList = invoice.invoiceItemList.filter(item => item.id !== id)
}

function addNewInvoiceItem() {
  const newItem = {
    id: uuidv4(),
    itemName: '',
    qty: 0,
    price: 0,
  }
  invoice.invoiceItemList.push(newItem)
}

function calculateInvoiceTotal() {
  invoice.invoiceTotal = invoice.invoiceItemList.reduce((acc, item) => {
    return acc += item.price * item.qty
  }, 0)
}
//

//Invoice Modal functions
function checkClick(e: any) {
  if(e.target == invoiceWrap.value){
    useWarningModal.toggleVisibilityModal()
  }
}

function closeInvoice() {
  useInvoiceModal.toggleVisibilityModal()
}

function saveDraft() {
  invoice.invoiceDraft = true
}

function publishInvoice() {
  invoice.invoicePending = true
}

async function uploadInvoice() {
  try{
    if (!invoice.invoiceItemList.length) {
      return alert('Por favor preencha o formulário com os itens da fatura!')
    }
    loading.value = true;
    calculateInvoiceTotal()
    const respFirebase = await addDoc(collection(db, 'invoices'), {
      ...invoice,
      createdAt: moment().toISOString()
    });
    alert('Fatura criada com sucesso!')
    closeInvoice();
    loading.value = false;
  }catch(error){ console.log('error', error) }
}

async function submitForm() {
  await uploadInvoice()
}
//

//paymentTerms and invoiceDate watch
watch([() => invoice.invoiceDate, () => invoice.paymentTerms], ([newInvoiceDate, newPaymentTerms]) => {
  if (newPaymentTerms && newInvoiceDate !== '') {
    invoice.paymentDueDate = moment(newInvoiceDate).add(newPaymentTerms, 'days').format("YYYY-MM-DD")
  }
});

</script>

<style scoped lang="scss">
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100vh;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 900px) {
    left: 80px;
  }

  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      color: #fff;
    }

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }

    h4 {
      margin-bottom: 24px;
      font-size: 12px;
      color: #7c5dfa;
    }

    //Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;

      .location-details {
        gap: 16px;

        div {
          flex: 1;
        }
      }
    }

    //Invoice Work
    .invoice-work {
      .payment {
        gap: 24px;

        div {
          flex: 1;
        }
      }

      .work-items {
        .item-list {
          width: 100%;

          //Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;

            img {
              cursor: pointer;
            }

            .item-name {
              flex-basis: 50%;
            }

            .qty {
              flex-basis: 10%;
            }

            .price {
              flex-basis: 20%;
            }

            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }

          .table-heading {
            margin-bottom: 16px;

            th {
              text-align: left;
            }
          }

          .table-items {
            position: relative;
            margin-bottom: 24px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }

        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;

          img {
            margin-right: 4px;
          }
        }
      }
    }

    .save {
      margin-top: 60px;

      div {
        flex: 1;
      }

      .right {
        justify-content: flex-end;
      }
    }
  }

  .input {
    margin-bottom: 24px;
  }

  label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;

    &:focus {
      outline: none;
    }
  }
}
</style>
