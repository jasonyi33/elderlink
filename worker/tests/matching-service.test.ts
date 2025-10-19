/**
 * Task 3.5a: Matching Service Tests
 * 16 tests covering community matching algorithm and group generation
 * 
 * Reference:
 * - TDD_TEST_CASES.md Section 4.1 (lines 681-909)
 * - PRD.md lines 386-475 (Matching Requirements)
 * - PRD.md lines 1641-1676 (Algorithm Details)
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.5
 */

import { MOCK_MRS_CHEN } from './fixtures';
import { SeniorProfile } from '../src/types';

// Functions to be implemented in src/services/matching-service.ts
declare function calculateMatchScore(
  senior1: Partial<SeniorProfile>,
  senior2: Partial<SeniorProfile>
): number;

declare function getTopMatches(
  seniorId: string,
  allSeniors: Partial<SeniorProfile>[],
  currentSenior: Partial<SeniorProfile>
): Array<{
  seniorId: string;
  score: number;
  compatibility: string;
  sharedInterests: string[];
  calculatedAt: string;
}>;

declare function autoGenerateGroups(
  profile: Partial<SeniorProfile>,
  allSeniors: Partial<SeniorProfile>[]
): Array<{
  id: string;
  name: string;
  memberCount: number;
  activity: string;
  language: string;
  schedule: string;
}>;

