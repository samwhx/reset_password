import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


//Components
import { AddAuthorComponent } from './author-add/add-author.component';
import { EditAuthorComponent } from './authors-edit/edit-author.component';
import { ListAuthorComponent } from './authors-list/list-author.component';
import { DetailAuthorComponent } from './authors-details/detail-author.component';
import { SearchAuthorComponent } from './authors-search/search-author.component';
import { UploadAuthorComponent } from './authors-upload/upload-author.component';

const authorsRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: 'authors/list',
    component: AddAuthorComponent
  },
  {
    path: 'authors',
    children: [
      {
        path: 'details',
        children: [ //why need another children
          {
            path: '',  
            component: DetailAuthorComponent
          },
        ]
      },
      {
        path: 'add',
        children: [
          {
            path: '',
            component: AddAuthorComponent
          },
        ]
      },
      {
        path: 'edit',
        children: [
          {
            path: '',
            component: EditAuthorComponent
          },
        ]
      },
      {
        path: '',
        component: SearchAuthorComponent
      },
      {
        path: 'authors/upload', // why authors-upload?
        component: UploadAuthorComponent
      },
    ]
  }
]);


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    authorsRouting,
    BrowserAnimationsModule,
    ReactiveFormsModule, 
  ],
  declarations: [AddAuthorComponent, EditAuthorComponent, ListAuthorComponent, DetailAuthorComponent, SearchAuthorComponent, UploadAuthorComponent]
})

export class AuthorsModule { }

