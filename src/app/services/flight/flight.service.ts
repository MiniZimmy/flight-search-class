import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';

import {FlightOffersRequest, FlightOffersResponse} from '../../models';
import {environment} from '../../../environments/environment';
import {of as observableOf, Subject} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable()
export class FlightService {

  private securityUrl = environment.apiUrl + 'security/oauth2/token';
  private url = environment.apiUrl + 'shopping/';
  private autocompleteUrl = environment.apiUrl + 'reference-data/';

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
          this.expiresAt = Date.now() + response.expires_in * 1000;
        }
      }),
      map((response) => response.access_token)
    );
  }

  private needsLoadOrRefresh() {
    if (!this.token) {
      return true;
    } else if ((Date.now() + 10) > this.expiresAt) {
      return true;
    }
    return false;
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
    if (key === 'departureDate' || key === 'returnDate') {
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
      switchMap((token) => this.http.get<FlightOffersResponse>(this.url + 'flight-offers', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: this.buildRequestParams(data)
      }))
    );
  }

  private buildAutoCompleteParams(text: string) {
    let params = new HttpParams();
    params = params.set('subType', 'AIRPORT,CITY');
    params = params.set('keyword', text);
    params = params.set('page[limit]', '5');
    params = params.set('view', 'LIGHT');
    return params;
  }

  // Airport & City Search
  public getAirportOrCity(text: string) {
    if (!text || !text.length) {
      return;
    }
    return this.getToken().pipe(
      switchMap((token) => this.http.get<any>(this.autocompleteUrl + 'locations', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: this.buildAutoCompleteParams(text)
      }))
    );
  }

}
