import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage/storage.service';
import { UserService } from '../../../services/user/user.service';
import { ToastService } from '../../../services/toast/toast-service';
import { DataSharingService } from '../../../services/data-sharing/data-sharing.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private toastService: ToastService,
    private dataSharingService: DataSharingService,
    private http: HttpClient
  ) { }

  isShow!: boolean;
  isHide!: boolean;

  cartItems: any[] = []
  totalPrice: number = 0;
  totalQuantity: number = 0;

  shoppingSpinner: boolean = false;
  emptyCart: boolean = false
  shoppingCart: boolean = true

  navReceiveDataHide(event: boolean) {
    this.isHide = event
    this.ngOnInit()
  }

  navReceiveDataShow(event: boolean) {
    this.isShow = event
  }

  ngOnInit(): void {
    // check user sign in
    if (this.storageService.isLoggedIn() === true) {
      this.isShow = true
      this.isHide = false

    } else {
      this.isShow = false
      this.isHide = true
    }

    // get user cart
    this.getUserCartDetails()
  }


  // get user cart details
  getUserCartDetails() {
    if (this.storageService.isLoggedIn() === true) {
      const user = this.storageService.getUser()
      const id = user.id
      this.userService.getCartDetails(id).subscribe({
        next: (res) => {
          console.log(res)
          this.cartItems = res.data.Cart

          if (this.cartItems.length === 0) {
            this.emptyCart = true
            this.shoppingCart = false
          }

          this.calculateTotalPrice()
          this.calculateTotalQuantity()

        },
        error: (error) => {
          this.toastService.show(error, { classname: 'bg-danger', delay: 15000 })
        }
      })
    }
  }

  // sub total price calculate
  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce((total, cart) => {
      return total + (cart.cart_items.quantity * cart.price);
    }, 0);
  }

  // total quantity calculate
  calculateTotalQuantity() {
    this.totalQuantity = this.cartItems.reduce((total, cart) => {
      const quantityAsNumber = parseInt(cart.cart_items.quantity, 10);
      return total + quantityAsNumber;
    }, 0);
  }

  // delete cart 
  dropCart(id: string) {
    this.shoppingSpinner = true

    const user = this.storageService.getUser()
    const user_id = user.id
    const product_id = id

    this.userService.deleteCart(product_id, user_id).subscribe({
      next: (res) => {
        console.log(res)

        const delayMilliseconds = 1000;

        const delayedCode = () => {
          this.getUserCartDetails()

          const delayMilliseconds = 500;

          const delayedCode = () => {
            this.shoppingSpinner = false
          }

          setTimeout(delayedCode, delayMilliseconds)
        }

        setTimeout(delayedCode, delayMilliseconds)

        this.dataSharingService.deleteCartChanges.emit('Shopping cart product delete successful.')

      },
      error: (error) => {
        this.toastService.show(error, { classname: 'bg-danger', delay: 15000 });
      }
    })
  }


  // checkout
  async onCheckout() {
    if (this.storageService.isLoggedIn() === true) {
      try {
        const user = this.storageService.getUser()
        const session = await this.http.post<any>('http://localhost:8080/api/checkout/proceed-to-checkout', {
          items: this.cartItems,
          customer: user.id
        })
        const sessionId = await lastValueFrom(session)
        await this.redirectToCheckout(sessionId.id)

        console.log(sessionId)

      } catch (error: any) {
        console.log('Error: ', error);
        this.toastService.show(error, { classname: 'bg-danger', delay: 15000 });
      }

    } else {
      this.toastService.show('Please login before buy this product.', { classname: 'bg-warning', delay: 5000 });
    }
  }

  async redirectToCheckout(id: string) {
    const stripe = await this.getStripeInstance();
    const result = await stripe!.redirectToCheckout({
      sessionId: id,
    });

    if (result.error) {
      console.log('Error: ', result.error)
    }
  }

  async getStripeInstance() {
    const stripe = await import('@stripe/stripe-js');
    const stripeInstance = await stripe.loadStripe('pk_test_51NXHCpKouu9LL6RnKsviYGimoMw89fzfuCIKHdWQLCIE5zXgMwV9w18nd6Ed53ldkRJFQTiBp66DbfBYrZCoF48B00aIQUalbh');
    return stripeInstance
  }

  




}
