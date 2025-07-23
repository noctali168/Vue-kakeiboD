<template>
  <div class="component-container">
    <div class="header">
      <div class="month-navigation">
        <button @click="prevMonth" class="nav-button">＜</button>
        <div class="month-year-inputs">
          <input type="number" v-model.number="selectedYear" class="year-input" min="2000" max="2100" />年
          <input type="number" v-model.number="selectedMonth" class="month-input" min="1" max="12" />月
        </div>
        <button @click="nextMonth" class="nav-button">＞</button>
      </div>

      <h3>{{ displayChartType === 'pie' ? selectedYear + '年' + selectedMonth + '月の収支内訳' : '直近6ヶ月の収支推移' }}</h3>

      <div class="toggle-buttons chart-type-selector">
        <button @click="displayChartType = 'pie'" :class="{ active: displayChartType === 'pie' }">円グラフ表示</button>
        <button @click="displayChartType = 'bar'" :class="{ active: displayChartType === 'bar' }">棒グラフ表示</button>
      </div>
    </div>

    <div v-if="displayChartType === 'pie'" class="charts-container">
      <div class="chart-section">
        <h4>支出の内訳</h4>
        <div class="chart-wrapper">
          <Pie v-if="expenseChartData.labels.length > 0" :data="expenseChartData" :options="baseChartOptions" />
          <p v-else>今月の支出データがありません。</p>
        </div>
      </div>

      <div class="chart-section">
        <h4>収入の内訳</h4>
        <div class="chart-wrapper">
          <Pie v-if="incomeChartData.labels.length > 0" :data="incomeChartData" :options="baseChartOptions" />
          <p v-else>今月の収入データがありません。</p>
        </div>
      </div>
    </div>

    <div v-else-if="displayChartType === 'bar'" class="bar-chart-container">
      <div class="chart-wrapper large-chart-wrapper">
        <Bar v-if="barChartData.labels.length > 0" :data="barChartData" :options="barChartOptions" />
        <p v-else>データがありません。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Pie, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
);

const props = defineProps({
  categories: { type: Object, required: true },
  records: { type: Array, required: true }, // ★変更点★ records全体を受け取る
});

// SummaryArea内部で年月を管理
const now = new Date();
const selectedYear = ref(now.getFullYear());
const selectedMonth = ref(now.getMonth() + 1);

// 月を変更する関数 (SummaryArea内部用)
const prevMonth = () => {
  if (selectedMonth.value === 1) {
    selectedMonth.value = 12;
    selectedYear.value -= 1;
  } else {
    selectedMonth.value -= 1;
  }
};

const nextMonth = () => {
  if (selectedMonth.value === 12) {
    selectedMonth.value = 1;
    selectedYear.value += 1;
  } else {
    selectedMonth.value += 1;
  }
};


const displayChartType = ref('bar'); // 初期表示は棒グラフのまま

// ★追加★ グラフ表示用のフィルタリング済みレコード
const filteredRecordsForGraphMonth = computed(() => {
  const ym = `${selectedYear.value}-${String(selectedMonth.value).padStart(2, '0')}`;
  return props.records.filter(r => r.date.startsWith(ym));
});

// --------- 円グラフデータ (支出) - filteredRecordsForGraphMonthを使用 ---------
const expenseChartData = computed(() => {
  const expenses = {};
  filteredRecordsForGraphMonth.value
    .filter(r => r.type === '支出')
    .forEach(record => {
      const category = record.category;
      const amount = Number(record.amount) || 0;
      if (expenses[category]) {
        expenses[category] += amount;
      } else {
        expenses[category] = amount;
      }
    });
  
  const labels = Object.keys(expenses);
  const data = Object.values(expenses);
  const backgroundColors = labels.map(label => {
    const category = props.categories.支出.find(c => c.name === label);
    return category ? category.color : '#cccccc';
  });

  return {
    labels: labels,
    datasets: [{ backgroundColor: backgroundColors, data: data }]
  };
});

