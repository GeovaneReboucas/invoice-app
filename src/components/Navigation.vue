<template>
  <header class="flex">
    <ButtonNavigation to="Invoices" imgSrc="file-invoice-dollar-solid.png" />
  </header>
</template>

<script setup lang="ts">
import ButtonNavigation from '@/components/ButtonNavigation.vue'
</script>

<style scoped lang="scss">
header {
  z-index: 99;
  flex-direction: row;
  gap: 8px;
  background-color: #1e2139;

  @media(min-width: 900px) {
    min-height: 100%;
    min-width: 80px;
    flex-direction: column;
    border-radius: 0 20px 20px 0;
  }
}
</style>