import { Component, inject, Inject, Injector, OnInit } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';



@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    Image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl('', [Validators.required, Validators.min(0)]),
  })

  firebaseSVC = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;


  ngOnInit() {

    this.user = this.utilsSvc.getFromLocalStorage('user');

  }

        

  async takeImage(){

    const dataUrl = (await this.utilsSvc.takePicture('Imagen del producto')).dataUrl;
    this.form.controls.Image.setValue(dataUrl);


  }
  

  async submit() {

    

    if (this.form.valid) {

      let path =`users/${this.user.uid}/products`

      const loading = await this.utilsSvc.loading();
      await loading.present();

      //========subir imagen y obtener url=============//

      let dataUrl= this.form.value.Image;
      let imagePath=`${this.user.uid}/${Date.now()}`;
      let imageUrl= await this.firebaseSVC.uploadImage(imagePath, dataUrl);
      this.form.controls.Image.setValue(imageUrl);

      delete this.form.value.id;

      this.firebaseSVC.addDocument(path, this.form.value).then(async res =>{
        

        this.utilsSvc.dismissModal ({success : true});


        this.utilsSvc.presentToast({

          message: 'Producto creado',
          duration:1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })


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
