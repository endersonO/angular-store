import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ProductModel } from '@model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getProducts(category_id?: string) {
    const url = new URL(`${this.apiUrl}/products`);

    if (category_id) {
      url.searchParams.set('categoryId', category_id);
    }

    return this.http.get<ProductModel[]>(url.toString());
  }

  getOne(id: string) {
    return this.http.get<ProductModel>(`${this.apiUrl}/products/${id}`);
  }
}
