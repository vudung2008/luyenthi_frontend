/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useTabStore } from "@/stores/useTabStore";
import { authService } from "@/services/authService";
import type { ClassInfo } from "@/types/Class";
import { Button } from "./ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import type { User } from "@/types/User";
import { toast } from "sonner";

const tools = ["Bài tập", "Thành viên", "Thống kê", "Tài nguyên", "Tạo đề"];

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

export default function ClassDashboard() {
    const [activeTab, setActiveTab] = useState(tools[0]);
    const { cls } = useTabStore();
    const { user } = useAuthStore();
    const [classData, setClassData] = useState<ClassInfo | null>(null);

    const getClassInfo = async (classId: string) => {
        try {
            const res = await authService.getClassInfo(classId);
            setClassData(res);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (!cls) return;
        setActiveTab(tools[0]);
        getClassInfo(cls);
    }, [cls]);

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col gap-6">
            {/* Phần 1: Thông tin lớp */}
            <Card>
                <CardHeader>
                    <CardTitle>{classData?.name || "Đang tải..."}</CardTitle>
                    <CardDescription>{classData?.description || "..."}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Số lượng thành viên</Label>
                        <p>{classData?.members.length ?? "..."}</p>
                    </div>
                    <div>
                        <Label>Ngày tạo lớp</Label>
                        <p>{classData ? new Date(classData.createAt).toLocaleDateString() : "..."}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Phần 2: Công cụ */}
            <div className="flex flex-col gap-4 w-full">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col w-full">

                    {/* TabsList cuộn ngang */}
                    <div className="overflow-x-auto scroll-smooth touch-pan-x">
                        <TabsList className="inline-flex gap-2 whitespace-nowrap py-2 min-w-max">
                            {tools.map((tool) => (
                                <TabsTrigger
                                    key={tool}
                                    value={tool}
                                    className="flex-shrink-0 min-w-[80px] text-center px-3 py-1"
                                >
                                    {tool}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {/* TabsContent */}
                    <div className="flex-1 overflow-y-auto max-h-[70vh]">

                        {tools.map((tool) => (
                            <TabsContent key={tool} value={tool} className="p-4 border rounded-md bg-white">
                                <TabPanel cls={cls} tool={tool} activeTab={activeTab} classData={classData} user={user} />
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </div>


        </div>
    );
}

function TabPanel({ tool, activeTab, classData, user, cls }: { cls: string, user: User | null; tool: string; activeTab: string; classData: ClassInfo | null }) {
    const [data, setData] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        if (activeTab === tool && !data) {
            // Giả lập gọi API
            console.log(`Fetching API for ${tool}`);
            setTimeout(() => {
                setData(`Dữ liệu của ${tool}`);
            }, 500);
        }
        setLoading(false);
    }, [activeTab, tool, data]);

    if (loading) return <p>Loading {tool}...</p>;

    switch (tool) {
        // Tab bài tập
        case 'Bài tập':
            return (
                <ExamTab cls={cls} />
            )


        // Tab tài nguyên
        case "Tài nguyên":
            return (
                <div>
                    <h2 className="text-lg font-bold">Tài Nguyên</h2>
                    <p>{data}</p>
                </div>
            )


        // Tab thành viên
        case "Thành viên":

            return (
                <MemberTab classData={classData} />
            );



        // Tab thông kê
        case "Thống kê":
            return (
                <StatsTab cls={cls} />
            )


        // Tab tạo đề
        case "Tạo đề":
            return (
                <CreateExam classData={classData} user={user} />
            )
        default:
            break;
    }
}

const ExamTab = ({ cls }: { cls: string }) => {
    const [data, setData] = useState<Exam[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await authService.getExams(cls); // giữ nguyên service của bạn
                console.log(res);
                setData(res);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [cls]);

    const handleExamClick = (exam: Exam) => {

        // ví dụ: chuyển trang, mở modal, hoặc console.log
        console.log("Exam clicked:", exam._id);
        window.location.replace('/exam/' + exam._id);
    };

    if (loading) return <div>Đang tải...</div>;
    if (!data || data.length === 0) return <div>Không có dữ liệu</div>;

    return (
        <div className="grid gap-3">
            {data.map((exam) => (
                <div
                    key={exam._id}
                    // wrapper clickable, dùng div với role/button để dễ custom style
                    role="button"
                    tabIndex={0}
                    onClick={() => handleExamClick(exam)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleExamClick(exam);
                        }
                    }}
                    className="cursor-pointer transform transition duration-150 ease-out
                     hover:-translate-y-1 hover:shadow-lg active:scale-95
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
                     rounded-xl"
                >
                    <Card className="p-4">
                        <Label className="pl-1 block text-md font-medium">{exam.title}</Label>
                        <p className="pl-1 block text-sm text-muted-foreground">Số câu: {exam.questions?.length ?? 0}</p>
                        <p className="pl-1 block text-sm text-muted-foreground">
                            Ngày tạo:{" "}
                            {exam.createdAt
                                ? new Date(exam.createdAt).toLocaleDateString("vi-VN")
                                : "Không xác định"}
                        </p>
                    </Card>
                </div>
            ))}
        </div>
    );
};


