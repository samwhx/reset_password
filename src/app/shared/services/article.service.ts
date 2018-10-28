import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Article} from '../models/article';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  
  private articlesRootApiUrl = `${environment.api_url}/api/articles`;

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar) { }

  // Get an array of authors
  public getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.articlesRootApiUrl)
      .pipe(catchError(this.handleError<Article[]>('getArticle')));
  }

  
  publishArticle(article): Observable<any> {
    return this.http.post(this.articlesRootApiUrl, article)
    .pipe(catchError(this.handleError<Article>('addArticle')));
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
