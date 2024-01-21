import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { OrderComponent } from './order/order.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    OrderComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule
  ]
})
export class CustomerModule { }
