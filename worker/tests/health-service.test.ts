/**
 * Task 3.4a: Health Service Tests
 * 12 tests covering health note creation, appointment logic, and Sam's health behaviors
 * 
 * Reference:
 * - TDD_TEST_CASES.md Section 3.1 (lines 549-677)
 * - PRD.md lines 320-357 (Health Integration)
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.4
 */

import { MOCK_MRS_CHEN } from './fixtures';
import {
  createHealthNote,
  appendHealthNote,
  generateHealthCheckIn,
  getNextAppointment,
  extractVitals
} from '../src/services/health-service';

describe('Health Service', () => {
  describe('Create Health Note', () => {
    test('creates note from symptom mention', () => {
      const healthMentions = [{
        type: 'symptom' as const,
        text: 'back pain',
        context: 'gardening',
        severity: 'mild' as const
      }];

      const note = createHealthNote(healthMentions, MOCK_MRS_CHEN);

      expect(note).toMatchObject({
        timestamp: expect.any(String),
        source: 'Sam AI Conversation',
        note: expect.stringMatching(/back pain.*garden/i),
        mentions: healthMentions
      });
    });

    test('creates note from medication non-adherence', () => {
      const healthMentions = [{
        type: 'medication' as const,
        text: 'forgot morning pills',
        status: 'non-adherent' as const
      }];

      const note = createHealthNote(healthMentions, MOCK_MRS_CHEN);

      expect(note.note).toMatch(/forgot.*medication/i);
      expect(note.mentions[0].status).toBe('non-adherent');
    });

    test('multiple health mentions in single note', () => {
      const healthMentions = [
        { type: 'symptom' as const, text: 'back pain', severity: 'mild' as const },
        { type: 'medication' as const, text: 'took Lisinopril', status: 'adherent' as const }
      ];

      const note = createHealthNote(healthMentions, MOCK_MRS_CHEN);

      expect(note.mentions.length).toBe(2);
      expect(note.note).toMatch(/back pain/i);
      expect(note.note).toMatch(/Lisinopril/i);
    });
  });

  describe('Batch Append Health Notes', () => {
    test('appends note to existing notes array', () => {
      const profile = {
        ...MOCK_MRS_CHEN,
        healthData: {
          ...MOCK_MRS_CHEN.healthData,
          notes: [{ timestamp: '2024-01-01', source: 'Manual', note: 'Old note', mentions: [] }]
        }
      };

      const newNote = createHealthNote([{
        type: 'symptom' as const,
        text: 'headache',
        severity: 'mild' as const
      }], profile);

      const updated = appendHealthNote(profile, newNote);

      expect(updated.healthData.notes.length).toBe(2);
      expect(updated.healthData.notes[1]).toEqual(newNote);
    });

    test('truncates to last 10 notes', () => {
      const profile = {
        ...MOCK_MRS_CHEN,
        healthData: {
          ...MOCK_MRS_CHEN.healthData,
          notes: Array(10).fill({ timestamp: 'old', source: 'test', note: 'old note', mentions: [] })
        }
      };

      const newNote = createHealthNote([{ type: 'symptom' as const, text: 'test' }], profile);
      const updated = appendHealthNote(profile, newNote);

      expect(updated.healthData.notes.length).toBe(10);
      expect(updated.healthData.notes[9]).toEqual(newNote);
      expect(updated.healthData.notes[0].timestamp).not.toBe('old');
    });
  });

  describe('Proactive Health Behaviors', () => {
    test('Sam references specific medication name', () => {
      const response = generateHealthCheckIn(MOCK_MRS_CHEN, 'medication');

      expect(response).toMatch(/Lisinopril|Metformin|Vitamin D/i);
    });

    test('Sam references known condition by name', () => {
      const response = generateHealthCheckIn(MOCK_MRS_CHEN, 'condition');

      expect(response).toMatch(/arthritis|diabetes|hypertension/i);
    });

    test('Sam reminds about NEXT appointment only', () => {
      const profile = {
        ...MOCK_MRS_CHEN,
        healthData: {
          ...MOCK_MRS_CHEN.healthData,
          appointments: [
            { date: '2025-01-25', time: '10:00am', type: 'Primary care checkup', doctor: 'Dr. Smith' },
            { date: '2025-02-15', time: '2:00pm', type: 'Cardiology follow-up', doctor: 'Dr. Johnson' }
          ]
        }
      };

      const response = generateHealthCheckIn(profile, 'appointment');

      expect(response).toMatch(/Dr\. Smith/i);
      expect(response).not.toMatch(/Dr\. Johnson/i);
    });

    test('Sam mentions appointment if <7 days away', () => {
      // Create appointment 5 days in the future
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const dateString = futureDate.toISOString().split('T')[0];

      const profile = {
        ...MOCK_MRS_CHEN,
        healthData: {
          ...MOCK_MRS_CHEN.healthData,
          appointments: [
            { date: dateString, time: '10:00am', type: 'checkup', doctor: 'Dr. Smith' }
          ]
        }
      };

      const appointment = getNextAppointment(profile);

      expect(appointment).not.toBeNull();
      expect(appointment?.doctor).toBe('Dr. Smith');
    });

    test("Sam doesn't mention appointments >7 days away", () => {
      // Create appointment 10 days in the future
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      const dateString = futureDate.toISOString().split('T')[0];

      const profile = {
        ...MOCK_MRS_CHEN,
        healthData: {
          ...MOCK_MRS_CHEN.healthData,
          appointments: [
            { date: dateString, time: '10:00am', type: 'checkup', doctor: 'Dr. Smith' }
          ]
        }
      };

      const appointment = getNextAppointment(profile);

      expect(appointment).toBeNull();
    });

    test('mentions doctor name and appointment type', () => {
      // Appointment within 7 days
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      const dateString = futureDate.toISOString().split('T')[0];

      const profile = {
        ...MOCK_MRS_CHEN,
        healthData: {
          ...MOCK_MRS_CHEN.healthData,
          appointments: [
            { date: dateString, time: '2:00pm', type: 'Cardiology follow-up', doctor: 'Dr. Johnson' }
          ]
        }
      };

      const response = generateHealthCheckIn(profile, 'appointment');

      expect(response).toMatch(/Dr\. Johnson/i);
      expect(response).toMatch(/Cardiology|follow-up/i);
    });

    test('Sam never gives medical advice', () => {
      // This tests the deflection behavior
      const profile = MOCK_MRS_CHEN;
      
      // Sam should acknowledge but not advise
      const medResponse = generateHealthCheckIn(profile, 'medication');
      
      // Should ask about medication, not tell them what to do
      expect(medResponse).toMatch(/did you take|have you taken/i);
      expect(medResponse).not.toMatch(/you should take|you must take|don't take/i);
    });
  });

  describe('Extract Vitals', () => {
    test('extracts blood pressure from message', () => {
      const message = 'My blood pressure was 130/85 this morning';
      const vitals = extractVitals(message);

      expect(vitals).not.toBeNull();
      expect(vitals?.bloodPressure).toBe('130/85');
    });

    test('extracts weight from message', () => {
      const message = 'I weigh 145 pounds now';
      const vitals = extractVitals(message);

      expect(vitals).not.toBeNull();
      expect(vitals?.weight).toMatch(/145/);
    });

    test('extracts blood sugar from message', () => {
      const message = 'My blood sugar was 110 this morning';
      const vitals = extractVitals(message);

      expect(vitals).not.toBeNull();
      expect(vitals?.bloodSugar).toMatch(/110/);
    });

    test('returns null when no vitals mentioned', () => {
      const message = 'I had a nice day today';
      const vitals = extractVitals(message);

      expect(vitals).toBeNull();
    });
  });
});

