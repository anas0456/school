"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface Student {
  id: string;
  email: string;
  name: string;
  role: string;
  fatherName?: string;
  motherName?: string;
  age?: string;
  gender?: string;
  phone?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

function StudentDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<Student | null>(null);
  const initialSection = searchParams.get("section") || "profile";
  const [activeSection, setActiveSection] = useState(initialSection);

  // News and Courses/Homework states
  const [news, setNews] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      const userData = JSON.parse(storedUser);
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
            loadNews();
          }
        })
        .catch(() => {
          // If API fails, allow access (might be offline)
          setUser(userData);
          loadNews();
        });
    }
  }, [router]);

  const loadNews = async () => {
    try {
      const [newsRes, homeworkRes] = await Promise.all([
        fetch("/api/teacher/news"),
        fetch("/api/teacher/homework")
      ]);
      
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(newsData.news || []);
      }
      
      if (homeworkRes.ok) {
        const homeworkData = await homeworkRes.json();
        setHomework(homeworkData.homework || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const navItems: NavItem[] = [
    { id: "profile", label: "ملفي الشخصي", icon: "👤" },
    { id: "news", label: "الأخبار", icon: "📰" },
    { id: "homework", label: "الوظائف", icon: "📋" },
    { id: "schedule", label: "جدول الحصص", icon: "📅" },
    { id: "exams", label: "الامتحانات", icon: "📝" },
    { id: "grades", label: "العلامات", icon: "⭐" },
    { id: "installments", label: "الأقساط", icon: "💰" },
    { id: "graduation", label: "الجلاء", icon: "🎓" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900/80 border-r border-white/10 min-h-screen hidden md:block">
        <div className="p-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">
              جنة<span className="text-cyan-400">الأطفال</span>
            </span>
          </Link>
        </div>

        <nav className="p-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "home") {
                  router.push("/");
                } else {
                  setActiveSection(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-white border border-white/10"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-white/10">
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-2 px-4 py-2 text-cyan-400 hover:text-white transition-colors mb-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            الصفحة الرئيسية
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            تسجيل الخروج
          </button>
        </div>
      </aside>

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

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
              {user.name?.charAt(0) || "ط"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{user.name}</h1>
              <p className="text-zinc-500 text-sm">{user.role === "admin" ? "مدير" : "طالب"}</p>
            </div>
          </div>
        </header>

        {activeSection === "news" && (
          <NewsContent news={news} />
        )}
        {activeSection === "homework" && (
          <StudentHomeworkContent homework={homework} />
        )}
        {activeSection === "profile" && (
          <ProfileContent user={user} />
        )}
        {activeSection === "schedule" && (
          <ScheduleContent />
        )}
        {activeSection === "exams" && (
          <ExamsContent />
        )}
        {activeSection === "grades" && (
          <GradesContent />
        )}
        {activeSection === "installments" && (
          <InstallmentsContent />
        )}
        {activeSection === "graduation" && (
          <GraduationContent />
        )}
      </main>
    </div>
  );
}

function DashboardContent({ user }: { user: Student }) {
  const stats = [
    { label: "الوظائف المكتملة", value: "12", icon: "✅" },
    { label: "العلامات", value: "85%", icon: "⭐" },
    { label: "نسبة الحضور", value: "95%", icon: "🎯" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-white mb-6">مرحباً، {user.name}! 👋</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-zinc-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">الوظائف القادمة</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-xl">
              <div>
                <p className="text-white font-medium">رياضيات - تمرين 5</p>
                <p className="text-zinc-500 text-sm">موعد التسليم: غداً</p>
              </div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">قيد التنفيذ</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-xl">
              <div>
                <p className="text-white font-medium">عربي - بحث</p>
                <p className="text-zinc-500 text-sm">موعد التسليم: بعد 3 أيام</p>
              </div>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">متاح</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">الجدول اليومي</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-xl border border-white/5">
              <span className="text-2xl">🕘</span>
              <div>
                <p className="text-white font-medium">الرياضيات</p>
                <p className="text-zinc-500 text-sm">8:00 - 8:45</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
              <span className="text-2xl">🕘</span>
              <div>
                <p className="text-white font-medium">العربي</p>
                <p className="text-zinc-500 text-sm">9:00 - 9:45</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function NewsContent({ news }: { news: any[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold mb-6">الأخبار والإعلانات</h2>
      
      {news.length === 0 ? (
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-8 text-center">
          <p className="text-zinc-500">لا توجد أخبار حالياً</p>
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900/50 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-white">{item.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs ${
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
              <p className="text-zinc-400 text-sm">{item.content}</p>
              <p className="text-zinc-500 text-xs mt-3">
                {new Date(item.created_at).toLocaleDateString("ar")}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function StudentHomeworkContent({ homework }: { homework: any[] }) {
  const [homeworkStatus, setHomeworkStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load status from localStorage
    const stored = localStorage.getItem("homeworkStatus");
    if (stored) {
      setHomeworkStatus(JSON.parse(stored));
    }
  }, []);

  const updateHomeworkStatus = (hwId: string, status: string) => {
    const newStatus = { ...homeworkStatus, [hwId]: status };
    setHomeworkStatus(newStatus);
    localStorage.setItem("homeworkStatus", JSON.stringify(newStatus));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-zinc-500/20 text-zinc-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "تم الحل";
      default:
        return "لم يتم الحل";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold mb-6">الوظائف</h2>
      
      {homework.length === 0 ? (
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-8 text-center">
          <p className="text-zinc-500">لا توجد وظائف حالياً</p>
        </div>
      ) : (
        <div className="space-y-4">
          {homework.map((hw) => (
            <motion.div
              key={hw.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900/50 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{hw.title}</h3>
                  <p className="text-zinc-400 text-sm mt-2">{hw.description || "لا يوجد وصف"}</p>
                  <p className="text-yellow-400 text-sm mt-3">
                    تاريخ التسليم: {hw.due_date || "غير محدد"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm">
                    {hw.grade || "الصف غير محدد"}
                  </span>
                  <select
                    value={homeworkStatus[hw.id] || "not_completed"}
                    onChange={(e) => updateHomeworkStatus(hw.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm cursor-pointer ${getStatusColor(homeworkStatus[hw.id])}`}
                  >
                    <option value="not_completed">لم يتم الحل</option>
                    <option value="completed">تم الحل</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <StudentDashboardContent />
    </Suspense>
  );
}

function ProfileContent({ user }: { user: Student }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    fatherName: user.fatherName || "",
    motherName: user.motherName || "",
    age: user.age || "",
    phone: user.phone || "",
    gender: user.gender || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          ...formData,
        }),
      });

      if (response.ok) {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setMessage("تم تحديث المعلومات بنجاح!");
        setIsEditing(false);
      } else {
        setMessage("حدث خطأ أثناء التحديث");
      }
    } catch {
      setMessage("حدث خطأ أثناء التحديث");
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">ملفي الشخصي</h2><button onClick={() => isEditing ? handleSave() : setIsEditing(!isEditing)} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg text-sm">{loading ? "جاري..." : (isEditing ? "حفظ" : "تعديل")}</button></div>{message && <div className={`mb-4 p-3 rounded-lg ${message.includes("نجاح") ? "bg-green-600" : "bg-red-600"}`}>{message}</div>}
      
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 max-w-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white text-4xl font-bold">
            {user.name?.charAt(0) || "ط"}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{isEditing ? <input className="bg-zinc-800 text-white px-2 py-1 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /> : user.name}</h3>
            <p className="text-zinc-400">{user.email}</p>
            <span className="inline-block mt-2 px-4 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">طالب</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-black/30 rounded-xl">
            <p className="text-zinc-500 text-sm mb-1">اسم الأب</p>
            <p className="text-white font-medium">{isEditing ? <input className="bg-zinc-800 text-white px-2 py-1 rounded w-full" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} /> : (user.fatherName || "لم يُحدد")}</p>
          </div>
          <div className="p-4 bg-black/30 rounded-xl">
            <p className="text-zinc-500 text-sm mb-1">اسم الأم</p>
            <p className="text-white font-medium">{isEditing ? <input className="bg-zinc-800 text-white px-2 py-1 rounded w-full" value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} /> : (user.motherName || "لم يُحدد")}</p>
          </div>
          <div className="p-4 bg-black/30 rounded-xl">
            <p className="text-zinc-500 text-sm mb-1">العمر</p>
            <p className="text-white font-medium">{isEditing ? <input className="bg-zinc-800 text-white px-2 py-1 rounded w-full" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} /> : (user.age || "لم يُحدد")}</p>
          </div>
          <div className="p-4 bg-black/30 rounded-xl">
            <p className="text-zinc-500 text-sm mb-1">الجنس</p>
            <p className="text-white font-medium">
              {isEditing ? (
                <select 
                  className="bg-zinc-800 text-white px-2 py-1 rounded w-full" 
                  value={formData.gender} 
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="">اختر</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              ) : (
                user.gender === "male" ? "ذكر" : user.gender === "female" ? "أنثى" : "لم يُحدد"
              )}
            </p>
          </div>
          <div className="p-4 bg-black/30 rounded-xl">
            <p className="text-zinc-500 text-sm mb-1">رقم الهاتف</p>
            <p className="text-white font-medium">{isEditing ? <input className="bg-zinc-800 text-white px-2 py-1 rounded w-full" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+963 xxx xxx xxx" /> : (formData.phone || "لم يُحدد")}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ScheduleContent() {
  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
  const classes = [
    { time: "8:00 - 8:45", subject: "الرياضيات" },
    { time: "9:00 - 9:45", subject: "العربي" },
    { time: "10:00 - 10:45", subject: "الإنجليزي" },
    { time: "11:00 - 11:45", subject: "العلوم" },
    { time: "12:00 - 12:45", subject: "التاريخ" },
    { time: "13:00 - 13:45", subject: "الفنون" },
    { time: "14:00 - 14:45", subject: "التربية الرياضية" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-white mb-6">جدول الحصص الأسبوعي</h2>
      
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden max-w-4xl">
        <div className="grid grid-cols-6 bg-zinc-800/50 border-b border-white/10">
          <div className="p-4 text-center text-zinc-400 font-medium">الحصة</div>
          {days.map((day) => (
            <div key={day} className="p-4 text-center text-white font-medium border-l border-white/10">
              {day}
            </div>
          ))}
        </div>
        
        {classes.map((cls, index) => (
          <div key={index} className="grid grid-cols-6 border-b border-white/5">
            <div className="p-4 text-center text-zinc-400 text-sm">{cls.time}</div>
            {days.map((day) => (
              <div key={day} className="p-4 text-center text-white border-l border-white/10">
                {cls.subject}
              </div>
            ))}
          </div>
        ))}
      </div>

      <p className="mt-4 text-zinc-500 text-sm">* لا توجد حصص يوم الجمعة والسبت</p>
    </motion.div>
  );
}

function ExamsContent() {
  const exams = [
    { subject: "الرياضيات", date: "2026-03-01", duration: "60 دقيقة", status: "قيد الإنشاء" },
    { subject: "العربي", date: "2026-03-05", duration: "45 دقيقة", status: "قيد الإنشاء" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-white mb-6">الامتحانات</h2>
      
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 max-w-2xl">
        <div className="flex items-center gap-2 mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <span className="text-amber-400">⚠️</span>
          <span className="text-amber-400">الامتحانات قيد الإنشاء</span>
        </div>

        <div className="space-y-4">
          {exams.map((exam, index) => (
            <div key={index} className="p-4 bg-black/30 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">{exam.subject}</h3>
                <span className="px-3 py-1 bg-zinc-700 text-zinc-400 rounded-full text-sm">{exam.status}</span>
              </div>
              <div className="flex gap-4 text-sm text-zinc-500">
                <span>📅 {exam.date}</span>
                <span>⏰ {exam.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function HomeworkContent() {
  const homework = [
    { subject: "الرياضيات", title: "تمرين 5 - الجبر", startDate: "2026-02-20", dueDate: "2026-02-28", hasFile: true },
    { subject: "العربي", title: "بحث عن поэзия", startDate: "2026-02-22", dueDate: "2026-03-01", hasFile: true },
    { subject: "الإنجليزي", title: "Write a paragraph", startDate: "2026-02-25", dueDate: "2026-03-05", hasFile: false },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-white mb-6">الوظائف</h2>
      
      <div className="space-y-4 max-w-2xl">
        {homework.map((hw, index) => (
          <div key={index} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{hw.title}</h3>
                <p className="text-cyan-400 text-sm">{hw.subject}</p>
              </div>
              {hw.hasFile && (
                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  تحميل
                </a>
              )}
            </div>
            <div className="flex gap-4 text-sm text-zinc-500">
              <span>📅 بدء: {hw.startDate}</span>
              <span>⏰ تسليم: {hw.dueDate}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function GradesContent() {
  const grades = [
    { subject: "الرياضيات", grade: 85, maxGrade: 100 },
    { subject: "العربي", grade: 78, maxGrade: 100 },
    { subject: "الإنجليزي", grade: 92, maxGrade: 100 },
    { subject: "العلوم", grade: 88, maxGrade: 100 },
    { subject: "التاريخ", grade: 75, maxGrade: 100 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-white mb-6">العلامات</h2>
      
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 max-w-2xl">
        <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-xl">
          <p className="text-zinc-400 text-sm">المعدل العام</p>
          <p className="text-3xl font-bold text-white">83.6%</p>
        </div>

        <div className="space-y-4">
          {grades.map((g, index) => (
            <div key={index} className="p-4 bg-black/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{g.subject}</span>
                <span className="text-cyan-400 font-bold">{g.grade}/{g.maxGrade}</span>
              </div>
              <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
                  style={{ width: `${(g.grade / g.maxGrade) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function InstallmentsContent() {
  const installments = [
    { month: "شهر 1", amount: "50,000 ل.س", status: "مدفوع", date: "2026-01-01" },
    { month: "شهر 2", amount: "50,000 ل.س", status: "مدفوع", date: "2026-02-01" },
    { month: "شهر 3", amount: "50,000 ل.س", status: "مستحق", date: "2026-03-01" },
    { month: "شهر 4", amount: "50,000 ل.س", status: "مستحق", date: "2026-04-01" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-white mb-6">الأقساط</h2>
      
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 max-w-2xl">
        <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-xl">
          <p className="text-zinc-400 text-sm">المبلغ المدفوع</p>
          <p className="text-3xl font-bold text-green-400">100,000 ل.س</p>
          <p className="text-zinc-500 text-sm">من أصل 200,000 ل.س</p>
        </div>

        <div className="space-y-3">
          {installments.map((inst, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
              <div>
                <p className="text-white font-medium">{inst.month}</p>
                <p className="text-zinc-500 text-sm">{inst.date}</p>
              </div>
              <div className="text-left">
                <p className="text-white font-medium">{inst.amount}</p>
                <span className={`text-sm ${inst.status === "مدفوع" ? "text-green-400" : "text-amber-400"}`}>
                  {inst.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function GraduationContent() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-white mb-6">الجلاء</h2>
      
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 max-w-2xl text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
          <span className="text-5xl">🎓</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">شهادة التخرج</h3>
        <p className="text-zinc-400 mb-6">
          _ستتوفر الشهادة عند إكمال جميع المتطلبات_
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-right">
          <div className="p-4 bg-black/30 rounded-xl">
            <p className="text-zinc-500 text-sm">المعدل المطلوب</p>
            <p className="text-white font-medium">60%</p>
          </div>
          <div className="p-4 bg-black/30 rounded-xl">
            <p className="text-zinc-500 text-sm">معدلك الحالي</p>
            <p className="text-green-400 font-medium">83.6%</p>
          </div>
          <div className="p-4 bg-black/30 rounded-xl">
            <p className="text-zinc-500 text-sm">الحضور المطلوب</p>
            <p className="text-white font-medium">80%</p>
          </div>
          <div className="p-4 bg-black/30 rounded-xl">
            <p className="text-zinc-500 text-sm">حضورك</p>
            <p className="text-green-400 font-medium">95%</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <p className="text-green-400 font-medium">✅ مؤهل للتخرج</p>
        </div>
      </div>
    </motion.div>
  );
}
