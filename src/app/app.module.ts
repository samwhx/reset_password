import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Components & Modules
import { AppComponent } from './app.component';


// Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Materials
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/layout/material.module';


import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
// Services
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { MatFileUploadModule } from './shared/matfileUpload/matFileUpload.module';

import { RoutingModule } from './app.routing';
import { HeaderComponent } from './shared/layout/header/header.component';
import { AuthorComponent } from './components/author/author.component';
import { AddAuthorComponent } from './components/author/add-author/add-author.component';
import { EditAuthorComponent } from './components/author/edit-author/edit-author.component';
import { CategoryComponent } from './components/category/category.component';
import { ArticleComponent } from './components/article/article.component';
import { PublishComponent } from './components/article/publish/publish.component';
import { AddCategoryComponent } from './components/category/add-category/add-category.component';
import { EditCategoryComponent } from './components/category/edit-category/edit-category.component';
import  { DeleteAuthorDialog } from './components/author/author.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthorComponent,
    AddAuthorComponent,
    EditAuthorComponent,
    CategoryComponent,
    ArticleComponent,
    PublishComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    DeleteAuthorDialog
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    SharedModule,
    RoutingModule,
    MatFileUploadModule,
    DragDropModule,
    ScrollingModule,
    CdkTableModule,
    CdkTreeModule,
    PerfectScrollbarModule
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],

  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  entryComponents: [DeleteAuthorDialog],
  bootstrap: [AppComponent]
  

})
export class AppModule { }

