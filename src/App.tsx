import React, { useState } from 'react';
import { Course, User, H5PContentPackage } from './types';
import { storageService } from './services/storageService';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/common/Header';
import { NetworkStatusBanner } from './components/common/NetworkStatusBanner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { StudentDashboard } from './components/student/StudentDashboard';
import { LearningJourneyPlayer } from './components/student/LearningJourneyPlayer';
import { StudentAchievements } from './components/student/StudentAchievements';
import { StudentNotifications } from './components/student/StudentNotifications';
import { StudentProfile } from './components/student/StudentProfile';
import { ChapterSummaryView } from './components/student/ChapterSummaryView';
import { TutorialView } from './components/student/tutorial/TutorialView';
import { PracticalView } from './components/student/practical/PracticalView';
import { DrillGameView } from './components/student/drillgame/DrillGameView';
import { ChatbotView } from './components/student/chatbot/ChatbotView';
import { AssessmentView } from './components/student/assessment/AssessmentView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { CourseBuilder } from './components/teacher/CourseBuilder';
import { StudentMonitoringTable } from './components/teacher/StudentMonitoringTable';
import { H5PUploader } from './components/h5p/H5PUploader';
import { H5PPreview } from './components/h5p/H5PPreview';
import { HealthCheckModal } from './components/system/HealthCheckModal';
import { DevLogsModal } from './components/system/DevLogsModal';
import { PrePublishModal } from './components/teacher/PrePublishModal';

