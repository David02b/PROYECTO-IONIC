import { Component, inject, OnInit } from '@angular/core';
import { product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: product[]=[];

  ngOnInit() {
  }

  //========Cerrar sesion========//

  singOut(){

    this.firebaseSvc.signOut();

  }

  user(): User{

    return this.utilsSvc.getFromLocalStorage('user');

  }

  ionViewDidEnter() {
    this.getProducts();
  }

  //===========Obtener productos==============//

  getProducts(){

    let path =`users/${this.user().uid}/products`
    
    let sub=this.firebaseSvc.getcollectionData(path).subscribe({

      next: (res: any) =>{

        console.log(res);
        this.products = res;
        sub.unsubscribe();

      }

    })



  }

  //==========Agregar-actualizar productos============//
  addUpdateProduct(){

    this.utilsSvc.presentModal({

      component:AddUpdateProductComponent,
      cssClass: 'add-update-modal'

    })
  }

}
