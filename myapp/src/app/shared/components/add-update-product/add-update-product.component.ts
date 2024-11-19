import { Component, inject, Inject, Injector, Input, OnInit } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, Validators } from '@angular/forms';
import { product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';



@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  @Input () product:product;

  form = new FormGroup({
    id: new FormControl(''),
    Image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),
  })

  firebaseSVC = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;


  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.product) {
      console.log('Editando producto:', this.product);
      this.form.setValue(this.product); // Carga los datos del producto
    } else {
      console.log('Creando producto nuevo');
      this.form.reset(); // Prepara el formulario para un producto nuevo
    }
  }

        

  async takeImage(){

    const dataUrl = (await this.utilsSvc.takePicture('Imagen del producto')).dataUrl;
    this.form.controls.Image.setValue(dataUrl);


  }
  

  submit() {
    if (this.form.valid) {
      if (this.product) {
        this.updateProduct(); // Editar producto existente
      } else {
        this.createProduct(); // Crear producto nuevo
      }
    } else {
      this.utilsSvc.presentToast({
        message: 'Por favor, completa todos los campos requeridos.',
        duration: 2000,
        color: 'warning',
        position: 'top',
      });
    }
  }

  //============CONVIERTE VALOES A NUMBER

  setNumberInputs(){

    let {soldUnits} = this.form.controls;

  }

  async createProduct() {

    

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

  //=======ACTUALIZAR PRODUCTO==========//

  async updateProduct() {

    

      let path =`users/${this.user.uid}/products/${this.product.id}`

      const loading = await this.utilsSvc.loading();
      await loading.present();

      //========actualizar imagen y obtener url=============//

      if(this.form.value.Image !== this.product.Image){

      let dataUrl= this.form.value.Image;
      let imagePath = await this.firebaseSVC.getFilePath(this.product.Image);
      let imageUrl= await this.firebaseSVC.uploadImage(imagePath, dataUrl);
      this.form.controls.Image.setValue(imageUrl);
        
      }
      

      delete this.form.value.id;

      this.firebaseSVC.UpdateDocument(path, this.form.value).then(async res =>{
        

        this.utilsSvc.dismissModal ({success : true});


        this.utilsSvc.presentToast({

          message: 'Producto actualizado exitosamente',
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
