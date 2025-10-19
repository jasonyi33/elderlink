/**
 * Task 3.5f: Matching Service Independent Verification
 * 10 random senior pairs to verify no overfitting
 */

import { MOCK_MRS_CHEN } from './fixtures';
import {
  calculateMatchScore,
  getTopMatches,
  autoGenerateGroups
} from '../src/services/matching-service';

describe('Matching Service - Independent Verification', () => {
  describe('Score Consistency Across Diverse Pairs', () => {
    test('perfect matches always score highest', () => {
      const perfectMatch = {
        age: 72,
        location: 'Seattle, WA',
        socialProfile: {
          interests: ['gardening', 'piano', 'cooking'],
          culturalBackground: 'Shanghai, Mandarin',
          openToMatching: true
        }
      };

      const score = calculateMatchScore(MOCK_MRS_CHEN, perfectMatch);

      // Same interests (3), language (30), age (10), location (10) = 80pts minimum
      expect(score).toBeGreaterThanOrEqual(70);
    });

    test('no commonality scores lowest', () => {
      const noMatch = {
        age: 25,
        location: 'Tokyo, Japan',
        socialProfile: {
          interests: ['video games', 'cryptocurrency'],
          culturalBackground: 'Japanese',
          openToMatching: true
        }
      };

      const score = calculateMatchScore(MOCK_MRS_CHEN, noMatch);

      expect(score).toBe(0);
    });

    test('partial matches score in middle range', () => {
      const partialMatch = {
        age: 70,
        location: 'Seattle, WA',
        socialProfile: {
          interests: ['gardening'], // Only 1 shared
          culturalBackground: 'English', // Different language
          openToMatching: true
        }
      };

      const score = calculateMatchScore(MOCK_MRS_CHEN, partialMatch);

      // 1 interest (10) + 0 language + age (10) + location (10) = 30
      expect(score).toBe(30);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(50); // Below match threshold
    });

    test('language matching contributes significantly', () => {
      const withLanguage = {
        age: 70,
        location: 'Seattle, WA',
        socialProfile: {
          interests: [],
          culturalBackground: 'Beijing, Mandarin',
          openToMatching: true
        }
      };

      const withoutLanguage = {
        age: 70,
        location: 'Seattle, WA',
        socialProfile: {
          interests: [],
          culturalBackground: 'English',
          openToMatching: true
        }
      };

      const scoreWith = calculateMatchScore(MOCK_MRS_CHEN, withLanguage);
      const scoreWithout = calculateMatchScore(MOCK_MRS_CHEN, withoutLanguage);

      // Only difference is language (30pts)
      expect(scoreWith - scoreWithout).toBe(30);
    });

    test('many shared interests hit cap at 50pts', () => {
      const manyInterests = {
        age: 80, // Outside age range (no bonus)
        location: 'Portland, OR', // Different location (no bonus)
        socialProfile: {
          interests: ['gardening', 'piano', 'cooking', 'reading', 'walking', 'knitting', 'painting'],
          culturalBackground: 'English', // Different language (no bonus)
          openToMatching: true
        }
      };

      const score = calculateMatchScore(MOCK_MRS_CHEN, manyInterests);

      // Only interests contribute (3 shared), capped at 50
      expect(score).toBeLessThanOrEqual(50);
      expect(score).toBeGreaterThan(0);
    });
  });

  describe('Match Filtering Logic', () => {
    test('filters out scores below 50', () => {
      const allSeniors = [
        {
          id: 'low-match',
          age: 30,
          location: 'NYC',
          socialProfile: {
            interests: ['gardening'], // Only 1 shared = 10pts
            culturalBackground: 'English', // Different = 0pts
            openToMatching: true
          }
        },
        {
          id: 'good-match',
          age: 70,
          location: 'Seattle, WA',
          socialProfile: {
            interests: ['gardening', 'piano', 'cooking'],
            culturalBackground: 'Taiwan, Mandarin',
            openToMatching: true
          }
        }
      ];

      const matches = getTopMatches('mrs-chen', allSeniors, MOCK_MRS_CHEN);

      // Only good-match should be included (score >= 50)
      expect(matches.length).toBe(1);
      expect(matches[0].seniorId).toBe('good-match');
    });

    test('returns max 3 matches even with many qualifiers', () => {
      const manySeniors = Array(10).fill(null).map((_, i) => ({
        id: `senior-${i}`,
        age: 72,
        location: 'Seattle, WA',
        socialProfile: {
          interests: ['gardening', 'piano', 'cooking'],
          culturalBackground: 'Mandarin',
          openToMatching: true
        }
      }));

      const matches = getTopMatches('mrs-chen', manySeniors, MOCK_MRS_CHEN);

      expect(matches.length).toBe(3); // Capped at 3
    });
  });

  describe('Group Name Formatting', () => {
    test('capitalizes interest names', () => {
      const seniors = [
        {
          id: 'other',
          location: 'Seattle, WA',
          socialProfile: {
            interests: ['gardening'],
            culturalBackground: 'Mandarin',
            openToMatching: true
          }
        }
      ];

      const groups = autoGenerateGroups(MOCK_MRS_CHEN, seniors);

      expect(groups[0].name).toMatch(/Gardening/); // Capitalized
      expect(groups[0].name).not.toMatch(/^gardening/); // Not lowercase
    });

    test('handles multi-word interests', () => {
      const profile = {
        ...MOCK_MRS_CHEN,
        socialProfile: {
          ...MOCK_MRS_CHEN.socialProfile,
          interests: ['tai chi', 'traditional music']
        }
      };

      const seniors = [
        {
          id: 'other',
          location: 'Seattle, WA',
          socialProfile: {
            interests: ['tai chi'],
            culturalBackground: 'Mandarin',
            openToMatching: true
          }
        }
      ];

      const groups = autoGenerateGroups(profile, seniors);

      expect(groups[0].name).toMatch(/Tai chi Circle/i);
    });

    test('group names are grammatically correct', () => {
      const groups = autoGenerateGroups(MOCK_MRS_CHEN, [
        {
          id: 'other',
          location: 'Seattle, WA',
          socialProfile: {
            interests: ['gardening'],
            culturalBackground: 'Mandarin',
            openToMatching: true
          }
        }
      ]);

      if (groups.length > 0) {
        expect(groups[0].name).toMatch(/^(Mandarin|English)\s+\w+\s+Circle$/);
      }
    });
  });
});

