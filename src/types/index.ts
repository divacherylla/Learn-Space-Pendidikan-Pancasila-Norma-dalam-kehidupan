export type Role = 'student' | 'teacher' | 'admin';

export type LearningStage =
  | 'welcome'
  | 'get-ready'
  | 'real-life-context'
  | 'explore'
  | 'learn'
  | 'practice'
  | 'apply'
  | 'assess'
  | 'reflect'
  | 'celebrate';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  grade?: string; // e.g. "Kelas V-A"
  schoolName?: string;
  stars?: number;
  badges?: string[];
}

export interface H5PDependency {
  machineName: string;
  majorVersion: number;
  minorVersion: number;
}

export interface H5PMetadata {
  title: string;
  mainLibrary: string;
  preloadedDependencies: H5PDependency[];
  author?: string;
  license?: string;
  description?: string;
}

export interface H5PContentPackage {
  id: string;
  title: string;
  library: string; // e.g. "H5P.InteractiveVideo 1.22", "H5P.BranchingScenario 1.5", "H5P.DragQuestion 1.14"
  mainLibrary: string;
  embedUrl?: string; // Live Lumi Cloud embed URL (e.g. https://app.lumi.education/api/v1/run/Gh_GSY/embed)
  embedCode?: string; // Raw <iframe> embed code
  metadata: H5PMetadata;
  content: any; // The Lumi content.json object
  rawFileName?: string;
  fileSizeBytes?: number;
  uploadedAt: string;
  isValidated: boolean;
  validationStatus: 'valid' | 'warning' | 'invalid';
  validationErrors?: string[];
  passingScore?: number;
}

export type ActivityType = 'h5p' | 'context-story' | 'reflection' | 'interactive-checkpoint';

export interface Activity {
  id: string;
  moduleId: string;
  title: string;
  stage: LearningStage;
  stageLabel: string;
  estimatedMinutes: number;
  difficulty: 'mudah' | 'sedang' | 'menantang';
  instruction: string;
  learningObjective: string;
  type: ActivityType;
  storyContext?: {
    headline: string;
    narrative: string;
    character: string;
    sceneQuestion: string;
    imageUrl?: string;
  };
  h5pPackage?: H5PContentPackage;
  reflectionPrompt?: string;
  passingScore: number;
  maxScore: number;
  isRequired: boolean;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  activities: Activity[];
  isLocked?: boolean;
}

export interface Course {
  id: string;
  title: string;
  subject: string; // "Pendidikan Pancasila / PKn"
  grade: string; // "Kelas V SD"
  semester: string; // "Semester 1"
  description: string;
  learningObjectives: string[];
  authorName: string;
  coverImage: string;
  status: 'draft' | 'published';
  lastSavedAt: string;
  modules: Module[];
}

export interface StudentProgress {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  moduleId: string;
  activityId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  maxScore?: number;
  percentage?: number;
  attempts?: number;
  timeSpentSeconds: number;
  lastAttemptAt: string;
  completedAt?: string;
  reflectionMood?: 'senang' | 'bangga' | 'penasaran' | 'perlu-bantuan';
  reflectionText?: string;
  teacherFeedback?: string;
}

export interface ValidationIssue {
  severity: 'critical' | 'warning';
  field: string;
  message: string;
  section: string;
}

export interface PrePublishValidationResult {
  canPublish: boolean;
  checkedAt: string;
  issues: ValidationIssue[];
  stats: {
    totalModules: number;
    totalActivities: number;
    totalH5P: number;
    validH5PCount: number;
  };
}

export interface DevErrorLog {
  id: string;
  timestamp: string;
  code: string;
  message: string;
  details?: string;
  context?: {
    userId?: string;
    courseId?: string;
    activityId?: string;
    h5pLibrary?: string;
    phase?: string;
  };
  resolved: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'pancasila' | 'gotong-royong' | 'musyawarah' | 'refleksi';
}

