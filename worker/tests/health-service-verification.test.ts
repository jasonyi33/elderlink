/**
 * Task 3.4f: Independent Verification Tests
 * 20 diverse health mentions to verify no overfitting
 */

import { MOCK_MRS_CHEN } from './fixtures';
import {
  createHealthNote,
  generateHealthCheckIn,
  extractVitals
} from '../src/services/health-service';

describe('Health Service - Independent Verification', () => {
  describe('Diverse Health Mentions', () => {
    test('handles various symptom descriptions', () => {
      const scenarios = [
        { text: 'headache', context: 'morning', severity: 'mild' as const },
        { text: 'dizziness', context: 'standing up', severity: 'moderate' as const },
        { text: 'shortness of breath', context: 'walking', severity: 'severe' as const },
        { text: 'fatigue', context: 'all day', severity: 'moderate' as const },
        { text: 'joint pain', context: 'knees', severity: 'mild' as const }
      ];

      scenarios.forEach(symptom => {
        const note = createHealthNote([{
          type: 'symptom' as const,
          ...symptom
        }], MOCK_MRS_CHEN);

        expect(note.note).toMatch(new RegExp(symptom.text, 'i'));
        expect(note.source).toBe('Sam AI Conversation');
        expect(note.mentions[0].severity).toBe(symptom.severity);
      });
    });

    test('handles various medication mentions', () => {
      const scenarios = [
        'took all my pills',
        'forgot my afternoon dose',
        'remembered my Lisinopril',
        'skipped my vitamins',
        'took medication with breakfast'
      ];

      scenarios.forEach(text => {
        const note = createHealthNote([{
          type: 'medication' as const,
          text,
          status: text.includes('forgot') || text.includes('skipped') ? 'non-adherent' as const : 'adherent' as const
        }], MOCK_MRS_CHEN);

        expect(note.note).toMatch(/medication|pills/i);
        expect(note.mentions[0].type).toBe('medication');
      });
    });
  });

  describe('Natural Language Quality', () => {
    test('health check-ins sound natural, not clinical', () => {
      const responses = [
        generateHealthCheckIn(MOCK_MRS_CHEN, 'medication'),
        generateHealthCheckIn(MOCK_MRS_CHEN, 'condition'),
      ];

      responses.forEach(response => {
        // Should NOT sound clinical
        expect(response).not.toMatch(/patient|diagnosis|treatment|prescription/i);
        
        // Should sound conversational
        expect(response.length).toBeGreaterThan(10);
        expect(response).toMatch(/\?$/); // Ends with question mark
      });
    });

    test('references actual medication names naturally', () => {
      const response = generateHealthCheckIn(MOCK_MRS_CHEN, 'medication');
      
      // Should mention actual medication from profile
      const hasMedName = /Lisinopril|Metformin|Vitamin D/.test(response);
      expect(hasMedName).toBe(true);
      
      // Should be phrased as a question
      expect(response).toMatch(/did you|have you/i);
    });
  });

  describe('Vitals Extraction Robustness', () => {
    test('handles various blood pressure formats', () => {
      const formats = [
        'my bp was 120/80',
        'blood pressure: 130/85',
        '140 over 90',
        'BP is 125/82'
      ];

      formats.forEach(msg => {
        const vitals = extractVitals(msg);
        expect(vitals).not.toBeNull();
        expect(vitals?.bloodPressure).toMatch(/\d{2,3}\/\d{2,3}/);
      });
    });

    test('handles various weight formats', () => {
      const formats = [
        'I weigh 150 pounds',
        'weight is 145 lbs',
        'I am 65 kg',
        '148 pounds today'
      ];

      formats.forEach(msg => {
        const vitals = extractVitals(msg);
        expect(vitals).not.toBeNull();
        expect(vitals?.weight).toBeDefined();
      });
    });

    test('ignores non-vital numbers', () => {
      const messages = [
        'I am 72 years old',
        'It was 85 degrees today',
        'I called at 3pm'
      ];

      messages.forEach(msg => {
        const vitals = extractVitals(msg);
        expect(vitals).toBeNull();
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles empty health mentions array', () => {
      const note = createHealthNote([], MOCK_MRS_CHEN);
      
      expect(note.note).toBe('Patient reports: .');
      expect(note.mentions).toEqual([]);
    });

    test('handles profile with no medications', () => {
      const profileNoMeds = {
        ...MOCK_MRS_CHEN,
        healthData: {
          ...MOCK_MRS_CHEN.healthData,
          medications: []
        }
      };

      const response = generateHealthCheckIn(profileNoMeds, 'medication');
      expect(response).toBe('How are you feeling today?');
    });

    test('handles profile with no conditions', () => {
      const profileNoConds = {
        ...MOCK_MRS_CHEN,
        healthData: {
          ...MOCK_MRS_CHEN.healthData,
          conditions: []
        }
      };

      const response = generateHealthCheckIn(profileNoConds, 'condition');
      expect(response).toBe('How has your health been?');
    });

    test('handles profile with no appointments', () => {
      const profileNoAppts = {
        ...MOCK_MRS_CHEN,
        healthData: {
          ...MOCK_MRS_CHEN.healthData,
          appointments: []
        }
      };

      const response = generateHealthCheckIn(profileNoAppts, 'appointment');
      expect(response).toBe('');
    });
  });
});

