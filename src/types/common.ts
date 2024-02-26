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
