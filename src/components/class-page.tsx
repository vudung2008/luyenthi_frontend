import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useTabStore } from "@/stores/useTabStore";
import { authService } from "@/services/authService";
import type { ClassInfo } from "@/types/Class";

const tools = ["Bài tập", "Điểm danh", "Thống kê", "Tài nguyên", "Tạo đề"];

export default function ClassDashboard() {
    const [activeTab, setActiveTab] = useState(tools[0]);
    const { cls } = useTabStore();

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
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-slate-400 scrollbar-none scroll-smooth touch-pan-x">
                        <TabsList className="flex gap-2 whitespace-nowrap py-2 min-w-max">
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
                    {tools.map((tool) => (
                        <TabsContent key={tool} value={tool} className="p-4 border rounded-md bg-white">
                            <p className="text-lg font-medium">{tool}</p>
                            <p className="text-sm text-slate-500 mt-2">
                                Nội dung {tool} sẽ hiển thị ở đây.
                            </p>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

        </div>
    );
}

