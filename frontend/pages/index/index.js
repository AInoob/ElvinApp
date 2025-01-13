import { getTodayGreeting } from '../../services/api';
Page({
    data: {
        greeting: null,
        loading: true,
        error: null,
        isMorning: false,
        today: new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    },
    onLoad() {
        this.checkMorningTime();
        if (this.data.isMorning) {
            this.loadTodayGreeting();
        }
    },
    onShow() {
        this.checkMorningTime();
        if (this.data.isMorning && !this.data.greeting) {
            this.loadTodayGreeting();
        }
    },
    onPullDownRefresh() {
        this.checkMorningTime();
        if (this.data.isMorning) {
            this.loadTodayGreeting();
        }
        else {
            wx.stopPullDownRefresh();
        }
    },
    onShareAppMessage() {
        return {
            title: '传统节日问候',
            path: '/pages/index/index'
        };
    },
    checkMorningTime() {
        const now = new Date();
        const hour = now.getHours();
        const isMorning = hour >= 5 && hour < 12;
        this.setData({
            isMorning,
            error: isMorning ? null : '早上5点到12点才能查看问候哦',
            loading: false
        });
    },
    async loadTodayGreeting() {
        if (!this.data.isMorning) {
            return;
        }
        this.setData({ loading: true, error: null });
        try {
            const greeting = await getTodayGreeting();
            this.setData({
                greeting,
                loading: false,
                error: null
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : '加载失败';
            console.error('Failed to load greeting:', error);
            this.setData({
                error: errorMessage,
                loading: false,
                greeting: null
            });
        }
        finally {
            wx.stopPullDownRefresh();
        }
    }
});
