import { Component, ComponentFactoryResolver, NgModule } from '@angular/core';
import { CommonModule, formatCurrency } from '@angular/common';
import {HeaderComponent } from './components/header/header.component';
import {CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/header/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [

    HeaderComponent,
    CustomInputComponent,
    LogoComponent,

  ],
  exports:[

    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule


  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
