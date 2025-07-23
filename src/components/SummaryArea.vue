<template>
  <div class="component-container">
    <div class="header">
      <h3>{{ currentMonthYear }}の収支グラフ</h3>

      <div class="chart-controls">
        <div class="toggle-buttons">
          <button @click="chartMode = '支出'" :class="{ active: chartMode === '支出' && displayChartType === 'pie' }">支出 (円グラフ)</button>
          <button @click="chartMode = '収入'" :class="{ active: chartMode === '収入' && displayChartType === 'pie' }">収入 (円グラフ)</button>
        </div>

        <div class="toggle-buttons" style="margin-top: 1rem;">
          <button @click="displayChartType = 'pie'" :class="{ active: displayChartType === 'pie' }">円グラフ表示</button>
          <button @click="displayChartType = 'bar'" :class="{ active: displayChartType === 'bar' }">棒グラフ表示</button>
        </div>
      </div>
    </div>

    <div class="chart-wrapper">
      <Pie
        v-if="displayChartType === 'pie' && pieChartData.labels.length > 0"
        :data="pieChartData"
        :options="baseChartOptions"
      />
      <Bar
        v-else-if="displayChartType === 'bar' && barChartData.labels.length > 0"
        :data="barChartData"
        :options="barChartOptions"
      />
      <p v-else>データがありません。</p>
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
  CategoryScale, // Bar Chart用に追加
  LinearScale,   // Bar Chart用に追加
  BarElement     // Bar Chart用に追加
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
  expenseData: { type: Object, required: true },
  incomeData: { type: Object, required: true },
  categories: { type: Object, required: true },
  records: { type: Array, required: true }, // 追加：全取引履歴
});

const chartMode = ref('支出'); // 支出 or 収入 の円グラフ切替用
// ★ここを変更します★
const displayChartType = ref('bar'); // 'pie' or 'bar'

const currentMonthYear = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return `${year}年${month}月`;
});

// --------- 円グラフ用 computed ---------
const pieChartData = computed(() => {
  const isExpense = chartMode.value === '支出';
  const dataObject = isExpense ? props.expenseData : props.incomeData;
  const categoryList = isExpense ? props.categories.支出 : props.categories.収入;

  const labels = Object.keys(dataObject);
  const data = Object.values(dataObject);

  const backgroundColors = labels.map(label => {
    const category = categoryList.find(c => c.name === label);
    return category ? category.color : '#cccccc';
  });

  return {
    labels,
    datasets: [{ backgroundColor: backgroundColors, data }]
  };
});

// --------- 棒グラフ用ロジック ---------
function getPastMonths(count = 6) {
  const result = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    result.push(`${y}-${m.toString().padStart(2, '0')}`);
  }
  return result;
}

// src/components/SummaryArea.vue
// ... (中略) ...

const barChartData = computed(() => {
  const months = getPastMonths(6);
  const spendData = [];
  const incomeData = [];

  months.forEach(month => {
    const filtered = props.records.filter(r => r.date.startsWith(month));
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
        backgroundColor: '#FF8A80', // ★より鮮やかな赤に変更★
        data: spendData,
      },
      {
        label: '収入',
        backgroundColor: '#80CBC4', // ★より鮮やかな緑に変更★
        data: incomeData,
      },
    ],
  };
});

// ... (後略) ...

// 円グラフのオプション
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
    tooltip: {}, // ツールチップのカスタマイズを削除し、デフォルトに戻す
    title: { display: false }
  }
};

// 棒グラフのオプション
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
  display: flex;
  flex-direction: column;
  align-items: center; /* 中央寄せ */
}
h3 {
  margin: 0;
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1rem; /* グラフコントロールとの間隔 */
  /* ★追加★ グラフタイトルを強調 */
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

/* グラフコントロール（ボタン群） */
.chart-controls {
  display: flex;
  flex-direction: column; /* 縦に並べる */
  gap: 1rem; /* ボタン群の間のスペース */
  margin-bottom: 1.5rem; /* グラフとの間隔 */
  width: 100%; /* 親要素に合わせる */
  align-items: center; /* 中央寄せ */
}

.toggle-buttons {
  display: flex;
  border: 1px solid #0d6efd;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content; /* コンテンツに合わせて幅を調整 */
}
.toggle-buttons button {
  padding: 0.5rem 1rem;
  background-color: #fff;
  color: #0d6efd;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  flex-grow: 1; /* ボタンが均等に幅を占めるように */
}
.toggle-buttons button.active {
  background-color: #0d6efd;
  color: white;
}
.toggle-buttons button:not(.active):hover {
  background-color: #e7f1ff;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 300px; /* 以前のChart-sectionと同じ高さに設定 */
  margin: auto;
  /* ★追加★ グラフ自体に少し影をつけ、立体感を出す */
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  border-radius: 8px; /* 角丸にする */
  overflow: hidden; /* グラフがはみ出さないように */
}
p {
  text-align: center;
  margin-top: 1rem; /* 元々は2remでしたが、chart-wrapperに影をつけたので少し詰める */
  color: #888;
  font-size: 0.9em;
}
</style>