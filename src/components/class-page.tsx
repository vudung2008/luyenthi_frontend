import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useTabStore } from "@/stores/useTabStore";
import { authService } from "@/services/authService";
import type { ClassInfo } from "@/types/Class";

const tools = ["Bài tập", "Thành viên", "Thống kê", "Tài nguyên", "Tạo đề"];

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
                    {tools.map((tool) => (
                        <TabsContent key={tool} value={tool} className="p-4 border rounded-md bg-white">
                            <TabPanel tool={tool} activeTab={activeTab} />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>


        </div>
    );
}

function TabPanel({ tool, activeTab }: { tool: string; activeTab: string }) {
    const [data, setData] = useState<string>('');

    useEffect(() => {
        if (activeTab === tool && !data) {
            // Giả lập gọi API
            console.log(`Fetching API for ${tool}`);
            setTimeout(() => {
                setData(`Dữ liệu của ${tool}`);
            }, 500);
        }
    }, [activeTab, tool, data]);

    if (!data) return <p>Loading {tool}...</p>;

    return (
        <div>
            <h2 className="text-lg font-bold">{tool}</h2>
            <p>{data}</p>
        </div>
    );
}