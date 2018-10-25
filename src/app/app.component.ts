import { AutocompleteData } from './shared/autocomplete/autocomplete-data';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  recipeSelected = (recipe: AutocompleteData) => {
    console.log(recipe);
  }

  countrySelected = (country: AutocompleteData) => {
    console.log(country);
  }

  stateSelected = (state: AutocompleteData) => {
    console.log(state);
  }
}
