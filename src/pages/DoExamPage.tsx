/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { authService } from "@/services/authService";
import { toast } from "sonner";

// ----- Interfaces -----
interface MultiChoice { content: string; options: string[] }
interface TrueFalseItem { _id: string; statement: string }
interface TrueFalse { content: string; items: TrueFalseItem[] }
interface ShortAnswer { content: string }
interface Question {
    _id: string;
    type: "multichoices" | "true-false" | "short-answer";
    multichoices?: MultiChoice;
    truefalse?: TrueFalse;
    shortanswer?: ShortAnswer;
}
interface Exam { _id?: string; time: number; classId: string; questions: Question[] }
interface AnswerRecord {
    _id: string;
    type: "multichoices" | "true-false" | "short-answer";
    answer: any;
}

// ----- Validate & Sanitize Exam -----
function isExam(data: any): data is Exam {
    return data && typeof data.time === "number" && Array.isArray(data.questions);
}
function sanitizeExam(raw: any): Exam | null {
    if (!isExam(raw)) return null;
    return {
        _id: raw._id,
        time: raw.time,
        classId: raw.classId,
        questions: raw.questions.map((q: any) => ({
            _id: q._id,
            type: q.type,
            multichoices: q.multichoices,
            truefalse: q.truefalse,
            shortanswer: q.shortanswer
        }))
    };
}

// ----- Timer -----
const Timer = ({ start }: { start: number }) => {
    const [time, setTime] = useState(start * 60);
    useEffect(() => {
        const id = setInterval(() => setTime(t => (t > 0 ? t - 1 : 0)), 1000);
        return () => clearInterval(id);
    }, []);
    const format = (t: number) =>
        `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
    return <span className="font-bold">{format(time)}</span>;
};

// ----- QuestionBox -----
const QuestionBox = ({ children }: { children: React.ReactNode }) => (
    <div className="border border-gray-300 rounded-xl p-4 mb-4 shadow-sm bg-white">{children}</div>
);

// ----- MultiChoiceQuestion -----
interface MultiChoiceProps { question: Question; onAnswerChange: (qId: string, ans: number) => void }
const MultiChoiceQuestion = ({ question, onAnswerChange }: MultiChoiceProps) => {
    const [selected, setSelected] = useState<number | null>(null);
    if (!question.multichoices) return null;
    const letters = ["A", "B", "C", "D"];
    return (
        <QuestionBox>
            <div className="font-semibold mb-2">{question.multichoices.content}</div>
            <div className="space-y-3">
                {question.multichoices.options.map((opt, i) => {
                    const active = selected === i;
                    return (
                        <div
                            key={i}
                            onClick={() => { setSelected(i); onAnswerChange(question._id, i); }}
                            className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition
                ${active ? "bg-blue-500 border-blue-500 text-white" : "bg-white hover:bg-gray-50 border-gray-300"}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border
                ${active ? "bg-white/20 border-white text-white" : "border-gray-300 text-black"}`}>{letters[i]}</div>
                            <p className="flex-1 leading-[1.4] text-[15px]">{opt}</p>
                        </div>
                    );
                })}
            </div>
        </QuestionBox>
    );
};

