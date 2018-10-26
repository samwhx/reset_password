import { Component, OnInit } from '@angular/core';
import { AuthorsService } from '../../shared/services/authors.service';
import { Author } from '../../shared/models/author';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {
  authors: Author[];

  constructor(private authorSvc: AuthorsService, private router: Router) { }

  ngOnInit() {
    this.authorSvc.getAuthors().subscribe((result)=>{
      this.authors = result;
    })
  }

  onEdit(idValue){
    console.log(idValue);
    this.router.navigate([`/Author/Edit/${idValue}`]);
  }

  onAdd(){
    this.router.navigate(['/Author/Add']);
  }

  onDelete(){

  }

}