// --------- 円グラフデータ (収入) - filteredRecordsForGraphMonthを使用 ---------
const incomeChartData = computed(() => {
  const incomes = {};
  filteredRecordsForGraphMonth.value
    .filter(r => r.type === '収入')
    .forEach(record => {
      const category = record.category;
      const amount = Number(record.amount) || 0;
      if (incomes[category]) {
        incomes[category] += amount;
      } else {
        incomes[category] = amount;
      }
    });
  
  const labels = Object.keys(incomes);
  const data = Object.values(incomes);
  const backgroundColors = labels.map(label => {
    const category = props.categories.収入.find(c => c.name === label);
    return category ? category.color : '#cccccc';
  });

  return {
    labels: labels,
    datasets: [{ backgroundColor: backgroundColors, data: data }]
  };
});

// 円グラフの共通オプション
const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#2c3e50',
        font: {
          size: 12
        }
      }
    },
    tooltip: {},
    title: { display: false }
  }
};

// --------- 棒グラフ用ロジック ---------
// ★修正★ 選択された年月に基づいて過去の月を取得
function getPastMonths(count = 6) {
  const result = [];
  const baseDate = new Date(selectedYear.value, selectedMonth.value - 1, 1); // SummaryArea内部の年月を基準に
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    result.push(`${y}-${m.toString().padStart(2, '0')}`);
  }
  return result;
}

const barChartData = computed(() => {
  const months = getPastMonths(6);
  const spendData = [];
  const incomeData = [];

  months.forEach(month => {
    const filtered = props.records.filter(r => r.date.startsWith(month)); // records全体からフィルタリング
    const monthExpense = filtered
      .filter(r => r.type === '支出')
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const monthIncome = filtered
      .filter(r => r.type === '収入')
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    spendData.push(monthExpense);
    incomeData.push(monthIncome);
  });

  return {
    labels: months,
    datasets: [
      {
        label: '支出',
        backgroundColor: '#FF8A80',
        data: spendData,
      },
      {
        label: '収入',
        backgroundColor: '#80CBC4',
        data: incomeData,
      },
    ],
  };
});

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => value.toLocaleString() + ' 円',
      },
    },
  },
};
</script>

<style scoped>
.component-container {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}
.header {
  text-align: center;
  margin-bottom: 1.5rem;
}
h3 {
  margin: 0;
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

/* 月切り替えナビゲーションのスタイル */
.month-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: bold;
}

.month-navigation .nav-button {
  background-color: #f0f2f5;
  color: #2c3e50;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: normal;
  font-size: 1rem;
}
.month-navigation .nav-button:hover {
  background-color: #e0e0e0;
}
/* 年月入力フィールドのスタイル */
.month-year-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.month-year-inputs input {
  width: 60px; /* 年入力の幅 */
  text-align: center;
  padding: 0.3rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  color: #2c3e50; /* 文字色を濃く */
  background-color: #f0f2f5; /* 背景色を明るく */
}
.month-year-inputs .month-input {
  width: 40px; /* 月入力の幅 */
}


/* グラフタイプ選択ボタン */
.toggle-buttons {
  display: flex;
  border: 1px solid #0d6efd;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
  margin: 0 auto 1.5rem; /* 中央寄せと下マージン */
}
.toggle-buttons button {
  padding: 0.5rem 1rem;
  background-color: #fff;
  color: #0d6efd;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  flex-grow: 1;
}
.toggle-buttons button.active {
  background-color: #0d6efd;
  color: white;
}
.toggle-buttons button:not(.active):hover {
  background-color: #e7f1ff;
}

/* 円グラフのコンテナ */
.charts-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.chart-section {
  text-align: center;
  flex: 1;
  min-width: 280px;
  max-width: 400px;
}

.chart-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

/* 各グラフのラッパー */
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 250px;
  margin: auto;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}

/* 棒グラフ専用のコンテナ */
.bar-chart-container {
  width: 100%;
  padding-top: 1rem;
}

.large-chart-wrapper {
  height: 350px;
}

p {
  text-align: center;
  margin-top: 1rem;
  color: #888;
  font-size: 0.9em;
}
</style>

<style lang="css">
/* vue-chartjs の Canvas 要素に直接スタイルを適用 */
.chart-wrapper canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>