// ----- TrueFalseQuestion -----
interface TrueFalseProps { question: Question; onAnswerChange: (qId: string, ans: { [itemId: string]: boolean }) => void }
const TrueFalseQuestion = ({ question, onAnswerChange }: TrueFalseProps) => {
    const [selected, setSelected] = useState<{ [itemId: string]: boolean | null }>({});
    if (!question.truefalse) return null;
    const handleSelect = (itemId: string, value: boolean) => {
        const newSelected = { ...selected, [itemId]: value };
        setSelected(newSelected);
        // Chỉ gửi boolean, loại bỏ null
        const filtered: { [id: string]: boolean } = {};
        Object.entries(newSelected).forEach(([id, val]) => { if (val !== null) filtered[id] = val; });
        onAnswerChange(question._id, filtered);
    };
    return (
        <QuestionBox>
            <div className="font-semibold mb-2">{question.truefalse.content}</div>
            <div className="space-y-3">
                {question.truefalse.items.map(item => {
                    const val = selected[item._id];
                    return (
                        <div key={item._id} className="flex items-start justify-between border p-3 rounded-xl">
                            <p className="flex-1 pr-4 leading-[1.4] text-[15px] break-words">{item.statement}</p>
                            <div className="flex gap-3">
                                <button onClick={() => handleSelect(item._id, true)}
                                    className={`w-20 p-2 rounded-lg border text-center transition
                  ${val === true ? "bg-blue-500 border-blue-500 text-white" : "hover:bg-gray-50 bg-white"}`}>Đúng</button>
                                <button onClick={() => handleSelect(item._id, false)}
                                    className={`w-20 p-2 rounded-lg border text-center transition
                  ${val === false ? "bg-blue-500 border-blue-500 text-white" : "hover:bg-gray-50 bg-white"}`}>Sai</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </QuestionBox>
    );
};

// ----- ShortAnswerQuestion -----
interface ShortAnswerProps { question: Question; onAnswerChange: (qId: string, ans: string) => void }
const ShortAnswerQuestion = ({ question, onAnswerChange }: ShortAnswerProps) => {
    if (!question.shortanswer) return null;
    return (
        <QuestionBox>
            <div className="font-semibold mb-2">{question.shortanswer.content}</div>
            <div>
                <input
                    type="text"
                    placeholder="Nhập đáp án..."
                    className="w-full border border-gray-300 rounded-xl p-2"
                    onChange={(e) => onAnswerChange(question._id, e.target.value)}
                />
            </div>
        </QuestionBox>
    );
};

// ----- ExamQuestions -----
const ExamQuestions = ({ exam, recordRef }: { exam: Exam; recordRef: React.MutableRefObject<AnswerRecord[]> }) => {
    const handleAnswerChange = (qId: string, answer: any, type: AnswerRecord["type"]) => {
        const idx = recordRef.current.findIndex(r => r._id === qId);
        if (idx >= 0) recordRef.current[idx].answer = answer;
        else recordRef.current.push({ _id: qId, type, answer });
    };

    return (
        <div className="p-4 mt-20 max-w-3xl mx-auto">
            {exam.questions.map(q => {
                if (q.type === "multichoices") return <MultiChoiceQuestion key={q._id} question={q} onAnswerChange={(id, ans) => handleAnswerChange(id, ans, "multichoices")} />;
                if (q.type === "true-false") return <TrueFalseQuestion key={q._id} question={q} onAnswerChange={(id, ans) => handleAnswerChange(id, ans, "true-false")} />;
                if (q.type === "short-answer") return <ShortAnswerQuestion key={q._id} question={q} onAnswerChange={(id, ans) => handleAnswerChange(id, ans, "short-answer")} />;
                return null;
            })}
        </div>
    );
};

// ----- Prepare answers for API -----
const prepareAnswersForApi = (records: AnswerRecord[], examId: string, userId: string, classId: string | null) => {
    const startedAt = new Date().toISOString();
    return {
        examId,
        userId,
        classId,
        startedAt,
        answers: records.map(r => {
            if (r.type === "multichoices") return { questionId: r._id, type: r.type, multichoices: r.answer };
            if (r.type === "true-false") return { questionId: r._id, type: r.type, truefalse: Object.entries(r.answer).map(([itemId, ans]) => ({ itemId, answer: ans })) };
            if (r.type === "short-answer") return { questionId: r._id, type: r.type, shortanswer: r.answer };
        })
    };
};

// ----- DoExamPage -----
const DoExamPage = () => {
    const { user } = useAuthStore();
    const recordRef = useRef<AnswerRecord[]>([]);
    const location = useLocation();
    const exam = sanitizeExam(location.state);

    const [result, setResult] = useState<{ score: number; total: number } | null>(null);
    const [submitted, setSubmitted] = useState(false); // trạng thái đã nộp

    if (!exam) return <div className="p-4 mt-16 text-center">Không có dữ liệu, vui lòng truy cập đúng cách.</div>;

    const handleSubmit = async () => {
        if (!user?._id || !exam._id) return;

        const data = prepareAnswersForApi(recordRef.current || [], exam._id, user._id, exam.classId || null);
        console.log("Data chuẩn API:", data);

        try {
            const res = await authService.submitExam(data);
            if (res) {
                toast.success('Nộp bài thành công!');
                setResult({ score: res.score, total: recordRef.current.length });
                setSubmitted(true); // đánh dấu đã nộp
            }
        } catch (err) {
            console.error(err);
            toast.error('Nộp bài thất bại!');
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-4 p-4">
            {!submitted ? (
                <>
                    <div className="fixed top-0 left-0 w-full h-14 bg-white flex items-center shadow z-50 px-4">
                        <div className="font-bold"><Timer start={exam.time} /></div>
                        <div className="flex-1 text-center"><p>Thí sinh: {user?.lastName} {user?.firstName}</p></div>
                        <Button onClick={handleSubmit}>Nộp bài</Button>
                    </div>

                    <ExamQuestions exam={exam} recordRef={recordRef} />
                </>
            ) : (
                <div className="p-4 border rounded-xl shadow bg-white text-center">
                    <h2 className="text-xl font-bold mb-2">Kết quả bài thi</h2>
                    <p>Số câu đã làm: {result?.total}</p>
                    <p>Điểm: {result?.score}</p>
                </div>
            )}
        </div>
    );
};



export default DoExamPage;
