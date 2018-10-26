import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material';
import { Author } from '../../../shared/models/author';
import { AuthorsService } from '../../../shared/services/authors.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-author',
  templateUrl: './edit-author.component.html',
  styleUrls: ['./edit-author.component.css']
})
export class EditAuthorComponent implements OnInit {
  author: Author;

  editAuthorForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    profile: new FormControl('', Validators.required)
  });

  constructor(private authorSvc: AuthorsService, 
    private snackSvc: MatSnackBar,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.params.id;
    console.log(id);
    this.authorSvc.getAuthor(id).subscribe((result)=>{
      console.log(JSON.stringify(result))
      this.editAuthorForm.patchValue({
        id: result.id,
        firstname: result.firstname,
        lastname: result.lastname,
        profile: result.profile
      });
      this.author = result;
    })
  }

  onSubmit() {
    console.log(this.editAuthorForm.get("firstname").value);
    console.log(this.editAuthorForm.get("lastname").value);
    console.log(this.editAuthorForm.get("profile").value);
    var authorObj: Author = {
      id: this.author.id,
      firstname: this.editAuthorForm.get("firstname").value,
      lastname: this.editAuthorForm.get("lastname").value,
      profile: this.editAuthorForm.get("profile").value
    }
    this.authorSvc.editAuthor(authorObj).subscribe((result)=>{
      let snackBarRef = this.snackSvc.open("Author Updated", 'Done', {
        duration: 3000
      });
    })
  }

}
