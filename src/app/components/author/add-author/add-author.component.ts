import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material';
import { Author } from '../../../shared/models/author';
import { AuthorsService } from '../../../shared/services/authors.service';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.css']
})
export class AddAuthorComponent implements OnInit {

  addAuthorForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    profile: new FormControl('', Validators.required)
  });

  constructor(private authorSvc: AuthorsService, private snackSvc: MatSnackBar) { }

  ngOnInit() {
  }

  onSubmit(){
    console.log(this.addAuthorForm.get("firstname").value);
    console.log(this.addAuthorForm.get("lastname").value);
    console.log(this.addAuthorForm.get("profile").value);
    var authorObj: Author = {
      firstname: this.addAuthorForm.get("firstname").value,
      lastname: this.addAuthorForm.get("lastname").value,
      profile: this.addAuthorForm.get("profile").value
    }
    this.authorSvc.addAuthor(authorObj).subscribe((result)=>{
      let snackBarRef = this.snackSvc.open("Author added", 'Done', {
        duration: 3000
      });
    })
  }

}
