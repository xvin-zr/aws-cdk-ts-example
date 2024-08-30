type RegisterUser = {
    username: string;
    password: string;
};

type User = {
    username: string;
    passwordHash: string;
};

type LoginRequest = {
    username: string;
    password: string;
};
