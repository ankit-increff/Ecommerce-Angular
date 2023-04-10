export interface user {
    email: string;
    name: string;
    password: string;
}

export interface userInfo {
    email: string;
    name: string;
}

export interface usersJson {
    credentials: user[];
}