import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AuthorComponent } from './components/author/author.component';
import { AddAuthorComponent } from './components/author/add-author/add-author.component';
import { EditAuthorComponent } from './components/author/edit-author/edit-author.component';
import { CategoryComponent } from './components/category/category.component';
import { ArticleComponent } from './components/article/article.component';
import { PublishComponent } from './components/article/publish/publish.component';
const appRoutes = [
    {
        path: 'Article',
        component: ArticleComponent,
    },
    {
        path: 'Author',
        component: AuthorComponent,
    },
    {
        path: 'Author/Add',
        component: AddAuthorComponent, 
    },
    {
        path: 'Author/Edit/:id',
        component: EditAuthorComponent, 
    },
    {
        path: 'Category',
        component: CategoryComponent,
    },
    {
        path: 'Publish',
        component: PublishComponent,
    },
    {
        path: '', 
        redirectTo: '/Article', 
        pathMatch: 'full' 
    },
    {
        path: '**', 
        component: ArticleComponent,
    }
]

@NgModule({
    declarations: [
    
    ],
    imports: [
      BrowserModule,
      RouterModule.forRoot(appRoutes)
    ],
    exports: [ RouterModule ],
    providers: []
  })
export class RoutingModule { }