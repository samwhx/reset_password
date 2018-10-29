import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Author} from '../models/author';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class AuthorsService{

  private authorRootApiUrl = `/api/authors`;

  constructor(private http: ApiService) { }

  // Get an array of authors
  public getAuthors(): Observable<Author[]> {
    return this.http.get(this.authorRootApiUrl);
  }

  public getAuthor(idValue): Observable<Author> {
    return this.http.get(`${this.authorRootApiUrl}/${idValue}`);
  }

  editAuthor(details): Observable<Author> {
    console.log(details);
    return this.http.put(this.authorRootApiUrl, details);
  }

  addAuthor(author): Observable<any> {
    return this.http.post(this.authorRootApiUrl, author);
  }

  deleteAuthor(idValue): Observable<Author> {
    console.log(idValue);
    return this.http.delete(`${this.authorRootApiUrl}?id=${idValue}`);
  }

}