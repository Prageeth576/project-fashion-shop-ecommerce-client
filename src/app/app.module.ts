import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProductComponent } from './pages/product/product.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomerModule } from './pages/customer/customer.module';
import { CartComponent } from './pages/cart/cart.component';

// bootstrap
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsContainer } from '../services/toast/toasts-container.component';

// prime-ng
import { GalleriaModule } from 'primeng/galleria';

// quill
import { QuillModule } from 'ngx-quill';

// interceptor service
import { httpInterceptorProviders } from '../services/interceptor/index';




@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    HomeComponent,
    CategoryComponent,
    ProductComponent,
    FooterComponent,
    CartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    GalleriaModule,
    HttpClientModule,
    QuillModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    ToastsContainer,
    CustomerModule
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
