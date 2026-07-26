export interface CognitiveEpisode {
  episodeId: string;
  questionText: string;
  reasoningPath: string[];
  decisionFormulated: string;
  outcomeResultText: string;
  overallScore: number;
}
