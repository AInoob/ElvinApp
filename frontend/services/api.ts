import { GeneratedGreeting, GreetingTemplate, SolarTerm, TraditionalHoliday } from '../typings/types/index';

const app = getApp<WechatMiniprogram.IAppOption>();

export async function getTodayGreeting(): Promise<GeneratedGreeting | null> {
  try {
    const res = await new Promise<WechatMiniprogram.RequestSuccessCallbackResult<GeneratedGreeting>>((resolve, reject) => {
      wx.request({
        url: `${app.globalData.apiBaseUrl}/api/greetings/today`,
        method: 'GET',
        success: resolve,
        fail: reject
      });
    });

    if (res.statusCode !== 200) {
      throw new Error('无法获取当前问候信息');
    }

    return res.data;
  } catch (error) {
    console.error(`API Error - getTodayGreeting: ${error}`);
    throw error;
  }
}

export async function generateGreeting(
  type: 'video' | 'dynamic-text-image',
  occasionType: 'solar-term' | 'traditional-holiday'
): Promise<GeneratedGreeting> {
  try {
    const res = await new Promise<WechatMiniprogram.RequestSuccessCallbackResult<GeneratedGreeting>>((resolve, reject) => {
      wx.request({
        url: `${app.globalData.apiBaseUrl}/api/greetings/generate`,
        method: 'POST',
        data: { type, occasionType },
        success: resolve,
        fail: reject
      });
    });

    if (res.statusCode !== 200) {
      throw new Error('无法生成新的问候信息');
    }

    return res.data;
  } catch (error) {
    console.error(`API Error - generateGreeting: ${error}`);
    throw error;
  }
}

export async function getTemplates(): Promise<GreetingTemplate[]> {
  try {
    const res = await new Promise<WechatMiniprogram.RequestSuccessCallbackResult<GreetingTemplate[]>>((resolve, reject) => {
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
  } catch (error) {
    console.error(`API Error - getTemplates: ${error}`);
    throw error;
  }
}

export async function getTodaySpecialDates(): Promise<{
  solar_term: SolarTerm | null;
  traditional_holiday: TraditionalHoliday | null;
}> {
  try {
    const res = await new Promise<WechatMiniprogram.RequestSuccessCallbackResult<{
      solar_term: SolarTerm | null;
      traditional_holiday: TraditionalHoliday | null;
    }>>((resolve, reject) => {
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
  } catch (error) {
    console.error(`API Error - getTodaySpecialDates: ${error}`);
    throw error;
  }
}
