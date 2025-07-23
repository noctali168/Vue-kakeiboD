<template>
  <div id="app">
    <Header />
    <router-view class="main-content-router-view" />
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  components: {
    Header,
    Footer,
  },
}
</script>

<style>
/* src/style.css の内容と一部重複する可能性があるので注意 */

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* max-width: 1280px; は削除または変更 */
  width: 100%; /* ★変更★ 親の幅いっぱいに広がるようにする */
  margin: 0 auto;
  padding: 0;
  text-align: center;
}

.main-content-router-view {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* 他のグローバルスタイルはそのまま */
body {
  margin: 0;
  background-color: #f0f2f5;
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #213547;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}