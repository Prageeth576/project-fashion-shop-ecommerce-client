import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ProductsService } from '../../../services/products/products.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SelectProduct } from '../../../models/all.product.model';
import KeenSlider, { KeenSliderInstance, KeenSliderPlugin } from 'keen-slider';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { StorageService } from '../../../services/storage/storage.service';
import { ToastService } from '../../../services/toast/toast-service';
import { UserService } from '../../../services/user/user.service';
import { DataSharingService } from '../../../services/data-sharing/data-sharing.service';

function ThumbnailPlugin(main: KeenSliderInstance): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("active")
      })
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add("active")
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          main.moveToIdx(idx)
        })
      })
    }

    slider.on("created", () => {
      addActive(slider.track.details.rel)
      addClickEvents()
      main.on("animationStarted", (main) => {
        removeActive()
        const next = main.animator.targetIdx || 0
        addActive(main.track.absToRel(next))
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next))
      })
    })
  }
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  constructor(
    private productService: ProductsService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private http: HttpClient,
    private storageService: StorageService,
    private toastService: ToastService,
    private userService: UserService,
    private dataSharingService: DataSharingService
  ) { }

  @ViewChild("sliderRef")
  sliderRef!: ElementRef<HTMLElement>;
  @ViewChild("thumbnailRef")
  thumbnailRef!: ElementRef<HTMLElement>;

  slider!: KeenSliderInstance;
  thumbnailSlider!: KeenSliderInstance;

  html!: string;

  category_name: any;
  sub_category_name: any;
  product_id: any;
  sub_id: any;

  select_product!: SelectProduct;

  quantity = new FormControl('')
  size = new FormControl('')
  color = new FormControl('')

  // color for availability
  getColorAvailability = {
    'background-color': '#f5cdc5'
  }


  ngOnInit(): void {
    this.category_name = this.route.snapshot.params['category_name'];

    this.sub_category_name = this.route.snapshot.params['sub_category_name'];

    this.product_id = this.route.snapshot.params['id'];

    this.sub_id = this.route.snapshot.params['sub_id']

    // get select product
    const id = this.product_id
    this.productService.getSelectProduct(id).subscribe({
      next: (res) => {
        console.log(res)

        this.select_product = res.data

        this.html = res.data.specifications

        // color for availability
        if (this.select_product.availability === 'In Stock') {
          this.getColorAvailability = {
            'background-color': '#84d8e3'
          }
        }

        this.size.setValue(this.select_product.sizes[0].name)

        this.color.setValue(this.select_product.colors[0].color_name)
      }
    })

    this.quantity.setValue('1')
  }

  byPassHTML(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }

  ngAfterViewInit() {
    this.slider = new KeenSlider(this.sliderRef.nativeElement)
    this.thumbnailSlider = new KeenSlider(
      this.thumbnailRef.nativeElement,
      {
        initial: 0,
        slides: {
          perView: 4,
          spacing: 10,
        },
      },
      [ThumbnailPlugin(this.slider)]
    )
  }

  ngOnDestroy() {
    if (this.slider) this.slider.destroy()
    if (this.thumbnailSlider) this.thumbnailSlider.destroy()
  }


  // buy now
  async onCheckoutBuyNow() {
    if (this.storageService.isLoggedIn() === true) {
      try {
        const originalURL = `http://localhost:4200/shop/category/${this.category_name}/${this.sub_id}/${this.sub_category_name}/product/${this.product_id}`
        const encodedURL = originalURL.replace(`${this.category_name}`, encodeURIComponent(`${this.category_name}`))
        const encodedURLSecond = encodedURL.replace(`${this.sub_category_name}`, encodeURIComponent(`${this.sub_category_name}`))

        const user = this.storageService.getUser()

        const session = await this.http.post<any>('http://localhost:8080/api/checkout/buy-now', {
          quantity: this.quantity.value,
          color: this.color.value,
          size: this.size.value,
          productDetail: this.select_product,
          url: encodedURLSecond,
          customer: user.id,
        })
        const sessionId = await lastValueFrom(session)
        //await this.redirectToCheckout(sessionId.id)

        console.log(sessionId)

      } catch (error) {
        console.log('Error: ', error);
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


  // add to cart
  addToCartProduct() {
    if (this.storageService.isLoggedIn() === true) {
      const quantity = this.quantity.value
      const color = this.color.value
      const size = this.size.value
      const product_id = this.select_product.id

      const user = this.storageService.getUser()
      const user_id = user.id

      this.userService.addToCart(product_id, user_id, quantity, color, size).subscribe({
        next: (res) => {
          console.log(res)

          this.dataSharingService.addToCartChanges.emit('Shopping cart update successful.')

        },
        error: (error) => {
          this.toastService.show(error, { classname: 'bg-danger', delay: 15000 })

        }
      })

    } else {
      this.toastService.show('Please login before adding to the cart.', { classname: 'bg-warning', delay: 5000 });
    }

  }

  





}