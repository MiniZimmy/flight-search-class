import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlightServiceModule} from '../../services/flight';
import {FlightOffersComponent} from './flight-offers.component';

@NgModule({
  imports: [
    CommonModule,
    FlightServiceModule
  ],
  declarations: [FlightOffersComponent],
  exports: [FlightOffersComponent],
  providers: []
})
export class FlightOffersModule {}
