import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { authService } from "@/services/authService";

// ====== Interfaces ======
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
}

export interface Class {
    info: {
        userId: string;
        classId: string;
        role: string;
        joinedAt: string;
    };
    class: {
        name: string;
        maxMem: number | null;
        description: string | null;
    };
}

// ====== Parser Functions ======
const tnParser = (data: string): MultiChoice[] => {
    const regex = /Câu\s+\d+:[\s\S]*?(?=Câu\s+\d+:|$)/g;
    const blocks = data.match(regex) || [];

    return blocks.map((block) => {
        const body = block.replace(/^Câu\s+\d+:\s*/, "");
        // chỉ khớp A. hoặc a) mà trước đó là đầu chuỗi hoặc xuống dòng hoặc khoảng trắng
        const splitIndex = body.search(/(?:^|\s|\r?\n)(?=(?:A\.|a\)|B\.|b\)|C\.|c\)|D\.|d\)))/);

        const question =
            splitIndex !== -1
                ? body.slice(0, splitIndex).trimEnd()
                : body.trimEnd();

        const optionsPart =
            splitIndex !== -1 ? body.slice(splitIndex) : "";

        const options = optionsPart
            .split(/(?:^|\s|\r?\n)(?=(?:A\.|a\)|B\.|b\)|C\.|c\)|D\.|d\)))/)
            .map((opt) =>
                opt.trim().replace(/^(?:A\.|a\)|B\.|b\)|C\.|c\)|D\.|d\))\s*/, "")
            )
            .filter((o) => o.length > 0);

        return {
            content: question,
            options,
            correctAnswer: -1,
        };
    });
};


const dsParser = (data: string): TrueFalse[] => {
    const regex = /Câu\s+\d+:[\s\S]*?(?=Câu\s+\d+:|$)/g;
    const blocks = data.match(regex) || [];

    return blocks.map((block) => {
        const body = block.replace(/^Câu\s+\d+:\s*/, "");
        // chỉ khớp a), b), c), d) khi trước đó không có ký tự liền kề
        const splitIndex = body.search(/(?:^|\s|\r?\n)(?=(?:a\)|b\)|c\)|d\)))/);

        const question =
            splitIndex !== -1
                ? body.slice(0, splitIndex).trimEnd()
                : body.trimEnd();

        const itemsPart = splitIndex !== -1 ? body.slice(splitIndex) : "";

        const items = itemsPart
            .split(/(?:^|\s|\r?\n)(?=(?:a\)|b\)|c\)|d\)))/)
            .map((opt) =>
                opt.trim().replace(/^(?:a\)|b\)|c\)|d\))\s*/, "")
            )
            .filter((o) => o.length > 0)
            .map((statement) => ({
                statement,
                correctAnswer: false,
            }));

        return { content: question, items };
    });
};


const tlnParser = (data: string): ShortAnswer[] => {
    const regex = /Câu\s+\d+:[\s\S]*?(?=Câu\s+\d+:|$)/g;
    const blocks = data.match(regex) || [];

    return blocks.map((block) => ({
        content: block.replace(/^Câu\s+\d+:\s*/, "").trimEnd(),
        correctAnswer: "",
    }));
};


// ====== Components cho từng loại câu ======
interface MultiChoiceItemProps {
    options: string[];
    onChange: (val: number) => void;
}

const MultiChoiceItem = ({ options, onChange }: MultiChoiceItemProps) => {
    const [answer, setAnswer] = useState(-1);
    return (
        <RadioGroup
            value={answer.toString()}
            onValueChange={(val) => {
                const v = +val;
                setAnswer(v);
                onChange(v);
            }}
        >
            {options.map((opt, i) => (
                <label key={i} className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value={i.toString()} />
                    <span>{opt}</span>
                </label>
            ))}
        </RadioGroup>
    );
};

interface TrueFalseItemCompProps {
    items: TrueFalseItem[];
    onChange: (index: number, val: boolean) => void;
}

const TrueFalseItemComp = ({ items, onChange }: TrueFalseItemCompProps) => {
    const [answers, setAnswers] = useState(items.map(() => false));
    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={i} className="flex items-center space-x-4">
                    <p className="font-medium">{item.statement}</p>
                    <div className="flex items-center space-x-2">
                        <RadioGroup
                            value={answers[i] ? "true" : "false"}
                            onValueChange={(val) => {
                                const v = val === "true";
                                const newAns = [...answers];
                                newAns[i] = v;
                                setAnswers(newAns);
                                onChange(i, v);
                            }}
                            className="flex space-x-2"
                        >
                            <div className="flex items-center space-x-1">
                                <RadioGroupItem value="true" id={`tf-${i}-t`} />
                                <Label htmlFor={`tf-${i}-t`}>Đúng</Label>
                            </div>
                            <div className="flex items-center space-x-1">
                                <RadioGroupItem value="false" id={`tf-${i}-f`} />
                                <Label htmlFor={`tf-${i}-f`}>Sai</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            ))}
        </div>
    );
};

interface ShortAnswerItemProps {
    onChange: (val: string) => void;
}

