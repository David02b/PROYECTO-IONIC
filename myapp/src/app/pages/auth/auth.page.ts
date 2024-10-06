import { Component, inject, Inject, Injector, OnInit } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required])
  })

  firebaseSVC = inject(FirebaseService);
  utilsSvc = inject(UtilsService);



  ngOnInit() {
  }
  

  async submit() {

    console.log(this.firebaseSVC);

    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSVC.signIn(this.form.value as User).then(res =>{

        console.log(res);

      }).catch(error=> {

        console.log(error);

        this.utilsSvc.presentToast({

          message: error.message,
          duration:2500,
          color: 'danger',
          position: 'middle',
          icon: 'aler-circle-outline'
        })

      }).finally(() =>{

        loading.dismiss();

      })




    }

  }

}
