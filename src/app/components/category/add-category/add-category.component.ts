import { Component, OnInit, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  @Output() categoryEvt = new EventEmitter<string>();
  name: string;
  constructor() { }

  ngOnInit() {
  }

  onAdd(){
    console.log(this.name);
    this.categoryEvt.emit(this.name);
  }

}
