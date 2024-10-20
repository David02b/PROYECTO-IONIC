import { inject, Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from 'firebase/auth';
import { User } from '../models/user.model';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {getFirestore, setDoc, doc, getDoc} from '@angular/fire/firestore'
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject (AngularFirestore);
  utilsSvc = inject (UtilsService);

  //=========Autenticacion========//

  getAuth(){

    return getAuth();

  }

  //===========Cerrar sesion===========//

  signOut(){

    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');

  }





  //=========Acceso=======//

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //==========Registro=============//

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //=========Actualizar Usuario==============//

  updateUser(displayName: string){

    return updateProfile(getAuth().currentUser, {displayName})
  }


  //=================BASE DE DATOS==============//

  //================DOCUMENTOS=================//

  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }
  
  //================OBTENER DOCUMENTO===========//

  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //================RECUPERACION DE CONTRASEÑA===========//

  sendRecoberyEmail(email: string){

    return sendPasswordResetEmail(getAuth(), email)

  }

}

