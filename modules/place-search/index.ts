import { requireOptionalNativeModule } from 'expo';

/** A place from MapKit (ios/PlaceSearchModule.swift). */
export type MapPlace = {
  /** MKMapItem.identifier: absent before iOS 18. */
  id?: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
  category?: string;
};

/** A point to bias the search towards; radius in metres. */
export type Near = { lat: number; lng: number; radius?: number };

type PlaceSearchModule = {
  search(query: string, near: Near | null): Promise<MapPlace[]>;
  nearby(near: Near): Promise<MapPlace[]>;
};

/**
 * Null on web, Android and a build made before the module was added: the
 * café sheet then offers the cafés already logged and a typed name only.
 */
const native = requireOptionalNativeModule<PlaceSearchModule>('PlaceSearch');

export const placeSearchAvailable = native != null;

/**
 * Cafés matching a typed query; within the square around `near` when given
 * (iOS 18+). Rejects with ERR_THROTTLED / ERR_UNAVAILABLE.
 */
export function searchPlaces(query: string, near: Near | null): Promise<MapPlace[]> {
  if (!native) return Promise.reject(new Error('ERR_UNAVAILABLE'));
  return native.search(query, near);
}

/** Cafés around a point. */
export function nearbyCafes(near: Near): Promise<MapPlace[]> {
  if (!native) return Promise.reject(new Error('ERR_UNAVAILABLE'));
  return native.nearby(near);
}
