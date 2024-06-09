<template>
  <div class="home container">
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Faturas</h1>
        <span>Há 4 faturas no total</span>
      </div>
      <div class="right flex">
        <div class="filter flex" @click="toggleFilterMenu">
          <span>Filtrar por status</span>
          <img src="@/assets/icon-arrow-down.svg">

          <ul class="filter-menu" v-show="filterMenu">
            <li>Draft</li>
            <li>Pendente</li>
            <li>Pago</li>
            <li>Limpar Filtros</li>
          </ul>
        </div>

        <div class="button flex" @click="newInvoice">
          <div class="inner-button flex">
            <img src="@/assets/icon-plus.svg" alt="">
          </div>

          <span>Nova Fatura</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const filterMenu = ref(false) 
function toggleFilterMenu(){
  filterMenu.value = !filterMenu.value
}

function newInvoice(){

}
</script>

<style lang="scss" scoped>
.home{
  color: #fff;

  .header{
    margin-bottom: 65px;

    .left, .right{
      flex: 1;
    }

    .right{
      justify-content: flex-end;
      align-items: center;
      
      .button, .filter{
        align-items: center;

        span{
          font-size: 12px;
        }
      }

      .filter{
        cursor: pointer;
        position: relative;
        margin-right: 40px;

        img{
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu{
          width: 120px;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

          li{
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover{
              color: #1e2139;
              background-color: #fff;
            }
          }
        }
      }

      .button{
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;

        .inner-button{
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;

          img{
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }
}
</style>