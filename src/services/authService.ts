/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";
import type { Member } from "@/types/Member";
import { toast } from "sonner";

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

interface Submission {
    _id: string;
    examId: string;
    userId: string;
    answers: any[];
    score: number;
    duration: number; // giây
    completed: boolean;
    createdAt: string;
    updatedAt: string; // thêm vào
}

export const authService = {
    signUp: async (
        username: string,
        password: string,
        email: string,
        firstName: string,
        lastName: string,
        gender: string,
        birth: string
    ) => {
        const res = await api.post(
            "/auth/signup",
            { username, password, email, firstName, lastName, gender, birth },
            { withCredentials: true }
        );

        return res.data;
    },

    signIn: async (username: string, password: string) => {
        const res = await api.post(
            "auth/signin",
            { username, password },
            { withCredentials: true }
        );
        return res.data; // access token
    },

    signOut: async () => {
        const refreshToken = localStorage.getItem('refreshToken')
        return api.post("/auth/signout", { refreshToken });
    },

    getMe: async () => {
        const res = await api.get("/me/getme", { withCredentials: true });
        return res.data;
    },

    refresh: async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) { throw new Error("Không có refresh token") };

        try {

            const res = await api.post("/auth/gettoken", { refreshToken });
            const { accessToken } = res.data;

            return accessToken;
        } catch (error) {
            console.error('Không thể lấy accessToken, error:', error);
            localStorage.removeItem('refreshToken');

        }
    },

    getClass: async () => {
        const res = await api.get('/class/getmyclasses');
        return res.data;
    },
    getClassInfo: async (id: string) => {
        try {
            const res = await api.get(`/class/getclassinfo?id=${id}`);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    },
    createClass: async (name: string, description: string, maxMem: number) => {
        await api.post('/class/createclass', { name, description, maxMem: (maxMem == 0 ? null : maxMem) })
    },
    joinClass: async (classId: string) => {
        await api.post('/class/joinclass', { classId });
    },
    getUserInfo: async (member: Member) => {
        try {
            const { userId, role, joinedAt } = member;
            const res = await api.get(`/me/getUserInfo?id=${userId}&role=${role}&joinedAt=${joinedAt}`);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    },
    createExam: async (data: Exam) => {
        try {
            const res = await api.post('/exam/createexam', data);
            console.log(res)
            toast.success(res.data.message);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Không thể tạo bài thi, vui lòng kiểm tra lại');
        }
    },
    getExams: async (classId: string) => {
        try {
            const res = await api.get(`/class/getexams?id=${classId}`);
            return res.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Không thể lấy danh sách bài thi, vui lòng kiểm tra lại');
        }
    },
    getExamInfo: async (examId: string) => {
        try {
            const res = await api.get(`/exam/info?id=${examId}`);
            return res.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Không thể lấy dữ liệu bài thi, vui lòng kiểm tra lại');
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    submitExam: async (data: any) => {
        try {
            const res = await api.post('/exam/submitexam', data);
            return res.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Không thể nộp bài thi');
            console.log(error)
        }
    },
    getExamSubmissions: async (examId: string) => {
        try {
            const res = await api.get(`/exam/getexamsubmissions?examId=${examId}`);
            return res.data;
        } catch (error) {
            toast.error('Không thể lấy dữ liệu!');
            console.log(error);
            return null;
        }
    },
    getClassSubmissions: async (classId: string) => {
        try {
            const res = await api.get(`/exam/getclasssubmissions?classId=${classId}`);
            console.log(classId);
            return res.data;
        } catch (error) {
            toast.error('Không thể lấy dữ liệu!');
            console.log(error);
            return [];
        }
    },
    getSubmission: async (id: string): Promise<Submission | null> => {
        try {
            const res = await api.get(`/exam/getsubmission?id=${id}`);
            return res.data as Submission;
        } catch (error) {
            toast.error('Không thể lấy dữ liệu bài làm!');
            console.error(error);
            return null;
        }
    }
};