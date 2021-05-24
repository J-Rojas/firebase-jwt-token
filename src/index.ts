import * as firebase from "firebase";
import * as firebaseAdmin from "firebase-admin";
import * as jsonwebtoken from "jsonwebtoken";
import axios from "axios";

export class FirebaseJWTToken {
  app: firebase.app.App;
  admin: firebaseAdmin.app.App;
  private identityUrl: string;

  constructor(apiKey: string) {
    this.app = firebase.initializeApp({ apiKey });
    this.admin = firebaseAdmin.initializeApp();
    this.identityUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${apiKey}`
    if (process.env.FIREBASE_AUTH_EMULATOR_HOST != '') {
        this.identityUrl = `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${apiKey}`    
    }
  }



  async getTokenFromUid(uid: string, decode = false) {
    try {

      const customToken = await firebaseAdmin.auth().createCustomToken(uid)
      const res = await axios({
        url: this.identityUrl,
        method: 'post',
        data: {
          token: customToken,
          returnSecureToken: true
        }
      });      
      const idToken = res.data.idToken;
      if (decode && idToken) {
        return JSON.stringify(jsonwebtoken.decode(idToken));
      }
      return idToken;
    } catch (e) {
      throw new Error(`Error ${e}`);
    }

  }

  async getToken(email: string, password: string, decode = false) {
    try {
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const idToken = await user.user?.getIdToken();
      if (decode && idToken) {
        return JSON.stringify(jsonwebtoken.decode(idToken));
      }
      return idToken;
    } catch (e) {
      throw new Error(`Error ${e}`);
    }
  }
}
