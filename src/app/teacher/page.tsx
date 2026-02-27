"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  subject?: string;
  qualification?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  age?: string;
  gender?: string;
  phone?: string;
  father_name?: string;
  mother_name?: string;
}

interface Course {
  id: string;
  title: string;
  description?: string;
  grade?: string;
  created_at: string;
}

interface Homework {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  grade?: string;
  course_id?: string;
  created_at: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  created_at: string;
}

function TeacherDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const initialSection = searchParams.get("section") || "dashboard";
  const [activeSection, setActiveSection] = useState(initialSection);

  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [news, setNews] = useState<News[]>([]);
  
  // Form states
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  
  const [courseForm, setCourseForm] = useState({ title: "", description: "", grade: "" });
  const [homeworkForm, setHomeworkForm] = useState({ title: "", description: "", due_date: "", grade: "", course_id: "" });
  const [newsForm, setNewsForm] = useState({ title: "", content: "", category: "general" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      const userData = JSON.parse(storedUser);
      if (userData.role !== "teacher" && userData.role !== "admin") {
        router.push("/student");
      }
      // Verify user still exists in database
      fetch(`/api/admin/users?id=${userData.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error || !data.user) {
            // User was deleted, clear session and redirect
            localStorage.removeItem("user");
            router.push("/login");
          } else {
            setUser(userData);
            loadData(userData);
          }
        })
        .catch(() => {
          // If API fails, allow access (might be offline)
          setUser(userData);
          loadData(userData);
        });
    }
  }, [router]);

  const loadData = async (currentUser: any) => {
    // Load students
    const studentsRes = await fetch("/api/teacher/students");
    if (studentsRes.ok) {
      const studentsData = await studentsRes.json();
      setStudents(studentsData.students || []);
    }

    // Load teachers if admin
    if (currentUser?.role === "admin") {
      const teachersRes = await fetch("/api/admin/teachers");
      if (teachersRes.ok) {
        const teachersData = await teachersRes.json();
        setTeachers(teachersData.teachers || []);
      }
    }

    // Load courses
    const coursesRes = await fetch("/api/teacher/courses");
    if (coursesRes.ok) {
      const coursesData = await coursesRes.json();
      setCourses(coursesData.courses || []);
    }

    // Load homework
    const homeworkRes = await fetch("/api/teacher/homework");
    if (homeworkRes.ok) {
      const homeworkData = await homeworkRes.json();
      setHomework(homeworkData.homework || []);
    }

    // Load news
    const newsRes = await fetch("/api/teacher/news");
    if (newsRes.ok) {
      const newsData = await newsRes.json();
      setNews(newsData.news || []);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/teacher/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...courseForm,
        teacherId: user?.id
      }),
    });
    if (res.ok) {
      setShowCourseForm(false);
      setCourseForm({ title: "", description: "", grade: "" });
      loadData(user);
    }
  };

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/teacher/homework", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(homeworkForm),
    });
    if (res.ok) {
      setShowHomeworkForm(false);
      setHomeworkForm({ title: "", description: "", due_date: "", grade: "", course_id: "" });
      loadData(user);
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/teacher/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newsForm),
    });
    if (res.ok) {
      setShowNewsForm(false);
      setNewsForm({ title: "", content: "", category: "general" });
      loadData(user);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقرر؟")) return;
    const res = await fetch(`/api/teacher/courses?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      loadData(user);
    }
  };

  const handleDeleteHomework = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الوظيفة؟")) return;
    const res = await fetch(`/api/teacher/homework?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      loadData(user);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الخبر؟")) return;
    const res = await fetch(`/api/teacher/news?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      loadData(user);
    }
  };

  const handleDeleteUser = async (id: string, userRole: string) => {
    const userType = userRole === "teacher" ? "المعلم" : "الطالب";
    console.log("Attempting to delete user:", id, "role:", userRole);
    if (!confirm(`هل أنت متأكد من حذف ${userType}؟`)) return;
    
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      console.log("Delete response status:", res.status);
      const data = await res.json();
      console.log("Delete response data:", data);
      
      if (res.ok) {
        // Check if the deleted user is the current user
        if (user?.id === id) {
          // The deleted user is currently logged in, logout
          localStorage.removeItem("user");
          router.push("/login");
        } else {
          loadData(user);
        }
      } else {
        alert(data.error || "فشل في حذف المستخدم");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("حدث خطأ في الاتصال بالخادم");
    }
  };

  const navItems = [
    { id: "dashboard", label: "الرئيسية", icon: "🏠" },
    { id: "students", label: "الطلاب", icon: "👥" },
    ...(user?.role === "admin" ? [{ id: "teachers", label: "المعلمين", icon: "👨‍🏫" }] : []),
    { id: "homework", label: "الوظائف", icon: "📝" },
    { id: "news", label: "الأخبار", icon: "📰" },
    { id: "profile", label: "ملفي", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-zinc-900/80 border-b border-white/10 sticky top-0 z-50 w-full">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-600 flex items-center justify-center">
              <span className="text-xl">🎓</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">{user?.role === "admin" ? "مدير" : "معلم"} - جنة الأطفال</h1>
              <p className="text-xs text-zinc-400">{user?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            تسجيل خروج
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 text-sm bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors"
          >
            الصفحة الرئيسية
          </button>
        </div>
      </header>

      <div className="flex w-full">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-zinc-900/50 border-r border-white/10 p-4 hidden md:block">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-white border border-white/10"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-6">
          {/* Mobile Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900/90 border-t border-white/10 z-50">
            <div className="flex justify-around py-2 overflow-x-auto">
              {navItems.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                  }}
                  className={`flex flex-col items-center gap-1 px-3 py-2 ${
                    activeSection === item.id ? "text-cyan-400" : "text-zinc-500"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold mb-6">مرحباً بك يا {user?.role === "admin" ? "مدير" : "معلم"} {user?.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                  <p className="text-3xl font-bold text-violet-400">{students.length}</p>
                  <p className="text-zinc-400">عدد الطلاب</p>
                </div>
                {user?.role === "admin" && (
                  <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                    <p className="text-3xl font-bold text-blue-400">{teachers.length}</p>
                    <p className="text-zinc-400">عدد المعلمين</p>
                  </div>
                )}
                <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                  <p className="text-3xl font-bold text-yellow-400">{homework.length}</p>
                  <p className="text-zinc-400">الوظائف</p>
                </div>
                <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                  <p className="text-3xl font-bold text-green-400">{news.length}</p>
                  <p className="text-zinc-400">الأخبار</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Students Section */}
          {activeSection === "students" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold mb-6">قائمة الطلاب</h2>
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-zinc-800/50">
                    <tr>
                      <th className="px-4 py-3 text-right text-zinc-400 text-sm">الاسم</th>
                      <th className="px-4 py-3 text-right text-zinc-400 text-sm">البريد الإلكتروني</th>
                      <th className="px-4 py-3 text-right text-zinc-400 text-sm">العمر</th>
                      <th className="px-4 py-3 text-right text-zinc-400 text-sm">الجنس</th>
                      <th className="px-4 py-3 text-right text-zinc-400 text-sm">رقم الهاتف</th>
                      <th className="px-4 py-3 text-right text-zinc-400 text-sm">اسم الأب</th>
                      {user?.role === "admin" && (
                        <th className="px-4 py-3 text-right text-zinc-400 text-sm">الإجراءات</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id} className="border-t border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3">{student.name}</td>
                        <td className="px-4 py-3 text-zinc-400">{student.email}</td>
                        <td className="px-4 py-3 text-zinc-400">{student.age || "-"}</td>
                        <td className="px-4 py-3 text-zinc-400">
                          {student.gender === "male" ? "ذكر" : student.gender === "female" ? "أنثى" : "-"}
                        </td>
                        <td className="px-4 py-3 text-zinc-400">{student.phone || "-"}</td>
                        <td className="px-4 py-3 text-zinc-400">{student.father_name || "-"}</td>
                        {user?.role === "admin" && (
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDeleteUser(student.id, "student")}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                              title="حذف"
                            >
                              🗑️
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan={user?.role === "admin" ? 7 : 6} className="px-4 py-8 text-center text-zinc-500">
                          لا يوجد طلاب مسجلين
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Teachers Section - Admin Only */}
          {activeSection === "teachers" && user?.role === "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold mb-6">قائمة المعلمين</h2>
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-zinc-800/50">
                    <tr>
                      <th className="px-4 py-3 text-right text-zinc-400 text-sm">الاسم</th>
                      <th className="px-4 py-3 text-right text-zinc-400 text-sm">البريد الإلكتروني</th>
                      <th className="px-4 py-3 text-right text-zinc-400 text-sm">المادة</th>
                      <th className="px-4 py-3 text-right text-zinc-400 text-sm">الوصف</th>
                      <th className="px-4 py-3 text-right text-zinc-400 text-sm">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="border-t border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3">{teacher.name}</td>
                        <td className="px-4 py-3 text-zinc-400">{teacher.email}</td>
                        <td className="px-4 py-3 text-zinc-400">{teacher.subject || "-"}</td>
                        <td className="px-4 py-3 text-zinc-400">{teacher.qualification || "-"}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteUser(teacher.id, "teacher")}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            title="حذف"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                    {teachers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                          لا يوجد معلمين مسجلين
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Homework Section */}
          {activeSection === "homework" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">الوظائف</h2>
                <button
                  onClick={() => setShowHomeworkForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-600 rounded-lg font-medium"
                >
                  + إضافة وظيفة
                </button>
              </div>

              {showHomeworkForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4">إضافة وظيفة جديدة</h3>
                    <form onSubmit={handleCreateHomework} className="space-y-4">
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">عنوان الوظيفة</label>
                        <input
                          type="text"
                          value={homeworkForm.title}
                          onChange={(e) => setHomeworkForm({ ...homeworkForm, title: e.target.value })}
                          required
                          className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                          placeholder="عنوان الوظيفة"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">الوصف</label>
                        <textarea
                          value={homeworkForm.description}
                          onChange={(e) => setHomeworkForm({ ...homeworkForm, description: e.target.value })}
                          className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                          placeholder="تفاصيل الوظيفة"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">تاريخ التسليم</label>
                        <input
                          type="date"
                          value={homeworkForm.due_date}
                          onChange={(e) => setHomeworkForm({ ...homeworkForm, due_date: e.target.value })}
                          className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">الصف</label>
                        <select
                          value={homeworkForm.grade}
                          onChange={(e) => setHomeworkForm({ ...homeworkForm, grade: e.target.value })}
                          className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                        >
                          <option value="">اختر الصف</option>
                          <option value="first">الصف الأول</option>
                          <option value="second">الصف الثاني</option>
                          <option value="third">الصف الثالث</option>
                          <option value="fourth">الصف الرابع</option>
                          <option value="fifth">الصف الخامس</option>
                          <option value="sixth">الصف السادس</option>
                        </select>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-gradient-to-r from-violet-500 to-cyan-600 rounded-lg font-medium"
                        >
                          إضافة
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowHomeworkForm(false)}
                          className="flex-1 py-2 bg-zinc-700 rounded-lg font-medium"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {homework.map((hw) => (
                  <div key={hw.id} className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 relative group">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{hw.title}</h3>
                        <p className="text-zinc-400 text-sm mt-2">{hw.description || "لا يوجد وصف"}</p>
                        <p className="text-yellow-400 text-sm mt-3">
                          تاريخ التسليم: {hw.due_date || "غير محدد"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteHomework(hw.id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          title="حذف"
                        >
                          🗑️
                        </button>
                        <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm">
                          {hw.grade || "الصف غير محدد"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {homework.length === 0 && (
                  <p className="text-zinc-500 text-center py-8">لا توجد وظائف بعد</p>
                )}
              </div>
            </motion.div>
          )}

          {/* News Section */}
          {activeSection === "news" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">الأخبار والإعلانات</h2>
                <button
                  onClick={() => setShowNewsForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-600 rounded-lg font-medium"
                >
                  + نشر خبر
                </button>
              </div>

              {showNewsForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
                    <h3 className="text-xl font-bold mb-4">نشر خبر جديد</h3>
                    <form onSubmit={handleCreateNews} className="space-y-4">
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">العنوان</label>
                        <input
                          type="text"
                          value={newsForm.title}
                          onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                          required
                          className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                          placeholder="عنوان الخبر"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">المحتوى</label>
                        <textarea
                          value={newsForm.content}
                          onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                          required
                          className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                          placeholder="محتوى الخبر"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-1">الفئة</label>
                        <select
                          value={newsForm.category}
                          onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                          className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                        >
                          <option value="general">عام</option>
                          <option value="announcement">إعلان</option>
                          <option value="event">فعالية</option>
                          <option value="homework">وظيفة</option>
                          <option value="exam">امتحان</option>
                        </select>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-gradient-to-r from-violet-500 to-cyan-600 rounded-lg font-medium"
                        >
                          نشر
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewsForm(false)}
                          className="flex-1 py-2 bg-zinc-700 rounded-lg font-medium"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 relative group">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-zinc-400 text-sm mt-2">{item.content}</p>
                        <p className="text-zinc-500 text-xs mt-3">
                          {new Date(item.created_at).toLocaleDateString("ar")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteNews(item.id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          title="حذف"
                        >
                          🗑️
                        </button>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          item.category === "announcement" ? "bg-red-500/20 text-red-400" :
                          item.category === "event" ? "bg-green-500/20 text-green-400" :
                          item.category === "homework" ? "bg-yellow-500/20 text-yellow-400" :
                          item.category === "exam" ? "bg-orange-500/20 text-orange-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>
                          {item.category === "general" ? "عام" :
                           item.category === "announcement" ? "إعلان" :
                           item.category === "event" ? "فعالية" :
                           item.category === "homework" ? "وظيفة" :
                           item.category === "exam" ? "امتحان" : item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {news.length === 0 && (
                  <p className="text-zinc-500 text-center py-8">لا توجد أخبار بعد</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Profile Section */}
          {activeSection === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold mb-6">ملفي الشخصي</h2>
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 max-w-md">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-cyan-600 flex items-center justify-center text-2xl">
                    🎓
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{user?.name}</h3>
                    <p className="text-zinc-400">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-zinc-400 text-sm">المادة</p>
                    <p className="font-medium">{user?.subject || "غير محدد"}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm">المؤهل</p>
                    <p className="font-medium">{user?.qualification || "غير محدد"}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm">الدور</p>
                    <p className="font-medium">{user?.role === "teacher" ? "معلم" : "مدير"}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">جاري التحميل...</div>}>
      <TeacherDashboardContent />
    </Suspense>
  );
}
