<template>
  <div class="achievement-notifier">
    <transition-group name="fade">
      <div v-for="achievement in achievements" :key="achievement.id" class="notification">
        <div class="icon">{{ achievement.icon }}</div>
        <div class="content">
          <div class="title">アチーブメント達成！</div>
          <div class="name">{{ achievement.name }}</div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
defineProps({
  achievements: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.achievement-notifier {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  width: 320px;
}
.notification {
  display: flex;
  align-items: center;
  background-color: #2c3e50;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  margin-bottom: 1rem;
  border-left: 5px solid #ff9800;
  overflow: hidden;
}
.icon {
  font-size: 2rem;
  margin-right: 1rem;
}
.content {
  display: flex;
  flex-direction: column;
}
.title {
  font-weight: bold;
  font-size: 1.1em;
}
.name {
  font-size: 0.9em;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>