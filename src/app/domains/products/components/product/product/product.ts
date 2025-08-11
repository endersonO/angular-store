import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { ProductModel } from '@model/product.model';
import { ReversePipe } from '@shared/pipes/reverse-pipe';
import { TimeAgoPipe } from '@shared/pipes/time-ago-pipe';

@Component({
  selector: 'app-product',
  imports: [
    CommonModule,
    ReversePipe,
    TimeAgoPipe,
    RouterLinkWithHref,
    NgOptimizedImage,
  ],
  templateUrl: './product.html',
})
export class Product {
  productInput = input.required<ProductModel>();
  addToCart = output<ProductModel>();

  addToCartHandler() {
    const product = this.productInput();
    this.addToCart.emit(product);
  }
}
