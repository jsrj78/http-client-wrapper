import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { HttpObserve } from '@angular/common/http/src/client';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { environment } from './environment';

export interface IRequestOptions {
  body?: any;
  headers?: HttpHeaders | {
      [header: string]: string | string[];
  };
  observe?: HttpObserve;
  params?: HttpParams | {
      [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
}

export class HttpClientBase {
  
  constructor(
    public http: HttpClient,
    public router: Router,
    public resourceUrl: string,
    public excludeAuthenticationHeaders = false
  ) {
    this.resourceUrl = environment.apiUrl + this.resourceUrl;
  }

  clearLocalStorage() {
    localStorage.removeItem(environment.userKey);
  }

  getAccessToken(): string {
    let user = JSON.parse(localStorage.getItem(environment.userKey));
    return user ? user.accessToken : null;
  }

  getAuthorizationHeaders(): any {
    let token = this.getAccessToken();
    if (!token) {
      return null;
    }

    return {
      'Authorization': `Bearer ${token}`
    };
  }

  getRequestOptions(queryParams?: any): IRequestOptions {
    let params: HttpParams = null;   
    let headers = {
      'Content-Type': 'application/json'
    };

    if (!this.excludeAuthenticationHeaders) {
      Object.assign(headers, this.getAuthorizationHeaders());
    }

    if(queryParams) {
      params = new HttpParams();
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] !== null) {
          if (Array.isArray(queryParams[key])) {
            queryParams[key].forEach(arrKey => {
              params.append(key, queryParams[key][arrKey]);
            });
          }
          else {
            params.set(key, queryParams[key]);
          }
        }
      });      
    }

    return {
      headers: new HttpHeaders(headers),
      params: params,
      responseType: 'json'
    };
  }

  // error processing
  handleError(error: HttpErrorResponse) {
    // authentication or forbidden error
    if (error.status === 401 || error.status === 403) {
      let state = error.status === 401 ? '/login' : '/unauthorized';
      this.displayError(error);
      this.clearLocalStorage();
      this.router.navigate([state]);
    }

    return new ErrorObservable(error);
  }

  displayError(error: HttpErrorResponse) {
    console.log(`${error.name}: ${error.message}`);
  }

  get<T>(queryParams?: any, resourcePath?: string): Observable<T> {
    return this.http.get<T>(`${this.resourceUrl + resourcePath}`, <any>this.getRequestOptions(queryParams))
      .pipe(catchError(this.handleError));
  }

  async getAsync<T>(queryParams?: any, resourcePath?: string): Promise<T> {
    return this.get<T>(queryParams, resourcePath).toPromise();
  }

  post<T>(body?: any, resourcePath?: string): Observable<T> {
    return this.http.post<T>(`${this.resourceUrl + resourcePath}`, body, <any>this.getRequestOptions())
      .pipe(catchError(this.handleError));
  }

  async postAsync<T>(body?: any, resourcePath?: string): Promise<T> {
    return this.post<T>(body, resourcePath).toPromise();
  }

  put<T>(body?: any, resourcePath?: string): Observable<T> {
    return this.http.put<T>(`${this.resourceUrl + resourcePath}`, body, <any>this.getRequestOptions())
      .pipe(catchError(this.handleError));
  }

  async putAsync<T>(body?: any, resourcePath?: string): Promise<T> {
    return this.put<T>(body, resourcePath).toPromise();
  }

  delete<T>(resourcePath?: string): Observable<T> {
    return this.http.delete<T>(`${this.resourceUrl + resourcePath}`, <any>this.getRequestOptions())
      .pipe(catchError(this.handleError));
  }

  async deleteAsync<T>(resourcePath?: string): Promise<any> {
    return this.delete<T>(resourcePath).toPromise();
  }
}