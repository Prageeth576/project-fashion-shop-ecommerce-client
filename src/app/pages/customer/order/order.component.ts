import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // order details
    // this.route.queryParams.subscribe((params) => {
    //   const session_id = params['session_id']
      
    //   if (session_id) {
    //     this.userService.orderDetails(session_id).subscribe({
    //       next: (res) => {
    //         console.log(res)
    //       },
    //       error: (error) => {
  
    //       }
    //     })
    //   }
    // })
  }
}
