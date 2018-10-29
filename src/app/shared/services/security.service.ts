import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private registerRootApiUrl = `${environment.api_url}/api/register`;
  private loginRootApiUrl = `${environment.api_url}/api/login`;
  private resetPasswordRootApiUrl = `${environment.api_url}/api/resetPassword`;
  private changePasswordRootApiUrl = `${environment.api_url}/api/changePassword`;

  constructor(private http: HttpClient, private snackSvc: MatSnackBar ) { }

  register(user){
    console.log("Register srvice !")
    return this.http.post(this.registerRootApiUrl, user)
    .pipe(catchError(this.handleError<User>('register')));
  }

  login(user){
    return this.http.post(this.loginRootApiUrl, user)
    .pipe(catchError(this.handleError<User>('login')));
  }


  changePassword(user){
    return this.http.post(this.changePasswordRootApiUrl, user)
    .pipe(catchError(this.handleError<User>('changePassword')));
  }

  resetPassword(user){
    return this.http.post(this.resetPasswordRootApiUrl, user)
    .pipe(catchError(this.handleError<User>('resetPassword')));
  }

  private handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.log(JSON.stringify(error.error));
      this.showErrorMessage(JSON.stringify(error.error));
      return throwError(error || 'generic backend error');
    }
  }

  showErrorMessage(msg) {
    let snackBarRef = this.snackSvc.open(msg, 'Undo');
    console.log(snackBarRef);
  }
}
