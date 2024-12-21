export type Evidence = {
  type: string;
  path: string;
  reason: string;
};

export type PredictedPattern = {
  patternName: string;
  confidence: number;
  evidence: Evidence[];
};

export type UnusualPattern = {
  description: string;
  confidence: number;
  evidence: Evidence[];
};

export type RepositoryAnalysis = {
  repoName: string;
  lastCommitHash: string;
  analysisDate: string;
  predictedDesignPatterns: PredictedPattern[];
  unusualPatterns: UnusualPattern[];
};

export type Meta = {
  analyzedCommits: number;
  analyzedBranches: number;
  analyzedIssues: number; 
  linesOfCode: number;
  toolVersion: string;
};

export type AnalysisJson = {
  repositoryAnalysis: RepositoryAnalysis;
  meta: Meta;
};

export function transformToMarkdown(json: AnalysisJson): string {
  const { repositoryAnalysis, meta } = json;

  let markdown = `# Repository Analysis: ${repositoryAnalysis.repoName}\n\n`;

  repositoryAnalysis.analysisDate = new Date().toUTCString();
  if (repositoryAnalysis.lastCommitHash){
    markdown += `**Last Commit Hash:** ${repositoryAnalysis.lastCommitHash}\n`;
  }
  else {
    markdown += `**Last Commit Hash:** Undetermined\n`;
  }

  markdown += `**Analysis Date:** ${repositoryAnalysis.analysisDate}\n\n`;

  markdown += `## Predicted Design Patterns\n\n`;

  if (repositoryAnalysis.predictedDesignPatterns.length === 0) {
    markdown += `No design patterns detected.\n\n`;
  } else {
    repositoryAnalysis.predictedDesignPatterns.forEach((pattern) => {
      markdown += `### ${pattern.patternName}\n`;
      markdown += `**Confidence:** ${(pattern.confidence * 100).toFixed(2)}%\n\n`;
      pattern.evidence.forEach((evidence, index) => {
        markdown += `#### Evidence #${index + 1}\n`; 
        markdown += `- **Type:** ${evidence.type}\n`;
        markdown += `  - **Path:** ${evidence.path}\n`;
        markdown += `  - **Reason:** ${evidence.reason}\n\n`;
      });
      markdown += `\n`;
    });
  }

  markdown += `## Unusual Patterns\n\n`;

  if (repositoryAnalysis.unusualPatterns.length === 0) {
    markdown += `No unusual patterns detected.\n\n`;
  } else {
    repositoryAnalysis.unusualPatterns.forEach((pattern) => {
      if (pattern.evidence && pattern.confidence && pattern.description) { 
        markdown += `### ${pattern.description}\n`;
        markdown += `**Confidence:** ${(pattern.confidence * 100).toFixed(2)}%\n\n`;
        
        pattern.evidence.forEach((evidence, index) => {
          markdown += `#### Evidence #${index +1}:\n`;
          markdown += `- **Type:** ${evidence.type}\n`;
          markdown += `  - **Path:** ${evidence.path}\n`;          
          markdown += `  - **Reason:** ${evidence.reason}\n`;
        });  
        
        markdown += `\n`;
      }
    });
  }

  markdown += `## Meta Information\n\n`;
  if (meta.analyzedCommits){
    markdown += `- **Commits Analyzed:** ${meta.analyzedCommits}\n`;
  }
  if (meta.analyzedBranches){
    markdown += `- **Branches Analyzed:** ${meta.analyzedBranches}\n`;
  }
  if (meta.analyzedIssues){
    markdown += `- **Issues Analyzed:** ${meta.analyzedIssues}\n`;
  }
  markdown += `- **Lines of Code:** ${meta.linesOfCode}\n`;
  markdown += `- **Tool Version:** 1.0\n`;

  return markdown;
}

