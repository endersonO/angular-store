import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { ProductModel } from '@model/product.model';
import { TimeAgoPipe } from '@shared/pipes/time-ago-pipe';

@Component({
  selector: 'app-product',
  imports: [CommonModule, TimeAgoPipe, RouterLinkWithHref, NgOptimizedImage],
  templateUrl: './product.component.html',
})
export class ProductComponent {
  productInput = input.required<ProductModel>();
  addToCart = output<ProductModel>();

  addToCartHandler() {
    const product = this.productInput();
    this.addToCart.emit(product);
  }
}
