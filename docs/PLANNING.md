# WeChat Mini Program - Traditional Greetings Generator

## Core Features
1. Daily Greeting Generation
   - Automatically generate greetings every morning
   - Support both video and dynamic text-image formats
   - Base greetings on either solar terms (节气) or traditional holidays (传统节日)

2. Data Requirements
   - Solar Terms Calendar (24 solar terms)
   - Traditional Chinese Holidays Calendar
   - Greeting Templates Database
   - Generated Greetings History

## API Endpoints

### Calendar APIs
```
GET /api/calendar/today
- Returns today's special dates (solar terms and/or traditional holidays)

GET /api/calendar/solar-terms
- Returns list of all solar terms with dates

GET /api/calendar/traditional-holidays
- Returns list of all traditional holidays with dates
```

### Greeting APIs
```
GET /api/greetings/today
- Returns today's generated greetings

POST /api/greetings/generate
- Generates new greeting based on current date
- Parameters:
  - type: "video" | "dynamic-text-image"
  - occasion: "solar-term" | "traditional-holiday"

GET /api/greetings/templates
- Returns available greeting templates
```

## Database Schema

### SolarTerm
```
- id: string
- name: string (e.g., "立春", "清明")
- date: string (MMDD format)
- description: string
```

### TraditionalHoliday
```
- id: string
- name: string (e.g., "春节", "中秋节")
- date: string (MMDD format)
- description: string
```

### GreetingTemplate
```
- id: string
- type: string ("video" | "dynamic-text-image")
- occasion_type: string ("solar-term" | "traditional-holiday")
- template_content: string
- variables: string[]
```

### GeneratedGreeting
```
- id: string
- date: string
- occasion_id: string
- occasion_type: string
- content: string
- type: string
```

## Technical Stack
- Backend: Spring Boot (Kotlin)
- Database: PostgreSQL
- Frontend: WeChat Mini Program (TypeScript)
- Asset Storage: Cloud Storage for media files

## Implementation Phases
1. Setup project structure and basic environment
2. Implement calendar data and APIs
3. Create greeting templates system
4. Implement greeting generation logic
5. Build WeChat Mini Program frontend
6. Setup automated daily greeting generation
7. Add monitoring and error handling
