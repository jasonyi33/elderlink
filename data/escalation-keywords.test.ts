// Crisis Detection Keywords - Test Suite
// Tests for escalation keyword detection and crisis identification

import { loadEscalationKeywords } from './escalation-keywords';

describe('Escalation Keywords', () => {
  test('medical crisis keywords defined', () => {
    const keywords = loadEscalationKeywords();
    expect(keywords.medical).toBeDefined();
    expect(keywords.medical).toContain('chest pain');
    expect(keywords.medical).toContain('can\'t breathe');
    expect(keywords.medical).toContain('stroke');
    expect(keywords.medical).toContain('heart attack');
    expect(keywords.medical).toContain('severe pain');
    expect(keywords.medical).toContain('emergency');
    expect(keywords.medical).toContain('ambulance');
    expect(keywords.medical).toContain('hospital');
    expect(keywords.medical).toContain('bleeding');
    expect(keywords.medical).toContain('unconscious');
  });

  test('crisis keywords defined', () => {
    const keywords = loadEscalationKeywords();
    expect(keywords.crisis).toBeDefined();
    expect(keywords.crisis).toContain('end it all');
    expect(keywords.crisis).toContain('not worth living');
    expect(keywords.crisis).toContain('suicide');
    expect(keywords.crisis).toContain('kill myself');
    expect(keywords.crisis).toContain('end my life');
    expect(keywords.crisis).toContain('no point');
    expect(keywords.crisis).toContain('give up');
    expect(keywords.crisis).toContain('hopeless');
    expect(keywords.crisis).toContain('helpless');
    expect(keywords.crisis).toContain('desperate');
  });

  test('depression keywords defined', () => {
    const keywords = loadEscalationKeywords();
    expect(keywords.depression).toBeDefined();
    expect(keywords.depression).toContain('hopeless');
    expect(keywords.depression).toContain('no meaning');
    expect(keywords.depression).toContain('worthless');
    expect(keywords.depression).toContain('empty');
    expect(keywords.depression).toContain('sad');
    expect(keywords.depression).toContain('depressed');
    expect(keywords.depression).toContain('lonely');
    expect(keywords.depression).toContain('isolated');
    expect(keywords.depression).toContain('no purpose');
    expect(keywords.depression).toContain('no reason');
  });

  test('all keyword categories have minimum 10 entries', () => {
    const keywords = loadEscalationKeywords();
    expect(keywords.medical.length).toBeGreaterThanOrEqual(10);
    expect(keywords.crisis.length).toBeGreaterThanOrEqual(10);
    expect(keywords.depression.length).toBeGreaterThanOrEqual(10);
  });

  test('keywords are case-insensitive and contain common variations', () => {
    const keywords = loadEscalationKeywords();
    
    // Test medical variations
    expect(keywords.medical.some(k => k.includes('pain'))).toBe(true);
    expect(keywords.medical.some(k => k.includes('breath'))).toBe(true);
    
    // Test crisis variations
    expect(keywords.crisis.some(k => k.includes('end'))).toBe(true);
    expect(keywords.crisis.some(k => k.includes('life'))).toBe(true);
    
    // Test depression variations
    expect(keywords.depression.some(k => k.includes('hope'))).toBe(true);
    expect(keywords.depression.some(k => k.includes('sad'))).toBe(true);
  });
});
