import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpObserve } from '@angular/common/http/src/client';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { environment } from './environment';

import { HttpClientBase } from './http-client-base';

export interface IPaginatedData<T> {
  records: T[],
  totalRecords: number;
}

export class HttpClientCRUD<Id, T> extends HttpClientBase {
  
  constructor(
    http: HttpClient,
    router: Router,    
    resourceUrl: string,
    excludeAuthenticationHeaders = false) {
      super(http, router, resourceUrl, excludeAuthenticationHeaders);
  }

  // Generic methods
  // Get by id
  read(id: Id, resourcePath?: string): Observable<T> {
    return this.get<T>(null, `${resourcePath}/${id}`);
  }

  async readAsync(id: Id, resourcePath?: string): Promise<T> {
    return this.read(id, resourcePath).toPromise();
  }

  // Insert
  create<T>(data: T, resourcePath?: string): Observable<T> {
    return this.post<T>(data, resourcePath);
  }

  async createAsync<T>(body?: any, resourcePath?: string): Promise<T> {
    return this.create<T>(body, resourcePath).toPromise();
  }

  // Update
  update(id: Id, data: T, resourcePath?: string): Observable<T> {
    return this.put<T>(data, `${resourcePath}/${id}`);
  }

  async updateAsync(id: Id, data: T, resourcePath?: string): Promise<T> {
    return this.update(id, data, resourcePath).toPromise();
  }

  // Remove
  remove(id: Id, resourcePath?: string): Observable<T> {
    return this.delete<T>(`${resourcePath}/${id}`);
  }

  async removeAsync(id: Id, resourcePath?: string): Promise<T> {
    return this.remove(id, resourcePath).toPromise();
  }

  // Read
  query<T>(queryParams?: any, resourcePath?: string): Observable<T[]> {
    return this.get<T[]>(queryParams, resourcePath);
  }

  async queryAsync<T>(queryParams?: any, resourcePath?: string): Promise<T[]> {
    return this.query<T>(queryParams, resourcePath).toPromise();
  }

  // Read Paginated
  queryPaginated<T>(queryParams?: any, resourcePath?: string): Observable<IPaginatedData<T>> {
    return this.get<IPaginatedData<T>>(queryParams, resourcePath);
  }

  async queryPaginatedAsync<T>(queryParams?: any, resourcePath?: string): Promise<IPaginatedData<T>> {
    return this.queryPaginated<T>(queryParams, resourcePath).toPromise();
  }
}