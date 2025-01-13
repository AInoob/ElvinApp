export type SolarTerm = {
  id: string;
  name: string;
  date: string;
  description: string | null;
}

export type TraditionalHoliday = {
  id: string;
  name: string;
  date: string;
  description: string | null;
}

export type GreetingTemplate = {
  id: string;
  type: 'video' | 'dynamic-text-image';
  occasionType: 'solar-term' | 'traditional-holiday';
  templateContent: string;
  variables: string | null;
}

export type GeneratedGreeting = {
  id: string;
  date: string;
  occasionId: string;
  occasionType: string;
  content: string;
  type: string;
}
