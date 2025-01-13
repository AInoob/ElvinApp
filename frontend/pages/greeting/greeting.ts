import { generateGreeting } from '../../services/api';

type IData = {
  type: 'dynamic-text-image' | 'video';
  occasionType: 'solar-term' | 'traditional-holiday';
  generating: boolean;
}

interface ICustom {
  generateGreeting: () => Promise<void>;
  onTypeChange: (e: WechatMiniprogram.CustomEvent<{ value: 'dynamic-text-image' | 'video' }>) => void;
  onOccasionTypeChange: (e: WechatMiniprogram.CustomEvent<{ value: 'solar-term' | 'traditional-holiday' }>) => void;
}

Page<IData, ICustom>({
  data: {
    type: 'dynamic-text-image',
    occasionType: 'solar-term',
    generating: false
  },

  async generateGreeting() {
    if (this.data.generating) return;

    this.setData({ generating: true });
    try {
      await generateGreeting(this.data.type, this.data.occasionType);
      wx.showToast({
        title: '生成成功',
        icon: 'success'
      });
      // Navigate back to index page to show the new greeting
      wx.navigateBack();
    } catch (error) {
      console.error('Failed to generate greeting:', error);
      wx.showToast({
        title: '生成失败',
        icon: 'error'
      });
    } finally {
      this.setData({ generating: false });
    }
  },

  onTypeChange(e: WechatMiniprogram.CustomEvent<{ value: 'dynamic-text-image' | 'video' }>) {
    this.setData({
      type: e.detail.value
    });
  },

  onOccasionTypeChange(e: WechatMiniprogram.CustomEvent<{ value: 'solar-term' | 'traditional-holiday' }>) {
    this.setData({
      occasionType: e.detail.value
    });
  }
});
