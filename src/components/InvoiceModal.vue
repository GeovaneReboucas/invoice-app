<template>
  <div class="invoice-wrap flex flex-column" @click="checkClick" ref="invoiceWrap">
    <form class="invoice-content" @submit.prevent="submitForm">
      <h1>Nova Fatura</h1>

      <!-- Bill from -->
      <div class="bill-from flex flex-column">
        <h4>Fatura de</h4>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Endereço</label>
          <input required type="text" id="billerStreetAddress" v-model="billerStreetAddress">
        </div>

        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billerCity">Cidade</label>
            <input required type="text" id="billerCity" v-model="billerCity">
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">CEP</label>
            <input required type="text" id="billerZipCode" v-model="billerZipCode">
          </div>
          <div class="input flex flex-column">
            <label for="billerCountry">País</label>
            <input required type="text" id="billerCountry" v-model="billerCountry">
          </div>
        </div>
      </div>

      <!-- Bill to -->
      <div class="bill-to flex flex-column">
        <h4>Fatura para</h4>
        <div class="input flex flex-column">
          <label for="clientName">Nome do Cliente</label>
          <input required type="text" id="clientName" v-model="clientName">
        </div>

        <div class="input flex flex-column">
          <label for="clientEmail">Email do Cliente</label>
          <input required type="text" id="clientEmail" v-model="clientEmail">
        </div>

        <div class="input flex flex-column">
          <label for="clientStreetAddress">Endereço do Cliente</label>
          <input required type="text" id="clientStreetAddress" v-model="clientStreetAddress">
        </div>

        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">Cidade</label>
            <input required type="text" id="clientCity" v-model="clientCity">
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">CEP</label>
            <input required type="text" id="clientZipCode" v-model="clientZipCode">
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">País</label>
            <input required type="text" id="clientCountry" v-model="clientCountry">
          </div>
        </div>
      </div>

      <!-- Invoice Work Details -->
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Data da Fatura</label>
            <input type="date" id="invoiceDate" v-model="invoiceDate">
          </div>

          <div class="input flex flex-column">
            <label for="paymentDueDate">Data do Vencimento</label>
            <input disabled type="date" id="paymentDueDate" v-model="paymentDueDate">
          </div>
        </div>

        <div class="input flex flex-column">
          <label for="paymentTerms">Termos do Pagamento</label>
          <select id="paymentTerms" required v-model="paymentTerms">
            <option value="30">30 dias líquidos</option>
            <option value="60">60 dias líquidos</option>
          </select>
        </div>

        <div class="input flex flex-column">
          <label for="productDescription">Descrição do Produto</label>
          <input required type="text" id="productDescription" v-model="productDescription">
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

            <tr class="table-items flex" v-for="(item, index) in invoiceItemList" :key="index">
              <td class="item-name">
                <input type="text" v-model="item.itemName">
              </td>
              <td class="qty">
                <input type="text" v-model="item.qty">
              </td>
              <td class="price">
                <input type="text" v-model="item.price">
              </td>
              <td class="total flex">${{ (item.qty * item.price) }}</td>
              <img src="@/assets/icon-delete.svg" @click="deleteInvoiceItem(item.id)">
            </tr>
          </table>

          <div class="flex button" @click="addNewInvoiceItem">
            <img src="@/assets/icon-plus.svg">
            Adicionar novo Item
          </div>
        </div>
      </div>

      <!-- Save/Exit -->
      <div class="save flex">
        <div class="left">
          <button class="red" @click="closeInvoice">Cancel</button>
        </div>

        <div class="right flex">
          <button class="dark-purple" @click="saveDraft">Salvar Draft</button>
          <button class="purple" @click="publishInvoice">Criar Fatura</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { useInvoiceModalStore } from '@/stores/InvoiceModalStore';
import type { InvoiceItem } from '../types/InvoiceItem';

const billerStreetAddress = ref(null);
const billerCity = ref(null);
const billerZipCode = ref(null);
const billerCountry = ref(null);
const clientName = ref(null);
const clientEmail = ref(null);
const clientStreetAddress = ref(null);
const clientCity = ref(null);
const clientZipCode = ref(null);
const clientCountry = ref(null);
const invoiceDateUnix = ref(null);
const invoiceDate = ref();
const paymentTerms = ref(30);
const paymentDueDateUnix = ref(null);
const paymentDueDate = ref<string | null>(null);
const productDescription = ref(null);
const invoicePending = ref(null);
const invoiceDraft = ref(null);
const invoiceItemList = ref<InvoiceItem[]>([]);
const invoiceTotal = ref(0);

const invoiceModal = useInvoiceModalStore();

//Invoice Modal Events
function checkClick() { }
function submitForm() { }

function deleteInvoiceItem(id: string) {
  invoiceItemList.value = invoiceItemList.value.filter(item => item.id !== id)
}

function addNewInvoiceItem() {
  const newItem = {
    id: uuidv4(),
    itemName: '',
    qty: 0,
    price: 0,
  }
  invoiceItemList.value.push(newItem)
}
function closeInvoice() {
  invoiceModal.toggleVisibilityModal()
}
function saveDraft() { }
function publishInvoice() { }
//

//paymentTerms and invoiceDate watch
watch([paymentTerms, invoiceDate], ([newPaymentTerms, newInvoiceDate]) => {
  if (newPaymentTerms && newInvoiceDate) {
    paymentDueDate.value = moment(newInvoiceDate).add(newPaymentTerms, 'days').format("YYYY-MM-DD")
  }
});
//

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
    left: 90px;
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

            img{
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
