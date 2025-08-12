import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { ProductModel } from '@model/product.model';
import { environment } from '@env/environment';
import { ProductListMock } from './__mocks__/product.mock';
import { provideHttpClient } from '@angular/common/http';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // veriry, it doesn't exists calls
  });

  it('should fetch products', () => {
    const mockProducts: ProductModel[] = ProductListMock;

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products[0].title).toBe(ProductListMock[0].title);
    });

    const req = httpMock.expectOne(`${apiUrl}/products`);

    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should consult product by id', () => {
    const mockProduct: ProductModel = ProductListMock[0];

    service.getOne(mockProduct.id.toString()).subscribe((product) => {
      expect(product.title).toBe(mockProduct.title);
    });

    const req = httpMock.expectOne(`${apiUrl}/products/${mockProduct.id}`);

    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should handle empty product list', () => {
    const emptyProducts: ProductModel[] = [];

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(0);
      expect(products).toEqual([]);
    });

    const req = httpMock.expectOne(`${apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(emptyProducts);
  });

  it('should handle error when fetching products', () => {
    const errorMessage = 'Server Error';

    service.getProducts().subscribe({
      next: () => fail('Should have failed with server error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      },
    });

    const req = httpMock.expectOne(`${apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush('Server Error', { status: 500, statusText: errorMessage });
  });

  it('should handle error when fetching single product', () => {
    const productId = '999';

    service.getOne(productId).subscribe({
      next: () => fail('Should have failed with not found error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      },
    });

    const req = httpMock.expectOne(`${apiUrl}/products/${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush('Product not found', { status: 404, statusText: 'Not Found' });
  });
});
