import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, map} from 'rxjs/operators';
import {FlightService} from '../../services/flight';
import {FlightOffersRequest} from '../../models';

@Component({
  selector: 'app-flight-offer-search',
  styleUrls: ['./flight-offer-search.style.scss'],
  templateUrl: './flight-offer-search.template.html'
})
export class FlightOfferSearchComponent implements OnInit {

  @Output() search: EventEmitter<FlightOffersRequest> = new EventEmitter<FlightOffersRequest>();

  public model = {
    origin: '',
    destination: '',
    departureDate: undefined,
    returnDate: undefined
  };

  // public flightOffers: Observable<FlightOffersResponse>;

  public originSubject$: Subject<string> = new Subject<string>();
  public destinationSubject$: Subject<string> = new Subject<string>();

  public originOptions$: Observable<any>;
  public destinationOptions$: Observable<any>;

  constructor(private flightService: FlightService) {}

  ngOnInit() {
    this.originOptions$ = this.originSubject$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((text: string) => this.flightService.getAirportOrCity(text)),
      map((locationsResult) => locationsResult.data)
    );
    this.destinationOptions$ = this.destinationSubject$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((text: string) => this.flightService.getAirportOrCity(text)),
      map((locationsResult) => locationsResult.data)
    );
  }

  public originInputChange(text: string) {
    this.originSubject$.next(text);
  }

  public destinationInputChange(text: string) {
    this.destinationSubject$.next(text);
  }

  public onSearch() {
    this.search.emit(this.model);
  }
}
