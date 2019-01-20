import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatInputModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule} from '@angular/material';
import {FlightServiceModule} from '../../services/flight';
import {FlightOfferSearchComponent} from './flight-offer-search.component';

@NgModule({
  imports: [
    CommonModule,
    FlightServiceModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule, MatNativeDateModule,
    MatButtonModule
  ],
  declarations: [FlightOfferSearchComponent],
  exports: [FlightOfferSearchComponent],
  providers: []
})
export class FlightOfferSearchModule {}
