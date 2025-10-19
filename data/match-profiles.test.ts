import { loadMatchProfiles } from './match-profiles';

describe('Match Profiles Data', () => {
  test('3 match profiles created (Mrs. Lee, Mr. Wang, Mrs. Kim)', () => {
    const profiles = loadMatchProfiles();
    expect(profiles).toHaveLength(3);
    
    const names = profiles.map(p => p.name);
    expect(names).toContain('Mrs. Lee');
    expect(names).toContain('Mr. Wang');
    expect(names).toContain('Mrs. Kim');
  });

  test('each profile has complete structure (age, location, interests, culturalBackground)', () => {
    const profiles = loadMatchProfiles();
    
    profiles.forEach(profile => {
      expect(profile.age).toBeDefined();
      expect(profile.location).toBeDefined();
      expect(profile.socialProfile.interests).toBeDefined();
      expect(profile.socialProfile.culturalBackground).toBeDefined();
      expect(profile.socialProfile.interests.length).toBeGreaterThan(0);
    });
  });

  test('shared interests with Mrs. Chen documented', () => {
    const profiles = loadMatchProfiles();
    
    // Mrs. Chen's interests: ['gardening', 'piano', 'cooking', 'Shanghai culture']
    profiles.forEach(profile => {
      const hasSharedInterest = profile.socialProfile.interests.some(interest =>
        ['gardening', 'piano', 'cooking', 'Shanghai culture', 'Mandarin'].includes(interest)
      );
      expect(hasSharedInterest).toBe(true);
    });
  });

  test('all profiles have Mandarin language (except Mrs. Kim: Korean)', () => {
    const profiles = loadMatchProfiles();
    
    const mrsLee = profiles.find(p => p.name === 'Mrs. Lee');
    const mrWang = profiles.find(p => p.name === 'Mr. Wang');
    const mrsKim = profiles.find(p => p.name === 'Mrs. Kim');
    
    expect(mrsLee?.socialProfile.culturalBackground).toMatch(/Mandarin|Taiwan/i);
    expect(mrWang?.socialProfile.culturalBackground).toMatch(/Mandarin|Beijing/i);
    expect(mrsKim?.socialProfile.culturalBackground).toMatch(/Korean|Seoul/i);
  });

  test('Mrs. Lee has high compatibility with Mrs. Chen', () => {
    const profiles = loadMatchProfiles();
    const mrsLee = profiles.find(p => p.name === 'Mrs. Lee');
    
    expect(mrsLee).toBeDefined();
    expect(mrsLee?.age).toBe(69);
    expect(mrsLee?.location).toBe('Seattle, WA');
    expect(mrsLee?.socialProfile.interests).toContain('gardening');
    expect(mrsLee?.socialProfile.interests).toContain('piano');
    expect(mrsLee?.socialProfile.interests).toContain('cooking');
  });

  test('Mr. Wang has high compatibility with Mrs. Chen', () => {
    const profiles = loadMatchProfiles();
    const mrWang = profiles.find(p => p.name === 'Mr. Wang');
    
    expect(mrWang).toBeDefined();
    expect(mrWang?.age).toBe(75);
    expect(mrWang?.location).toBe('Seattle, WA');
    expect(mrWang?.socialProfile.interests).toContain('gardening');
    expect(mrWang?.socialProfile.interests).toContain('cooking');
  });

  test('Mrs. Kim has good compatibility with Mrs. Chen', () => {
    const profiles = loadMatchProfiles();
    const mrsKim = profiles.find(p => p.name === 'Mrs. Kim');
    
    expect(mrsKim).toBeDefined();
    expect(mrsKim?.age).toBe(68);
    expect(mrsKim?.location).toBe('Bellevue, WA');
    expect(mrsKim?.socialProfile.interests).toContain('gardening');
  });
});
