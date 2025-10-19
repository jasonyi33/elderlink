import { detectLanguage, extractEnergyLevel, selectVoice } from './conversation-helpers';

describe('Conversation Helpers', () => {
  describe('Language Detection', () => {
    test('detects Mandarin from Chinese characters', () => {
      const result = detectLanguage("我今天很好");
      expect(result).toBe("mandarin");
    });

    test('detects English from English text', () => {
      const result = detectLanguage("Hello, how are you?");
      expect(result).toBe("english");
    });

    test('detects mixed language and returns primary language', () => {
      const result = detectLanguage("我很好, how are you?");
      expect(result).toBe("mandarin"); // Should detect primary language
    });

    test('defaults to English for unknown text', () => {
      const result = detectLanguage("123456");
      expect(result).toBe("english");
    });
  });

  describe('Energy Level Extraction', () => {
    test('detects high energy from excited text', () => {
      const result = extractEnergyLevel("I'm so excited!");
      expect(result).toBe("high");
    });

    test('detects low energy from tired text', () => {
      const result = extractEnergyLevel("Tired.");
      expect(result).toBe("low");
    });

    test('detects normal energy from neutral text', () => {
      const result = extractEnergyLevel("I'm doing okay today");
      expect(result).toBe("normal");
    });

    test('detects high energy from multiple exclamation marks', () => {
      const result = extractEnergyLevel("Great!!! Wonderful!!!");
      expect(result).toBe("high");
    });

    test('detects low energy from short, minimal responses', () => {
      const result = extractEnergyLevel("Fine");
      expect(result).toBe("low");
    });
  });

  describe('Voice Selection', () => {
    test('selects Mandarin voice for Mandarin language', () => {
      const result = selectVoice("mandarin");
      expect(result).toBe("FGY2WhTYpPnrIDTdsKH5"); // Mandarin voice ID
    });

    test('selects English voice for English language', () => {
      const result = selectVoice("english");
      expect(result).toBe("EXAVITQu4vr4xnSDxMaL"); // English voice ID
    });

    test('defaults to English voice for unknown language', () => {
      const result = selectVoice("unknown");
      expect(result).toBe("EXAVITQu4vr4xnSDxMaL"); // English voice ID
    });
  });
});
