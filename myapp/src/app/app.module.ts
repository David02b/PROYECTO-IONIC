import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//===========FIREBASE===============//

import{AngularFireModule} from '@angular/fire/compat';
import { environment } from 'src/environments/environment.prod';
import { FirebaseService } from './services/firebase.service';



@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot({mode: 'md'}), AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig)],
  //providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  //providers: [FirebaseService]
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FirebaseService  // Aquí combinamos el FirebaseService en el mismo array de providers
  ],

})
export class AppModule {}