const MemberTab = ({ classData }: { classData: ClassInfo | null }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [users, setUsers] = useState<any[]>([]);
    useEffect(() => {
        if (!classData) return;
        (async () => {
            const data = await Promise.all(
                classData.members.map((member) => authService.getUserInfo(member))
            );
            setUsers(data);
            console.log(data);
        })();
    }, [classData]);
    return (
        <div className="space-y-4">
            <div className="flex border rounded-lg p-4">

                <div className="w-1/2 border-r pr-4">
                    <h2 className="text-lg font-bold">Thành viên ({users?.length || 0})</h2>
                </div>
                <div className="w-1/2 pl-4 justify-end">
                    <Button onClick={async () => {
                        try {
                            await navigator.clipboard.writeText(`${window.location.origin}/invite?id=${classData?.classId}`);
                            toast.success('Sao chép vào bộ nhớ thành công');
                        } catch (error) {
                            console.log(error)
                        }
                    }}>Lấy link invite</Button>
                </div>
            </div>
            {/* Kiểm tra nếu có dữ liệu */}
            {users?.length ? (
                <ul className="divide-y divide-gray-200 border rounded-md">
                    {users.map((user) => (
                        <li key={user._id} className="p-3 flex justify-between items-center">
                            <div>
                                <p className="font-medium">{user.lastName + ' ' + user.firstName}</p>
                                <p className="text-sm text-gray-500">
                                    Vai trò: {user.role}
                                </p>
                            </div>
                            <span className="text-xs text-gray-400">
                                {new Date(user.joinedAt).toLocaleDateString("vi-VN")}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">Chưa có thành viên nào.</p>
            )}
        </div>
    )
}

const CreateExam = ({ classData, user }: { user: User | null; classData: ClassInfo | null }) => {
    const isLeader = classData?.members.some((member) => member.userId === user?._id && member.role === "leader");
    console.log(isLeader);
    return (
        <div>
            {isLeader}
        </div >
    )
}

interface ExamSubmission {
    _id: string;
    examId: string;
    userId: string;
    answers: any[];
    score: number;
    duration: number;
    completed: boolean;
    createdAt: string;
}

interface StatsTabProps {
    cls: string;
}

const StatsTab = ({ cls }: StatsTabProps) => {
    const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setLoading(true);
                const res: ExamSubmission[] = await authService.getClassSubmissions(cls);
                setSubmissions(res || []);
            } catch (err) {
                console.error("Lỗi lấy thống kê:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [cls]);

    if (loading) return <p>Đang tải thống kê...</p>;
    if (!submissions.length) return <p>Chưa có bài làm nào.</p>;

    // Tính toán thống kê
    const total = submissions.length;
    const completed = submissions.filter(s => s.completed).length;
    const pending = total - completed;
    const avgScore = submissions.reduce((acc, s) => acc + s.score, 0) / total;

    return (
        <div className="space-y-4">
            <Card className="p-4">
                <h2 className="text-lg font-bold mb-4">Thống kê lớp</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Số bài làm</Label>
                        <p>{total}</p>
                    </div>
                    <div>
                        <Label>Bài hoàn thành</Label>
                        <p>{completed}</p>
                    </div>
                    <div>
                        <Label>Bài chưa hoàn thành</Label>
                        <p>{pending}</p>
                    </div>
                    <div>
                        <Label>Điểm trung bình</Label>
                        <p>{avgScore.toFixed(2)}</p>
                    </div>
                </div>
            </Card>

            {/* Liệt kê chi tiết bài làm */}
            <Card className="p-4">
                <h3 className="font-bold mb-3">Danh sách bài làm</h3>
                <div className="space-y-2">
                    {submissions.map(sub => (
                        <div
                            key={sub._id}
                            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                            onClick={() => window.location.replace(`/submission/${sub._id}`)}
                        >
                            <p><strong>Bài làm ID:</strong> {sub._id}</p>
                            <p><strong>Exam ID:</strong> {sub.examId}</p>
                            <p><strong>User ID:</strong> {sub.userId}</p>
                            <p><strong>Score:</strong> {sub.score}</p>
                            <p><strong>Ngày tạo:</strong> {new Date(sub.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};