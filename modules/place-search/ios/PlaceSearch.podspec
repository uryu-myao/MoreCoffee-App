Pod::Spec.new do |s|
  s.name           = 'PlaceSearch'
  s.version        = '1.0.0'
  s.summary        = "MapKit's place search for the café sheet"
  s.description    = "MKLocalSearch and MKLocalPointsOfInterestRequest, for MoreCoffee's café sheet (5a / 11a)."
  s.license        = 'UNLICENSED'
  s.author         = 'MoreCoffee'
  s.homepage       = 'https://github.com/'
  s.platforms      = {
    :ios => '16.4'
  }
  s.swift_version  = '5.9'
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.frameworks = 'MapKit'

  s.source_files = "**/*.{h,m,swift}"
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
end