// 1. TUTORIAL TYPES
export interface TutorialCheckpointQuestion {
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface TutorialHotspot {
  id: string;
  title: string;
  description: string;
  xPercent: number;
  yPercent: number;
  iconName?: string;
}

export interface TutorialTopic {
  id: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  stages: {
    intro: {
      title: string;
      leadText: string;
      whyImportant: string;
    };
    objectives: string[];
    realLifeSituation: {
      headline: string;
      story: string;
      questionPrompt: string;
    };
    material: {
      cards: {
        id: string;
        title: string;
        definition: string;
        source: string;
        sanksi: string;
        color: string;
        iconName: string;
      }[];
      hotspots?: TutorialHotspot[];
      accordionDetails?: {
        title: string;
        content: string;
      }[];
    };
    examples: {
      title: string;
      situation: string;
      normaType: string;
      positiveAction: string;
    }[];
    checkpoint: TutorialCheckpointQuestion;
    summary: {
      keyPoints: string[];
      reflectionPrompt: string;
    };
  };
}

// 2. PRACTICAL TYPES
export type PracticalCategory = 'rumah' | 'sekolah' | 'musyawarah';

export interface PracticalScenario {
  id: string;
  title: string;
  category: PracticalCategory;
  categoryLabel: string;
  objective: string;
  situationHeadline: string;
  situationNarrative: string;
  instruction: string;
  options: {
    id: string;
    label: string;
    description: string;
    isRecommended: boolean;
    consequence: string;
  }[];
  classificationTask?: {
    instruction: string;
    items: {
      id: string;
      text: string;
      isAppropriate: boolean;
    }[];
  };
  reflectionPrompt: string;
}

export interface PracticalSubmission {
  id: string;
  studentId: string;
  studentName: string;
  scenarioId: string;
  scenarioTitle: string;
  category: PracticalCategory;
  selectedOptionId: string;
  selectedOptionLabel: string;
  reasoningText: string;
  reflectionText: string;
  classificationScore?: number;
  feedback: string;
  submittedAt: string;
}

// 3. DRILL & GAME TYPES
export type DrillDifficulty = 'mudah' | 'sedang' | 'menantang';

export interface DrillQuestion {
  id: string;
  topic: string;
  difficulty: DrillDifficulty;
  type: 'multiple-choice' | 'true-false' | 'matching';
  question: string;
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  correctAnswerBool?: boolean;
  matchingPairs?: {
    left: string;
    right: string;
  }[];
  explanation: string;
}

export interface DrillSessionResult {
  id: string;
  studentId: string;
  studentName: string;
  topic: string;
  difficulty: DrillDifficulty;
  correctCount: number;
  totalQuestions: number;
  masteryPercentage: number;
  completedAt: string;
  recommendation: string;
}

export interface GameLevel {
  id: number;
  code: string;
  title: string;
  missionName: string;
  objective: string;
  description: string;
  targetScore: number;
}

export interface GameProgress {
  currentLevel: number;
  totalPoints: number;
  starsEarned: number;
  levelsCompleted: number[];
  unlockedBadge: boolean;
}

// 4. LEARNING CHATBOT TYPES
export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  quickAction?: {
    label: string;
    targetTab: string;
  };
}

// 5. ENROLLED STUDENT (Empty initially in Teacher Dashboard)
export interface EnrolledStudent {
  id: string;
  name: string;
  email?: string;
  enrolledAt: string;
  completedActivities: number;
  totalActivities: number;
  averageScore: number;
  status: 'aktif' | 'selesai' | 'perlu-bimbingan';
  needsHelp: boolean;
  stars?: number;
}

// 6. ASSESSMENT TYPES (Pre, Formative, Final)
export type AssessmentType = 'pre' | 'formative' | 'final';

export interface AssessmentQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'matching' | 'case-study';
  question: string;
  context?: string;
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  correctAnswerBool?: boolean;
  matchingPairs?: {
    left: string;
    right: string;
  }[];
  explanation: string;
  topicTag: string;
}

export interface AssessmentAttempt {
  id: string;
  studentId: string;
  studentName: string;
  assessmentType: AssessmentType;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  answers: Record<string, any>;
  topicsToReview: string[];
}


