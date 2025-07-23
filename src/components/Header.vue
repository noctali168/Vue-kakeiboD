<template>
  <header class="app-header">
    <router-link to="/" class="header-link">
      <img src="/inko-icon.png" alt="INKO Bank ロゴ" class="logo" />
      <span class="app-title">INKO Bank</span>
    </router-link>

    <nav class="nav-menu">
      <router-link to="/" class="nav-item">ホーム</router-link>
      <router-link to="/form" class="nav-item">収支入力</router-link>
      <router-link to="/list" class="nav-item">記録</router-link>
      <router-link to="/notify" class="nav-item">設定</router-link>
    </nav>
  </header>
</template>

<script setup>
defineProps({
  showBack: {
    type: Boolean,
    default: false,
  }
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;

  background-color: #ffffff;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.header-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #2c3e50;
  position: relative;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 0.75rem;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
}

.app-title {
  font-size: 1.6rem;
  font-weight: 700;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 1px;
}

/* ▼ ナビメニュー */
.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-item {
  color: #213547;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  position: relative;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #1abc9c; /* INKO Bankカラー */
  transition: width 0.3s ease;
  border-radius: 1px;
}

.nav-item:hover::after {
  width: 100%;
}
</style>
