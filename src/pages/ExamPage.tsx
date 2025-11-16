/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { Card } from "@/components/ui/card";
import { Timer, Calendar1, CircleQuestionMark, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

//----- INTERFACE-----
interface MultiChoice { content: string; options: string[]; correctAnswer: number; }
interface TrueFalseItem { _id: string; statement: string; correctAnswer: boolean; }
interface TrueFalse { content: string; items: TrueFalseItem[]; }
interface ShortAnswer { content: string; correctAnswer: string; }
interface Question { _id: string; type: "multichoices" | "true-false" | "short-answer"; multichoices?: MultiChoice; truefalse?: TrueFalse; shortanswer?: ShortAnswer; }
interface Exam { _id: string; title: string; uploadBy: string; time: number; classId: string | null; score: { multichoices: number; truefalse: number; shortanswer: number; }; questions: Question[]; createdAt: string; }
// ---------------------

const getExamSections = (exam: Exam): string => {
    const s = new Set<string>();
    exam.questions.forEach((q) => {
        if (q.type === "multichoices") s.add("Trắc nghiệm");
        if (q.type === "true-false") s.add("Đúng/Sai");
        if (q.type === "short-answer") s.add("Trả lời ngắn");
    });
    return [...s].join(", ");
};

const ExamPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSubmissions, setShowSubmissions] = useState(false);
    const [submissions, setSubmissions] = useState<any[]>([]); // danh sách bài làm

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await authService.getExamInfo(examId || "");
                setData(res);
            } catch (err) {
                console.error("Lỗi:", err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [examId]);

    const fetchSubmissions = async () => {
        try {
            const res = await authService.getExamSubmissions(examId || ''); // API lấy bài làm
            console.log(res);
            setSubmissions(res || []);
            setShowSubmissions(true);
        } catch (err) {
            console.error("Lỗi lấy bài làm:", err);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (!data) return <div>Không có dữ liệu</div>;

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 bg-gradient-purple">
            <div className="w-full max-w-sm md:max-w-2xl">
                {!showSubmissions ? (
                    <Card>
                        <div>
                            <h1 className="font-bold text-xl text-center">{data.title}</h1>
                            <h3 className="font-medium text-md text-center">ID: {data._id}</h3>

                            <div className="flex flex-col p-4">
                                <div className="mb-3 flex justify-between">
                                    <span className="flex items-center space-x-1">
                                        <Timer /> <span>Thời gian làm bài:</span>
                                    </span>
                                    <span className="font-medium">{data.time} phút</span>
                                </div>

                                <div className="mb-3 flex justify-between">
                                    <span className="flex items-center space-x-1">
                                        <Calendar1 /> <span>Ngày tạo:</span>
                                    </span>
                                    <span className="font-medium">
                                        {new Date(data.createdAt).toLocaleDateString("vi-VN")}
                                    </span>
                                </div>

                                <div className="mb-3 flex justify-between">
                                    <span className="flex items-center space-x-1">
                                        <CircleQuestionMark />
                                        <span>Số lượng câu hỏi:</span>
                                    </span>
                                    <span className="font-medium">{data.questions.length}</span>
                                </div>

                                <div className="mb-3 flex justify-between">
                                    <span className="flex items-center space-x-1">
                                        <ClipboardCheck />
                                        <span>Loại đề:</span>
                                    </span>
                                    <span className="font-medium">{getExamSections(data)}</span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Button
                                        className="w-full"
                                        onClick={() => navigate(`/exam/${data._id}/start`, { state: data })}
                                    >
                                        Làm bài
                                    </Button>
                                    <Button className="w-full" onClick={fetchSubmissions} variant="outline">
                                        Xem bài làm
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="p-4">
                        <h2 className="text-lg font-bold mb-3 text-center">Danh sách bài làm</h2>
                        {submissions.length === 0 ? (
                            <p className="text-center">Chưa có bài làm nào</p>
                        ) : (
                            submissions.map((s, idx) => (
                                <Button
                                    key={idx}
                                    className="w-full mb-2 text-left"
                                    onClick={() => {
                                        // Clear state và điều hướng sang chi tiết bài làm
                                        setShowSubmissions(false);
                                        navigate(`/submission/${s._id}`);
                                    }}
                                >
                                    {s.userName} - Điểm: {s.score}
                                </Button>
                            ))
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ExamPage;
