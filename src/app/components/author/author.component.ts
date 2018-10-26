import { Component, OnInit, Inject } from '@angular/core';
import { AuthorsService } from '../../shared/services/authors.service';
import { Author } from '../../shared/models/author';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';

export interface DialogData {
  id: string;
  firstname: string;
  lastname: string;
}

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {
  authors: Author[];

  constructor(private authorSvc: AuthorsService, 
    private router: Router,
    public dialog: MatDialog,
    private snackSvc: MatSnackBar) { }

  ngOnInit() {
    this.authorSvc.getAuthors().subscribe((result)=>{
      this.authors = result;
    });
  }

  onEdit(idValue){
    console.log(idValue);
    this.router.navigate([`/Author/Edit/${idValue}`]);
  }

  onAdd(){
    this.router.navigate(['/Author/Add']);
  }

  
  onDelete(idValue, firstname, lastname) {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {id: idValue, firstname: firstname, lastname: lastname}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if(typeof(result) !== 'undefined')
      {
        this.authorSvc.deleteAuthor(idValue).subscribe((result)=>{
          console.log(result);
          this.authorSvc.getAuthors().subscribe((result)=>{
            this.authors = result;
          });
          let snackBarRef = this.snackSvc.open("Author Deleted", 'Done', {
            duration: 3000
          });
        })
      }      
      
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'author-delete-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}