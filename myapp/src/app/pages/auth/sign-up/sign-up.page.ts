import { Component, inject, Inject, Injector, OnInit } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  })

  firebaseSVC = inject(FirebaseService);
  utilsSvc = inject(UtilsService);



  ngOnInit() {
  }
  

  async submit() {

    

    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSVC.signUp(this.form.value as User).then(async res =>{
        
        await this.firebaseSVC.updateUser(this.form.value.name);
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


  async setUserInfo(uid: string) {

    

    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSVC.setDocument(this.form.value as User).then(async res =>{
        
        await this.firebaseSVC.updateUser(this.form.value.name);
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
