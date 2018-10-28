import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Author} from '../models/author';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class AuthorsService{

  private authorRootApiUrl = `${environment.api_url}/api/authors`;

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar) { }

  // Get an array of authors
  public getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.authorRootApiUrl)
      .pipe(catchError(this.handleError<Author[]>('getAuthors')));
  }

  public getAuthor(idValue): Observable<Author> {
    return this.http.get<Author>(`${this.authorRootApiUrl}/${idValue}`)
      .pipe(catchError(this.handleError<Author>('getAuthor')));
  }

  editAuthor(details): Observable<Author> {
    console.log(details);
    return this.http.put<Author>(this.authorRootApiUrl, details)
    .pipe(catchError(this.handleError<Author>('editAuthor')));
  }

  addAuthor(author): Observable<any> {
    return this.http.post(this.authorRootApiUrl, author)
    .pipe(catchError(this.handleError<Author>('addAuthor')));
  }

  deleteAuthor(idValue): Observable<Author> {
    console.log(idValue);
    return this.http.delete<Author>(`${this.authorRootApiUrl}?id=${idValue}`)
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