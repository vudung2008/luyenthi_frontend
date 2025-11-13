import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authService } from "@/services/authService";
import { Card } from "@/components/ui/card";
import { Timer, Calendar1, CircleQuestionMark, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MultiChoice {
    content: string;
    options: string[];
    correctAnswer: number;
}

interface TrueFalseItem {
    statement: string;
    correctAnswer: boolean;
}

interface TrueFalse {
    content: string;
    items: TrueFalseItem[];
}

interface ShortAnswer {
    content: string;
    correctAnswer: string;
}

interface Question {
    type: "multichoices" | "true-false" | "short-answer";
    multichoices?: MultiChoice;
    truefalse?: TrueFalse;
    shortanswer?: ShortAnswer;
}

interface Exam {
    _id: string;
    title: string;
    uploadBy: string;
    time: number;
    classId: string | null;
    score: {
        multichoices: number;
        truefalse: number;
        shortanswer: number;
    };
    questions: Question[];
    createdAt: string;
}

const getExamSections = (exam: Exam): string => {
    const sectionsSet = new Set<string>();

    exam.questions.forEach((q) => {
        switch (q.type) {
            case "multichoices":
                sectionsSet.add("Trắc nghiệm");
                break;
            case "true-false":
                sectionsSet.add("Đúng/sai");
                break;
            case "short-answer":
                sectionsSet.add("Trả lời ngắn");
                break;
        }
    });

    return Array.from(sectionsSet).join(", ");
};

const ExamPage = () => {
    const { examId } = useParams();
    const [data, setData] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await authService.getExamInfo(examId || ''); // giữ nguyên service của bạn
                console.log(res);
                setData(res);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [examId]);

    if (loading) return <div>Đang tải...</div>;
    if (!data) return <div>Không có dữ liệu</div>;

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-gradient-purple">
            <div className="w-full max-w-sm md:max-w-2xl">
                <Card>
                    {/* Header */}
                    <div>
                        <h1 className="font-bold text-xl text-center">{data.title}</h1>
                        <h3 className="font-medium text-md text-center">ID: {data._id}</h3>
                        {/* <p className="text-center text-muted-foreground">{data.description}</p> */}
                        <div className="flex flex-col p-4">
                            <div className="mb-3 flex justify-between">
                                <span className="flex items-center space-x-1">
                                    <Timer />
                                    <span>Thời gian làm bài:</span>
                                </span>
                                <span className="font-medium">{data.time} phút</span>
                            </div>

                            {/* Dòng 2 */}
                            <div className="mb-3 flex justify-between">
                                <span className="flex items-center space-x-1">
                                    <Calendar1 />
                                    <span>Ngày tạo:</span>
                                </span>
                                <span className="font-medium">
                                    {data.createdAt
                                        ? new Date(data.createdAt).toLocaleDateString("vi-VN")
                                        : "Không xác định"}
                                </span>
                            </div>

                            {/* Dòng 3 */}
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
                            <div className="flex justify-center">
                                <Button className="w-full max-w-[calc(100%-rem)]">Làm bài</Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div >
        </div >
    )
}

export default ExamPage
