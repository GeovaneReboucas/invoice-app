<template>
  <router-link class="router-link flex" :class="routerLinkStyles" :to="{ name: props.to }">
    <img v-if="props.imgSrc" :src="`/${props.imgSrc}`">
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

interface ButtonNavigationProps{
  to: string;
  imgSrc: string;
}

const props = defineProps<ButtonNavigationProps>()
const route = useRoute()
const isRouteActive: boolean = route.name === props.to;
const routerLinkStyles = computed(() => ({
  'router-link-active': isRouteActive
}));
</script>

<style scoped lang="scss">
.router-link {
  border-radius: 0 20px 20px 0;
  background-color: #141625;
  justify-content: center;
  padding: 22px;
  transition: filter 0.2s;

  img {
    width: auto;
    height: 26px;
  }

  @media(min-width: 900px) {
    width: 100%;
  }

  &:hover {
    filter: brightness(0.8);
  }
}

.router-link-active{
  background-color: #7c5dfa;

  &:hover {
    filter: none;
  }
}
</style>