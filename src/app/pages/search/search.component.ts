import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {FlightOffersRequest, FlightOffersResponse} from '../../models';
import {FlightService} from '../../services/flight';

@Component({
  selector: 'app-search',
  styleUrls: ['./search.style.scss'],
  templateUrl: './search.template.html'
})
export class SearchComponent implements OnInit {

  public flightOffers: Observable<FlightOffersResponse>;

  constructor(private flightService: FlightService) {
  }

  ngOnInit() {}

  public onSearch(model: FlightOffersRequest) {
    this.flightOffers = this.flightService.getFlightOffers(model);
  }

}
