import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Member } from "@/types/Member";

export default function JoinPage() {

    interface Invite {
        name: string;
        createAt: string;
        status: string;
        id: string;
    }

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("id");

    const [loading, setLoading] = useState(true);
    const [invite, setInvite] = useState<Invite | null>(null);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const { user } = useAuthStore();

    // Demo: load invites from localStorage (same key as InvitePage demo)
    const loadInvite = async (t: string) => {
        try {
            const res = await authService.getClassInfo(t);
            if (!res) {
                throw new Error("");

            }
            const isUserInMembers = await res.members.some((member: Member) => member.userId == user?._id);
            console.log(isUserInMembers)
            return {
                name: res.name,
                createAt: res.createAt,
                status: isUserInMembers ? 'used' : 'pending',
                id: t
            };
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    useEffect(() => {
        const fetchInvite = async () => {
            setError("");
            setSuccess("");
            setLoading(true);

            if (!token) {
                setError("Không tìm thấy token invite trong URL.");
                setLoading(false);
                return;
            }

            try {
                const found = await loadInvite(token); // await ở đây

                if (!found) {
                    setError("Invite không tồn tại hoặc đã bị xóa.");
                    setInvite(null);
                } else {
                    setInvite(found);
                }
            } catch (err) {
                console.error(err);
                setError("Lỗi khi tải invite");
                setInvite(null);
            } finally {
                setLoading(false);
            }
        };

        fetchInvite();
    }, [token]);

    const handleAccept = async () => {
        if (!invite) return;
        setError("");
        setActionLoading(true);

        try {
            await authService.joinClass(invite.id);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setInvite((prev: any) => ({ ...prev, status: "used", usedAt: new Date().toISOString() }));
            setSuccess("Bạn đã tham gia thành công!");

            // redirect to class page (example). If invite links contain class id, use that.
            // Example: navigate(`/class?id=${invite.classId || 'unknown'}`)
            setTimeout(() => {
                window.location.replace('/');
            }, 1200);
        } catch (err) {
            console.error(err);
            setError("Không thể tham gia. Vui lòng thử lại.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setSuccess("Đã sao chép vào clipboard.");
            setTimeout(() => setSuccess(""), 1500);
        } catch {
            setError("Không thể sao chép. Hãy thử thủ công.");
        }
    };

    // UI helpers
    const statusBadge = (s: string) => {
        if (s === "pending") return <Badge>Pending</Badge>;
        if (s === "revoked") return <Badge variant="outline">Revoked</Badge>;
        if (s === "used") return <Badge variant="secondary">Used</Badge>;
        return <Badge variant="outline">{s}</Badge>;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-2xl">
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle>Join bằng Invite</CardTitle>
                                <CardDescription>
                                    Nhập link invite hoặc dùng link bạn nhận được để tham gia.
                                </CardDescription>
                            </div>
                            <div>{token && <Badge>Token: {token.slice(0, 6)}</Badge>}</div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {loading ? (
                            <div className="py-12 text-center">Đang kiểm tra invite...</div>
                        ) : error ? (
                            <div className="py-6 text-center text-sm text-red-600">{error}</div>
                        ) : !invite ? (
                            <div className="py-6 text-center text-sm text-slate-500">Không tìm thấy invite.</div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <Label className="mb-2 block">Class được mời</Label>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(invite.name)}`} />
                                            <AvatarFallback>{invite?.name?.[0]?.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <div className="font-medium truncate">{invite.name}</div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <Label className="mb-1 block">Trạng thái</Label>
                                        {statusBadge(invite.status)}
                                        <div className="mt-3 text-xs text-slate-400">
                                            Tạo: {new Date(invite.createAt).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-2">
                                        <Button onClick={() => handleCopy(`http://localhost:5173/invite?id=${invite.id}`)}>Copy link</Button>

                                        {/* Only let user accept if pending */}
                                        {invite.status === "pending" ? (
                                            <Button onClick={handleAccept} disabled={actionLoading}>
                                                {actionLoading ? "Đang xử lý..." : "Tham gia"}
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" onClick={() => navigate("/")}>Quay lại</Button>
                                        )}
                                    </div>

                                    {success && <p className="mt-3 text-sm text-green-600">{success}</p>}
                                </div>

                                <div>
                                    <Label className="mb-2 block">Thông tin thêm</Label>
                                    <div className="rounded-md border p-4 text-sm text-slate-600">
                                        <p className="mb-2"><strong>Ghi chú:</strong> Đây là phiên bản demo. Trong production bạn nên:</p>
                                        <ul className="list-disc ml-5 space-y-1">
                                            <li>Kiểm tra token trên server (tồn tại, expiry, classId, role).</li>
                                            <li>Gọi API `POST /invites/:token/accept` để gán user vào class.</li>
                                            <li>Xử lý trường hợp đã dùng, revoked, hoặc hết hạn.</li>
                                            <li>Redirect về trang class tương ứng sau khi join thành công.</li>
                                        </ul>
                                        <Separator className="my-3" />
                                        <div className="text-xs text-slate-400">
                                            Nếu bạn muốn mình viết luôn endpoint backend demo (Express) để test invite flow, mình làm tiếp được.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
