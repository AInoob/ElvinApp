const app = getApp();
function isMorningTime() {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 5 && hour < 12; // 早上5点到12点
}
export async function getTodayGreeting() {
    if (!isMorningTime()) {
        throw new Error('不在早上时段');
    }
    try {
        const res = await new Promise((resolve, reject) => {
            wx.request({
                url: `${app.globalData.apiBaseUrl}/api/greetings/today`,
                method: 'GET',
                success: resolve,
                fail: reject
            });
        });
        if (res.statusCode !== 200) {
            throw new Error('获取问候失败');
        }
        return res.data;
    }
    catch (error) {
        console.error(`API Error - getTodayGreeting: ${error}`);
        throw error;
    }
}
export async function generateGreeting(type, occasionType) {
    if (!isMorningTime()) {
        throw new Error('不在早上时段');
    }
    try {
        const res = await new Promise((resolve, reject) => {
            wx.request({
                url: `${app.globalData.apiBaseUrl}/api/greetings/generate`,
                method: 'POST',
                data: { type, occasionType },
                success: resolve,
                fail: reject
            });
        });
        if (res.statusCode !== 200) {
            throw new Error('生成问候失败');
        }
        return res.data;
    }
    catch (error) {
        console.error(`API Error - generateGreeting: ${error}`);
        throw error;
    }
}
export async function getTemplates() {
    try {
        const res = await new Promise((resolve, reject) => {
            wx.request({
                url: `${app.globalData.apiBaseUrl}/api/greetings/templates`,
                method: 'GET',
                success: resolve,
                fail: reject
            });
        });
        if (res.statusCode !== 200) {
            throw new Error('获取模板失败');
        }
        return res.data;
    }
    catch (error) {
        console.error(`API Error - getTemplates: ${error}`);
        throw error;
    }
}
export async function getTodaySpecialDates() {
    try {
        const res = await new Promise((resolve, reject) => {
            wx.request({
                url: `${app.globalData.apiBaseUrl}/api/calendar/today`,
                method: 'GET',
                success: resolve,
                fail: reject
            });
        });
        if (res.statusCode !== 200) {
            throw new Error('获取日期信息失败');
        }
        return res.data;
    }
    catch (error) {
        console.error(`API Error - getTodaySpecialDates: ${error}`);
        throw error;
    }
}
