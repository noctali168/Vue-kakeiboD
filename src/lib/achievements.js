// アチーブメントの定義
export const achievements = [
  {
    id: 'first_step',
    name: 'はじめの一歩',
    description: '最初の収支を記録した',
    icon: '🚀',
    condition: ({ records }) => records.length > 0,
  },
  {
    id: 'first_income',
    name: '初収入！',
    description: '初めて収入を記録した',
    icon: '💰',
    condition: ({ records }) => records.some(r => r.type === '収入'),
  },
  {
    id: 'first_recurring',
    name: '計画性の第一歩',
    description: '初めて定期的な項目を登録した',
    icon: '📅',
    condition: ({ recurringItems }) => recurringItems.length > 0,
  },
  {
    id: 'customize_category',
    name: '自分色に染め上げろ',
    description: 'カテゴリを自分で追加した',
    icon: '🎨',
    condition: ({ categories }) => {
        const defaultExpense = ['食費', '交通費', '日用品', 'その他', '固定費'];
        const defaultIncome = ['給与', '副業'];
        const hasCustomExpense = categories.支出.some(c => !defaultExpense.includes(c.name));
        const hasCustomIncome = categories.収入.some(c => !defaultIncome.includes(c.name));
        return hasCustomExpense || hasCustomIncome;
    }
  },
  {
    id: 'goal_achieved',
    name: '目標達成！',
    description: '初めて月の目標収支を達成した',
    icon: '🏆',
    condition: ({ currentAchievementRate }) => currentAchievementRate >= 100,
  },
];