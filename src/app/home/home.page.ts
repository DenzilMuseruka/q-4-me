import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GoogleMap } from '@capacitor/google-maps';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    // LeafletModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage {
  @ViewChild('map') mapRef: any;
  map: GoogleMap | any;
  apiKey = 'KEYAIzaSyClnB1fc_S7PcEoUgN1Wv43qUMP9Q-eGuk';
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  autocomplete: any;
  autocompleteItems: any[];
  geocoder: any;
  markers: any;

  constructor() {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }
  ionViewDidEnter() {
    const mapdiv = document.getElementById('map') as HTMLElement;
    //Set latitude and longitude of some place
    this.map = new google.maps.Map(mapdiv, {
      center: { lat: -25.747868, lng: 28.229271 },
      zoom: 15,
    });
  }
  updateSearchResults() {
    if (this.autocomplete.input === '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      { input: this.autocomplete.input },
      (predictions: any, status) => {
        this.autocompleteItems = [];
        predictions.forEach((prediction: any) => {
          this.autocompleteItems.push(prediction);
        });
      }
    );
  }
  selectSearchResult(item: any) {
    this.clearMarkers();
    this.autocompleteItems = [];

    this.geocoder.geocode(
      { placeId: item.place_id },
      (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          let position = {
            lat: results[0].geometry.location.lat,
            lng: results[0].geometry.location.lng,
          };
          let marker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: this.map,
          });
          this.markers.push(marker);
          this.map.setCenter(results[0].geometry.location);
        }
      }
    );
  }
  clearMarkers() {
    this.geocoder = new google.maps.Geocoder();
    this.markers = [];
  }
}
