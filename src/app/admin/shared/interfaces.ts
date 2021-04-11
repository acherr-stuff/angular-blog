export interface User {
    email: string
    password: string
    returnSecureToken?: boolean
}


export interface FbAuthReponse {
  idToken: string
  expiresIn: string
}
