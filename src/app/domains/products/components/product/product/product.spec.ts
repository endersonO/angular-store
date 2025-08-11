import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from './product';
import { ProductListMock } from '@shared/services/product/__mocks__/product.mock';
import { ProductModel } from '@model/product.model';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

describe('Product', () => {
  let component: Product;
  let fixture: ComponentFixture<Product>;

  const mockProduct: ProductModel = ProductListMock[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Product],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Product);
    component = fixture.componentInstance;

    // Set required input before change detection

    fixture.componentRef.setInput('productInput', mockProduct);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render product title', () => {
    const titleEl: HTMLElement = fixture.debugElement.query(
      By.css('h3'),
    ).nativeElement;
    expect(titleEl.textContent).toContain(mockProduct.title);
  });

  it('should render product price', () => {
    const priceEl: HTMLElement = fixture.debugElement.query(
      By.css('p.text-lg'),
    ).nativeElement;
    expect(priceEl.textContent).toContain(mockProduct.price.toString());
  });

  it('should render the product image with lazy loading and correct ngSrc', () => {
    const imgDebug = fixture.debugElement.query(By.css('img'));
    const imgEl: HTMLImageElement = imgDebug.nativeElement;

    // ngSrc is applied as the `src` attribute after Angular processes it
    expect(imgEl.getAttribute('ngSrc')).toBe(mockProduct.images[0]);

    // check alt text
    expect(imgEl.alt).toBe(mockProduct.title);

    // check loading attribute
    expect(imgEl.loading).toBe('lazy');

    // check fill attribute (it will appear as an empty string if present)
    expect(imgEl.hasAttribute('fill')).toBeTrue();
  });
});
