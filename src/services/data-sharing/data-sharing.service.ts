import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  addToCartChanges = new EventEmitter<string>;

  deleteCartChanges = new EventEmitter<string>;
}
