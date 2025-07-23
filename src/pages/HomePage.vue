<template>
  <div class="container">
    <Header />

    <div class="main-content-row">
      <div class="content-left card-container">
        <div class="card-inner character-block">
          <CharacterSection :username="username" />
        </div>
        
        <div class="card-inner goal-tracker-full-block">
          <GoalTracker
            :goal-amount="goalAmount"
            :total-income="monthlyIncome"
            :total-expense="monthlyExpense"
            @update:goal="updateGoalAmount"
            @update:achievement-rate="currentAchievementRate = $event"
          />
          <div class="reward-button-area">
            <button
              @click="displayReward"
              :disabled="currentAchievementRate < 100"
              class="reward-button"
            >
              ご褒美をもらう！
            </button>
            <p v-if="currentAchievementRate < 100" class="reward-hint">目標達成でご褒美がもらえます！</p>
          </div>
        </div>

        <div class="card-inner kuji-block">
          <Kuji />
        </div>
      </div>

      <div class="content-right card-container summary-chart-container">
        <SummaryArea
          :categories="categories"
          :records="records" class="summary-area-component"
        />
      </div>
    </div>

    <Calender />
    <NavCards /> 
    <Reminder />

    <transition name="fade">
      <div v-if="showRewardOverlay" class="reward-overlay"></div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Header from '../components/Header.vue'
import CharacterSection from '../components/CharacterSection.vue'
import SummaryArea from '../components/SummaryArea.vue'
import NavCards from '../components/NavCards.vue'
import Kuji from '../components/Kuji.vue'
import Reminder from '../components/Reminder.vue'
import Calender from '../components/Calender.vue'
import GoalTracker from '../components/GoalTracker.vue'

const records = ref([]);
const categories = ref({
  支出: [],
  収入: []
});
const goalAmount = ref(50000);
const username = ref('');

const currentAchievementRate = ref(0);
const showRewardOverlay = ref(false);

const getJSTDate = () => new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));

// --- 固定費の自動登録ロジック ---
const runAutoAddRecurringItems = () => {
  const recurringItemsData = localStorage.getItem('kakeibo-recurring');
  if (!recurringItemsData) return;
  
  const recurringItems = JSON.parse(recurringItemsData);
  const autoAddItems = recurringItems.filter(item => item.isAutoAdd);
  if (autoAddItems.length === 0) return;

  const now = getJSTDate();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastRunMonth = localStorage.getItem('kakeibo-last-auto-add-month');

  if (lastRunMonth === currentMonthStr) return; // 今月は実行済み

  const currentRecords = JSON.parse(localStorage.getItem('kakeibo-records') || '[]');
  const newRecords = [];

  autoAddItems.forEach(item => {
    const recordId = `auto_${item.id}_${currentMonthStr}`;
    const alreadyExists = currentRecords.some(r => r.id === recordId);
    if (!alreadyExists) {
      newRecords.push({
        id: recordId,
        date: `${currentMonthStr}-01`,
        type: item.type,
        name: `${item.name} (自動)`,
        amount: item.amount,
        category: '固定費',
        recurringId: item.id,
      });
    }
  });

  if (newRecords.length > 0) {
    const updatedRecords = [...newRecords, ...currentRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem('kakeibo-records', JSON.stringify(updatedRecords));
    records.value = updatedRecords; // 画面に反映
  }

  localStorage.setItem('kakeibo-last-auto-add-month', currentMonthStr);
};


onMounted(() => {
  // まず自動登録を実行
  runAutoAddRecurringItems();

  // その後、データを読み込む
  const recData = localStorage.getItem('kakeibo-records');
  if (recData) records.value = JSON.parse(recData).sort((a, b) => new Date(b.date) - new Date(a.date));

  const catData = localStorage.getItem('kakeibo-categories');
  if (catData) {
    categories.value = JSON.parse(catData);
  } else {
    // デフォルトカテゴリを設定
    categories.value = {
      支出: [
        { name: '食費', color: '#FF6384' }, { name: '交通費', color: '#36A2EB' },
        { name: '日用品', color: '#FFCE56' }, { name: 'その他', color: '#C9CBCF' },
      ],
      収入: [ { name: '給与', color: '#9966FF' }, { name: '副業', color: '#FF9F40' } ]
    };
  }
  // 固定費カテゴリがなければ追加
  if (!categories.value.支出.some(c => c.name === '固定費')) {
    categories.value.支出.push({ name: '固定費', color: '#4BC0C0' });
  }

  const savedGoal = localStorage.getItem('kakeibo-goal');
  if (savedGoal) goalAmount.value = Number(savedGoal);

  username.value = localStorage.getItem('kakeibo-username') || '';
});

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

const updateGoalAmount = (newGoal) => {
  goalAmount.value = newGoal;
  localStorage.setItem('kakeibo-goal', newGoal);
};

const displayReward = () => {
  if (currentAchievementRate.value >= 100) {
    showRewardOverlay.value = true;
    setTimeout(() => {
      showRewardOverlay.value = false;
    }, 3000);
  }
};
</script>

<style scoped>
/* スタイルは変更なし */
/* ...（既存のスタイルをそのままコピー）... */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: calc(72px + 2rem) 2rem 2rem;
  min-height: calc(100vh - 72px);
  box-sizing: border-box;
  position: relative; /* オーバーレイの基準点として設定 */
}

