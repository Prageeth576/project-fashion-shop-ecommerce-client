import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductsService } from '../../../services/products/products.service';
import { Products } from '../../../models/all.product.model';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private router: Router
  ) { }

  category_name: any;
  sub_category_name: any;
  sub_id: any;
  allProduct: Products[] = [];

  categories: any[] = [];

  checkedName: any;

  ngOnInit(): void {
    // get each sub category products
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.category_name = params.get('category_name');
        this.sub_category_name = params.get('sub_category_name')
        this.sub_id = params.get('sub_id')
        this.checkedName = this.sub_category_name
        const category_name = this.category_name
        return this.productService.getSubCategories(category_name);
      })
    ).subscribe({
      next: (res) => {
        console.log(res)

        this.categories = res.data.subs

        for (let sub of this.categories) {
          sub.sub_id = sub.id
          delete sub.id
        }

        const id = this.sub_id

        // get checked sub category products
        this.productService.getSubProduct(id).subscribe({
          next: (res) => {
            console.log(res)

            for (let products of res.data) {
              this.allProduct = products.products
            }
          },
          error: (error) => {

          }
        })

      },
      error: (error) => {

      }
    })

  }

  onSelect(sub_id: any, sub_category_name: any) {
    this.router.navigate(['/shop/category', this.category_name, sub_id, sub_category_name])
  }





}
