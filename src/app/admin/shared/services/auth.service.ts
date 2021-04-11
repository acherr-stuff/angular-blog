import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FbAuthReponse, User} from "../interfaces";
import {Observable, pipe, throwError, Subject} from "rxjs";
import {environment} from "../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { toBase64String } from "@angular/compiler/src/output/source_map";

@Injectable(

)

export class AuthService {

    public error$: Subject <string> = new Subject<string>()

    constructor(private http: HttpClient) {
    }

    get token(): string {
        const expDate = new Date(localStorage.getItem('fb-token-exp'))
        if (new Date() > expDate) {
            this.logout()
            return null
        }
        return localStorage.getItem('fb-token')
    }

    login(user: User): Observable<any> {
        user.returnSecureToken = true
        return this.http.
        post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
            .pipe(
                tap(this.setToken),
                catchError(this.handleError.bind(this)),
                // catchError(() => this.handleError)

            )
    }

    logout() {
        this.setToken(null)
    }

    private handleError(error: HttpErrorResponse) {
        const {message} = error.error.error;
        console.log(message);

        switch (message) {
            case 'EMAIL_NOT_FOUND':
            this.error$.next('E-mail не зарегистрирован в системе')
                break;
            case 'INVALID_EMAIL':
            this.error$.next('Неверный e-mail')
                break;
            case 'INVALID_PASSWORD':
            this.error$.next('Неверный пароль')
                break;
        }

        return throwError(error)
        
    }

    isAuthenticated(): boolean {
        return !!this.token
    }

    private setToken(response: FbAuthReponse | null) {
        // console.log(response)
        if (response) {
        const expDate = new Date(new Date().getTime() + +response.expiresIn*1000)
        localStorage.setItem('fb-token', response.idToken)
        localStorage.setItem('fb-token-exp', expDate.toString())
        } else {
            localStorage.clear()
        }
    }

}
