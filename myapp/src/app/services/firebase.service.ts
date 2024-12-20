import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query,updateDoc, deleteDoc } from '@angular/fire/firestore'
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage";


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage= inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);

  //=========Autenticacion========//

  getAuth() {

    return getAuth();

  }

  //===========Cerrar sesion===========//

  signOut() {

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

  updateUser(displayName: string) {

    return updateProfile(getAuth().currentUser, { displayName })
  }


  //=================BASE DE DATOS==============//

  //=================obtener documentos de la coleccion============//

  getcollectionData(path: string, collectionQuery?: any){

    const ref= collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), {idField:'id'});

  }

  //================DOCUMENTOS=================//

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

   //================ACTUALIZAR DOCUMENTO=================//

   UpdateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //================ELIMINAR DOCUMENTO=================//

  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  //================OBTENER DOCUMENTO===========//

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //================RECUPERACION DE CONTRASEÑA===========//

  sendRecoberyEmail(email: string) {

    return sendPasswordResetEmail(getAuth(), email)

  }

  //================agregar documento====================//

  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  //================Almacenamiento========================//

  //=========Subir imagen=============//

  async uploadImage(path: string, data_url: string) {

    return uploadString(ref(getStorage(), path),data_url, 'data_url').then(()=>{


      return getDownloadURL(ref(getStorage(),path));
      
    })
    
      

    

  }

  //=============obtener ruta de la imagen============//
  async getFilePath(url: string){

    return ref(getStorage(),url).fullPath


  }
  //===============ELIMINAR ARCHIVOS=============//

  deleteFile(path: string){

    return deleteObject(ref(getStorage(),path));
  }


}

