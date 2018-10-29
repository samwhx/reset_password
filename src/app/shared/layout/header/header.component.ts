import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateToAuthor(){
    this.router.navigate(['/Author']);
  }

  navigateToCategory(){
    this.router.navigate(['/Category']);
  }

  navigateToPublish(){
    this.router.navigate(['/Publish']);
  }

  navigateToRegister(){
    this.router.navigate(['/Registration']);
  }

  navigateToLogin(){
    this.router.navigate(['/Login']);
  }

  navigateToChangePassword(){
    this.router.navigate(['/ChangePassword']);
  }

  navigateToResetPassword(){
    this.router.navigate(['/ResetPassword']);
  }

}
