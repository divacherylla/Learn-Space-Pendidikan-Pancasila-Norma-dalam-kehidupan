import { 
  Course, 
  StudentProgress, 
  User, 
  DevErrorLog, 
  PrePublishValidationResult, 
  ValidationIssue,
  PracticalSubmission,
  DrillSessionResult,
  GameProgress,
  EnrolledStudent,
  AssessmentAttempt
} from '../types';
import { INITIAL_COURSE, INITIAL_PROGRESS, INITIAL_DEV_LOGS } from '../data/mockData';

const KEYS = {
  COURSE: 'learnspace_course_norma_v11',
  PROGRESS: 'learnspace_progress_norma_v4',
  DEV_LOGS: 'learnspace_dev_logs_norma_v4',
  USER_ROLE: 'learnspace_current_role_v3',
  AUTH_USER: 'learnspace_auth_user_v3',
  PRACTICAL: 'learnspace_practical_submissions_v1',
  DRILL: 'learnspace_drill_results_v1',
  GAME: 'learnspace_game_progress_v1',
  TUTORIAL: 'learnspace_tutorial_progress_v1',
  SIMULATION_BROKEN_H5P: 'learnspace_sim_broken_h5p',
  ENROLLED_STUDENTS: 'learnspace_enrolled_students_v2',
  ASSESSMENTS: 'learnspace_assessment_attempts_v1',
  ONBOARDING: 'learnspace_onboarding_completed_v1',
};

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'failed';

class StorageService {
  private autosaveStatus: AutosaveStatus = 'saved';
  private autosaveListeners: ((status: AutosaveStatus) => void)[] = [];
  private pendingChanges: any = null;

