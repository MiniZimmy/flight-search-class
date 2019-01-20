import {Component, Input} from '@angular/core';
import {FlightOffersResponse} from '../../models';

@Component({
  selector: 'app-flight-offers',
  styleUrls: ['./flight-offers.style.scss'],
  templateUrl: './flight-offers.template.html'
})
export class FlightOffersComponent {

  @Input()
  flightOffers?: FlightOffersResponse;

  constructor() {}
}
