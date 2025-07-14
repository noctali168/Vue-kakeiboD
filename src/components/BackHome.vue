<template>
  <CostAutoAdd />
  <router-link to="/" class="back-home">🏠 ホームへ戻る</router-link>
</template>

<script setup>
import CostAutoAdd from './CostAutoAdd.vue';
</script>

<style scoped>
.back-home {
  display: inline-block;
  margin: 1rem 0;
  color: #1976d2;
  text-decoration: none;
  font-weight: bold;
}
.back-home:hover {
  text-decoration: underline;
}
</style>
