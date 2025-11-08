import type { Member } from "./Member";

export interface Class {
    info: {
        userId: string;
        classId: string;
        role: string;
        joinedAt: string;
    };
    class: {
        name: string,
        maxMem: number | null;
        description: string | null;
    };
}

export interface ClassInfo {
    name: string;
    classId: string;
    maxMem: number;
    description: string;
    createAt: string;
    members: Member[];
}