.main-content-row {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
  margin-bottom: 2rem;
  justify-content: center;
}

.content-left {
  flex: 1;
  min-width: 300px;
  margin-top: 0;
}

.card-container {
  background-color: #fff; /* 親の白い枠 */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0; /* 子のcard-innerがパディングを持つ */
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  box-sizing: border-box;
  display: flex;
  flex-direction: column; /* 子要素を縦に並べる */
  overflow: hidden; /* 角丸を効かせる */
}

/* 各セクションを囲む白い枠の共通スタイル */
.card-inner {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0; /* 基本は下線あり */
  padding: 1.5rem; /* 内部パディング */
  box-sizing: border-box;
}
.card-inner:last-of-type { /* 最後の子要素の下線はなし */
  border-bottom: none;
}

/* インコの写真とコメントのブロック */
.character-block {
  /* .card-innerの共通スタイルを継承しつつ、必要に応じて調整 */
}

/* くじ引きのブロックのスタイル */
.kuji-block {
  border-top: 1px solid #e0e0e0; /* 上の要素との間に線を追加 */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* GoalTrackerをカードとして大きく表示するためのスタイル */
.goal-tracker-full-block {
  border-top: 1px solid #e0e0e0; /* 上の要素との間に線を追加 */
  flex-grow: 1; /* 残りのスペースを埋める */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem; /* GoalTrackerコンポーネントが直接持つpaddingと重複しないように調整 */
}

/* ご褒美ボタンエリアのスタイル */
.reward-button-area {
  margin-top: 1.5rem;
  text-align: center;
  width: 100%;
}

.reward-button {
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
  background-color: #ff9800; /* オレンジ色 */
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reward-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.reward-button:hover:not(:disabled) {
  background-color: #f57c00;
}

.reward-hint {
  font-size: 0.9em;
  color: #666;
  margin-top: 0.8rem;
}


/* CharacterSectionのマージンとボーダーを調整 */
:deep(.character-section) {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 0;
  padding-bottom: 1.5rem; /* インコと目標金額の間のパディング */
  border-bottom: 1px solid #e0e0e0; /* インコと目標金額の間に線 */
}
/* CharacterSection内のpタグのマージンも調整 */
:deep(.character-section p) {
    margin-top: 0.5rem;
    margin-bottom: 0;
}

.content-right {
  flex: 1;
  min-width: 300px;
  margin-top: 0;
}

/* SummaryAreaを囲む新しいカードコンテナのスタイル */
.summary-chart-container {
  /* ここでcontent-rightのスタイルを上書きまたは追加調整 */
  display: flex;
  flex-direction: column;
  padding: 1.5rem; /* SummaryArea内部のpaddingと競合しないように調整 */
}

/* SummaryAreaコンポーネント自体のスタイル調整 */
.summary-area-component {
  /* 親のsummary-chart-containerがpaddingを持つため、ここでpaddingをリセット */
  padding: 0;
  border: none;
  box-shadow: none;
  margin-bottom: 0;
}


/* :deep()スタイルの一部は.card-inner内で調整するため、ここでは削除または上書き */
:deep(.season-display),
:deep(.monthly-rating) {
  text-align: center;
  margin-top: 0;
  margin-bottom: 0;
}

/* Kujiコンポーネント内部のスタイルを調整 */
:deep(.kuji-area) {
  margin-top: 0;
  text-align: center;
  width: 100%;
  padding: 0;
}
:deep(.kuji-area h2) {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}
:deep(.kuji-area button) {
  background-color: #ff6666;
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
:deep(.kuji-area button:hover) {
  background-color: #e53935;
}
:deep(.result-area) {
  margin-top: 1rem;
}
:deep(.result-text) {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
:deep(.result-img) {
  width: 100px;
  height: 100px;
  object-fit: contain;
}


@media (max-width: 768px) {
  .main-content-row {
    flex-direction: column;
    align-items: center;
  }

  .content-left,
  .content-right {
    width: 100%;
    min-width: unset;
  }

  /* card-inner のモバイルでのパディング調整 */
  .card-inner {
    padding: 1rem;
  }
  /* CharacterSectionはcard-innerのパディングを使うのでpaddingはリセット */
  :deep(.character-section) {
    padding: 0;
    padding-bottom: 1rem;
  }
  .kuji-block {
    padding: 1rem;
  }

  /* summary-chart-container のモバイル調整 */
  .summary-chart-container {
    padding: 1rem;
  }
}

/* ご褒美オーバーレイのスタイル */
.reward-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8); /* 半透明の黒背景 */
  background-image: url('/saito.png'); /* 指定された画像 */
  background-size: contain; /* 画像を中央に収まるように表示 */
  background-repeat: no-repeat;
  background-position: center;
  z-index: 9999; /* 他の要素より手前に表示 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* トランジション（フェードイン・アウト） */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>