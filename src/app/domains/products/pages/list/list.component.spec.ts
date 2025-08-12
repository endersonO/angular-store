import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponent } from './list.component';
import { CategoryModel } from '@model/category.model';
import { CategoryListMock } from '@shared/services/category/__mocks__/category.mock';
import { ProductModel } from '@model/product.model';
import { ProductListMock } from '@shared/services/product/__mocks__/product.mock';
import { CartService } from '@shared/services/cart/cart.service';
import { CategoryService } from '@shared/services/category/category.service';
import { ProductService } from '@shared/services/product/product.service';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ProductComponent } from '@product/components/product/product.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  let cartService: jasmine.SpyObj<CartService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let productService: jasmine.SpyObj<ProductService>;

  const mockCategories: CategoryModel[] = CategoryListMock;
  const mockProducts: ProductModel[] = ProductListMock;

  beforeEach(async () => {
    // Create spies for services
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'getAll',
    ]);
    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
    ]);

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: cartServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: ProductService, useValue: productServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;

    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    categoryService = TestBed.inject(
      CategoryService,
    ) as jasmine.SpyObj<CategoryService>;
    productService = TestBed.inject(
      ProductService,
    ) as jasmine.SpyObj<ProductService>;

    categoryService.getAll.and.returnValue(of(mockCategories));
    productService.getProducts.and.returnValue(of(mockProducts));

    fixture.componentRef.setInput('categoryId', '1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    fixture.detectChanges();

    expect(categoryService.getAll).toHaveBeenCalled();
    expect(component.categories()).toEqual(mockCategories);
  });

  it('should load products on changes', () => {
    fixture.detectChanges();

    expect(productService.getProducts).toHaveBeenCalledWith('1');
    expect(component.products()).toEqual(mockProducts);
  });

  it('should display categories in navigation', () => {
    fixture.detectChanges();

    const categoryLinks = fixture.debugElement.queryAll(By.css('ul li a'));

    // Primer link es "All" + 2 categorías = 3 links totales
    expect(categoryLinks.length).toBe(3);
    expect(categoryLinks[0].nativeElement.textContent.trim()).toBe('All');
    expect(categoryLinks[1].nativeElement.textContent.trim()).toBe(
      'Electronics',
    );
    expect(categoryLinks[2].nativeElement.textContent.trim()).toBe('Clothing');
  });

  it('should display products', () => {
    fixture.detectChanges();

    const productComponents = fixture.debugElement.queryAll(
      By.directive(ProductComponent),
    );
    expect(productComponents.length).toBe(2);

    // Verificar que se pasan los productos correctos
    expect(productComponents[0].componentInstance.productInput).toEqual(
      mockProducts[0],
    );
    expect(productComponents[1].componentInstance.productInput).toEqual(
      mockProducts[1],
    );
  });

  it('should handle addToCart event', () => {
    fixture.detectChanges();

    component.addToCart(mockProducts[0]);

    expect(cartService.addToCart).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('should handle category service error', () => {
    spyOn(console, 'log');
    categoryService.getAll.and.returnValue(
      throwError(() => new Error('API Error')),
    );

    fixture.detectChanges();

    expect(console.log).toHaveBeenCalledWith('error query categories');
    expect(component.categories()).toEqual([]);
  });

  it('should update products when categoryId changes', () => {
    fixture.detectChanges();

    // Resetear el spy para contar solo las nuevas llamadas
    productService.getProducts.calls.reset();

    // Cambiar el categoryId
    fixture.componentRef.setInput('categoryId', '2');
    fixture.detectChanges();

    expect(productService.getProducts).toHaveBeenCalledWith('2');
  });

  it('should have correct query parameters for category links', () => {
    fixture.detectChanges();

    const categoryLinks = fixture.debugElement.queryAll(
      By.css('ul li a[queryParams]'),
    );

    expect(categoryLinks[0].attributes['ng-reflect-query-params']).toContain(
      'category_id',
    );
  });

  it('should handle empty categories list', () => {
    categoryService.getAll.and.returnValue(of([]));

    fixture.detectChanges();

    const categoryLinks = fixture.debugElement.queryAll(By.css('ul li a'));
    // Solo debería mostrar el link "All"
    expect(categoryLinks.length).toBe(1);
    expect(categoryLinks[0].nativeElement.textContent.trim()).toBe('All');
  });

  it('should handle empty products list', () => {
    productService.getProducts.and.returnValue(of([]));

    fixture.detectChanges();

    const productComponents = fixture.debugElement.queryAll(
      By.directive(ProductComponent),
    );
    expect(productComponents.length).toBe(0);
  });
});
