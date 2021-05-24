import * as firebase from "firebase";
import * as firebaseAdmin from "firebase-admin";
export declare class FirebaseJWTToken {
    app: firebase.app.App;
    admin: firebaseAdmin.app.App;
    private identityUrl;
    constructor(apiKey: string);
    getTokenFromUid(uid: string, decode?: boolean): Promise<any>;
    getToken(email: string, password: string, decode?: boolean): Promise<string | undefined>;
}
