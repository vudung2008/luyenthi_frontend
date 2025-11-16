/* eslint-disable no-case-declarations */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Card } from '@/components/ui/card';

interface MultiChoice {
    content: string;
    options: string[];
    correctAnswer: number;
}

interface TrueFalseItem {
    _id: string;
    statement: string;
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
    _id: string;
    type: "multichoices" | "true-false" | "short-answer";
    multichoices?: MultiChoice;
    truefalse?: TrueFalse;
    shortanswer?: ShortAnswer;
}

interface Exam {
    _id: string;
    title: string;
    questions: Question[];
}

interface AnswerItem {
    type: string;
    multichoices?: { selected?: number; correctAnswer?: number; options?: string[] };
    truefalse?: { itemId: string; answer: boolean; correctAnswer: boolean }[];
    shortanswer?: { answer?: string; correctAnswer?: string };
}

interface Submission {
    _id: string;
    examId: string;
    userId: string;
    answers: AnswerItem[];
    score: number;
    duration: number;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

const SubmissionPage = () => {
    const { id } = useParams<{ id: string }>();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const sub: Submission | null = await authService.getSubmission(id);
                if (!sub) return setLoading(false);
                setSubmission(sub);

                const examData: Exam | null = await authService.getExamInfo(sub.examId);
                setExam(examData);
            } catch (err) {
                console.error('Lỗi khi lấy dữ liệu:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAskAI = (question: Question, answer?: AnswerItem, statement?: number) => {
        let content = '';

        switch (question.type) {
            case 'multichoices':
                const options = question.multichoices?.options || [];
                const selected = answer?.multichoices?.selected;
                const optionText = options.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`).join('\n');
                content = `Câu hỏi: ${question.multichoices?.content}\nLựa chọn:\n${optionText}\nCâu trả lời của học sinh: ${selected !== undefined ? String.fromCharCode(65 + selected) : 'Chưa trả lời'}`;
                break;

            case 'true-false':
                const tfItems = question.truefalse?.items || [];
                content = `Câu hỏi: ${question.truefalse?.content}\nPhát biểu:\n` + `${(tfItems[statement || 0]).statement}`;
                break;

            case 'short-answer':
                const ansText = answer?.shortanswer?.answer || 'Chưa trả lời';
                content = `Câu hỏi: ${question.shortanswer?.content}\nCâu trả lời của học sinh: ${ansText}`;
                break;
        }

        alert(`Gửi câu hỏi cho AI:\n${content}`);
        // Thực hiện gọi API AI ở đây
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (!submission) return <p>Không tìm thấy bài làm.</p>;
    if (!exam) return <p>Đang tải dữ liệu đề thi...</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Thông tin bài làm */}
            <Card className="p-4 mb-6">
                <h2 className="text-xl font-bold mb-2">Chi tiết bài làm</h2>
                <p><strong>Submission ID:</strong> {submission._id}</p>
                <p><strong>Exam:</strong> {exam.title}</p>
                <p><strong>Score:</strong> {submission.score}</p>
                <p><strong>Duration:</strong> {Math.floor(submission.duration / 60)} phút {submission.duration % 60} giây</p>
            </Card>

            {/* Câu trả lời chi tiết */}
            <Card className="p-4">
                <h3 className="text-lg font-bold mb-4">Câu trả lời chi tiết</h3>
                {exam.questions.map((q, index) => {
                    const ans = submission.answers[index];
                    if (!ans) return null;

                    return (
                        <div key={index} className="mb-4 p-4 border rounded shadow-sm">
                            <p className="font-medium mb-2">Câu {index + 1} ({q.type})</p>
                            <p className="mb-2"><strong>Nội dung:</strong> {q.multichoices?.content || q.truefalse?.content || q.shortanswer?.content}</p>

                            {/* Trắc nghiệm */}
                            {q.type === 'multichoices' && (
                                <>
                                    <p><strong>Câu trả lời của bạn:</strong> {ans.multichoices?.selected !== undefined ? ['A', 'B', 'C', 'D'][ans.multichoices.selected] : 'Chưa trả lời'}</p>
                                    <p><strong>Đáp án đúng:</strong> {['A', 'B', 'C', 'D'][q.multichoices?.correctAnswer || 0]}</p>
                                    <p><strong>Đúng/Sai:</strong> {ans.multichoices?.selected === q.multichoices?.correctAnswer ? '✅ Đúng' : '❌ Sai'}</p>
                                    <button
                                        className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleAskAI(q, ans, 0)}
                                    >
                                        Hỏi AI
                                    </button>
                                </>
                            )}

                            {/* True/False */}
                            {q.type === 'true-false' && q.truefalse?.items.map((item, i) => {
                                const userTF = ans.truefalse?.find(a => a.itemId === item._id);
                                const userAnswer = userTF?.answer;
                                const correct = userTF?.correctAnswer;

                                return (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 p-2 border rounded">
                                        <div className="flex-1">
                                            <p className="font-medium">Phát biểu {i + 1}:</p>
                                            <p>{item.statement}</p>
                                            <p><strong>Câu trả lời của bạn:</strong> {userAnswer !== undefined ? (userAnswer ? 'Đúng' : 'Sai') : 'Chưa trả lời'}</p>
                                            <p><strong>Đúng/Sai:</strong> {userAnswer === correct ? '✅ Đúng' : '❌ Sai'}</p>
                                        </div>
                                        <button
                                            className="mt-2 sm:mt-0 sm:ml-4 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                            onClick={() => handleAskAI(q, ans, i)}
                                        >
                                            Hỏi AI
                                        </button>
                                    </div>
                                );
                            })}

                            {/* Short answer */}
                            {q.type === 'short-answer' && (
                                <>
                                    <p><strong>Câu trả lời của bạn:</strong> {ans.shortanswer?.answer || 'Chưa trả lời'}</p>
                                    <p><strong>Đáp án đúng:</strong> {q.shortanswer?.correctAnswer}</p>
                                    <p><strong>Đúng/Sai:</strong> {ans.shortanswer?.answer === q.shortanswer?.correctAnswer ? '✅ Đúng' : '❌ Sai'}</p>
                                    <button
                                        className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleAskAI(q, ans, 0)}
                                    >
                                        Hỏi AI
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}
            </Card>
        </div>
    );
};

export default SubmissionPage;
