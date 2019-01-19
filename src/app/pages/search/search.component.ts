import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {FlightOffersResponse} from '../../models';
import { FlightService } from '../../services/flight';

@Component({
  selector: 'app-search',
  styleUrls: ['./search.style.scss'],
  templateUrl: './search.template.html'
})
export class SearchComponent implements OnInit {

  public search: Observable<FlightOffersResponse>;

  constructor(private flightService: FlightService) {
  }

  ngOnInit() {
    this.search = this.flightService.getFlightOffers({
      origin: 'CDG',
      destination: 'LON',
      departureDate: new Date('2019-02-02'),
      max: 3
    });
  }

}
