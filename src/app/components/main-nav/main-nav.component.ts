import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../../../services/products/products.service';
import { ToastService } from '../../../services/toast/toast-service';
import { AuthService } from '../../../services/auth/auth.service';
import { Auth } from '../../../models/auth.model';
import { StorageService } from '../../../services/storage/storage.service';
import { UserService } from '../../../services/user/user.service';
import { DataSharingService } from '../../../services/data-sharing/data-sharing.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
})
export class MainNavComponent implements OnInit {

  constructor(
    private offcanvasService: NgbOffcanvas,
    private productService: ProductsService,
    private modalService: NgbModal,
    public toastService: ToastService,
    private authService: AuthService,
    private storageService: StorageService,
    private userService: UserService,
    private dataSharingService: DataSharingService
  ) { }

  categories: any[] = [];
  cartItems: any[] = []
  totalQuantity: number = 0;

  modelSignUp = new Auth('', '', '', '', '')
  modelLogin = new Auth('', '', '', '', '')

  errorMessageSignUp = '';
  errorMessageLogin = '';
  errorShowSignUp: boolean = false
  errorShowLogin: boolean = false

  isShow!: boolean;
  isHide!: boolean;

  @Output() MainNavEventHide = new EventEmitter<boolean>()
  @Output() MainNavEventShow = new EventEmitter<boolean>()

  toaltQuantityAmount: boolean = true
  quantitySpinner: boolean = false

  ngOnInit(): void {
    // get all main categories
    this.productService.allProductMainCategories().subscribe({
      next: (res) => {
        this.categories = res.data

        for (let sub of this.categories) {
          sub.sub_category_name = sub.subs[0].sub_category_name
          sub.sub_id = sub.subs[0].id
          delete sub.subs
        }
      },
      error: (error) => {
        this.toastService.show(error, { classname: 'bg-danger', delay: 10000 });
      }
    })

    // check user sign in
    if (this.storageService.isLoggedIn() === true) {
      this.isShow = true
      this.isHide = false

    } else {
      this.isShow = false
      this.isHide = true
    }

    // get user cart
    this.getUserCart()

    // get changes user product
    this.dataSharingService.addToCartChanges.subscribe((data: string) => {
      this.toaltQuantityAmount = false
      this.quantitySpinner = true

      const delayMilliseconds = 1000;

      const delayedCode = () => {
        this.getUserCart()

        const delayMilliseconds = 1000;

        const delayedCode = () => {
          this.quantitySpinner = false
          this.toaltQuantityAmount = true
          console.log(data)
        }

        setTimeout(delayedCode, delayMilliseconds)
      }

      setTimeout(delayedCode, delayMilliseconds)
    })

    // get changes user cart 
    this.dataSharingService.deleteCartChanges.subscribe((data: string) => {
      this.toaltQuantityAmount = false
      this.quantitySpinner = true

      const delayMilliseconds = 1000;

      const delayedCode = () => {
        this.getUserCart()

        const delayMilliseconds = 1000;

        const delayedCode = () => {
          this.quantitySpinner = false
          this.toaltQuantityAmount = true
          console.log(data)
        }

        setTimeout(delayedCode, delayMilliseconds)
      }

      setTimeout(delayedCode, delayMilliseconds)
    })

  }


  openOffcanvas(content: any) {
    this.offcanvasService.open(content).result
  }

  openModalSignUp(contentSignUp: any) {
    this.modalService.open(contentSignUp, { centered: true }).result
  }

  openModalLogin(contentLogin: any) {
    this.modalService.open(contentLogin, { centered: true }).result
  }


  // sign up
  onSubmitSignUp(contentSignUp: any) {
    const auth = this.modelSignUp

    this.authService.signUp(auth).subscribe({
      next: (res) => {
        this.modalService.dismissAll(contentSignUp)

        this.modelSignUp.user_name = ''
        this.modelSignUp.email = ''
        this.modelSignUp.password = ''

        this.toastService.show(res.message, { classname: 'bg-success', delay: 5000 });

      },
      error: (error) => {
        this.errorShowSignUp = true
        this.errorMessageSignUp = error
      }
    })
  }


  // login
  onSubmitLogin(contentLogin: any) {
    const auth = this.modelLogin

    this.authService.login(auth).subscribe({
      next: (res) => {
        this.storageService.saveUser(res)
        this.storageService.saveToken(res.accessToken)
        this.modalService.dismissAll(contentLogin)

        this.modelLogin.email = ''
        this.modelLogin.password = ''

        if (this.storageService.isLoggedIn() === true) {
          this.isShow = true
          this.isHide = false

          this.MainNavEventHide.emit(this.isHide)
          this.MainNavEventShow.emit(this.isShow)
        }

        this.toastService.show(res.message, { classname: 'bg-success', delay: 5000 });

        this.getUserCart()

      },
      error: (error) => {
        this.errorShowLogin = true
        this.errorMessageLogin = error
      }
    })
  }

  // log out
  logOut(): void {
    this.authService.logOut().subscribe({
      next: (res) => {
        console.log(res)
        this.storageService.clean()

        if (this.storageService.isLoggedIn() === false) {
          this.isShow = false
          this.isHide = true

          this.MainNavEventHide.emit(this.isHide)
          this.MainNavEventShow.emit(this.isShow)
        }

        this.toastService.show(res.message, { classname: 'bg-success', delay: 5000 });

        this.totalQuantity = 0

      },
      error: (error) => {
        this.toastService.show(error, { classname: 'bg-danger', delay: 10000 });
      }
    })
  }


  // get user cart
  getUserCart() {
    if (this.storageService.isLoggedIn() === true) {
      const user = this.storageService.getUser()
      const id = user.id
      this.userService.getCartDetails(id).subscribe({
        next: (res) => {
          this.cartItems = res.data.Cart

          this.calculateTotalQuantity()

        },
        error: (error) => {
          this.toastService.show(error, { classname: 'bg-danger', delay: 15000 })
        }
      })
    }
  }

  // total quantity calculate
  calculateTotalQuantity() {
    this.totalQuantity = this.cartItems.reduce((total, cart) => {
      const quantityAsNumber = parseInt(cart.cart_items.quantity, 10);
      return total + quantityAsNumber;
    }, 0);
  }






}
