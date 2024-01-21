import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  {
    path: 'customer',
    component: ProfileComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'order',
        component: OrderComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
