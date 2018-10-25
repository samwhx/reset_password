import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'; // reactive forms
import { AuthorsService } from '../../shared/services/authors.service'; // service
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material'; // sort
import { Router } from '@angular/router'; // routing
import { environment } from '../../../environments/environment'; // variables for development/production


@Component({
  selector: 'app-search-author',
  templateUrl: './search-author.component.html',
  styleUrls: ['./search-author.component.css']
})
export class SearchAuthorComponent implements OnInit {

   // list of types for selection
   types = ['Firstname', 'Lastname', 'ID'];

   // image source
   IMG_URL = environment.image_url;
 
   // for table
   displayedColumns: string[] = ['id', 'thumbnail', 'firstname', 'lastname', 'edit'];
   authors = (new MatTableDataSource([]));
   // sort
   @ViewChild(MatSort) sort: MatSort;
   // paginator
   length = 1000;
   pageSize = 10;
   pageSizeOptions: number[] = [5, 10, 20, 50];
   @ViewChild(MatPaginator) paginator: MatPaginator;
 
   searchCriteria = {
     'firstname': '',
     'lastname': ''
   };
 
   // reactive forms
   searchForm: FormGroup;
   createFormGroup() {
     return new FormGroup({
       type: new FormControl('', Validators.required),
      
     });
   }
 
   constructor(private authorsSvc: AuthorsService,
               private route: Router) {
     this.searchForm = this.createFormGroup();
   }
 
   // validator checks for reactive forms
   get type() { return this.searchForm.get('type'); }
   
 
   // reset button
   reset() {
     this.searchForm.reset();
   }
 
   // go edit page
   goEditPage(firstname, lastname, title, thumbnail, id) {
     this.authorsSvc.edit = {
       'firstname' : firstname,
       'lastname' : lastname,
       'title' : title,
       'thumbnail' : thumbnail,
       'id' : id,
     };
     this.route.navigate(['/edit']);
   }
 
   // go add page
   goAddPage() {
     this.route.navigate(['/add']);
   }
 
   // go upload page
   goUpload(firstname, lastname, title, thumbnail, id) {
     this.authorsSvc.editAuthor = {
       'firstname' : firstname,
       'lastname' : lastname,
       'thumbnail' : thumbnail,
       'id' : id,
     };
     this.route.navigate(['/upload']);
   }
 
   // submit button
   onSubmit() {
     this.searchCriteria.firstname = ''; // reset to default
     this.searchCriteria.lastname = ''; // reset to default
     console.log('Submitted Form data >>>>> ', this.searchForm.value);
     if (this.searchForm.value.type === 'ID') {
         this.authorsSvc.getAuthors().subscribe((results) => {
           console.log('Suscribed Results: ', results);
           this.authors = new MatTableDataSource();
           this.authors.sort = this.sort;
           this.authors.paginator = this.paginator;
           this.searchForm.reset();
         });
       } else {
         alert('Author Id search only accepts numbers!');
     } else {
       if (this.searchForm.value.type === 'firstname') {
         this.searchCriteria.firstname = `%${this.searchForm.value.term}%`;
       }
       if (this.searchForm.value.type === 'lastname') {
         this.searchCriteria.lastname = `%${this.searchForm.value.term}%`;
       }
       if (this.searchForm.value.type === 'firstname & lastname') {
         this.searchCriteria.firstname = `%${this.searchForm.value.term}%`;
         this.searchCriteria.lastname = `%${this.searchForm.value.term}%`;
       }
       console.log('Sent Data >>>>> FirstName:', this.searchCriteria.firstname, ', Lastname: ', this.searchCriteria.lastname);
       this.authorsSvc.getAuthors().subscribe((results) => {
         console.log('Suscribed Results: ', results);
         this.authors = new MatTableDataSource();
         this.authors.sort = this.sort;
         this.authors.paginator = this.paginator;
       });
       this.searchForm.reset();
     }
   }
 
   ngOnInit() {
     // init get all data
     this.authorsSvc.getAuthors().subscribe((results) => {
       console.log('Suscribed Results; ', results);
       this.authors = new MatTableDataSource();
       this.authors.sort = this.sort;
       this.authors.paginator = this.paginator;
     });
   }
 }