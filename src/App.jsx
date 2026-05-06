import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";

// ADMIN
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Courses from "./pages/admin/Courses";
import CourseDetail from "./pages/admin/CourseDetail";
import Exams from "./pages/admin/Exams";
import Questions from "./pages/admin/Questions";
import RunningExams from "./pages/admin/RunningExams";
import Events from "./pages/admin/Events";
import StudentsPage from "./pages/admin/course/StudentsPage";
import TeachersPage from "./pages/admin/course/TeachersPage";

// SHARED
import ExamMonitor from "./pages/shared/ExamMonitor";

// CORE
import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoute from "./components/PrivateRoute";
import CourseLayout from "./layouts/CourseLayout";
import QuestionsPage from "./pages/admin/course/QuestionsPage";
import StudentTokenPage from "./pages/student/StudentTokenPage";
import ExamConfirmationPage from "./pages/student/ExamConfirmationPage";
import ExamPage from "./pages/student/ExamPage";
import ExamListPage from "./pages/admin/course/ExamListPage";
import ExamDetailPage from "./pages/admin/course/ExamDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Login />} />

        {/* ================= STUDENT ================= */}
        <Route path="/student/token" element={
          <PrivateRoute role="student">
            <StudentTokenPage />
          </PrivateRoute>
        } />
       
       <Route path="/student/exam-confirmation" element={
            <PrivateRoute role="student">
              <ExamConfirmationPage />
            </PrivateRoute>
        } />

        <Route
          path="/student/exam/:attemptId"
          element={
            <PrivateRoute role="student">
              <ExamPage />
            </PrivateRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route path="/admin" element={
          <PrivateRoute role="admin">
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </PrivateRoute>
        } />

        <Route path="/admin/users" element={
          <PrivateRoute role="admin">
            <DashboardLayout>
              <Users />
            </DashboardLayout>
          </PrivateRoute>
        } />

        {/* 🔥 COURSE CENTER */}
        <Route path="/admin/courses" element={
          <PrivateRoute role="admin">
            <DashboardLayout>
              <Courses />
            </DashboardLayout>
          </PrivateRoute>
        } />

        <Route path="/admin/courses/:id" element={
          <PrivateRoute role="admin">
            <CourseLayout>
              <CourseDetail />
            </CourseLayout>
          </PrivateRoute>
        } />

        <Route path="/admin/courses/:id/students" element={
          <PrivateRoute role="admin">
            <CourseLayout>
              <StudentsPage />
            </CourseLayout>
          </PrivateRoute>
        } />

        <Route path="/admin/courses/:id/teachers" element={
          <PrivateRoute role="admin">
            <CourseLayout>
              <TeachersPage />
            </CourseLayout>
          </PrivateRoute>
        } />

        <Route path="/admin/courses/:id/questions" element={
          <PrivateRoute role="admin">
            <CourseLayout>
              <QuestionsPage />
            </CourseLayout>
          </PrivateRoute>
        } />
        <Route
          path="/admin/courses/:id/exams"
          element={
            <PrivateRoute role="admin">
              <CourseLayout>
                <ExamListPage />
              </CourseLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/courses/:id/exams/:examId"
          element={
            <PrivateRoute role="admin">
              <CourseLayout>
                <ExamDetailPage />
              </CourseLayout>
            </PrivateRoute>
          }
        />
        {/* 🔥 GLOBAL (OPTIONAL - nanti bisa dipindah ke dalam course) */}
        <Route path="/admin/exams" element={
          <PrivateRoute role="admin">
            <DashboardLayout>
              <Exams />
            </DashboardLayout>
          </PrivateRoute>
        } />

        <Route path="/admin/questions" element={
          <PrivateRoute role="admin">
            <DashboardLayout>
              <Questions />
            </DashboardLayout>
          </PrivateRoute>
        } />

        {/* 🔥 MONITORING */}
        <Route path="/admin/running-exams" element={
          <PrivateRoute role="admin">
            <DashboardLayout>
              <RunningExams />
            </DashboardLayout>
          </PrivateRoute>
        } />

        <Route path="/admin/monitor/:id" element={
          <PrivateRoute role="admin">
            <DashboardLayout>
              <ExamMonitor />
            </DashboardLayout>
          </PrivateRoute>
        } />

        {/* 🔥 EVENTS */}
        <Route path="/admin/events" element={
          <PrivateRoute role="admin">
            <DashboardLayout>
              <Events />
            </DashboardLayout>
          </PrivateRoute>
        } />
        
        <Route
          path="/guru/courses/:id/exams"
          element={
            <PrivateRoute role="guru">
              <CourseLayout>
                <ExamListPage />
              </CourseLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/guru/courses/:id/exams/:examId"
          element={
            <PrivateRoute role="guru">
              <CourseLayout>
                <ExamDetailPage />
              </CourseLayout>
            </PrivateRoute>
          }
        />
        {/* ================= PROKTOR ================= */}
        <Route path="/proctor/monitor/:id" element={
          <PrivateRoute role="proktor">
            <DashboardLayout>
              <ExamMonitor />
            </DashboardLayout>
          </PrivateRoute>
        } />

       

      </Routes>
    </BrowserRouter>
  );
}