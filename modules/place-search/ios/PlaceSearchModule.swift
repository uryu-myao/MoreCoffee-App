import ExpoModulesCore
import MapKit

/**
 * MapKit's place search, for the café sheet (5a / 11a). No dependency we had
 * could search places, so this wraps MKLocalSearch itself (decided 2026-10-30).
 *
 * It needs the network, never the location permission. `near` keeps a typed
 * search to the area around a point (iOS 18+; before, it only biases), and
 * `nearby` searches around one.
 *
 * Cafés only (COFFEE_PLACES; Uryu, 2026-10-30). Unfiltered, "fujimi" from
 * Chōfu returned toilets, car parks and clinics; with restaurants and
 * bakeries, diners and bread shops. Checked on the Mac around Chōfu:
 * "coffee", "starbucks", "tully's", "珈琲", "喫茶", "カフェ" come back as
 * cafés almost entirely, so little is lost. A coffee stand filed under
 * another category is missed: typing its name by hand is the way out.
 *
 * Without the network every call rejects, and the sheet falls back to the
 * cafés already logged and a name typed by hand.
 *
 * Each place: { id, name, address, lat, lng, category }
 *   id        MKMapItem.identifier (iOS 18+): matches a place on a later
 *             visit (places.external_id). Absent before iOS 18.
 *   address   the short address (iOS 26+), else built from the placemark
 *   category  the point-of-interest category ("cafe")
 *
 * Errors: ERR_THROTTLED (Apple limits how often an app may search),
 * ERR_UNAVAILABLE (no network, or any other failure). No results is [].
 */
public final class PlaceSearchModule: Module {
  public func definition() -> ModuleDefinition {
    Name("PlaceSearch")

    AsyncFunction("search") { (query: String, near: Near?, promise: Promise) in
      let request = MKLocalSearch.Request()
      request.naturalLanguageQuery = query
      request.resultTypes = .pointOfInterest
      request.pointOfInterestFilter = MKPointOfInterestFilter(including: COFFEE_PLACES)
      if let near {
        request.region = MKCoordinateRegion(center: near.coordinate, latitudinalMeters: near.radius * 2, longitudinalMeters: near.radius * 2)
        if #available(iOS 18.0, *) {
          request.regionPriority = .required
        }
      }
      start(MKLocalSearch(request: request), promise)
    }
    .runOnQueue(.main)

    AsyncFunction("nearby") { (near: Near, promise: Promise) in
      let request = MKLocalPointsOfInterestRequest(center: near.coordinate, radius: near.radius)
      request.pointOfInterestFilter = MKPointOfInterestFilter(including: COFFEE_PLACES)
      start(MKLocalSearch(request: request), promise)
    }
    .runOnQueue(.main)
  }
}

private let COFFEE_PLACES: [MKPointOfInterestCategory] = [.cafe]

struct Near: Record {
  @Field var lat: Double = 0
  @Field var lng: Double = 0
  /** Metres around the point. */
  @Field var radius: Double = 2000

  var coordinate: CLLocationCoordinate2D {
    CLLocationCoordinate2D(latitude: lat, longitude: lng)
  }
}

private func start(_ search: MKLocalSearch, _ promise: Promise) {
  search.start { response, error in
    if let error {
      let code = (error as? MKError)?.code
      if code == .placemarkNotFound {
        promise.resolve([[String: Any]]())
      } else if code == .loadingThrottled {
        promise.reject("ERR_THROTTLED", error.localizedDescription)
      } else {
        promise.reject("ERR_UNAVAILABLE", error.localizedDescription)
      }
      return
    }
    promise.resolve((response?.mapItems ?? []).compactMap(place))
  }
}

private func place(_ item: MKMapItem) -> [String: Any]? {
  guard let name = item.name, !name.isEmpty else { return nil }
  var place: [String: Any] = ["name": name]
  let coordinate: CLLocationCoordinate2D
  if #available(iOS 26.0, *) {
    coordinate = item.location.coordinate
    if let address = item.address?.shortAddress ?? item.address?.fullAddress {
      place["address"] = address
    }
  } else {
    coordinate = item.placemark.coordinate
    let street = [item.placemark.thoroughfare, item.placemark.subThoroughfare].compactMap { $0 }.joined(separator: " ")
    let address = [street.isEmpty ? nil : street, item.placemark.locality].compactMap { $0 }.joined(separator: ", ")
    if !address.isEmpty {
      place["address"] = address
    }
  }
  place["lat"] = coordinate.latitude
  place["lng"] = coordinate.longitude
  if #available(iOS 18.0, *), let id = item.identifier?.rawValue {
    place["id"] = id
  }
  if let category = item.pointOfInterestCategory?.rawValue {
    // "MKPOICategoryCafe" → "cafe"
    let bare = category.replacingOccurrences(of: "MKPOICategory", with: "")
    place["category"] = bare.prefix(1).lowercased() + bare.dropFirst()
  }
  return place
}
