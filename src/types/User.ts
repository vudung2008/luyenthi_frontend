export interface User {
    _id: string,
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    birth: string;
    role: string;
    isVerified: boolean;
    bio: string;
    createAt: Date;
    updateAt: Date;
}