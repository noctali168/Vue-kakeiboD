<template>
  <section class="component-container monthly-rating">
    <h3>今月の鳥の様子</h3>

    <div v-if="ratingData">
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

// --- ★変更点1: propsを削除し、コンポーネント内にデータを持つ ---
const records = ref([]);
const goalAmount = ref(50000); // デフォルト値

// --- ★変更点2: データを読み込む関数を作成 ---
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

// 6段階評価（コメントと画像パス）
const ratingLevels = [
  { comment: '絶好調！目標達成おめでとうございます！', image: '/seityou.png' },
  { comment: '順調です！この調子でいきましょう！', image: '/wakadori.png' },
  { comment: 'まずまず。目標まであと少し！', image: '/hinaedori.png' },
  { comment: 'ちょっと厳しいかも？支出を見直そう！', image: '/hina.png' },
  { comment: 'ピンチ！目標達成は難しそうです…', image: '/tamago.png' },
  { comment: '赤字です！すぐに対策を考えましょう！', image: '/yakitori.png' }
];

// --- ★変更点3: 達成率の計算ロジックをコンポーネント内に移動 ---
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

// 達成率に応じて評価を決定する
const ratingData = computed(() => {
  const rate = achievementRate.value;
  if (rate < 0) return ratingLevels[5];
  if (rate >= 100) return ratingLevels[0];
  if (rate >= 80) return ratingLevels[1];
  if (rate >= 50) return ratingLevels[2];
  if (rate >= 20) return ratingLevels[3];
  return ratingLevels[4];
});


// --- ★変更点4: データの変更を検知してリアルタイムに更新 ---
// コンポーネントが表示された時に、localStorageからデータを読み込む
onMounted(() => {
  loadData();
  // 他のタブやウィンドウでlocalStorageが変更されたことを検知するイベント
  window.addEventListener('storage', loadData);
});
// コンポーネントが非表示になったら、イベント検知を解除する
onUnmounted(() => {
  window.removeEventListener('storage', loadData);
});
</script>

<style scoped>
.monthly-rating {
  text-align: center;
}
/* ★変更点5: 画像のサイズを固定 */
.rating-image {
  width: 120px;
  height: 120px;
  margin-bottom: 0.5rem;
  object-fit: contain; /* アスペクト比を保ちつつ、コンテナに収める */
}
.rating-comment {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  min-height: 2.4rem; /* コメントの高さが変動してもレイアウトが崩れないように */
}
</style>