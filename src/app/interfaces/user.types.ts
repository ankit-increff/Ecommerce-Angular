export interface USER {
    email: string;
    name: string;
    password: string;
}

export interface USERINFO {
    email: string;
    name: string;
}

export interface USERSJSON {
    credentials: USER[];
}