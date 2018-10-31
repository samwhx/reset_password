import { Component } from '@angular/core';
import { SecurityService } from './shared/services/security.service';
import { User } from './shared/models/user'; 
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'meenee';
  email = '';
  uuid = '';

  constructor(private route: ActivatedRoute,
    private userService: SecurityService, private router: Router) {
    //   console.log('Activated Route: ', this.route);
    //   this.route.queryParams.subscribe(params => {
    //     console.log('email: ', params['email']);
    //     console.log('UUID: ', params['UUID']);
    //     this.email = params['email'];
    //     this.uuid = params['UUID'];
    // });
    if (!this.email || !this.uuid) {
      console.log(this.userService.getCurrentUser());
      let user: User = this.userService.getCurrentUser();
      // if(JSON.stringify(user) == "{}"){
      //   this.userService.logout();
      //   this.router.navigate(['/Article']);
      // }
    }
  }
}
