import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';


// Components & Modules
import { AppComponent } from './app.component';
import { AuthorsModule } from './authors/authors.module';
//import { HomeModule } from './home/home.module';
//import { ArticlesModule } from './articles/articles.module';


// Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Materials
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/layout/material.module';


// Services
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([]);

@NgModule({
  declarations: [
    AppComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    HttpModule,
    RouterModule,
    AuthorsModule,
    //HomeModule,
    //ArticlesModule,
    SharedModule,
    rootRouting
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

