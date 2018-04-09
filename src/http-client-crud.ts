import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpObserve } from '@angular/common/http/src/client';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { environment } from './environment';

import { HttpClientBase, IQueryParams } from './http-client-base';

export interface IPaginatedData<T> {
  records: T[],
  totalRecords: number;
}

export class HttpClientCRUD<Id, T> extends HttpClientBase {
  
  constructor(
    http: HttpClient,
    router: Router,    
    resourceUrl: string) {
      super(http, router, resourceUrl);
  }

  // Generic methods
  // Get by id
  read(
    id: Id,
    resourcePath?: string,
    excludeAuthenticationHeaders = false
  ): Observable<T> {
    return this.get<T>(null, `${resourcePath}/${id}`, excludeAuthenticationHeaders);
  }

  async readAsync(
    id: Id,
    resourcePath?: string,
    excludeAuthenticationHeaders = false
  ): Promise<T> {
    return this.read(id, resourcePath, excludeAuthenticationHeaders).toPromise();
  }

  // Insert
  create<T>(
    data: T,
    resourcePath?: string,
    excludeAuthenticationHeaders = false
  ): Observable<T> {
    return this.post<T>(data, resourcePath, null, excludeAuthenticationHeaders);
  }

  async createAsync<T>(
    data: T,
    resourcePath?: string,
    excludeAuthenticationHeaders = false
  ): Promise<T> {
    return this.create<T>(data, resourcePath, excludeAuthenticationHeaders).toPromise();
  }

  // Update
  update(
    id: Id,
    data: T,
    resourcePath?: string,
    excludeAuthenticationHeaders = false
  ): Observable<T> {
    return this.put<T>(data, `${resourcePath}/${id}`, null, excludeAuthenticationHeaders);
  }

  async updateAsync(
    id: Id,
    data: T,
    resourcePath?: string,
    excludeAuthenticationHeaders = false): Promise<T> {
    return this.update(id, data, resourcePath, excludeAuthenticationHeaders).toPromise();
  }

  // Remove
  remove(
    id: Id,
    resourcePath?: string,
    excludeAuthenticationHeaders = false
  ): Observable<T> {
    return this.delete<T>(`${resourcePath}/${id}`, null, excludeAuthenticationHeaders);
  }

  async removeAsync(
    id: Id,
    resourcePath?: string,
    excludeAuthenticationHeaders = false
  ): Promise<T> {
    return this.remove(id, resourcePath, excludeAuthenticationHeaders).toPromise();
  }

  // Read
  query<T>(
    queryParams?: IQueryParams,
    resourcePath?: string,
    excludeAuthenticationHeaders = false
  ): Observable<T[]> {
    return this.get<T[]>(queryParams, resourcePath, excludeAuthenticationHeaders);
  }

  async queryAsync<T>(
    queryParams?: IQueryParams,
    resourcePath?: string,
    excludeAuthenticationHeaders = false
  ): Promise<T[]> {
    return this.query<T>(queryParams, resourcePath, excludeAuthenticationHeaders).toPromise();
  }

  // Read Paginated
  queryPaginated<T>(
    queryParams?: IQueryParams,
    resourcePath?: string,
    excludeAuthenticationHeaders = false
  ): Observable<IPaginatedData<T>> {
    return this.get<IPaginatedData<T>>(queryParams, resourcePath, excludeAuthenticationHeaders);
  }

  async queryPaginatedAsync<T>(
    queryParams?: IQueryParams,
    resourcePath?: string,
    excludeAuthenticationHeaders = false
  ): Promise<IPaginatedData<T>> {
    return this.queryPaginated<T>(queryParams, resourcePath, excludeAuthenticationHeaders).toPromise();
  }
}