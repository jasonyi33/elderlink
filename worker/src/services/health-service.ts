/**
 * Task 3.4d: Health Service Implementation
 * 
 * Functions for health note creation, appointment logic, and proactive health behaviors
 * 
 * Reference:
 * - PRD.md lines 320-357 (Health Integration)
 * - PRD.md lines 337-342 (Sam's Health Behaviors)
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.4
 */

import { SeniorProfile } from '../types';

/**
 * Create a health note from health mentions
 * Format: Natural language + structured mentions
 * PRD line 344-356
 */
export function createHealthNote(
  healthMentions: Array<{
    type: 'symptom' | 'medication' | 'concern';
    text: string;
    context?: string;
    severity?: 'mild' | 'moderate' | 'severe';
    status?: 'adherent' | 'non-adherent';
  }>,
  _profile: SeniorProfile
): {
  timestamp: string;
  source: string;
  note: string;
  mentions: any[];
} {
  console.log('[HEALTH] Creating health note from', healthMentions.length, 'mentions');

  // Build natural language note
  const noteTexts = healthMentions.map(mention => {
    if (mention.type === 'symptom') {
      const severityText = mention.severity ? ` (${mention.severity} severity)` : '';
      const contextText = mention.context ? ` when ${mention.context}` : '';
      return `${mention.text}${contextText}${severityText}`;
    } else if (mention.type === 'medication') {
      const statusText = mention.status === 'adherent' ? 'took' : 'forgot';
      return `${statusText} medication: ${mention.text}`;
    } else {
      return mention.text;
    }
  });

  const naturalLanguage = `Patient reports: ${noteTexts.join('. ')}.`;

  return {
    timestamp: new Date().toISOString(),
    source: 'Sam AI Conversation',
    note: naturalLanguage,
    mentions: healthMentions
  };
}

/**
 * Append health note to profile and truncate to last 10
 * PRD line 1245-1248
 */
export function appendHealthNote(
  profile: SeniorProfile,
  note: {
    timestamp: string;
    source: string;
    note: string;
    mentions: any[];
  }
): SeniorProfile {
  console.log('[HEALTH] Appending health note to profile:', profile.id);

  // Deep copy notes array to avoid reference issues
  const notesCopy = profile.healthData.notes.map(n => ({...n}));
  notesCopy.push(note);

  // Sort by timestamp (most recent last) then truncate to last 10
  if (notesCopy.length > 10) {
    notesCopy.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
  
  // Truncate to last 10 notes (removes oldest by timestamp if > 10)
  const truncatedNotes = notesCopy.length > 10 ? notesCopy.slice(-10) : notesCopy;
  
  if (notesCopy.length > 10) {
    console.log('[HEALTH] Truncated notes to last 10');
  }

  // Create a copy to avoid mutation
  const updatedProfile = {
    ...profile,
    healthData: {
      ...profile.healthData,
      notes: truncatedNotes
    }
  };

  return updatedProfile;
}

/**
 * Generate proactive health check-in question
 * References specific medications, conditions, or appointments from profile
 * PRD lines 337-342
 */
export function generateHealthCheckIn(
  profile: SeniorProfile,
  type: 'medication' | 'condition' | 'appointment'
): string {
  console.log('[HEALTH] Generating health check-in:', type);

  if (type === 'medication') {
    // Reference specific medication from profile
    const medications = profile.healthData.medications;
    if (medications.length === 0) {
      return 'How are you feeling today?';
    }
    
    // Pick first medication (typically most important)
    const med = medications[0];
    return `Did you take your ${med.name} ${med.dosage} this morning?`;
  }

  if (type === 'condition') {
    // Reference known condition
    const conditions = profile.healthData.conditions;
    if (conditions.length === 0) {
      return 'How has your health been?';
    }

    // Pick first condition or one with specific pain points
    const condition = conditions.find(c => c.name.toLowerCase().includes('arthritis')) || conditions[0];
    return `How's your ${condition.name.toLowerCase()} been this week?`;
  }

  if (type === 'appointment') {
    // Mention NEXT appointment chronologically (regardless of how far away)
    const appointments = profile.healthData.appointments;
    
    if (appointments.length === 0) {
      return ''; // No appointments to mention
    }

    // Get next appointment (first one in the array, assumed to be next chronologically)
    const nextAppt = appointments[0];
    
    // Extract doctor's last name with Dr. prefix
    const doctorParts = nextAppt.doctor.split(' ');
    const doctorName = doctorParts.length > 1 ? 'Dr. ' + doctorParts.pop() : nextAppt.doctor;
    
    // Format date nicely
    const apptDate = new Date(nextAppt.date);
    const today = new Date();
    const daysUntil = Math.ceil((apptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let datePhrase;
    if (daysUntil === 0) {
      datePhrase = 'today';
    } else if (daysUntil === 1) {
      datePhrase = 'tomorrow';
    } else if (daysUntil <= 3) {
      datePhrase = `in ${daysUntil} days`;
    } else {
      datePhrase = `on ${nextAppt.date}`;
    }

    return `Your ${nextAppt.type.toLowerCase()} with ${doctorName} is ${datePhrase} at ${nextAppt.time}.`;
  }

  return 'How are you feeling today?';
}

/**
 * Get next appointment if within 7 days
 * Returns null if no appointments or all are >7 days away
 * PRD line 340
 */
export function getNextAppointment(
  profile: SeniorProfile
): { date: string; time: string; type: string; doctor: string } | null {
  const appointments = profile.healthData.appointments;
  
  if (appointments.length === 0) {
    return null;
  }

  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  // Find first appointment within 7 days
  for (const appointment of appointments) {
    const apptDate = new Date(appointment.date);
    
    if (apptDate >= today && apptDate <= sevenDaysFromNow) {
      return appointment;
    }
  }

  return null;
}

/**
 * Extract vitals from message text
 * Looks for blood pressure, weight, and blood sugar mentions
 */
export function extractVitals(
  message: string
): {
  bloodPressure?: string;
  weight?: string;
  bloodSugar?: string;
} | null {
  console.log('[HEALTH] Extracting vitals from message');

  let extracted: any = {};
  let foundAny = false;

  // Extract blood pressure (format: 120/80 or 120 over 80)
  const bpPattern = /\b(\d{2,3})\s*(?:\/|over)\s*(\d{2,3})\b/i;
  const bpMatch = message.match(bpPattern);
  if (bpMatch) {
    extracted.bloodPressure = `${bpMatch[1]}/${bpMatch[2]}`;
    foundAny = true;
  }

  // Extract weight (format: "145 pounds" or "145 lbs" or "65 kg")
  const weightPattern = /\b(\d{2,3})\s*(pounds?|lbs?|kg|kilograms?)\b/i;
  const weightMatch = message.match(weightPattern);
  if (weightMatch) {
    extracted.weight = `${weightMatch[1]} ${weightMatch[2]}`;
    foundAny = true;
  }

  // Extract blood sugar (format: "110" or "110 mg/dL")
  const sugarPattern = /blood sugar\s+(?:was|is|at)?\s*(\d{2,3})(?:\s*mg\/dL)?/i;
  const sugarMatch = message.match(sugarPattern);
  if (sugarMatch) {
    extracted.bloodSugar = `${sugarMatch[1]} mg/dL`;
    foundAny = true;
  }

  return foundAny ? extracted : null;
}

