import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../shared/services/article.service';
import { Article } from '../../shared/models/Article';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  articles: Article[] = [];
  constructor(private articleSvc: ArticleService) { }

  ngOnInit() {
    this.articleSvc.getArticles().subscribe((result)=>{
      this.articles = result;
    });
  }

}
