import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {User} from "../shared/interfaces";
import {AuthService} from "../shared/services/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup
  
  submitted: boolean = false
    message: string

  constructor(
      public auth: AuthService,
      private router: Router,
      private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
        if (params['loginAgain']) {
            this.message = "Пожалуйста, введите ваши данные"
        } else if (params['authFailed']) {
            this.message = 'Сессия истекла. Введите данные заново.'
        }
        console.log(this.message)
    })

    this.form = new FormGroup(
        {
          email: new FormControl(null,[
              Validators.required,
              Validators.email]),
          password: new FormControl(null,[
              Validators.required,
              Validators.minLength(6)
          ]),
        }
    )
  }

  submit() {
      // console.log(this.form)
    if (this.form.invalid) {
      return
    }

    this.submitted = true

    const user: User = {
        email: this.form.value.email,
        password: this.form.value.password,

    }
    this.auth.login(user).subscribe(
        () => {
            this.form.reset()
            this.router.navigate(['/admin','dashboard'])
            this.submitted = false
        }, () => {this.submitted = false}

    )

    this.submitted = false
  }

}
