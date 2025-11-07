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