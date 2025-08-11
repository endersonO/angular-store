import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  inject,
  input,
  signal,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductModel } from '@model/product.model';
import { CartService } from '@shared/services/cart/cart.service';
import { ProductService } from '@shared/services/product/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './product-detail.component.html',
})
export default class ProductDetail implements OnInit {
  productId = input<string | null>();
  dataProduct = signal<ProductModel | null>(null);
  cover = signal('');

  // Used to handle component destruction
  private destroyRef = inject(DestroyRef);

  private prodcutService = inject(ProductService);
  private cartService = inject(CartService);

  ngOnInit() {
    const productId = this.productId();
    if (productId) {
      this.prodcutService
        .getOne(productId)
        // Auto-unsubscribe if the component is destroyed
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (product: ProductModel) => {
            this.dataProduct.set(product);
            if (product.images.length > 0) {
              this.cover.set(product.images[0]);
            }
          },
        });
    }
  }

  changeCover(newImg: string) {
    this.cover.set(newImg);
  }

  addToCart() {
    const product = this.dataProduct();
    if (product) {
      this.cartService.addToCart(product);
    }
  }
}
