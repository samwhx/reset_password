import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SecurityService } from '../../services/security.service';
import { User } from '../../models/user';
import { PasswordValidation } from '../../validation/password-match';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-validate-and-reset',
  templateUrl: './validate-and-reset.component.html',
  styleUrls: ['./validate-and-reset.component.css']
})
export class ValidateAndResetComponent implements OnInit {
  email: string;
  UUID: string;
  resetForm: FormGroup;
  PASSWORD_PATTERN = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{12,}$/;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private securitySvc: SecurityService,
    private fb: FormBuilder,
    private snackSvc: MatSnackBar) {
    this.route.queryParams.subscribe(params => {
        this.email = params['email'];
        this.UUID = params['UUID'];
    });
    this.resetForm = fb.group({
      password: ['', [Validators.required, Validators.pattern(this.PASSWORD_PATTERN)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: [PasswordValidation.MatchPassword]
    });

    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', this.email, this.UUID);

  }

  ngOnInit() {
    this.securitySvc.validateReset({'email': this.email, 'uuid': this.UUID}).subscribe((result) => {
      console.log('VALIDATEEEEEEEEEEEEEE', result);
      if (result.salt === '') {
        this.snackSvc.open("Invalid Reset", 'Done', {duration: 3000});
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    const passwordconfirm = this.resetForm.get('confirmPassword').value;
    const updatePassword = {
      password: passwordconfirm,
      uuid: this.UUID,
      email: this.email
    };
    /// first hash to the server side
    this.securitySvc.validatedReset(updatePassword).subscribe((result) => {
      console.log(result);
      const snackBarRef = this.snackSvc.open('Password Updated!', 'Done', {
        duration: 3000
      });
    });
  }

}
