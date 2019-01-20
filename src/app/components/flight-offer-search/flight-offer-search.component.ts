import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {FlightService} from '../../services/flight';
import {FlightOffersResponse} from '../../models';

@Component({
  selector: 'app-flight-offer-search',
  styleUrls: ['./flight-offer-search.style.scss'],
  templateUrl: './flight-offer-search.template.html'
})
export class FlightOfferSearchComponent {

  public model = {
    origin: '',
    destination: '',
    departureDate: undefined,
    returnDate: undefined
  };

  public flightOffers: Observable<FlightOffersResponse>;

  constructor(private flightService: FlightService) {}

  public search() {
    this.flightOffers = this.flightService.getFlightOffers(this.model);
  }
}
