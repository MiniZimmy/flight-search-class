import { Price } from './price.model';

export interface FlightOffersRequest {
  origin: string; // IATA code
  destination: string; // IATA code
  departureDate: Date; // ISO 8601
  returnDate?: Date; // ISO 8601
  adults?: number;
  children?: number;
  infants?: number;
  seniors?: number;
  nonStop?: boolean; // If set to true, the search will find only flights going from the origin to the destination with no stop in between
  maxPrice?: number; // maximum price of the flight offers to find
  max?: number;
}

export interface FlightOffersResponse {
  data?: FlightOffer[];
}

export interface FlightOffer {
  id?: string;
  offerItems?: OfferItem[];
}

export interface OfferItem {
  services?: Service[];
  price?: Price;
}

export interface Service {
  segments?: Segment[];
}

export interface Segment {
  flightSegment?: FlightSegment;
}

export interface FlightSegment {
  departure?: FlightEndPoint;
  arrival?: FlightEndPoint;
  carrierCode?: string;
  number?: string;
  aircraft?: string;
  duration?: string;
  stops?: FlightStop[];
}

export interface FlightStop {
  iataCode?: string;
  duration?: string;
  arrivalAt?: string;
  departureAt?: string;
}

export interface FlightEndPoint {
  iataCode?: string; // IATA airline code
  terminal?: string;
  at?: string; // local date and time in ISO8601 YYYY-MM-ddThh:mm±hh:mm format
}
