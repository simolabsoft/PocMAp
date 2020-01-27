/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import MapView, {Marker, Callout, Polyline} from 'react-native-maps';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
const {width, height} = Dimensions.get('window');
const origin = {latitude: 33.994541, longitude: -6.823654};
const destination = {latitude: 33.991268, longitude: -6.82806};
const GOOGLE_MAPS_APIKEY = 'AIzaSyBayo9X5GPbijh81gObednUdrQFYXiqB0E';
const TomTomApiKey = 'QDjLGAH7sMuGO6VUlqtVeUUsGh5OKk8Q';
// vet Mocks

const listOfVets = [
  {
    vetName: 'vet1',
    description: 'vet number 1 ready to go ',
    vetAddress: {
      latitude: 33.994541,
      longitude: -6.823654,
    },
    vetIcon: require('./assets/catmarker1.png'),
  },
  {
    vetName: 'vet2',
    description: 'vet number 1 ready to go ',
    vetAddress: {
      latitude: 33.991268,
      longitude: -6.82806,
    },
    vetIcon: require('./assets/catmarker1.png'),
  },
  {
    vetName: 'vet3',
    description: 'vet number 1 ready to go ',
    vetAddress: {
      latitude: 33.987013,
      longitude: -6.828234,
    },
    vetIcon: require('./assets/catmarker1.png'),
  },
];

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.marker = [];
    this.state = {
      listOffRoutes: [],
      query: '',
      mapType: 'standard',
      coords: [],
      showCalloutView: true,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
    // this.onRegionChange = this.onRegionChange.bind(this);
  }
  //getAllRoutesData
  getData = listOfVets => {
    let AppCalls = [];
    AppCalls = listOfVets.map((vet, index) => {
      return fetch(
        'https://api.tomtom.com/routing/1/calculateRoute/' +
          this.state.region.latitude +
          '%2C' +
          this.state.region.longitude +
          '%3A' +
          vet.vetAddress.latitude +
          '%2C' +
          vet.vetAddress.longitude +
          '/json?avoid=unpavedRoads&key=' +
          TomTomApiKey,
      );
    });

    Promise.all(AppCalls)
      .then(values => Promise.all(values.map(value => value.json())))
      .then(finalVals => {
        this.setState({listOffRoutes: finalVals}, () => {
          this.compareAllRoutes(this.state.listOffRoutes);
        });
        console.log('list of routes : ', finalVals);
      });
  };
  //compare routes
  compareAllRoutes = listOffRoutes => {
    let distanceValues = [];
    for (let index = 0; index < listOffRoutes.length; index++) {
      distanceValues.push(
        listOffRoutes[index].routes[0].summary.lengthInMeters,
      );
    }
    console.log('minmum :', Math.min(...distanceValues));
  };
  // fetch directions and decode polylines
  async getDirections(startLoc, destinationLoc) {
    try {
      let resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`,
      );
      let respJson = await resp.json();
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      this.setState({coords: coords});
      console.log(this.state.coords);
      return coords;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async componentDidMount() {
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        // this.setState({region: position.coords});
        // console.log(initialPosition);
        console.log('hello', initialPosition);
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05,
          },
        });
      },
      error => this.setState({error: error.message}),
      {enableHighAccuracy: true, timeout: 2000, maximumAge: 2000},
    );
    // this.getDirections('40.1884979, 29.061018', '41.0082,28.9784');
  }
  async getDirectionsTomTom(dist) {
    let url =
      'https://api.tomtom.com/routing/1/calculateRoute/' +
      this.state.region.latitude +
      '%2C' +
      this.state.region.longitude +
      '%3A' +
      dist.latitude +
      '%2C' +
      dist.longitude +
      '/json?avoid=unpavedRoads&key=' +
      TomTomApiKey;
    try {
      let resp = await fetch(url);
      let respJson = await resp.json();
      console.log('res', respJson);
      // let points;
      // let coords = points.map((point, index) => {
      //   return {
      //     latitude: point[0],
      //     longitude: point[1],
      //   };
      // });
      // this.setState({coords: coords});
      this.setState({
        coords: respJson.routes[0].legs[0].points,
        showCalloutView: false,
      });
      console.log(respJson.routes[0].legs[0].points);

      // return coords;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  onRegionChange = region => {
    this.setState({
      region: {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.05,
      },
    });
    console.log(region);
  };
  findCoordinates = () => {
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        console.log('hello', initialPosition);
        this.setState({
          region: {
            latitude: initialPosition.coords.latitude,
            longitude: initialPosition.coords.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05,
          },
        });
      },
      error => this.setState({error: error.message}),
      {enableHighAccuracy: true, timeout: 2000, maximumAge: 2000},
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <MapView
          // onRegionChange={region => this.onRegionChange(region)}
          style={styles.map}
          mapType={this.state.mapType}
          // initialRegion={this.state.region}
          region={{
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          <Marker
            coordinate={this.state.region}
            title={'my place'}
            description={'hello world hello word hello world'}
            image={require('./assets/marker.png')}
          />
          {listOfVets.map((vet, index) => {
            return (
              <Marker
                coordinate={vet.vetAddress}
                ref={_marker => {
                  this.marker[index] = _marker;
                }}
                // onCalloutPress={() => {
                //   this.getDirectionsTomTom(vet.vetAddress);
                // }}
                // onPress={() => this.getDirectionsTomTom(vet.vetAddress)}
                onCalloutPress={() => {
                  this.marker[index].hideCallout();
                  this.getDirectionsTomTom(vet.vetAddress);
                }}
                title={vet.vetName}
                description={'this is vet hello hello'}
                icon={vet.vetIcon}>
                <Callout>
                  <View style={styles.callOutContainer}>
                    <Text
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                      <Image
                        source={vet.vetIcon}
                        resizeMode={'cover'}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: 'green',
                        }}></Image>
                    </Text>
                    <Text style={{textAlign: 'center', color: 'red'}}>
                      {vet.vetName}
                    </Text>
                    <Text style={{textAlign: 'center'}}>{vet.description}</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
          {/* <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="rgb(0,139,241)"
            onStart={params => {
              console.log(
                `Started routing between "${params.origin}" and "${params.destination}"`,
              );
            }}
            onReady={result => {
              console.log(result);
              console.log('Distance: ${result.distance} km');
              console.log('Duration: ${result.duration} min.');
            }}
            onError={errorMessage => {
              console.log('GOT AN ERROR');
            }}
          /> */}
          <Polyline
            coordinates={this.state.coords}
            strokeColor="#669DF6" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={4}
          />
        </MapView>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#233F6C',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,

            elevation: 24,
          }}>
          <View style={{flex: 4, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                this.state.mapType == 'standard'
                  ? this.setState({mapType: 'satellite'})
                  : this.setState({mapType: 'standard'});
              }}
              style={styles.nearMeBtn}>
              {this.state.mapType == 'standard' ? (
                <Image
                  source={require('./assets/satelite.png')}
                  // tintColor="#031349"
                  style={styles.iconMapStyle}
                  resizeMode={'cover'}></Image>
              ) : (
                <Image
                  source={require('./assets/plan.png')}
                  style={styles.iconMapStyle}
                  // tintColor="#031349"
                  resizeMode={'cover'}></Image>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              // backgroundColor: 'green',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => this.getData(listOfVets)}
              style={styles.nearMeBtn}>
              <Image
                source={require('./assets/nearMe.png')}
                tintColor="white"
                resizeMode={'cover'}></Image>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  nearMeBtn: {
    // position: 'absolute',
    // bottom: 10,
    // left: width - 60,
    // top: height - 80,
    // position: 'absolute',
    // right: 10,
    // bottom: 10,
    marginLeft: 10,
  },
  callOutContainer: {
    flex: 1,
    height: 100,
    width: 100,
    // backgroundColor: 'red',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  iconMapStyle: {
    width: 40,
    height: 40,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10000,
  },
});

export default App;
