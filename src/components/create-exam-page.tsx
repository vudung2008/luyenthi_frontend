import { Label } from "@radix-ui/react-label"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"

const CreateExamPage = () => {

    return (
        <div>
            <Card>
                <CardHeader>
                    <h1 className="font-bold text-xl text-center">Tạo đề thi</h1>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">

                        {/* Tiêu đề */}
                        <div className="flex flex-col gap-3">
                            <Label className='block text-sm' htmlFor="title">Tiêu đề</Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Nhập tiêu đề"
                                required
                            />
                        </div>
                        {/* Thời gian */}
                        <div className="flex flex-col gap-3">
                            <Label className='block text-sm' htmlFor="time">Thời gian làm bài</Label>
                            <Input
                                id="time"
                                type="number"
                                placeholder="Nhập thời gian làm bài"
                                required
                            />
                        </div>
                        {/* Mô tả */}
                        <div className="flex flex-col gap-3">
                            <Label className="block text-sm" htmlFor="description">Mô tả</Label>
                            <Textarea
                                placeholder="Nhập mô tả cho đề thi"
                                id="description"
                            ></Textarea>
                        </div>
                        {/* Score */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <Card>
                                    <CardContent className="p-4">
                                        <Label className="block text-sm" htmlFor="score_tn">Điểm TN</Label>
                                        <Input
                                            id="score_tn"
                                            type="number"
                                            placeholder="Nhập điểm phần trắc nghiệm"
                                            required
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="space-y-2">
                                <Card>
                                    <CardContent className="p-4">
                                        <Label className="block text-sm" htmlFor="score_tf">Điểm Đ/S</Label>
                                        <Input
                                            id="score_tf"
                                            type="number"
                                            placeholder="Nhập điểm phần đúng sai"
                                            required
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="space-y-2">
                                <Card>
                                    <CardContent className="p-4">
                                        <Label className="block text-sm" htmlFor="score_tln">Điểm TLN</Label>
                                        <Input
                                            id="score_tln"
                                            type="number"
                                            placeholder="Nhập điểm phần trả lời ngắn"
                                            required
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        {/* Questions */}
                        <div className="flex flex-col gap-3">
                            <Card className="p-4 space-y-4">
                            </Card>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Submit</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default CreateExamPage
