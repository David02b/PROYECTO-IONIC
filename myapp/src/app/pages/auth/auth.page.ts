import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup ({

    Email: new FormControl("",[Validators.required, Validators.email]),
    Password: new FormControl("",[Validators.required])


  })

  constructor() { }

  ngOnInit() {
  }

  submit(){
    console.log(this.form.value);

  }

}
