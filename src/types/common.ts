import {languageGerman} from "../languages/de";
import {languageEnglish} from "../languages/en";
import {languageFrench} from "../languages/fr";
import {languageItalian} from "../languages/it";

export type DaysOfWeek = { [key: string]: number };


export interface ModalDetailsData {
  name: string;
  description: string;
  image: string;
  address?: Address;
  openingHours: string[];
}

export interface CommonAttributes {
  "@context": string;
  "@type": string;
  "@customType": null | string;
  identifier: string;
  copyrightHolder: LocalizedText;
  license: string;
  tomasBookingId: null | string;
  category: { [key: string]: CategoryDetail };
  name: LocalizedText;
  disambiguatingDescription: LocalizedText;
  description: LocalizedText;
  titleTeaser: LocalizedText;
  textTeaser: LocalizedText;
  detailedInformation: LocalizedText;
  zurichCardDescription: null | string;
  zurichCard: boolean;
  osm_id: string;
  image: Image | null;
  price: LocalizedText | null;
  photo: Image[] | null;
  dateModified: string;
  opens: string[];
  openingHours: string[];
  openingHoursSpecification: OpeningHoursSpecification | null;
  specialOpeningHoursSpecification: SpecialOpeningHoursSpecification | null;
  address: Address;
  geoCoordinates: GeoCoordinates;
  place: any[]; // Define more specifically if possible
}



export interface LocalizedText {
  de?: string;
  en?: string;
  fr?: string;
  it?: string;
}

export interface CategoryDetail {
  swissId: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  addressCountry: string;
  addressLocality: string;
  postalCode: string;
  streetAddress: string;
  telephone: string | null;
  email: string;
  url: string;
}

export interface Image {
  url: string;
  caption?: LocalizedText;
}

export interface OpeningHoursSpecification {
  // Define if there are specific properties
}

export interface SpecialOpeningHoursSpecification {
  // Same as above or as needed
}

export interface Language {
  languageShortName: 'de' | 'en' | 'fr' | 'it';
  languageName: string;
  title: string
  your_selected_time: string
  selected_time: string
  configurations: string
  show_only_open_stores_at_the_selected_time: string
  language: string
  select_the_language: string
  select_the_page_size: string
  stores: string
  expand: string
  collapse: string
  opening_hours: string
  closed_stores: string
  open_stores: string
  name_to_category: {
    103: string
    101: string
    96: string
    136: string
    162: string
  }
}
export const languages = [languageEnglish, languageGerman, languageFrench, languageItalian]