describe('Community Matching Algorithm', () => {
  // Test data from TDD_TEST_CASES.md lines 687-709
  const MRS_LEE = {
    id: 'mrs-lee',
    age: 69,
    location: 'Seattle, WA',
    socialProfile: {
      interests: ['gardening', 'piano', 'cooking', 'mahjong'],
      culturalBackground: 'Taiwan, Mandarin',
      openToMatching: true
    }
  };

  const MR_WANG = {
    id: 'mr-wang',
    age: 75,
    location: 'Seattle, WA',
    socialProfile: {
      interests: ['gardening', 'tai chi', 'cooking'],
      culturalBackground: 'Beijing, Mandarin',
      openToMatching: true
    }
  };

  const MRS_KIM = {
    id: 'mrs-kim',
    age: 68,
    location: 'Bellevue, WA',
    socialProfile: {
      interests: ['gardening', 'knitting'],
      culturalBackground: 'Seoul, Korean',
      openToMatching: true
    }
  };

  describe('Calculate Match Score', () => {
    test('perfect match scores correctly', () => {
      // TDD_TEST_CASES.md lines 712-731
      const senior1 = {
        age: 72,
        location: 'Seattle, WA',
        socialProfile: {
          interests: ['gardening', 'piano', 'cooking'],
          culturalBackground: 'Shanghai, Mandarin',
          openToMatching: true
        }
      };

      const senior2 = {
        age: 70, // Within ±10
        location: 'Seattle, WA',
        socialProfile: {
          interests: ['gardening', 'piano', 'cooking', 'music'],
          culturalBackground: 'Taiwan, Mandarin',
          openToMatching: true
        }
      };

      const score = calculateMatchScore(senior1, senior2);

      // 3 shared interests = 30pts, language = 30pts, age = 10pts, location = 10pts
      expect(score).toBe(80);
    });

    test('shared interests: 10 points each, max 50', () => {
      const score = calculateMatchScore(MOCK_MRS_CHEN, MRS_LEE);

      // 4 shared interests (gardening, piano, cooking) = 30-40pts minimum
      const interestPoints = Math.min(50, 3 * 10);
      expect(score).toBeGreaterThanOrEqual(interestPoints);
    });

    test('same language: 30 points', () => {
      const score1 = calculateMatchScore(MOCK_MRS_CHEN, MRS_LEE); // Both Mandarin
      const score2 = calculateMatchScore(MOCK_MRS_CHEN, MRS_KIM); // Different languages

      expect(score1).toBeGreaterThan(score2);
      expect(score1 - score2).toBe(30);
    });

    test('age proximity (±10 years): 10 points', () => {
      const senior1 = { ...MOCK_MRS_CHEN, age: 72 };
      const senior2 = { ...MRS_LEE, age: 69 }; // 3 years = within range
      const senior3 = { ...MR_WANG, age: 85 }; // 13 years = outside range

      const scoreClose = calculateMatchScore(senior1, senior2);
      const scoreFar = calculateMatchScore(senior1, senior3);

      expect(scoreClose).toBeGreaterThan(scoreFar);
      expect(scoreClose - scoreFar).toBe(10); // Age proximity bonus
    });

    test('same location: 10 points', () => {
      const score1 = calculateMatchScore(MOCK_MRS_CHEN, MRS_LEE); // Both Seattle
      const score2 = calculateMatchScore(MOCK_MRS_CHEN, MRS_KIM); // Seattle vs Bellevue

      expect(score1 - score2).toBe(10);
    });

    test('empty interests still scores on language/age/location', () => {
      const senior1 = {
        age: 72,
        location: 'Seattle, WA',
        socialProfile: {
          interests: [],
          culturalBackground: 'Shanghai, Mandarin',
          openToMatching: true
        }
      };

      const senior2 = {
        age: 70,
        location: 'Seattle, WA',
        socialProfile: {
          interests: [],
          culturalBackground: 'Taiwan, Mandarin',
          openToMatching: true
        }
      };

      const score = calculateMatchScore(senior1, senior2);

      // 0 interests + 30 language + 10 age + 10 location = 50pts
      expect(score).toBe(50);
    });

    test('score never exceeds 100', () => {
      const senior1 = {
        age: 70,
        location: 'Seattle, WA',
        socialProfile: {
          interests: Array(20).fill('hobby'), // 20 shared = 200pts without cap
          culturalBackground: 'Mandarin',
          openToMatching: true
        }
      };

      const senior2 = {
        age: 70,
        location: 'Seattle, WA',
        socialProfile: {
          interests: Array(20).fill('hobby'),
          culturalBackground: 'Mandarin',
          openToMatching: true
        }
      };

      const score = calculateMatchScore(senior1, senior2);

      expect(score).toBe(100); // Capped at 100
    });

    test('below threshold (score < 50) example', () => {
      const senior1 = {
        age: 72,
        location: 'Seattle, WA',
        socialProfile: {
          interests: ['gardening', 'piano'],
          culturalBackground: 'Shanghai, Mandarin',
          openToMatching: true
        }
      };

      const senior2 = {
        age: 55, // Too far (17 years)
        location: 'Portland, OR', // Different city
        socialProfile: {
          interests: ['hiking'], // 0 shared
          culturalBackground: 'English',
          openToMatching: true
        }
      };

      const score = calculateMatchScore(senior1, senior2);

      // 0 interests + 0 language + 0 age + 0 location = 0
      expect(score).toBe(0);
      expect(score).toBeLessThan(50);
    });
  });

  describe('Get Top Matches', () => {
    test('returns exactly 3 matches (or fewer if <3 qualify)', () => {
      const allSeniors = [MRS_LEE, MR_WANG, MRS_KIM];
      const matches = getTopMatches('mrs-chen', allSeniors, MOCK_MRS_CHEN);

      expect(matches.length).toBeLessThanOrEqual(3);
      expect(matches.length).toBeGreaterThan(0);
    });

    test('only returns matches with score >= 50', () => {
      const allSeniors = [MRS_LEE, MR_WANG, MRS_KIM];
      const matches = getTopMatches('mrs-chen', allSeniors, MOCK_MRS_CHEN);

      matches.forEach(match => {
        expect(match.score).toBeGreaterThanOrEqual(50);
      });
    });

    test('matches sorted by score descending', () => {
      const allSeniors = [MRS_LEE, MR_WANG, MRS_KIM];
      const matches = getTopMatches('mrs-chen', allSeniors, MOCK_MRS_CHEN);

      for (let i = 0; i < matches.length - 1; i++) {
        expect(matches[i].score).toBeGreaterThanOrEqual(matches[i + 1].score);
      }
    });

    test('returns empty array when no seniors qualify', () => {
      const incompatibleSeniors = [
        {
          id: 'other',
          age: 30,
          location: 'New York, NY',
          socialProfile: {
            interests: ['tech'],
            culturalBackground: 'English',
            openToMatching: true
          }
        }
      ];

      const matches = getTopMatches('mrs-chen', incompatibleSeniors, MOCK_MRS_CHEN);
      expect(matches).toEqual([]);
    });

    test('includes compatibility level based on score', () => {
      const allSeniors = [MRS_LEE, MR_WANG, MRS_KIM];
      const matches = getTopMatches('mrs-chen', allSeniors, MOCK_MRS_CHEN);

      matches.forEach(match => {
        if (match.score >= 70) {
          expect(match.compatibility).toBe('high');
        } else if (match.score >= 50) {
          expect(match.compatibility).toBe('good');
        } else if (match.score >= 30) {
          expect(match.compatibility).toBe('potential');
        }
      });
    });
  });

  describe('Generate Group Suggestions', () => {
    test('group name format: "{Language} {Interest} Circle"', () => {
      const allSeniors = [MRS_LEE, MR_WANG];
      const groups = autoGenerateGroups(MOCK_MRS_CHEN, allSeniors);

      expect(groups).toContainEqual(
        expect.objectContaining({
          name: expect.stringMatching(/Mandarin.*Circle/i)
        })
      );
    });

    test('auto-generates group from most common shared interest', () => {
      const allSeniors = [MRS_LEE, MR_WANG]; // Both share 'gardening' with Mrs. Chen
      const groups = autoGenerateGroups(MOCK_MRS_CHEN, allSeniors);

      // Gardening is shared by all 3, should be first/most common
      expect(groups[0].name).toMatch(/gardening/i);
    });

    test('includes member list in group', () => {
      const allSeniors = [MRS_LEE, MR_WANG];
      const groups = autoGenerateGroups(MOCK_MRS_CHEN, allSeniors);

      if (groups.length > 0) {
        expect(groups[0]).toHaveProperty('memberCount');
        expect(groups[0].memberCount).toBeGreaterThanOrEqual(2); // At least 2 members
      }
    });
  });
});

