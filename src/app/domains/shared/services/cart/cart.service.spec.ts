import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';
import { ProductListMock } from '../product/__mocks__/product.mock';
import { ProductModel } from '@model/product.model';

describe('CartService', () => {
  let service: CartService;

  const [mockProdcut1, mockProdcut2]: ProductModel[] = ProductListMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService],
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty cart', () => {
    expect(service.cart()).toEqual([]);
    expect(service.cart().length).toBe(0);
  });

  it('should initialize with total of 0', () => {
    expect(service.total()).toBe(0);
  });

  it('should add product to cart', () => {
    service.addToCart(mockProdcut1);

    expect(service.cart().length).toBe(1);
    expect(service.cart()[0]).toEqual(mockProdcut1);
    expect(service.total()).toBe(mockProdcut1.price);
  });

  it('should calculate correct total for multiple products', () => {
    ProductListMock.forEach((product) => service.addToCart(product));

    const expectedTotal = ProductListMock.reduce(
      (sum, product) => sum + product.price,
      0,
    );
    expect(service.total()).toBe(expectedTotal);
  });

  it('should handle multiple products correctly', () => {
    const productsToAdd = [mockProdcut1, mockProdcut2, mockProdcut1];

    productsToAdd.forEach((product) => service.addToCart(product));

    const expectedTotal = productsToAdd.reduce(
      (sum, product) => sum + product.price,
      0,
    );
    expect(service.total()).toBe(expectedTotal);
    expect(service.cart().length).toBe(productsToAdd.length);

    productsToAdd.forEach((product, index) => {
      expect(service.cart()[index]).toEqual(product);
    });
  });

  it('should update total reactively when adding products', () => {
    // initial total
    expect(service.total()).toBe(0);

    // add first product
    service.addToCart(mockProdcut1);
    expect(service.total()).toBe(mockProdcut1.price);

    // add second prodcut
    service.addToCart(mockProdcut2);
    expect(service.total()).toBe(mockProdcut1.price + mockProdcut2.price);
  });

  it('should handle products with price 0', () => {
    const freeProduct: ProductModel = {
      ...mockProdcut1,
      id: 999,
      title: 'Free Product',
      price: 0,
    };

    service.addToCart(freeProduct);
    service.addToCart(mockProdcut1);

    expect(service.cart().length).toBe(2);
    expect(service.total()).toBe(mockProdcut1.price);
  });
});
