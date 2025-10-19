import { loadMrsChenProfile } from './mrs-chen-profile';

describe('Mrs. Chen Profile Data', () => {
  test('profile has exactly 5 conversations', () => {
    const profile = loadMrsChenProfile();
    expect(profile.conversations).toHaveLength(5);
  });

  test('each conversation has health mentions', () => {
    const profile = loadMrsChenProfile();
    
    profile.conversations.forEach(conversation => {
      expect(conversation.healthMentions).toBeDefined();
      expect(conversation.healthMentions.length).toBeGreaterThan(0);
    });
  });

  test('conversation 1: Sept 20, sentiment 0.3, knees sore mention', () => {
    const profile = loadMrsChenProfile();
    const conv1 = profile.conversations[0];
    
    expect(conv1.timestamp).toMatch(/2025-09-20/);
    expect(conv1.sentiment).toBeCloseTo(0.3, 1);
    expect(conv1.healthMentions).toContain(expect.stringMatching(/knee.*sore/i));
  });

  test('conversation 2: Sept 27, sentiment 0.2, forgot pills mention', () => {
    const profile = loadMrsChenProfile();
    const conv2 = profile.conversations[1];
    
    expect(conv2.timestamp).toMatch(/2025-09-27/);
    expect(conv2.sentiment).toBeCloseTo(0.2, 1);
    expect(conv2.healthMentions).toContain(expect.stringMatching(/forgot.*pills/i));
  });

  test('conversation 3: Oct 5, sentiment 0.4, back pain gardening mention', () => {
    const profile = loadMrsChenProfile();
    const conv3 = profile.conversations[2];
    
    expect(conv3.timestamp).toMatch(/2025-10-05/);
    expect(conv3.sentiment).toBeCloseTo(0.4, 1);
    expect(conv3.healthMentions).toContain(expect.stringMatching(/back.*pain.*garden/i));
  });

  test('conversation 4: Oct 12, sentiment 0.6, took all medications mention', () => {
    const profile = loadMrsChenProfile();
    const conv4 = profile.conversations[3];
    
    expect(conv4.timestamp).toMatch(/2025-10-12/);
    expect(conv4.sentiment).toBeCloseTo(0.6, 1);
    expect(conv4.healthMentions).toContain(expect.stringMatching(/took.*medications/i));
  });

  test('conversation 5: Oct 17, sentiment 0.7, excited for checkup mention', () => {
    const profile = loadMrsChenProfile();
    const conv5 = profile.conversations[4];
    
    expect(conv5.timestamp).toMatch(/2025-10-17/);
    expect(conv5.sentiment).toBeCloseTo(0.7, 1);
    expect(conv5.healthMentions).toContain(expect.stringMatching(/excited.*checkup/i));
  });

  test('health data has 3 medications', () => {
    const profile = loadMrsChenProfile();
    expect(profile.healthData.medications).toHaveLength(3);
  });

  test('health data has 3 conditions', () => {
    const profile = loadMrsChenProfile();
    expect(profile.healthData.conditions).toHaveLength(3);
  });

  test('at least 1 upcoming appointment', () => {
    const profile = loadMrsChenProfile();
    expect(profile.healthData.appointments.length).toBeGreaterThanOrEqual(1);
  });

  test('interests include: gardening, piano, cooking, Shanghai culture', () => {
    const profile = loadMrsChenProfile();
    const interests = profile.socialProfile.interests;
    
    expect(interests).toContain('gardening');
    expect(interests).toContain('piano');
    expect(interests).toContain('cooking');
    expect(interests).toContain('Shanghai culture');
  });
});
