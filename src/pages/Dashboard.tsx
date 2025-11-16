import AppContent from "@/components/app-content"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import { useTabStore } from "@/stores/useTabStore"

import { motion } from "framer-motion"
import { Brain, FilePlus, PenTool, FolderOpen, Sparkles } from "lucide-react"

const Dashboard = () => {

    const { tab } = useTabStore()

    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen overflow-y-auto">

                {/* HEADER */}
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="h-6 mx-2" />
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-semibold text-slate-700"
                    >
                        {tab.toUpperCase()}
                    </motion.div>
                </header>

                {/* MAIN LANDING */}
                <div className="p-8 space-y-16">

                    {/* HERO SECTION */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-3xl bg-white shadow-sm border border-slate-200 p-10"
                    >
                        <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
                            Nền tảng Luyện Thi Thông Minh
                            <Sparkles className="text-yellow-500" size={28} />
                        </h1>

                        <p className="text-slate-600 text-lg mt-4 max-w-2xl">
                            Học nhanh – nhớ lâu – hiệu quả tối đa.
                            Ứng dụng AI, flashcards, auto-review và tạo bài luyện tập theo trình độ.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl text-lg shadow-md hover:bg-blue-700 transition"
                        >
                            Bắt đầu học ngay
                        </motion.button>
                    </motion.div>

                    {/* FEATURES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* FEATURE 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <PenTool className="text-blue-600" size={32} />
                            <h3 className="text-xl font-semibold mt-4">Làm bài luyện tập</h3>
                            <p className="text-slate-600 mt-2">
                                Hệ thống tự sinh bài thi phù hợp với trình độ, chấm điểm tự động.
                            </p>
                        </motion.div>

                        {/* FEATURE 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <FilePlus className="text-purple-600" size={32} />
                            <h3 className="text-xl font-semibold mt-4">Tạo đề thi của riêng bạn</h3>
                            <p className="text-slate-600 mt-2">
                                Tạo bài thi nhanh từ tài nguyên hoặc nhập tay, hỗ trợ AI bổ sung câu hỏi.
                            </p>
                        </motion.div>

                        {/* FEATURE 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <FolderOpen className="text-emerald-600" size={32} />
                            <h3 className="text-xl font-semibold mt-4">Gửi tài nguyên học tập</h3>
                            <p className="text-slate-600 mt-2">
                                Upload PDF, văn bản, tài liệu – hệ thống phân tích và tạo câu hỏi từ nội dung.
                            </p>
                        </motion.div>

                        {/* FEATURE 4 */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <Brain className="text-rose-600" size={32} />
                            <h3 className="text-xl font-semibold mt-4">AI giải thích chi tiết</h3>
                            <p className="text-slate-600 mt-2">
                                Nhận giải thích thông minh từ AI, giúp hiểu sâu từng câu hỏi.
                            </p>
                        </motion.div>
                    </div>

                    {/* App Content Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="pt-6"
                    >
                        <AppContent />
                    </motion.div>

                </div>

            </SidebarInset>
        </SidebarProvider>
    )
}

export default Dashboard
