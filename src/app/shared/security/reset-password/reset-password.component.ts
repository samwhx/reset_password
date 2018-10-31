import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SecurityService } from '../../services/security.service';
import { User } from '../../models/user';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;

  constructor(private securitySvc: SecurityService,
    private fb: FormBuilder,
    private snackSvc: MatSnackBar) {
      this.resetPasswordForm = fb.group({
        email: ['', [Validators.required, Validators.email]]
      }, {
        validator: []
      })
  }

  ngOnInit() {
  }

  onSubmit() {
    let email = this.resetPasswordForm.get("email").value;
    let resetUser: User = {
      email: email,
    }
    console.log(resetUser);

    ///first hash to the server side
    this.securitySvc.requestToResetPassword(resetUser).subscribe((result)=>{
      console.log(result);
      let snackBarRef = this.snackSvc.open("Reset email sent.", 'Done', {
        duration: 3000
      });
    })
  }
}