export default function App() {
  // Authentication & Active User Session
  const [currentUser, setCurrentUser] = useState<User | null>(() => storageService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>(() => {
    const user = storageService.getCurrentUser();
    return user?.role === 'teacher' ? 'teacher-dashboard' : 'dashboard';
  });

  const [course, setCourse] = useState<Course>(() => storageService.getCourse());
  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>(undefined);

  // Modals (Teacher / System)
  const [showHealthCheck, setShowHealthCheck] = useState<boolean>(false);
  const [showDevLogs, setShowDevLogs] = useState<boolean>(false);
  const [showPrePublishModal, setShowPrePublishModal] = useState<boolean>(false);
  const [previewPackage, setPreviewPackage] = useState<H5PContentPackage | null>(null);

  // Offline network banner
  const [simulatedOffline, setSimulatedOffline] = useState<boolean>(false);

  // Handle Login from Beranda Masuk
  const handleLogin = (user: User) => {
    storageService.saveCurrentUser(user);
    if (user.role === 'student') {
      storageService.enrollStudent({
        id: user.id,
        name: user.name,
        email: user.email,
        enrolledAt: new Date().toISOString(),
        completedActivities: 0,
        totalActivities: 11,
        averageScore: 0,
        status: 'aktif',
        needsHelp: false,
        stars: user.stars ?? 0,
      });
    }
    setCurrentUser(user);
    setActiveTab(user.role === 'teacher' ? 'teacher-dashboard' : 'dashboard');
  };

  // Handle Logout to return to Beranda Masuk
  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    setSelectedActivityId(undefined);
  };

  // Keep course state synchronized
  const handleCourseUpdate = (updatedCourse: Course) => {
    setCourse(updatedCourse);
  };

  // Student starts learning an activity
  const handleStartLearning = (activityId?: string) => {
    setSelectedActivityId(activityId);
    setActiveTab('learning-journey');
  };

  const prePublishResult = storageService.validateCourseForPublish(course);

  // 1. DEDICATED LOGIN SCREEN (BERANDA MASUK)
  // If not logged in, render the login page exclusively.
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 2. LOGGED IN PORTALS (Strictly separated per role)
  const isStudent = currentUser.role === 'student';
  const isTeacher = currentUser.role === 'teacher';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Network Failure & Offline Resilience Handler */}
      <NetworkStatusBanner
        isSimulatedOffline={simulatedOffline}
        onToggleSimulatedOffline={(val) => setSimulatedOffline(val)}
      />

      {/* Top Bar Navigation (Clean, role-specific, with logout button) */}
      <Header
        currentRole={currentUser.role}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
        userName={currentUser.name}
        starsCount={currentUser.stars ?? 0}
      />

      {/* Main Learning & Authoring Area */}
      <main className="flex-1">
        <ErrorBoundary
          fallbackTitle="Halaman Belum Dapat Dimuat"
          fallbackMessage="Terjadi kendala pada sistem. Kamu dapat memuat ulang halaman dengan menekan tombol di bawah."
          componentContext="Main Application View"
        >
          {/* =========================================
              STUDENT VIEWS (PORTAL SISWA)
              Strictly separated - NO teacher controls
             ========================================= */}
          {isStudent && (
            <>
              {activeTab === 'dashboard' && (
                <StudentDashboard
                  course={course}
                  user={currentUser}
                  onStartLearning={handleStartLearning}
                  onOpenAchievements={() => setActiveTab('achievements')}
                  onOpenSummary={() => setActiveTab('summary')}
                  onUserUpdated={(updated) => setCurrentUser(updated)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'tutorial' && (
                <TutorialView
                  onBackToDashboard={() => setActiveTab('dashboard')}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'practical' && (
                <PracticalView
                  user={currentUser}
                  onBackToDashboard={() => setActiveTab('dashboard')}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'drill-game' && (
                <DrillGameView
                  user={currentUser}
                  onBackToDashboard={() => setActiveTab('dashboard')}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onUserUpdated={(updated) => setCurrentUser(updated)}
                />
              )}

              {activeTab === 'chatbot' && (
                <ChatbotView
                  user={currentUser}
                  onBackToDashboard={() => setActiveTab('dashboard')}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'summary' && (
                <ChapterSummaryView
                  onStartMission={(actId) => handleStartLearning(actId)}
                  onBackToDashboard={() => setActiveTab('dashboard')}
                />
              )}

              {activeTab === 'assessment' && (
                <AssessmentView
                  user={currentUser}
                  onBackToDashboard={() => setActiveTab('dashboard')}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onUserUpdated={(updated) => setCurrentUser(updated)}
                />
              )}

              {activeTab === 'learning-journey' && (
                <LearningJourneyPlayer
                  course={course}
                  initialActivityId={selectedActivityId}
                  studentId={currentUser.id}
                  studentName={currentUser.name}
                  onGoToDashboard={() => setActiveTab('dashboard')}
                  onActivityChanged={(actId) => setSelectedActivityId(actId)}
                />
              )}

              {activeTab === 'achievements' && (
                <StudentAchievements
                  user={currentUser}
                  onBackToStudy={() => setActiveTab('learning-journey')}
                />
              )}

              {activeTab === 'notifications' && (
                <StudentNotifications
                  onBackToStudy={() => setActiveTab('learning-journey')}
                />
              )}

              {activeTab === 'profile' && (
                <StudentProfile
                  user={currentUser}
                  onBackToStudy={() => setActiveTab('learning-journey')}
                  onUpdateAvatar={(newAvatar) => {
                    const updated = { ...currentUser, avatar: newAvatar };
                    setCurrentUser(updated);
                    storageService.saveCurrentUser(updated);
                  }}
                />
              )}
            </>
          )}

          {/* =========================================
              TEACHER VIEWS (PORTAL GURU)
              Strictly separated - NO student mixing
             ========================================= */}
          {isTeacher && (
            <>
              {activeTab === 'teacher-dashboard' && (
                <TeacherDashboard
                  course={course}
                  user={currentUser}
                  onNavigate={(tab) => setActiveTab(tab)}
                  onOpenPrePublish={() => setShowPrePublishModal(true)}
                />
              )}

              {activeTab === 'course-builder' && (
                <CourseBuilder
                  initialCourse={course}
                  onCourseUpdated={handleCourseUpdate}
                  onOpenPreviewH5P={(pkg) => setPreviewPackage(pkg)}
                />
              )}

              {activeTab === 'h5p-studio' && (
                <div className="max-w-4xl mx-auto px-4 py-8">
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      MEDIA PEMBELAJARAN INTERAKTIF
                    </span>
                    <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">
                      Pusat Media Interaktif Lumi
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Uji coba dan validasi berkas media interaktif <strong>.h5p</strong> yang diekspor dari aplikasi desktop Lumi atau tautan langsung.
                    </p>
                  </div>

                  <H5PUploader
                    onPackageReady={(pkg) => {
                      storageService.logDevError({
                        id: 'log_' + Date.now(),
                        timestamp: new Date().toISOString(),
                        code: 'H5P_UPLOAD_SUCCESS',
                        message: `Paket media interaktif "${pkg.title}" berhasil disiapkan.`,
                        details: `Library: ${pkg.library}`,
                        resolved: true,
                      });
                    }}
                    onPreviewRequested={(pkg) => setPreviewPackage(pkg)}
                  />
                </div>
              )}

              {activeTab === 'student-monitoring' && <StudentMonitoringTable />}
            </>
          )}
        </ErrorBoundary>
      </main>

      {/* Teacher Pre-Publish Validation Modal */}
      {showPrePublishModal && (
        <PrePublishModal
          validationResult={prePublishResult}
          onPublishConfirm={() => {
            const updated: Course = { ...course, status: 'published' };
            setCourse(updated);
            storageService.saveCourse(updated);
            setShowPrePublishModal(false);
          }}
          onClose={() => setShowPrePublishModal(false)}
        />
      )}

      {/* Package Preview Modal */}
      {previewPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-auto">
            <H5PPreview
              packageData={previewPackage}
              onClose={() => setPreviewPackage(null)}
              onPublish={() => {
                setPreviewPackage(null);
              }}
            />
          </div>
        </div>
      )}

      {/* System Modals (accessible for teacher maintenance) */}
      {showHealthCheck && (
        <HealthCheckModal onClose={() => setShowHealthCheck(false)} />
      )}

      {showDevLogs && (
        <DevLogsModal onClose={() => setShowDevLogs(false)} />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-display font-bold text-slate-800">LEARN SPACE</span>
            <span>·</span>
            <span>Pendidikan Pancasila: Norma dalam Kehidupanku · SD Kelas V</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>{isStudent ? `Masuk sebagai: ${currentUser.name}` : `Ruang Pendidik: ${currentUser.name}`}</span>
            <span>·</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer underline"
            >
              Ganti Akun / Keluar
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
