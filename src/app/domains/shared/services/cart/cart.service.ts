import { computed, Injectable, signal } from '@angular/core';
import { ProductModel } from '@model/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = signal<ProductModel[]>([]);

  total = computed(() => {
    const cart = this.cart();
    return cart.reduce((total, product) => total + product.price, 0);
  });

  addToCart(product: ProductModel) {
    this.cart.update((state) => [...state, product]);
  }
}
