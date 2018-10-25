import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AutocompleteData } from './autocomplete-data';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
  constructor(private httpClient: HttpClient) {}

  getAutocompleteData = (endpoint, searchString) => {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('searchString', searchString);
    return this.httpClient.get<AutocompleteData[]>(endpoint, {
      params: httpParams
    });
  }
}
