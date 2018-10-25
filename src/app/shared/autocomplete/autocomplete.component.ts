import { AutocompleteService } from './autocomplete.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AutocompleteData } from './autocomplete-data';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  providers: [AutocompleteService]
})
export class AutocompleteComponent implements OnInit {
  @Input()
  endpoint: string;
  @Input()
  placeholder: string;
  @Input()
  searchString: string;
  @Input()
  disabled: boolean;
  @Output()
  selected = new EventEmitter<AutocompleteData>();

  items: AutocompleteData[] = [];
  selectedIndex = 0;
  freshItems: boolean;

  callRequest = new Subject<string>();

  constructor(private autocompleteService: AutocompleteService) {}

  ngOnInit() {
    this.callRequest
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchString => {
        if (searchString) {
          this.autocompleteService
            .getAutocompleteData(this.endpoint, searchString)
            .subscribe(
              (data: AutocompleteData[]) => {
                this.items = data;
                this.freshItems = true;
                this.selectedIndex = 0;
              },
              error => {
                console.log(error);
              }
            );
        }
      });
  }

  handleKeyUp = $event => {
    const up = $event.keyCode === 38;
    const down = $event.keyCode === 40;
    const enter = $event.keyCode === 13;
    if (up || down) {
      if (this.items.length) {
        this.items.forEach(item => (item.isActive = false));

        if (!this.freshItems) {
          this.selectedIndex = this.handleSelectedIndex(up, down);
        } else {
          this.selectedIndex = down ? 0 : this.items.length - 1;
        }

        this.items[this.selectedIndex].isActive = true;
      }
      this.freshItems = false;
    } else if (enter) {
      if (this.items.length) {
        this.select(this.items[this.selectedIndex]);
      }
    } else {
      if (this.searchString.trim() === '') {
        this.items = [];
        this.selected.emit(new AutocompleteData());
        this.callRequest.next('');
      } else {
        this.callRequest.next(this.searchString);
      }
    }
  }

  handleSelectedIndex = (up, down) => {
    if (up) {
      return this.selectedIndex === 0
        ? this.items.length - 1
        : (this.selectedIndex -= 1);
    } else if (down) {
      return this.selectedIndex === this.items.length - 1
        ? 0
        : (this.selectedIndex += 1);
    }
  }

  select = item => {
    this.searchString = item.name;
    this.items = [];
    this.selected.emit({ id: item.id, name: item.name });
  }
}
