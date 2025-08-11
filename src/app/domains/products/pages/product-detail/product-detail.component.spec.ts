import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import ProductDetail from './product-detail.component';
import { ProductListMock } from '@shared/services/product/__mocks__/product.mock';
import { of } from 'rxjs';
import { ProductService } from '@shared/services/product/product.service';
import { CartService } from '@shared/services/cart/cart.service';

const productMock = ProductListMock[0];

interface productServiceMockInterface {
  getOne: jasmine.Spy<jasmine.Func>;
}

interface cartServiceMockInterface {
  addToCart: jasmine.Spy<jasmine.Func>;
}

describe('ProductDetail', () => {
  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;
  let cartServiceMock: cartServiceMockInterface;
  let productServiceMock: productServiceMockInterface;

  beforeEach(async () => {
    productServiceMock = {
      getOne: jasmine.createSpy('getOne').and.returnValue(of(productMock)),
    };

    cartServiceMock = {
      addToCart: jasmine.createSpy('addToCart'),
    };

    await TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: CartService, useValue: cartServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('Should load product data and set cover image on init', fakeAsync(() => {
    fixture.componentRef.setInput('productId', productMock.id);
    fixture.detectChanges();

    tick();

    expect(component.dataProduct()).toEqual(productMock);
    expect(component.cover()).toEqual(productMock.images[0]);
  }));

  it('should call cartService.addToCart with current product', () => {
    fixture.detectChanges();
    component.dataProduct.set(productMock);
    component.addToCart();

    expect(cartServiceMock.addToCart).toHaveBeenCalledWith(productMock);
  });

  it('should change cover image when changeCover is called', () => {
    fixture.detectChanges();
    const newImage = 'https://example.com/new-image.jpg';

    component.changeCover(newImage);

    expect(component.cover()).toBe(newImage);
  });

  it('should not load product data if productId is null', () => {
    productServiceMock.getOne.calls.reset();

    fixture.componentRef.setInput('productId', null);
    fixture.detectChanges();

    expect(productServiceMock.getOne).not.toHaveBeenCalled();
    expect(component.dataProduct()).toBeNull();
  });

  it('should not add to cart if no product is loaded', () => {
    fixture.detectChanges();
    component.dataProduct.set(null);

    component.addToCart();

    expect(cartServiceMock.addToCart).not.toHaveBeenCalled();
  });
});
