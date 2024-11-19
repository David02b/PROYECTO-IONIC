import { Component, inject, Input, OnInit } from '@angular/core';
import { product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import {orderBy} from 'firebase/firestore'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {



  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: product[] = [];
  loading: boolean = false;

  ngOnInit() {
  }

  //========Cerrar sesion========//

  singOut() {

    this.firebaseSvc.signOut();

  }

  user(): User {

    return this.utilsSvc.getFromLocalStorage('user');

  }

  ionViewDidEnter() {
    this.getProducts();
  }

  //===========Obtener productos==============//

  getProducts() {

    let path = `users/${this.user().uid}/products`

    this.loading = true;

    let query  = (

      orderBy('souldUnite','desc')

    )

    let sub = this.firebaseSvc.getcollectionData(path,query).subscribe({

      next: (res: any) => {

        console.log(res);
        this.products = res;
        this.loading = false;

        sub.unsubscribe();

      }

    })



  }

  //==========Agregar-actualizar productos============//
  async addUpdateProduct(product?: product) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product: product ?? null }, // Campo 'product'
    });
    if (success) this.getProducts();
  }

  async confirmDeleteProduct(product: product) {
    this.utilsSvc.presentAlert({
      header: 'Elimiar producto',
      message: '¿Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',

        }, {
          text: 'Si, eliminar producto',
          handler: () => {
            this.deleteProduct(product);
          }
        }
      ]
    });


  }

  //=======Eliminar PRODUCTO==========//

  async deleteProduct(product: product) {



    let path = `users/${this.user().uid}/products/${product.id}`

    const loading = await this.utilsSvc.loading();
    await loading.present();
    let imagePath = await this.firebaseSvc.getFilePath(product.Image);
    await this.firebaseSvc.deleteFile(imagePath);


    this.firebaseSvc.deleteDocument(path).then(async res => {

      this.products = this.products.filter(p => p.id !== product.id);


      this.utilsSvc.presentToast({

        message: 'Producto eliminado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })


    }).catch(error => {

      console.log(error);

      this.utilsSvc.presentToast({

        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'aler-circle-outline'
      })

    }).finally(() => {

      loading.dismiss();

    })



  }



}
