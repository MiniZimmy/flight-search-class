import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { FlightService } from './flight.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    FlightService
  ]
})
export class FlightServiceModule {}
