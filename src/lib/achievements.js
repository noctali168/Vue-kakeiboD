// src/lib/achievements.js

// アチーブメントの定義リスト
// condition 関数は、FormPage.vue から渡されるデータオブジェクトを引数に取る
export const achievements = [
  {
    id: 'first_record',
    name: 'はじめの一歩',
    description: '最初の記録をつけました！',
    icon: '👟',
    condition: ({ records }) => records.length >= 1
  },
  {
    id: 'ten_records',
    name: '記録の達人',
    description: '記録回数が10回に到達しました！',
    icon: '✍️',
    condition: ({ records }) => records.length >= 10
  },
  {
    id: 'fifty_records',
    name: '記録の巨匠',
    description: '記録回数が50回に到達しました！',
    icon: '📜',
    condition: ({ records }) => records.length >= 50
  },
  {
    id: 'first_income',
    name: '初めての収入',
    description: '初めて収入を記録しました。',
    icon: '💰',
    condition: ({ records }) => records.some(r => r.type === '収入')
  },
  {
    id: 'first_goal_achieved',
    name: '目標達成！',
    description: '初めて月の収支目標を100%達成しました！',
    icon: '🎯',
    condition: ({ currentAchievementRate }) => currentAchievementRate >= 100
  },
  {
    id: 'goal_overachieved',
    name: '驚異的な成果',
    description: '月の収支目標を150%以上達成しました！',
    icon: '🚀',
    condition: ({ currentAchievementRate }) => currentAchievementRate >= 150
  },
  {
    id: 'category_creator',
    name: 'カスタマイザー',
    description: '新しいカテゴリを初めて作成しました。',
    icon: '🎨',
    condition: ({ categories }) => {
      const defaultExpense = ['食費', '交通費', '日用品', '固定費', 'その他'];
      const defaultIncome = ['給与', '副業'];
      const hasNewExpense = categories.支出.some(c => !defaultExpense.includes(c.name));
      const hasNewIncome = categories.収入.some(c => !defaultIncome.includes(c.name));
      return hasNewExpense || hasNewIncome;
    }
  },
  {
    id: 'recurring_setter',
    name: '効率化の鬼',
    description: '定期的な項目を初めて登録しました。',
    icon: '⚙️',
    condition: ({ recurringItems }) => recurringItems.length >= 1
  },
  {
    id: 'three_days_streak',
    name: '三日坊主からの卒業',
    description: '3日連続で記録をつけました！',
    icon: '📅',
    condition: ({ records }) => {
        if (records.length < 3) return false;
        // 日付の重複を除き、時系列にソート
        const dates = [...new Set(records.map(r => r.date))]
            .map(d => new Date(d).getTime())
            .sort((a, b) => a - b);
        if (dates.length < 3) return false;

        const oneDay = 24 * 60 * 60 * 1000;
        // 連続する3日間が存在するかチェック
        for (let i = 0; i <= dates.length - 3; i++) {
            const day1 = dates[i];
            const day2 = dates[i+1];
            const day3 = dates[i+2];
            if (day2 - day1 === oneDay && day3 - day2 === oneDay) {
                return true;
            }
        }
        return false;
    }
  }
];