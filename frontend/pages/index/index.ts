import { getTodayGreeting } from '../../services/api';
import { GeneratedGreeting } from '../../typings/types/index';

type IData = {
  greeting: GeneratedGreeting | null;
  loading: boolean;
  today: string;
  error: string | null;
}

interface ICustom {
  loadTodayGreeting: () => Promise<void>;
}

Page<IData, ICustom>({
  data: {
    greeting: null,
    loading: true,
    error: null,
    today: new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  },

  onLoad() {
    this.loadTodayGreeting();
  },

  onShow() {
    if (!this.data.greeting) {
      this.loadTodayGreeting();
    }
  },

  onPullDownRefresh() {
    this.loadTodayGreeting();
  },

  onShareAppMessage() {
    return {
      title: '传统节日问候',
      path: '/pages/index/index'
    };
  },

  async loadTodayGreeting() {
    this.setData({ loading: true, error: null });
    try {
      const greeting = await getTodayGreeting();
      this.setData({
        greeting,
        loading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载失败';
      console.error('Failed to load greeting:', error);
      this.setData({ 
        error: errorMessage,
        loading: false,
        greeting: null
      });
    } finally {
      wx.stopPullDownRefresh();
    }
  }
});
