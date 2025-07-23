<template>
  <section class="component-container monthly-rating">
    <h3></h3> <div v-if="ratingData">
      <img
        v-if="ratingData.image"
        :src="ratingData.image"
        alt="評価画像"
        class="rating-image"
      />
      <p class="rating-comment">{{ ratingData.comment }}</p>
    </div>
    <p v-else>今月のデータがまだありません。</p>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  username: {
    type: String,
    default: '',
  },
});

const records = ref([]);
const goalAmount = ref(50000);

const loadData = () => {
  const recData = localStorage.getItem('kakeibo-records');
  if (recData) {
    records.value = JSON.parse(recData);
  }
  const savedGoal = localStorage.getItem('kakeibo-goal');
  if (savedGoal) {
    goalAmount.value = Number(savedGoal);
  }
};

const ratingLevels = [
  { comment: 'んっっっっっっぴぃぃぃぃ！！目標達成っピ！！', image: '/seityou.png' },
  { comment: 'ゴールは目前ピ！気を抜くなっピ', image: '/wakadori.png' },
  { comment: 'まあまあ良い感じっピ！気を抜くなっピ', image: '/hinaedori.png' },
  { comment: 'エアコンつけすぎっピ！ぜいたくは敵ピ', image: '/hina.png' },
  { comment: 'もっと稼いで節約してくれっピ', image: '/tamago.png' },
  { comment: '消費者金融に焼き鳥に焼き鳥にされちゃったピ！', image: '/yakitori.png' }
];

const getJSTDate = () => new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

const monthlyIncome = computed(() => {
  const currentMonth = getJSTDate().toISOString().slice(0, 7);
  return records.value
    .filter(r => r.date.startsWith(currentMonth) && r.type === '収入')
    .reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
});

const monthlyExpense = computed(() => {
  const currentMonth = getJSTDate().toISOString().slice(0, 7);
  return records.value
    .filter(r => r.date.startsWith(currentMonth) && r.type === '支出')
    .reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
});

const balance = computed(() => monthlyIncome.value - monthlyExpense.value);

const achievementRate = computed(() => {
  if (goalAmount.value <= 0) return 0;
  return (balance.value / goalAmount.value) * 100;
});

const ratingData = computed(() => {
  const rate = achievementRate.value;
  if (rate < 0) return ratingLevels[5];
  if (rate >= 100) return ratingLevels[0];
  if (rate >= 80) return ratingLevels[1];
  if (rate >= 50) return ratingLevels[2];
  if (rate >= 20) return ratingLevels[3];
  return ratingLevels[4];
});

onMounted(() => {
  loadData();
  window.addEventListener('storage', loadData);
});
onUnmounted(() => {
  window.removeEventListener('storage', loadData);
});
</script>

<style scoped>
.monthly-rating {
  text-align: center;
}
.monthly-rating h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  color: #2c3e50;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.rating-image {
  width: 120px;
  height: 120px;
  margin-bottom: 0.5rem;
  object-fit: contain;
}
.rating-comment {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  min-height: 2.4rem;
}
</style>