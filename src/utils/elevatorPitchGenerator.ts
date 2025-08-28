interface FormData {
  name: string;
  whatsapp: string;
  company: string;
  category: string;
  usp: string;
  specificAsk: string;
}

export function generateElevatorPitch(formData: FormData): string {
  const { company, category, usp, specificAsk } = formData;
  
  // Template variations for natural language
  const openings = [
    `Hi, I'm from ${company}.`,
    `I represent ${company}.`,
    `${company} is a ${category.toLowerCase()} company that`,
    `We're ${company}, and we`
  ];
  
  const problemStatements = [
    "Many businesses struggle with",
    "The challenge in our industry is",
    "What we've noticed is that",
    "The problem we solve is"
  ];
  
  const solutionIntros = [
    "That's where we come in.",
    "Here's how we help:",
    "Our solution is simple:",
    "What makes us different is"
  ];
  
  const callToActions = [
    "I'd love to show you how we can help your business.",
    "Let's schedule a quick call to discuss how this could work for you.",
    "Would you be interested in learning more?",
    "I think this could be exactly what you're looking for."
  ];
  
  // Extract key information for the pitch
  const targetInfo = specificAsk.toLowerCase();
  let targetAudience = "businesses";
  let goal = "grow and succeed";
  
  // Parse target audience
  if (targetInfo.includes("small business") || targetInfo.includes("startups")) {
    targetAudience = "small businesses and startups";
  } else if (targetInfo.includes("enterprise") || targetInfo.includes("large")) {
    targetAudience = "enterprise clients";
  } else if (targetInfo.includes("consumer") || targetInfo.includes("individual")) {
    targetAudience = "consumers";
  }
  
  // Parse goals
  if (targetInfo.includes("save") || targetInfo.includes("cost") || targetInfo.includes("money")) {
    goal = "reduce costs and improve efficiency";
  } else if (targetInfo.includes("grow") || targetInfo.includes("scale") || targetInfo.includes("expand")) {
    goal = "scale and grow their operations";
  } else if (targetInfo.includes("automate") || targetInfo.includes("streamline")) {
    goal = "streamline their processes";
  } else if (targetInfo.includes("customer") || targetInfo.includes("client")) {
    goal = "better serve their customers";
  }
  
  // Generate the pitch
  const opening = openings[Math.floor(Math.random() * openings.length)];
  const problem = `Most ${targetAudience} in the ${category.toLowerCase()} space face challenges when trying to ${goal}.`;
  const solution = `${solutionIntros[Math.floor(Math.random() * solutionIntros.length)]} ${usp}`;
  const callToAction = callToActions[Math.floor(Math.random() * callToActions.length)];
  
  return `${opening} ${problem} ${solution} ${callToAction}`;
}

export function generatePitchVariations(formData: FormData): string[] {
  const variations = [];
  
  // Generate 3 different variations
  for (let i = 0; i < 3; i++) {
    variations.push(generateElevatorPitch(formData));
  }
  
  return variations;
}

export function calculatePitchLength(pitch: string): number {
  // Average speaking pace is about 150 words per minute
  // For a 30-second pitch, that's roughly 75 words
  const words = pitch.split(' ').length;
  const estimatedSeconds = Math.round((words / 150) * 60);
  return estimatedSeconds;
}