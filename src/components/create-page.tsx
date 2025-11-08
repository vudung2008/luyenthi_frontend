import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { authService } from "@/services/authService";

// Zod schema
const createClassSchema = z.object({
    name: z.string().min(1, "Tên lớp không được để trống"),
    description: z.string().optional(),
    maxMem: z.number().min(1, "Số lượng tối thiểu là 1"),
});

type CreateClassFormValues = z.infer<typeof createClassSchema>;

export default function CreateClassForm() {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<CreateClassFormValues>({
        resolver: zodResolver(createClassSchema),
        defaultValues: {
            name: "",
            description: "",
            maxMem: 10
        }
    });

    const onSubmit = async (data: CreateClassFormValues) => {
        try {
            setLoading(true);
            await authService.createClass(data.name, data.description || '', data.maxMem);
            toast.success("Tạo lớp thành công!");
            setTimeout(() => {

                window.location.replace("/"); // chuyển trang bình thường, không SPA
            }, 600);
        } catch (err) {
            console.error(err);
            toast.error("Có lỗi xảy ra khi tạo lớp");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Tạo lớp học mới</CardTitle>
                        <CardDescription>Nhập thông tin lớp học để tạo lớp mới.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <div>
                                <Label className='block text-sm' htmlFor="name">Tên lớp</Label>
                                <Input id="name" placeholder="Nhập tên lớp học" {...register("name")} />
                                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                            </div>

                            <div>
                                <Label className='block text-sm' htmlFor="description">Mô tả</Label>
                                <Textarea id="description" placeholder="Nhập mô tả lớp học" {...register("description")} />
                                {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
                            </div>

                            <div>
                                <Label className='block text-sm' htmlFor="maxMem">Số lượng tối đa</Label>
                                <Input id="maxMem" type="number" min={1} {...register("maxMem", { valueAsNumber: true })} />
                                {errors.maxMem && <p className="text-destructive text-sm">{errors.maxMem.message}</p>}
                            </div>

                            <Button type="submit" disabled={isSubmitting || loading}>
                                {loading ? "Đang tạo..." : "Tạo lớp"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
