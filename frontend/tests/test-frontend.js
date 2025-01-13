// Test script for frontend functionality
import fetch from 'node-fetch';
import { base64Encode } from './utils/base64.js';

const API_BASE_URL = 'http://localhost:8080';
const API_CREDENTIALS = 'Basic ' + base64Encode('user:bfa7173496abb193cecf4a81d4b6fca4');

const testFrontend = async () => {
  let hasErrors = false;

  console.log('Starting API Integration Tests\n');

  // Get current time and expected prefix
  const now = new Date();
  const hour = now.getHours();
  const expectedPrefix = (() => {
    if (hour >= 5 && hour < 12) return "早上好！";
    if (hour >= 12 && hour < 14) return "中午好！";
    if (hour >= 14 && hour < 18) return "下午好！";
    if (hour >= 18 && hour < 24) return "晚上好！";
    return "夜深了！";
  })();

  console.log('Test Environment:');
  console.log(`Current Time: ${now.toLocaleTimeString()}`);
  console.log(`Expected Greeting Prefix: ${expectedPrefix}\n`);

  try {
    // 1. Test /api/calendar/today endpoint
    console.log('Testing GET /api/calendar/today...');
    const calendarResponse = await fetch(`${API_BASE_URL}/api/calendar/today`, {
      headers: {
        'Authorization': API_CREDENTIALS
      }
    });
    if (!calendarResponse.ok) {
      throw new Error(`Calendar API failed: ${calendarResponse.status} ${calendarResponse.statusText}`);
    }
    const calendarData = await calendarResponse.json();
    console.log('Today\'s Special Dates:');
    console.log(`- Solar Term: ${calendarData.solar_term?.name || 'None'}`);
    console.log(`- Traditional Holiday: ${calendarData.traditional_holiday?.name || 'None'}\n`);

    // 2. Test /api/greetings/templates endpoint
    console.log('Testing GET /api/greetings/templates...');
    const templatesResponse = await fetch(`${API_BASE_URL}/api/greetings/templates`, {
      headers: {
        'Authorization': API_CREDENTIALS
      }
    });
    if (!templatesResponse.ok) {
      throw new Error(`Templates API failed: ${templatesResponse.status} ${templatesResponse.statusText}`);
    }
    const templates = await templatesResponse.json();
    console.log('Available Templates:');
    templates.forEach(template => {
      console.log(`- ${template.type} for ${template.occasionType}`);
    });
    console.log('');

    // 3. Test /api/greetings/generate endpoint for both types and occasions
    const testCases = [
      { type: 'dynamic-text-image', occasionType: 'solar-term' },
      { type: 'video', occasionType: 'solar-term' },
      { type: 'dynamic-text-image', occasionType: 'traditional-holiday' },
      { type: 'video', occasionType: 'traditional-holiday' }
    ];

    for (const testCase of testCases) {
      console.log(`Testing POST /api/greetings/generate with ${testCase.type} for ${testCase.occasionType}...`);
      const greetingResponse = await fetch(
        `${API_BASE_URL}/api/greetings/generate?type=${testCase.type}&occasionType=${testCase.occasionType}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': API_CREDENTIALS
          }
        }
      );

      // Handle non-200 responses
      if (!greetingResponse.ok) {
        const errorText = await greetingResponse.text();
        console.error('Error Response:', errorText);
        throw new Error(`Greeting generation failed: ${greetingResponse.status} ${greetingResponse.statusText}`);
      }

      // Parse and validate response
      const greetingData = await greetingResponse.json();
      if (!greetingData || typeof greetingData !== 'object') {
        throw new Error('Invalid greeting data format');
      }

      console.log('\nGenerated Greeting:');
      console.log('Type:', greetingData.type);
      console.log('Content:', greetingData.content);

      // Verify time-based prefix
      if (greetingData.content) {
        const hasCorrectPrefix = greetingData.content.startsWith(expectedPrefix);
        console.log('\nTime-based Prefix Verification:');
        console.log('Expected:', expectedPrefix);
        console.log('Actual:', greetingData.content);
        console.log('Prefix matches:', hasCorrectPrefix ? '✓ Yes' : '✗ No');

        if (!hasCorrectPrefix) {
          console.warn('\nWarning: Generated greeting does not have expected time-based prefix');
          hasErrors = true;
        }
      } else {
        throw new Error('Generated greeting content is empty or undefined');
      }
      console.log('\n---\n');
    }

    if (hasErrors) {
      console.warn('\nTests completed with warnings ⚠️');
      process.exit(1);
    } else {
      console.log('\nAll API tests completed successfully! ✓');
      process.exit(0);
    }
  } catch (error) {
    console.error('\nTest Failed:', error.message);
    if (error.stack) {
      console.error('\nError Stack:', error.stack);
    }
    process.exit(1);
  }
};

// Run tests
testFrontend().catch(error => {
  console.error('Test script failed:', error);
  process.exit(1);
});