const ShortAnswerItem = ({ onChange }: ShortAnswerItemProps) => {
    const [answer, setAnswer] = useState("");
    return (
        <Input
            placeholder="Nhập đáp án..."
            value={answer}
            onChange={(e) => {
                setAnswer(e.target.value);
                onChange(e.target.value);
            }}
        />
    );
};

// ====== Main Component ======
export default function CreateExamPage() {
    const [title, setTitle] = useState("");
    const [time, setTime] = useState(60);
    const [score, setScore] = useState({ multichoices: 1, truefalse: 1, shortanswer: 2 });
    const [tnText, setTnText] = useState("");
    const [dsText, setDsText] = useState("");
    const [tlnText, setTlnText] = useState("");
    const [classId, setClassId] = useState<string | null>(null);

    const { user, classes } = useAuthStore();

    const [questions, setQuestions] = useState<Question[]>([]);

    const handleCreateExam = () => {
        const tn = tnParser(tnText);
        const ds = dsParser(dsText);
        const tln = tlnParser(tlnText);

        const allQuestions: Question[] = [
            ...tn.map((q) => ({ type: "multichoices" as const, multichoices: q })),
            ...ds.map((q) => ({ type: "true-false" as const, truefalse: q })),
            ...tln.map((q) => ({ type: "short-answer" as const, shortanswer: q })),
        ];
        console.log(allQuestions);
        setQuestions(allQuestions);
    };

    const handleExport = () => {
        const exam: Exam = {
            title,
            uploadBy: user?._id || "",
            time,
            classId,
            score,
            questions,
        };
        authService.createExam(exam);
    };

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-blue-600">🧩 Tạo Đề Thi</h1>

            {/* === Form Nhập === */}
            {questions.length === 0 && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin chung</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Input placeholder="Tên đề thi" value={title} onChange={(e) => setTitle(e.target.value)} />
                            <Input
                                type="number"
                                placeholder="Thời gian (phút)"
                                value={time}
                                onChange={(e) => setTime(+e.target.value)}
                            />

                            {/* Select Class */}
                            <div>
                                <Label className="text-sm">Chọn lớp</Label>
                                <Select onValueChange={(val) => setClassId(val === "none" ? null : val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn lớp hoặc để trống" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Không chọn lớp</SelectItem>
                                        {classes?.map((cls: Class) => (
                                            <SelectItem key={cls.info.classId} value={cls.info.classId}>
                                                {cls.class.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <Input
                                    type="number"
                                    placeholder="Điểm TN"
                                    value={score.multichoices}
                                    onChange={(e) => setScore({ ...score, multichoices: +e.target.value })}
                                />
                                <Input
                                    type="number"
                                    placeholder="Điểm ĐS"
                                    value={score.truefalse}
                                    onChange={(e) => setScore({ ...score, truefalse: +e.target.value })}
                                />
                                <Input
                                    type="number"
                                    placeholder="Điểm TL"
                                    value={score.shortanswer}
                                    onChange={(e) => setScore({ ...score, shortanswer: +e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Trắc nghiệm</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                rows={6}
                                placeholder="Câu 1: ... A. ... B. ... C. ... D. ..."
                                value={tnText}
                                onChange={(e) => setTnText(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Đúng Sai</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                rows={6}
                                placeholder="Câu 1: ... a) ... b) ..."
                                value={dsText}
                                onChange={(e) => setDsText(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Trả lời ngắn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                rows={6}
                                placeholder="Câu 1: ..."
                                value={tlnText}
                                onChange={(e) => setTlnText(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    <Button onClick={handleCreateExam} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Tạo đề thi
                    </Button>
                </>
            )}

            {/* === Nhập đáp án từng câu === */}
            {questions.length > 0 && (
                <Card className="border-blue-300">
                    <CardHeader>
                        <CardTitle>✅ Nhập đáp án</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {questions.map((q, i) => (
                            <div key={i} className="p-3 border rounded-lg bg-white shadow-sm">
                                {/* Hiển thị câu hỏi */}
                                <p className="font-semibold mb-2">
                                    Câu {i + 1}:{" "}
                                    {q.type === "multichoices" && q.multichoices?.content}
                                    {q.type === "true-false" && q.truefalse?.content}
                                    {q.type === "short-answer" && q.shortanswer?.content}
                                </p>

                                {q.type === "multichoices" && q.multichoices && (
                                    <MultiChoiceItem
                                        options={q.multichoices.options}
                                        onChange={(val) => (q.multichoices!.correctAnswer = val)}
                                    />
                                )}

                                {q.type === "true-false" && q.truefalse && (
                                    <TrueFalseItemComp
                                        items={q.truefalse.items}
                                        onChange={(index, val) => (q.truefalse!.items[index].correctAnswer = val)}
                                    />
                                )}

                                {q.type === "short-answer" && q.shortanswer && (
                                    <ShortAnswerItem
                                        onChange={(val) => (q.shortanswer!.correctAnswer = val)}
                                    />
                                )}
                            </div>
                        ))}

                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleExport}
                        >
                            Xuất JSON ra console
                        </Button>
                    </CardContent>
                </Card>
            )}

        </div>
    );
}
