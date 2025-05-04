
/**
 * Determines the emotional sentiment based on common emotion terms
 * Returns "unknown" if the emotion cannot be determined locally
 */
export function determineEmotionLocally(feeling: string): "positive" | "negative" | "neutral" | "unknown" {
  if (!feeling) return "unknown";
  
  const lowerFeeling = feeling.toLowerCase();
  
  const positiveTerms = [
    "happy", "positive", "good", "excited", "glad", "grateful", 
    "joy", "joyful", "pleased", "delighted", "content", "satisfied",
    "empowered", "enthusiastic", "engaged", "optimistic", "proud",
    // Additional positive emotions
    "hopeful", "inspired", "confident", "cheerful", "elated", 
    "triumphant", "thankful", "appreciative", "relieved", "amazed", 
    "wonderful", "peaceful", "loving", "fulfilled", "accomplished",
    "encouraged", "motivated", "thrilled", "passionate", "energetic",
    "balanced", "relaxed", "calm", "eager", "interested", "fascinated",
    "valued", "respected", "brave", "strong", "determined",
    // New additions
    "happiness", "love", "gratitude", "hope", "excitement", "pride", 
    "amusement", "relief", "affection", "compassion", "admiration", 
    "trust", "empathy", "kindness", "forgiveness", "friendliness", 
    "confidence", "courage", "determination", "satisfaction", "inspiration", 
    "serenity", "optimism", "wonder", "awe", "appreciation", "warmth", 
    "peacefulness", "curiosity", "anticipation", "exhilaration", "fulfillment", 
    "bliss", "belonging", "playfulness", "tenderness", "resilience", "euphoria", 
    "zest", "security", "contentment", "glee", "generosity", "comfort", 
    "thankfulness", "affinity", "self-assurance", "exuberance", "radiance", 
    "tranquility", "self-respect", "harmony", "lovefulness", "compassionateness", 
    "invigoration", "drive", "flow", "passion", "sincerity", "altruism", 
    "connectedness", "acceptance", "mindfulness", "spontaneity", "reassurance", 
    "symbiosis", "enthralment", "positivity", "delight", "lightheartedness", 
    "mirth", "fondness", "jubilance", "refreshment", "self-worth", "vibrancy", 
    "thoughtfulness", "gratification", "enchantment", "adoration", "devotion", 
    "unity", "flexibility", "creativity", "reverence", "elevation", "exaltation", 
    "hopefulness", "trustworthiness", "aspiration", "sense of purpose"
  ];
  
  const negativeTerms = [
    "sad", "negative", "bad", "angry", "upset", "frustrated",
    "depressed", "unhappy", "disappointed", "annoyed", "mad", "displeased",
    "anxious", "worried", "stressed", "overwhelmed",
    // Additional negative emotions
    "fearful", "scared", "afraid", "terrified", "hopeless", "despairing",
    "disgusted", "appalled", "horrified", "hurt", "pained", "damaged",
    "resentful", "bitter", "hostile", "furious", "enraged", "outraged",
    "jealous", "envious", "ashamed", "embarrassed", "humiliated", "guilty",
    "remorseful", "regretful", "isolated", "lonely", "abandoned", "rejected",
    // Remove "confused" from negative terms
    "insecure", "inadequate", "incompetent",
    "exhausted", "tired", "drained", "bored", "apathetic", "indifferent",
    "suspicious", "distrustful", "betrayed", "misunderstood", "neglected",
    // New additions
    "anger", "fear", "sadness", "disgust", "guilt", "shame", "envy", 
    "jealousy", "frustration", "loneliness", "regret", "resentment", 
    "hopelessness", "despair", "anxiety", "stress", "insecurity", 
    "bitterness", "grief", "disappointment", "helplessness", "dread", 
    "doubt", "remorse", "humiliation", "rejection", "contempt", 
    "powerlessness", "agitation", "annoyance", "hostility", "rage", 
    "irritation", "melancholy", "weariness", "pessimism", "desolation", 
    "desperation", "vulnerability", "distrust", "misery", "embarrassment", 
    "self-loathing", "anguish", "sorrow", "alienation", "defeat", 
    "worthlessness", "oppression", "despondency", "nervousness", 
    "restlessness", "suspicion", "boredom", "fatigue", "overwhelm", 
    "dismay", "worry", "dissonance", "torment", "apprehension", 
    "disillusionment", "doubtfulness", "exasperation", "revulsion", 
    "uncertainty", "grudgingness", "impatience", "homesickness", 
    "indignation", "lethargy", "spite", "tension", "mortification", 
    "yearning", "inadequacy", "forlornness", "cynicism", "melodrama", 
    "isolation", "sullenness", "brooding", "hesitation", "mistrust", 
    "loathing", "vindictiveness", "repression", "gloom", "exhaustion", 
    "animosity", "irritability", "self-doubt", "malaise", "self-pity", 
    "wretchedness", "fearfulness", "subjugation", "agony", "dejection"
  ];
  
  const neutralTerms = [
    "neutral", "okay", "fine", "normal", "indifferent", "unsure",
    "mixed", "ambivalent",
    // Additional neutral emotions
    "moderate", "average", "balanced", "steady", "stable", 
    "contemplative", "thoughtful", "reflective", "observant", "reserved",
    "composed", "even-tempered", "undecided", "impartial",
    // New neutral emotions as requested by user
    "curiosity", "surprise", "interest", "contemplation", "anticipation", 
    "acceptance", "indifference", "nostalgia", "skepticism", "thoughtfulness", 
    "suspense", "wonder", "ambivalence", "neutrality", "awareness", 
    "attentiveness", "observation", "reflection", "intrigue", "sensibility", 
    "cautiousness", "stoicism", "absorption", "hesitation", "expectation", 
    "disinterest", "mildness", "equanimity", "uncertainty", "puzzlement", 
    "recognition", "realization", "passivity", "composure", "objectivity", 
    "open-mindedness", "consideration", "speculation", "receptiveness", 
    "hesitancy", "nonchalance", "detachment", "prudence", "temperance", 
    "patience", "impression", "sensation", "scrutiny", "examination", 
    "inquisitiveness", "calculation", "deliberation",
    // Make sure "confused" is included in neutral terms
    "confused", "confusion"
  ];
  
  // To prioritize correctly, let's check each list in order
  // First check if it's in the neutral list specifically to catch special cases like "confused"
  if (neutralTerms.some(term => {
    return lowerFeeling === term || // exact match
           lowerFeeling.startsWith(term + " ") || // starts with term
           lowerFeeling.endsWith(" " + term) || // ends with term
           lowerFeeling.includes(" " + term + " "); // contains term
  })) {
    return "neutral";
  }
  
  // Then check for positive terms
  if (positiveTerms.some(term => lowerFeeling.includes(term))) {
    return "positive";
  }
  
  // Then check for negative terms
  if (negativeTerms.some(term => lowerFeeling.includes(term))) {
    return "negative";
  }
  
  // If it matches the general neutral pattern (not caught by the first check)
  if (neutralTerms.some(term => lowerFeeling.includes(term))) {
    return "neutral";
  }
  
  // Cannot determine locally
  return "unknown";
}
