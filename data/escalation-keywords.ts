// Crisis Detection Keywords - Data Module
// Contains escalation keywords for medical, crisis, and depression detection

export interface EscalationKeywords {
  medical: string[];
  crisis: string[];
  depression: string[];
}

/**
 * Load escalation keywords for crisis detection
 * @returns EscalationKeywords object with categorized crisis detection terms
 */
export function loadEscalationKeywords(): EscalationKeywords {
  return {
    medical: [
      "chest pain",
      "can't breathe",
      "stroke",
      "heart attack",
      "severe pain",
      "emergency",
      "ambulance",
      "hospital",
      "bleeding",
      "unconscious",
      "can't move",
      "numbness",
      "dizziness",
      "fainting",
      "severe headache",
      "difficulty breathing",
      "rapid heartbeat",
      "severe nausea",
      "vomiting blood",
      "severe abdominal pain"
    ],
    crisis: [
      "end it all",
      "not worth living",
      "suicide",
      "kill myself",
      "end my life",
      "no point",
      "give up",
      "hopeless",
      "helpless",
      "desperate",
      "want to die",
      "better off dead",
      "no reason to live",
      "life is meaningless",
      "can't go on",
      "end everything",
      "suicidal thoughts",
      "self harm",
      "hurt myself",
      "no way out"
    ],
    depression: [
      "hopeless",
      "no meaning",
      "worthless",
      "empty",
      "sad",
      "depressed",
      "lonely",
      "isolated",
      "no purpose",
      "no reason",
      "miserable",
      "unhappy",
      "down",
      "blue",
      "gloomy",
      "despair",
      "grief",
      "sorrow",
      "melancholy",
      "dejected"
    ]
  };
}
