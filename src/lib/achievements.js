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
  {
    id: 'reward_getter',
    name: 'バードマン',
    description: '目標を達成してご褒美を手に入れた',
    icon: '🎁',
    condition: () => localStorage.getItem('kakeibo-reward-claimed') === 'true',
  },
  {
    id: 'frugal_master',
    name: '倹約の達人',
    description: '月間支出が月間収入の半分以下になったことがある',
    icon: '🧘',
    condition: ({ records }) => {
      const now = new Date();
      const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const monthlyRecords = records.filter(r => r.date.startsWith(currentMonthStr));
      
      const income = monthlyRecords
        .filter(r => r.type === '収入')
        .reduce((sum, r) => sum + Number(r.amount), 0);
      
      const expense = monthlyRecords
        .filter(r => r.type === '支出')
        .reduce((sum, r) => sum + Number(r.amount), 0);

      return income > 0 && expense > 0 && expense <= income / 2;
    }
  },
  {
    id: 'top_earner',
    name: '稼ぎ頭',
    description: '月間収入が30万円を超えた',
    icon: '💼',
    condition: ({ records }) => {
      const monthlyIncomes = {};
      records.filter(r => r.type === '収入').forEach(r => {
        const month = r.date.substring(0, 7);
        monthlyIncomes[month] = (monthlyIncomes[month] || 0) + Number(r.amount);
      });
      return Object.values(monthlyIncomes).some(total => total >= 300000);
    }
  },
  {
    id: 'consistency_is_power',
    name: '継続は力なり',
    description: '7日間連続で収支を記録した',
    icon: '💪',
    condition: ({ records }) => {
        if (records.length < 7) return false;
        const uniqueDates = [...new Set(records.map(r => r.date))].sort();
        const oneDay = 24 * 60 * 60 * 1000;
        let consecutiveCount = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
            const prevDate = new Date(uniqueDates[i-1]);
            const currentDate = new Date(uniqueDates[i]);
            if ((currentDate.getTime() - prevDate.getTime()) / oneDay === 1) {
                consecutiveCount++;
                if (consecutiveCount >= 7) return true;
            } else {
                consecutiveCount = 1;
            }
        }
        return false;
    }
  },
  {
    id: 'category_collector',
    name: 'カテゴリコレクター',
    description: 'カテゴリの合計数が10個を超えた',
    icon: '📚',
    condition: ({ categories }) => {
        const expenseCount = categories.支出.length;
        const incomeCount = categories.収入.length;
        return (expenseCount + incomeCount) > 10;
    }
  }
];