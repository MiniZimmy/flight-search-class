import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';

import {FlightOffersRequest, FlightOffersResponse} from '../../models';
import {environment} from '../../../environments/environment';
import {of as observableOf} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class FlightService {

  private securityUrl = environment.apiUrl + 'security/oauth2/token';
  private url = environment.apiUrl + 'shopping/';

  private token?: string;
  private expiresAt?: number;

  constructor(private http: HttpClient) {}

  // TOKEN PART
  private loadToken() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      })
    };
    const formData = new URLSearchParams();
    formData.set('grant_type', 'client_credentials');
    formData.set('client_id', environment.apiKey);
    formData.set('client_secret', environment.apiSecret);
    return this.http.post<any>(this.securityUrl, formData.toString(), httpOptions).pipe(
      tap((response) => {
        if (response && response.access_token) {
          this.token = response.access_token;
          this.expiresAt = Date.now() + response.expires_in;
        }
      })
    );
  }

  private needsLoadOrRefresh() {
    if (!this.token) {
      return true;
    } else if ((Date.now() + 10) > this.expiresAt) {
      return true;
    } else {
      return false;
    }
  }

  private getToken() {
    if (this.needsLoadOrRefresh()) {
      return this.loadToken();
    }
    return observableOf(this.token);
  }

  private computeKey(key: any) {
    return key;
  }

  private computeValue(key, value) {
    if (key === 'departureDate') {
      return value.toISOString().split('T')[0];
    }
    return value;
  }

  private buildRequestParams(data: any) {
    return Object.entries(data).reduce((params, [key, value]) => {
      return !!value ? params.set(this.computeKey(key), this.computeValue(key, value)) : params;
    }, new HttpParams());
  }

  // Flight Low-fare Search
  public getFlightOffers(data: FlightOffersRequest) {
    return this.getToken().pipe(
      switchMap((response) => this.http.get<FlightOffersResponse>(this.url + 'flight-offers', {
        headers: {
          Authorization: `Bearer ${response.access_token}`
        },
        params: this.buildRequestParams(data)
      }))
    );
  }

}
