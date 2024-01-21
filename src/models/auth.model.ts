export class Auth {
    constructor(
        public user_name: string,
        public email: string,
        public password: string,
        public accessToken: string,
        public message: string
    ) {}
}