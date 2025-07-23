<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer /> </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue' // ★ここを追加★

export default {
  components: {
    Header,
    Footer, // ★ここを追加★
  },
}
</script>

<style>
/* 必要ならここに全体のスタイル */
</style>