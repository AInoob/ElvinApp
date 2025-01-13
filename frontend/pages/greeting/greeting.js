import { generateGreeting } from '../../services/api';
Page({
    data: {
        type: 'dynamic-text-image',
        occasionType: 'solar-term',
        generating: false
    },
    async generateGreeting() {
        if (this.data.generating)
            return;
        this.setData({ generating: true });
        try {
            await generateGreeting(this.data.type, this.data.occasionType);
            wx.showToast({
                title: '生成成功',
                icon: 'success'
            });
            // Navigate back to index page to show the new greeting
            wx.navigateBack();
        }
        catch (error) {
            console.error('Failed to generate greeting:', error);
            wx.showToast({
                title: '生成失败',
                icon: 'error'
            });
        }
        finally {
            this.setData({ generating: false });
        }
    },
    onTypeChange(e) {
        this.setData({
            type: e.detail.value
        });
    },
    onOccasionTypeChange(e) {
        this.setData({
            occasionType: e.detail.value
        });
    }
});
