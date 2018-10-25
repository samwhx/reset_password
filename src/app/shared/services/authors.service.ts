import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Author} from '../models/authors/author';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class AuthorsService {

  private authorRootApiUrl = `${environment.api_url}/api/authors`;

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar) { }



// Get an array of authors
public getAuthors(): Observable<Author> {
  return this.http.get<Author>(this.authorRootApiUrl)
  .pipe(catchError(this.handleError<Author>('getAuthors')));
}

editAuthor(details): Observable<any> {
  return this.http.put(this.authorRootApiUrl, details)
  .pipe(catchError(this.handleError<Author>('editAuthor')));
}



private handleError<T>(operation = 'operation', result?: T){
  return (error: any): Observable<T> => {
    console.log(JSON.stringify(error.error));
    this.showErrorMessage(JSON.stringify(error.error));
    return throwError(error || 'generic backend error');
  }
}

  showErrorMessage(msg) {
    let snackBarRef = this.snackBar.open(msg, 'Undo');
    console.log(snackBarRef);
  }
}