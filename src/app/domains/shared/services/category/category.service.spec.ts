import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { CategoryModel } from '@model/category.model';
import { CategoryListMock } from './__mocks__/category.mock';
import { environment } from '@env/environment';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should fetch categories successfully', () => {
      const mockCategories: CategoryModel[] = CategoryListMock;

      service.getAll().subscribe((categories) => {
        expect(categories).toEqual(mockCategories);
        expect(categories.length).toBe(2);
        expect(categories[0].id).toBe(76);
        expect(categories[0].name).toBe('Category 1132');
        expect(categories[1].id).toBe(77);
        expect(categories[1].name).toBe('Electronics');
      });

      const req = httpMock.expectOne(`${apiUrl}/categories`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Content-Type')).toBe(null);
      req.flush(mockCategories);
    });

    it('should return empty array when no categories exist', () => {
      const emptyResponse: CategoryModel[] = [];

      service.getAll().subscribe((categories) => {
        expect(categories).toEqual([]);
        expect(categories.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/categories`);
      expect(req.request.method).toBe('GET');
      req.flush(emptyResponse);
    });

    it('should handle HTTP error responses', () => {
      const errorMessage = 'Categories not found';

      service.getAll().subscribe({
        next: () => fail('Should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/categories`);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

    it('should handle server error (500)', () => {
      service.getAll().subscribe({
        next: () => fail('Should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/categories`);
      req.flush('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });

    it('should handle network error', () => {
      service.getAll().subscribe({
        next: () => fail('Should have failed with network error'),
        error: (error) => {
          expect(error.name).toBe('HttpErrorResponse');
          expect(error.status).toBe(0);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/categories`);
      req.error(new ProgressEvent('Network error'));
    });

    it('should use correct API endpoint URL', () => {
      service.getAll().subscribe();

      const req = httpMock.expectOne(`${apiUrl}/categories`);
      expect(req.request.url).toBe(`${apiUrl}/categories`);
      req.flush([]);
    });

    it('should not send any request body', () => {
      service.getAll().subscribe();

      const req = httpMock.expectOne(`${apiUrl}/categories`);
      expect(req.request.body).toBe(null);
      req.flush([]);
    });

    it('should handle malformed JSON response', () => {
      service.getAll().subscribe({
        next: () => fail('Should have failed with parse error'),
        error: (error) => {
          expect(error.name).toBe('HttpErrorResponse');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/categories`);
      req.flush('Invalid JSON', {
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should complete the observable after successful response', () => {
      let completed = false;

      service.getAll().subscribe({
        complete: () => {
          completed = true;
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/categories`);
      req.flush(CategoryListMock);

      expect(completed).toBe(true);
    });

    it('should be callable multiple times', () => {
      const mockCategories = CategoryListMock;
      let callCount = 0;

      // first call
      service.getAll().subscribe(() => {
        callCount++;
      });

      const req1 = httpMock.expectOne(`${apiUrl}/categories`);
      req1.flush(mockCategories);

      // second call
      service.getAll().subscribe(() => {
        callCount++;
      });

      const req2 = httpMock.expectOne(`${apiUrl}/categories`);
      req2.flush(mockCategories);

      expect(callCount).toBe(2);
    });
  });

  describe('Service Configuration', () => {
    it('should have correct apiUrl from environment', () => {
      expect(environment.apiUrl).toBeDefined();
      expect(typeof environment.apiUrl).toBe('string');
    });

    it('should be a singleton service', () => {
      const service1 = TestBed.inject(CategoryService);
      const service2 = TestBed.inject(CategoryService);

      expect(service1).toBe(service2);
    });
  });
});