  // Session & Auth operations
  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(KEYS.AUTH_USER);
      if (data) {
        const u = JSON.parse(data);
        if (u) {
          // Ensure clean state: no school/grade if reset, student starts with 0 badges
          if (u.role === 'student' && !u.badges) {
            u.badges = [];
            u.stars = 0;
          }
        }
        return u;
      }
    } catch {
      // ignore
    }
    return null;
  }

  saveCurrentUser(user: User | null) {
    try {
      if (user) {
        localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user));
        localStorage.setItem(KEYS.USER_ROLE, user.role);
      } else {
        localStorage.removeItem(KEYS.AUTH_USER);
      }
    } catch {
      // ignore
    }
  }

  logout() {
    this.saveCurrentUser(null);
  }

  addBonusStars(starsDelta: number): User | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    const currentStars = user.stars ?? 0;
    const updated = { ...user, stars: currentStars + starsDelta };
    this.saveCurrentUser(updated);
    return updated;
  }

  // Practical submissions
  getPracticalSubmissions(): PracticalSubmission[] {
    try {
      const data = localStorage.getItem(KEYS.PRACTICAL);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [];
  }

  savePracticalSubmission(sub: PracticalSubmission): void {
    try {
      const list = this.getPracticalSubmissions();
      const existingIdx = list.findIndex(
        s => s.studentId === sub.studentId && s.scenarioId === sub.scenarioId
      );
      if (existingIdx >= 0) {
        list[existingIdx] = sub;
      } else {
        list.push(sub);
      }
      localStorage.setItem(KEYS.PRACTICAL, JSON.stringify(list));
      this.addBonusStars(5);
    } catch {
      // ignore
    }
  }

  // Drill Results
  getDrillResults(): DrillSessionResult[] {
    try {
      const data = localStorage.getItem(KEYS.DRILL);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [];
  }

  saveDrillResult(res: DrillSessionResult): void {
    try {
      const list = this.getDrillResults();
      list.unshift(res);
      if (list.length > 50) list.pop();
      localStorage.setItem(KEYS.DRILL, JSON.stringify(list));
      if (res.masteryPercentage >= 70) {
        this.addBonusStars(10);
      } else {
        this.addBonusStars(3);
      }
    } catch {
      // ignore
    }
  }

  // Game Progress
  getGameProgress(): GameProgress {
    try {
      const data = localStorage.getItem(KEYS.GAME);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return {
      currentLevel: 1,
      totalPoints: 0,
      starsEarned: 0,
      levelsCompleted: [],
      unlockedBadge: false,
    };
  }

  saveGameProgress(gp: GameProgress): void {
    try {
      localStorage.setItem(KEYS.GAME, JSON.stringify(gp));
    } catch {
      // ignore
    }
  }

  // Tutorial Progress
  getTutorialProgress(): Record<string, number> {
    try {
      const data = localStorage.getItem(KEYS.TUTORIAL);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return {};
  }

  saveTutorialProgress(topicId: string, stageIndex: number): void {
    try {
      const prog = this.getTutorialProgress();
      prog[topicId] = Math.max(prog[topicId] || 0, stageIndex);
      localStorage.setItem(KEYS.TUTORIAL, JSON.stringify(prog));
    } catch {
      // ignore
    }
  }

  // Enrolled Students Operations (No dummy data: Starts empty 0)
  getEnrolledStudents(): EnrolledStudent[] {
    try {
      const data = localStorage.getItem(KEYS.ENROLLED_STUDENTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return [];
  }

  enrollStudent(student: EnrolledStudent): void {
    try {
      const list = this.getEnrolledStudents();
      const existingIdx = list.findIndex(s => s.id === student.id);
      if (existingIdx >= 0) {
        list[existingIdx] = { ...list[existingIdx], ...student };
      } else {
        list.push(student);
      }
      localStorage.setItem(KEYS.ENROLLED_STUDENTS, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  // Assessment Attempts
  getAssessmentAttempts(studentId?: string): AssessmentAttempt[] {
    try {
      const data = localStorage.getItem(KEYS.ASSESSMENTS);
      if (data) {
        const parsed: AssessmentAttempt[] = JSON.parse(data);
        if (studentId) {
          return parsed.filter(a => a.studentId === studentId);
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  }

  saveAssessmentAttempt(attempt: AssessmentAttempt): void {
    try {
      const list = this.getAssessmentAttempts();
      list.unshift(attempt);
      localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  // Student Onboarding Status
  hasCompletedOnboarding(): boolean {
    try {
      return localStorage.getItem(KEYS.ONBOARDING) === 'true';
    } catch {
      return false;
    }
  }

  setOnboardingCompleted(val: boolean): void {
    try {
      localStorage.setItem(KEYS.ONBOARDING, String(val));
    } catch {
      // ignore
    }
  }

  // Initialize data in localStorage if empty
  init() {
    try {
      if (!localStorage.getItem(KEYS.COURSE)) {
        localStorage.setItem(KEYS.COURSE, JSON.stringify(INITIAL_COURSE));
      }
      if (!localStorage.getItem(KEYS.PROGRESS)) {
        localStorage.setItem(KEYS.PROGRESS, JSON.stringify([]));
      }
      if (!localStorage.getItem(KEYS.DEV_LOGS)) {
        localStorage.setItem(KEYS.DEV_LOGS, JSON.stringify(INITIAL_DEV_LOGS));
      }
    } catch {
      // Safe fallback if localStorage is unavailable
    }
  }

  // Course operations
  getCourse(): Course {
    try {
      const data = localStorage.getItem(KEYS.COURSE);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed?.title && parsed.title.includes('Bab 2')) {
          parsed.title = parsed.title.replace(/Bab 2\s*–?\s*:?\s*/gi, '').trim();
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_COURSE;
  }

  saveCourse(course: Course): Promise<boolean> {
    this.setAutosaveStatus('saving');
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const updatedCourse = {
            ...course,
            lastSavedAt: new Date().toISOString(),
          };
          localStorage.setItem(KEYS.COURSE, JSON.stringify(updatedCourse));
          this.setAutosaveStatus('saved');
          resolve(true);
        } catch (err) {
          this.setAutosaveStatus('failed');
          this.logDevError({
            id: 'err_' + Date.now(),
            timestamp: new Date().toISOString(),
            code: 'STORAGE_SAVE_ERROR',
            message: 'Failed to write course to localStorage',
            details: (err as Error).message,
            resolved: false,
          });
          resolve(false);
        }
      }, 500);
    });
  }

  // Autosave status subscription
  onAutosaveChange(callback: (status: AutosaveStatus) => void): () => void {
    this.autosaveListeners.push(callback);
    callback(this.autosaveStatus);
    return () => {
      this.autosaveListeners = this.autosaveListeners.filter(cb => cb !== callback);
    };
  }

  private setAutosaveStatus(status: AutosaveStatus) {
    this.autosaveStatus = status;
    this.autosaveListeners.forEach(listener => listener(status));
  }

  // Student Progress operations
  getAllProgress(): StudentProgress[] {
    try {
      const data = localStorage.getItem(KEYS.PROGRESS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    return INITIAL_PROGRESS;
  }

  getProgressForActivity(studentId: string, activityId: string): StudentProgress | undefined {
    const list = this.getAllProgress();
    return list.find(p => p.studentId === studentId && p.activityId === activityId);
  }

  recordProgress(progress: Omit<StudentProgress, 'id'>): StudentProgress {
    const all = this.getAllProgress();
    const existingIndex = all.findIndex(
      p => p.studentId === progress.studentId && p.activityId === progress.activityId
    );

    const now = new Date().toISOString();
    let updatedRecord: StudentProgress;

    if (existingIndex >= 0) {
      updatedRecord = {
        ...all[existingIndex],
        ...progress,
        attempts: (all[existingIndex].attempts || 1) + 1,
        lastAttemptAt: now,
      };
      all[existingIndex] = updatedRecord;
    } else {
      updatedRecord = {
        ...progress,
        id: 'prg_' + Date.now(),
        attempts: 1,
        lastAttemptAt: now,
      };
      all.push(updatedRecord);
    }

    try {
      localStorage.setItem(KEYS.PROGRESS, JSON.stringify(all));
    } catch {
      // safely handle storage limit
    }

    return updatedRecord;
  }

  // Pre-Publish Validation
  validateCourseForPublish(course: Course): PrePublishValidationResult {
    const issues: ValidationIssue[] = [];
    let totalActivities = 0;
    let totalH5P = 0;
    let validH5PCount = 0;

    // 1. Course title
    if (!course.title || course.title.trim().length < 5) {
      issues.push({
        severity: 'critical',
        field: 'title',
        message: 'Course harus memiliki judul yang jelas (minimal 5 karakter).',
        section: 'Informasi Course',
      });
    }

    // 2. Course description
    if (!course.description || course.description.trim().length < 15) {
      issues.push({
        severity: 'critical',
        field: 'description',
        message: 'Deskripsi pembelajaran wajib diisi agar siswa memahami tujuan belajar.',
        section: 'Informasi Course',
      });
    }

    // 3. Learning objectives
    if (!course.learningObjectives || course.learningObjectives.length === 0) {
      issues.push({
        severity: 'critical',
        field: 'learningObjectives',
        message: 'Minimal sediakan 1 capaian pembelajaran (Learning Objective).',
        section: 'Capaian Belajar',
      });
    }

    // 4. Modules check
    if (!course.modules || course.modules.length === 0) {
      issues.push({
        severity: 'critical',
        field: 'modules',
        message: 'Course harus memiliki setidaknya 1 modul pembelajaran.',
        section: 'Struktur Modul',
      });
    } else {
      course.modules.forEach((mod, modIdx) => {
        if (!mod.activities || mod.activities.length === 0) {
          issues.push({
            severity: 'critical',
            field: `module_${mod.id}`,
            message: `Modul "${mod.title || `Modul ${modIdx + 1}`}" belum memiliki aktivitas pembelajaran.`,
            section: 'Aktivitas Belajar',
          });
        } else {
          mod.activities.forEach((act) => {
            totalActivities++;
            if (!act.title || act.title.trim() === '') {
              issues.push({
                severity: 'critical',
                field: `act_${act.id}_title`,
                message: `Terdapat aktivitas tanpa judul di ${mod.title}.`,
                section: 'Aktivitas Belajar',
              });
            }

            if (act.type === 'h5p') {
              totalH5P++;
              if (!act.h5pPackage) {
                issues.push({
                  severity: 'critical',
                  field: `act_${act.id}_h5p`,
                  message: `Aktivitas "${act.title}" belum memiliki paket H5P dari Lumi.`,
                  section: 'Media Interaktif H5P',
                });
              } else if (!act.h5pPackage.isValidated) {
                issues.push({
                  severity: 'critical',
                  field: `act_${act.id}_h5p_val`,
                  message: `Paket H5P pada "${act.title}" belum melalui proses validasi.`,
                  section: 'Media Interaktif H5P',
                });
              } else if (act.h5pPackage.validationStatus === 'invalid') {
                issues.push({
                  severity: 'critical',
                  field: `act_${act.id}_h5p_broken`,
                  message: `Paket H5P pada "${act.title}" dinyatakan rusak: ${act.h5pPackage.validationErrors?.join(', ') || 'file corrupt'}.`,
                  section: 'Media Interaktif H5P',
                });
              } else {
                validH5PCount++;
                if (act.h5pPackage.validationStatus === 'warning') {
                  issues.push({
                    severity: 'warning',
                    field: `act_${act.id}_h5p_warn`,
                    message: `Media "${act.title}" menggunakan library non-standar, siswa disarankan menggunakan browser terbaru.`,
                    section: 'Media Interaktif H5P',
                  });
                }
              }
            }
          });
        }
      });
    }

    const hasCritical = issues.some(i => i.severity === 'critical');

    return {
      canPublish: !hasCritical,
      checkedAt: new Date().toISOString(),
      issues,
      stats: {
        totalModules: course.modules.length,
        totalActivities,
        totalH5P,
        validH5PCount,
      },
    };
  }

  // Dev error logging for observability
  getDevLogs(): DevErrorLog[] {
    try {
      const data = localStorage.getItem(KEYS.DEV_LOGS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_DEV_LOGS;
  }

  logDevError(log: DevErrorLog) {
    const logs = this.getDevLogs();
    logs.unshift(log);
    // Keep last 50
    if (logs.length > 50) logs.pop();
    try {
      localStorage.setItem(KEYS.DEV_LOGS, JSON.stringify(logs));
    } catch {
      // ignore
    }
  }

  clearDevLogs() {
    try {
      localStorage.setItem(KEYS.DEV_LOGS, JSON.stringify([]));
    } catch {
      // ignore
    }
  }

  // Simulation flags for testing
  isSimulatingBrokenH5P(): boolean {
    return localStorage.getItem(KEYS.SIMULATION_BROKEN_H5P) === 'true';
  }

  setSimulateBrokenH5P(val: boolean) {
    localStorage.setItem(KEYS.SIMULATION_BROKEN_H5P, val ? 'true' : 'false');
  }

  // Reset to initial demo data
  resetAll() {
    try {
      localStorage.setItem(KEYS.COURSE, JSON.stringify(INITIAL_COURSE));
      localStorage.setItem(KEYS.PROGRESS, JSON.stringify(INITIAL_PROGRESS));
      localStorage.setItem(KEYS.DEV_LOGS, JSON.stringify(INITIAL_DEV_LOGS));
      localStorage.removeItem(KEYS.SIMULATION_BROKEN_H5P);
    } catch {
      // ignore
    }
  }
}

export const storageService = new StorageService();
storageService.init();
