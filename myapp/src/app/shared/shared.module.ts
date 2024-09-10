import { Component, ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule, formatCurrency } from '@angular/common';
import {HeaderComponent } from './Components/header/Header.Component';
import {customimputComponent } from './Components/custom-input/custom-input.Component';
import { CustomImputComponent } from './components/header/custom-imput/custom-imput.component';
import { LogoComponent } from './components/header/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [

    HeaderComponent,
    CustomImputComponent,
    LogoComponent,

  ],
  exports:[

    HeaderComponent,
    CustomImputComponent,

  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
