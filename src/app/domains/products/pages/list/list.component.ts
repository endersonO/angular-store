/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  input,
  signal,
  OnInit,
  OnChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CategoryModel } from '@model/category.model';
import { ProductModel } from '@model/product.model';
import { ProductComponent } from '@product/components/product/product.component';
import { CartService } from '@shared/services/cart/cart.service';
import { CategoryService } from '@shared/services/category/category.service';
import { ProductService } from '@shared/services/product/product.service';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ProductComponent, RouterLink],
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit, OnChanges {
  products = signal<ProductModel[]>([]);
  categories = signal<CategoryModel[]>([]);

  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  private destroyRef = inject(DestroyRef);

  categoryId = input.required<string>();

  ngOnInit() {
    this.getCategories();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(_changes: any) {
    this.getProducts();
  }

  addToCart(product: ProductModel) {
    this.cartService.addToCart(product);
  }

  private getProducts() {
    const categoryId = this.categoryId();
    this.productService
      .getProducts(categoryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products: ProductModel[]) => {
          this.products.set(products);
        },
      });
  }

  private getCategories() {
    this.categoryService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories: CategoryModel[]) => {
          this.categories.set(categories);
        },
        error: () => {
          console.log('error query categories');
        },
      });
  }
}

export default ListComponent;
