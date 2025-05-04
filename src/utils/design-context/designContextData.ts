
/**
 * Design context data for AI prompts
 * This file contains specialized design knowledge that will be injected into AI prompts
 * to provide better guidance for design-related questions.
 */

export const designContextData = `
DESIGN BEST PRACTICES:

Designing a story collection is a critical element of a Culture Sprint, as it forms the foundation for understanding the existing culture and identifying areas for potential change.
It is important to gather authentic, context-rich experiences directly from the people within the organization to uncover the true "way we do things around here".

STORY COLLECTION PRINCIPLES:
- Story questions should be open-ended and invite personal experiences
- Questions should be formulated to encourage narrative responses rather than opinions
- Story questions should avoid leading language that suggests a preferred answer
- Effective story questions often begin with "Tell me about a time when..." or similar phrases
- Questions should be specific enough to guide the response but broad enough to allow diverse experiences

SLIDER QUESTION GUIDELINES:
- Slider questions should measure a spectrum or dimension of the story
- Labels at each end of the slider should be clear opposites or represent distinct ends of a spectrum
- Slider themes should connect directly to project goals and factors identified in the define phase
- Avoid technical jargon in slider questions and labels
- Each slider should focus on a single dimension or attribute
- Ideal slider questions help reveal patterns across multiple stories

PARTICIPANT QUESTION CONSIDERATIONS:
- Only collect demographic information that is directly relevant to understanding patterns
- Ensure participant questions are respectful and inclusive
- Offer appropriate options for all participants
- Consider privacy implications when asking for personal information
- Use standard categories when possible for consistency

NARRATIVE INQUIRY METHODOLOGIES:
- Participatory narrative inquiry centers the voices and experiences of participants
- The goal is to collect and analyze stories to identify patterns and insights
- Stories provide context and human dimension to data
- Qualitative insights from stories complement quantitative data
- Interpreting patterns requires balancing researcher and participant perspectives

DEFINING THE FOCUS OF EXPLORATION

Before designing the story collection, it's crucial to define what aspect of the cultural landscape you want to explore.
This involves understanding the organization context and setting boundaries for the data collection.
This focus might be driven by specific challenges the organization is facing, such as misalignment, low engagement, or the need to adapt to a strategic shift.
Clearly defining the focus ensures that the collected stories are relevant to the goals of the Culture Sprint.

CHOOSING THE COLLECTION METHOD

A Culture Sprint prioritizes anonymous, context-rich experiences over traditional methods like interviews or focus groups.
This is because interviews and focus groups can introduce biases and limit candor.
Instead, the emphasis is on collecting firsthand accounts to provide unfiltered insights into the actual culture.

CRAFTING EFFECTIVE STORY ELICITING QUESTIONS

Designing effective story-eliciting questions is paramount to gathering the desired authentic experiences.
Here are some key principles:

- Focus on "What Happened?": Questions should encourage participants to share stories rather than opinions or facts. Using the "What happened?" phrasing can significantly increase the likelihood of getting a narrative response.
- Align Questions with the Goal: The questions should be tailored to the specific cultural aspect you want to understand (e.g., employee retention, team dynamics, innovation). Categories of questions can be designed to surface concerns, bring communities together, foster innovation, understand why people stay or leave, and many other specific purposes.
- Keep Questions Open-Ended: Allow participants to share their experiences in their own words without leading them towards specific answers.
- Consider the Emotional Tone and Importance: Including questions about the emotional tone of the story and its importance to the participant can provide deeper insights.
- Test Your Questions: It is crucial to test the story form before using it for widespread data collection. This involves testing on yourself, trusted individuals, and a small group of participants to identify any confusing, leading, or inappropriate questions.

ENSURING ANONYMITY AND CANDOR

Anonymity is crucial to encourage participants to share their genuine experiences without fear of repercussions.
Anonymous experiences offer more authenticity and depth compared to methods where identities are known.
When inviting people to participate, it's important to clearly communicate that everything they say will be anonymous.

PROVIDING CONTEXT AND CLEAR INSTRUCTIONS

When introducing the story collection, it's important to provide context about the purpose of the exercise and how their contributions will be used. Clear instructions on how to share their experiences should also be provided.

For surveys, the Culture Sprint Platform is designed to:
- Encourage detailed responses.
- Make all questions optional to respect participant autonomy and avoid scaring people off.
- Consider the order of questions, placing more factual questions later to avoid an interrogatory feel.
- Avoid splitting the survey onto multiple pages to allow participants to see the whole context.
- Use plain, respectful, and inclusive language, avoiding jargon.

SUPPORTING THE COLLECTION PROCESS

The preparation phase of a Culture Sprint includes training a team within the organization on best practices for collecting experiences, making the process inclusive.
Engaging a pilot group to refine the language and approach can also ensure that the data collection resonates throughout the organization.

GATHERING ENOUGH DATA

While a Culture Sprint is designed to be a condensed process, it's important to gather a sufficient number of context-rich experiences to identify meaningful patterns.
Multiple invitations might be necessary to gather enough stories, emphasizing a positive and hopeful tone and addressing potential reasons for non-response.
`;

/**
 * Returns the design context data, optionally with a focus area
 * @param area Optional area to focus on (story, slider, participant)
 * @returns The relevant design context data
 */
export const getDesignContext = (area?: 'story' | 'slider' | 'participant'): string => {
  // Return the full context by default
  if (!area) return designContextData;
  
  // Filter to relevant sections based on the area
  const sections = designContextData.split('\n\n');
  
  if (area === 'story') {
    return sections.filter(section => 
      section.includes('STORY COLLECTION PRINCIPLES') || 
      section.includes('NARRATIVE INQUIRY')
    ).join('\n\n');
  }
  
  if (area === 'slider') {
    return sections.filter(section => 
      section.includes('SLIDER QUESTION GUIDELINES')
    ).join('\n\n');
  }
  
  if (area === 'participant') {
    return sections.filter(section => 
      section.includes('PARTICIPANT QUESTION CONSIDERATIONS')
    ).join('\n\n');
  }
  
  return designContextData;
};
