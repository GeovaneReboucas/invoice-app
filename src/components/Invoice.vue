<template>
  <router-link class="invoice flex" :to="{ name: 'Invoice', params: { id: invoice.id } }">
    <div class="left flex">
      <span class="tracking-number">#{{ invoice.id }}</span>
      <span class="due-date">{{ moment(invoice.paymentDueDate).format('DD/MM/YYYY') }}</span>
      <span class="person">{{ invoice.clientName }}</span>
    </div>
    <div class="right flex">
      <span class="price">${{ invoice.invoiceTotal }}</span>
      <div class="status-button flex" :class='{
        paid: invoice.invoicePaid,
        draft: invoice.invoiceDraft,
        pending: invoice.invoicePending
      }'>
        <span v-if="invoice.invoicePaid">Pago</span>
        <span v-if="invoice.invoiceDraft">Rascunho</span>
        <span v-if="invoice.invoicePending">Pendente</span>
      </div>
      <div class="icon">
        <img src="/icon-arrow-right.svg">
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import moment from 'moment';

import type { Invoice } from '@/types/Invoice';

interface props {
  invoice: Invoice;
}

const { invoice } = defineProps<props>()
</script>

<style lang="scss" scoped>
.invoice {
  text-decoration: none;
  cursor: pointer;
  gap: 16px;
  margin-bottom: 16px;
  color: #fff;
  border-radius: 10px;
  padding: 20px 32px;
  background-color: #1e2139;
  align-items: center;
  border: 1.4px solid #1e2139;
  transition: all 0.4s;

  &:hover{
    border: 1.4px solid #7C5DFA;
  }

  span {
    font-size: 13px;
  }

  .left {
    align-items: center;
    flex-basis: 60%;
    gap: 16px;

    span {
      flex: 1;
    }

    .tracking-number {
      text-transform: uppercase;
    }
  }

  .right {
    gap: 16px;
    flex-basis: 40%;
    align-items: center;

    .price {
      flex: 1;
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>