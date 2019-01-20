import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {FlightOffersResponse} from '../../models';

@Component({
  selector: 'app-search',
  styleUrls: ['./search.style.scss'],
  templateUrl: './search.template.html'
})
export class SearchComponent implements OnInit {

  public search: Observable<FlightOffersResponse>;

  constructor() {
  }

  ngOnInit() {}

}
