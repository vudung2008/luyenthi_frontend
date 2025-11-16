import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Sparkles, FilePlus2, MessageSquare, Layers } from "lucide-react";

const DashboardPage = () => {
    return (
        <div className="p-6 space-y-10">

            {/* INTRO SECTION */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-4"
            >
                <h1 className="text-4xl font-bold tracking-tight">
                    Nền tảng <span className="text-blue-500">Luyện Thi Thông Minh</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Tạo bài học, luyện tập, quản lý tài nguyên, nhận trợ giúp AI – tất cả trong một nền tảng học tập hiện đại.
                </p>
            </motion.div>

            {/* FEATURES GRID */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {/* Feature 1 */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <Card className="shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Book className="w-5 h-5 text-blue-500" /> Luyện tập & Làm bài
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            Làm bài trắc nghiệm, flashcards, luyện thi theo chủ đề với thống kê chi tiết.
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Feature 2 */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <Card className="shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FilePlus2 className="w-5 h-5 text-purple-500" /> Tạo bài học nhanh
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            Tự tạo bộ đề hoặc flashcard theo ý muốn chỉ trong vài giây.
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Feature 3 */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <Card className="shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="w-5 h-5 text-green-500" /> Quản lý tài nguyên
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            Upload, lưu trữ và chia sẻ tài liệu học tập một cách dễ dàng.
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Feature 4 */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <Card className="shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-orange-500" /> Trợ lý AI thông minh
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            Đặt câu hỏi, giải đề, giải thích kiến thức – tất cả được AI hỗ trợ tức thì.
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Feature 5 */}
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <Card className="shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" /> Trải nghiệm mượt mà
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            Hiệu ứng hiện đại, giao diện đẹp, tốc độ nhanh – đem đến cảm giác học thú vị.
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center pt-8"
            >
                <p className="text-muted-foreground mb-4">
                    Sẵn sàng bắt đầu hành trình học tập thông minh?
                </p>
            </motion.div>

        </div>
    );
};

export default DashboardPage;
