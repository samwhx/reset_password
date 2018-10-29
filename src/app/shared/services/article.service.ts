import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article} from '../models/article';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private articlesRootApiUrl = `/api/articles`;

  constructor(private http: ApiService) { }

  public getArticles(): Observable<Article[]> {
    return this.http.get(this.articlesRootApiUrl);
  }

  publishArticle(article): Observable<any> {
    return this.http.post(this.articlesRootApiUrl, article);
  }
}
