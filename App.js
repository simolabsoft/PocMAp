/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import MapView, {Marker, Callout, Polyline} from 'react-native-maps';
// import Dialog, {DialogContent, SlideAnimation} from 'react-native-popup-dialog';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import Autocomplete from 'react-native-autocomplete-input';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  ScrollView,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
const {width, height} = Dimensions.get('window');
const origin = {latitude: 33.994541, longitude: -6.823654};
const destination = {latitude: 33.991268, longitude: -6.82806};
const GOOGLE_MAPS_APIKEY = 'AIzaSyBayo9X5GPbijh81gObednUdrQFYXiqB0E';
const TomTomApiKey = 'QDjLGAH7sMuGO6VUlqtVeUUsGh5OKk8Q';
const vetMarker = require('./assets/catmarker1.png');
// vet Mocks

const listOfVets = [
  {
    vetName: 'vet1',
    description:
      'Pariatur ut aliquip nostrud consequat ea officia ullamco dolor in proident aliqua. Nulla anim consequat elit cillum ad sit veniam labore ullamco mollit ipsum proident cillum fugiat. Dolore esse sunt veniam laborum ut quis laborum. Deserunt excepteur ullamco non aliqua ipsum veniam sunt. Qui fugiat amet esse cupidatat exercitation minim esse sint elit et laboris.',
    phone: '06666661',
    adress: 'Rabat Souissi 21',
    url: 'www.vet1.com',
    vetAddress: {
      latitude: 33.994541,
      longitude: -6.823654,
    },
    vetIcon: require('./assets/vet.png'),
  },
  {
    vetName: 'vet2',
    phone: '06666661',
    adress: 'Rabat Souissi 21',
    url: 'www.vet1.com',
    description:
      'Magna duis mollit quis minim Lorem exercitation nulla nostrud consequat adipisicing dolor culpa elit commodo. Et exercitation do non nisi ipsum mollit nisi id. Exercitation quis irure fugiat incididunt proident pariatur ex nulla commodo est aute. Adipisicing nostrud excepteur consequat qui irure reprehenderit laborum cupidatat do duis anim. Consequat aliqua ad adipisicing proident est commodo ullamco. Ad irure et in sint ex cillum irure officia nostrud.',
    vetAddress: {
      latitude: 33.991268,
      longitude: -6.82806,
    },
    vetIcon: require('./assets/vet1.jpg'),
  },
  {
    vetName: 'vet3',
    phone: '06666661',
    adress: 'Merrakch gelize 22',
    url: 'www.vet2.com',
    description:
      'Esse fugiat deserunt enim consectetur tempor non. Lorem mollit nisi cupidatat reprehenderit ullamco nulla in dolore. Amet mollit amet consequat incididunt nisi consectetur et sint. Et ut veniam nisi esse minim minim. Reprehenderit magna ea sit ad cupidatat amet ullamco laboris consectetur dolore. Ex nostrud consectetur labore cillum.',
    vetAddress: {
      latitude: 33.987013,
      longitude: -6.828234,
    },
    vetIcon: require('./assets/vet2.jpg'),
  },
  {
    vetName: 'vet4',
    description:
      '&Lorem mollit cillum dolor nisi. Velit et do ex cillum tempor do nulla mollit laboris non dolore. Velit incididunt velit culpa esse cillum incididunt voluptate minim esse. Voluptate proident deserunt proident dolore. Nulla eiusmod culpa sit exercitation elit pariatur pariatur cupidatat velit excepteur quis. Dolor nisi consequat veniam id eu ea.',
    phone: '06666661',
    adress: 'paris france 21',
    url: 'www.vet1.com',
    vetAddress: {
      latitude: 48.862438,
      longitude: 2.289015,
    },
    vetIcon: require('./assets/vet3.jpg'),
  },
  {
    vetName: 'vet5',
    phone: '06666661',
    adress: 'merakch 22',
    url: 'www.vet5.com',
    description:
      'Est est laborum anim id ipsum eu deserunt. Commodo id elit irure fugiat officia deserunt est eu. Lorem qui nisi cillum do adipisicing labore dolore exercitation veniam aliquip.',
    vetAddress: {
      latitude: 31.624335,
      longitude: -7.993801,
    },
    vetIcon: require('./assets/dogmarker1.png'),
  },
  // {
  //   vetName: 'vet6',
  //   description: 'vet number 1 ready to go ',
  //   vetAddress: {
  //     latitude: 32.897083,
  //     longitude: -6.914188,
  //   },
  //   vetIcon: require('./assets/catmarker1.png'),
  // },
];

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let SearchedVetList = [];
class App extends React.Component {
  constructor(props) {
    super(props);
    this.marker = [];
    (this.mapView = null),
      (this.state = {
        searchText: '',

        showSearchResult: false,
        selectedVet: listOfVets[0],
        isModalVisible: false,
        tintNearMeColor: '#233F6C',
        listOffRoutes: [],
        query: '',
        mapType: 'standard',
        coords: [],
        showCalloutView: true,
        userLocation: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        region: null,
      });
    // this.onRegionChange = this.onRegionChange.bind(this);
  }

  renderListOfSeachedVet = ResultList => {
    if (ResultList.length == 0) {
      return (
        <View style={{height: 100, backgroundColor: 'white'}}>
          <Text style={{fontSize: 18, color: '#333'}}>aucune résultat</Text>
        </View>
      );
    } else
      return (
        <ScrollView>
          {ResultList.map((item, index) => {
            return (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  // backgroundColor: 'red',
                  // alignItems: 'center',
                  marginBottom: 20,
                  borderBottomWidth: 2,
                  borderBottomColor: '#233F6C',
                }}>
                <View
                  style={{
                    width: '30%',
                    alignItems: 'center',
                    padding: 5,
                    borderRightWidth: 5,
                    borderRightColor: '#233F6C',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={item.vetIcon}
                    resizeMode={'cover'}
                    style={{
                      width: 60,
                      height: 60,
                    }}></Image>
                  <Text>{item.vetName}</Text>
                </View>
                <View
                  style={{
                    width: '60%',
                    // backgroundColor: 'green',
                    marginRight: 10,
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      // backgroundColor: 'yellow',
                      // justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: 5,
                    }}>
                    <Icon name="phone" size={20} color={'#233F6C'} />
                    <Text style={styles.textSmall}>{item.phone}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      // backgroundColor: 'yellow',
                      // justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: 5,
                    }}>
                    <Icon name="map-marker" size={20} color={'#233F6C'} />
                    <Text style={styles.textSmall}>{item.adress}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      // backgroundColor: 'yellow',
                      // justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: 5,
                    }}>
                    <Icon name="flag" size={20} color={'#233F6C'} />
                    <Text style={styles.textSmall}>{item.url}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      );
  };
  //getAllRoutesData
  getData = listOfVets => {
    let AppCalls = [];
    AppCalls = listOfVets.map((vet, index) => {
      return fetch(
        'https://api.tomtom.com/routing/1/calculateRoute/' +
          this.state.userLocation.latitude +
          '%2C' +
          this.state.userLocation.longitude +
          '%3A' +
          vet.vetAddress.latitude +
          '%2C' +
          vet.vetAddress.longitude +
          '/json?avoid=unpavedRoads&key=' +
          TomTomApiKey,
      );
    });
    console.log('list of routes : ', AppCalls);
    Promise.all(AppCalls)
      .then(values => Promise.all(values.map(value => value.json())))
      .then(finalVals => {
        this.setState(
          {listOffRoutes: finalVals, region: this.state.userLocation},
          () => {
            this.compareAllRoutes(this.state.listOffRoutes);
          },
        );
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
    var indexOfMaxValue = distanceValues.reduce(
      (iMax, x, i, arr) => (x < arr[iMax] ? i : iMax),
      0,
    );
    let initialRegion = Object.assign({}, this.state.userLocation);
    initialRegion['latitudeDelta'] = 0.005;
    initialRegion['longitudeDelta'] = 0.005;
    this.mapView.animateToRegion(initialRegion, 2000);
    // this.mapView.animateToRegion(this.state.userLocation, 1000);
    this.setState({
      coords: listOffRoutes[indexOfMaxValue].routes[0].legs[0].points,
    });
    console.log('index : ', indexOfMaxValue);
    // console.log('minmum :', Math.min(...distanceValues));
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
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05,
          },
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
      this.state.userLocation.latitude +
      '%2C' +
      this.state.userLocation.longitude +
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
      region: region,
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
  goToInitialRegion() {
    this.mapView.animateToRegion(this.state.userLocation, 2000);
  }
  findVet = query => {
    if (query === '') {
      return [];
    }
    const regex = new RegExp(`${query.trim()}`, 'i');
    console.log('catch : ', query);
    console.log(listOfVets.filter(vet => vet.vetName.search(regex) >= 0));
    return listOfVets.filter(vet => vet.vetName.search(regex) >= 0);
  };
  filterSearch = text => {
    if (text === '') return [];
    else {
      const regex = new RegExp(`${text.trim()}`, 'i');
      console.log('catch : ', text);
      console.log(listOfVets.filter(vet => vet.vetName.search(regex) >= 0));
      SearchedVetList = listOfVets.filter(
        vet =>
          vet.vetName.search(regex) >= 0 ||
          vet.adress.search(regex) >= 0 ||
          vet.phone.search(regex) >= 0 ||
          vet.url.search(regex) >= 0,
      );
    }
  };
  render() {
    const {query} = this.state;
    const Vets = this.findVet(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#233F6D" barStyle="light-content" />
        <MapView
          // onRegionChange={region => this.onRegionChange(region)}
          style={styles.map}
          followUserLocation={true}
          ref={ref => (this.mapView = ref)}
          // onMapReady={this.goToInitialRegion.bind(this)}
          zoomEnabled={true}
          showsUserLocation={true}
          mapType={this.state.mapType}
          initialRegion={this.state.region}
          // region={this.state.region}
          onRegionChange={() => {
            setTimeout(() => {
              this.onRegionChange;
            }, 500);
          }}

          // region={{
          //   latitude: this.state.region.latitude,
          //   longitude: this.state.region.longitude,
          //   latitudeDelta: LATITUDE_DELTA,
          //   longitudeDelta: LONGITUDE_DELTA,
          // }}
        >
          <Marker
            coordinate={this.state.userLocation}
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
                  this.setState({isModalVisible: true, selectedVet: vet});
                }}
                title={vet.vetName}
                description={'this is vet hello hello'}
                icon={vetMarker}>
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
                          // backgroundColor: 'green',
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
        <View style={styles.topSearchBar}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',

              height: 40,
              borderColor: 'white',
              borderWidth: 1,
              flex: 4,
              borderRadius: 20,
              backgroundColor: 'white',
              marginRight: 20,
              paddingLeft: 10,
            }}>
            <TextInput
              style={{width: '80%', color: '#233F6C'}}
              placeholder="Chercher un vétérinaire..."
              onChangeText={text => this.setState({searchText: text})}
              value={this.state.text}></TextInput>
            {/* <View style={styles.autocompleteContainer}>
              <Autocomplete
                autoCapitalize="none"
                autoCorrect={false}
                data={Vets}
                inputContainerStyle={{backgroundColor: 'yellow'}}
                listContainerStyle = {{backgroundColor : "black"}}
                containerStyle={{backgroundColor: 'red', zIndex: 1}}
                defaultValue={query}
                placeholder="Chercher un vétérinaire..."
                onChangeText={text => this.setState({query: text})}
                renderItem={({item, i}) => (
                  <TouchableOpacity
                    onPress={() => this.setState({query: item})}
                    style={{
                      height: 30,
                      backgroundColor: 'green',
                      flex: 1,
                      width: 100,
                    }}>
                    <Text>{item.vetName}</Text>
                  </TouchableOpacity>
                )}
              />
            </View> */}
            <TouchableOpacity
              style={{marginRight: 10}}
              onPress={() => {
                this.setState({isModalVisible: true, showSearchResult: true});
                this.filterSearch(this.state.searchText);
              }}>
              {/* <Image
                source={require('./assets/searchIcon.png')}
                resizeMode={'center'}
                tintColor={'#233F6C'}
                style={[styles.filterIconStyle]}></Image> */}
              <Icon name="search" size={20} color="#233F6C" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              // backgroundColor: 'red',
              justifyContent: 'center',
              alignItems: 'center',
              // alignContent: 'flex-end',
              flex: 1,
            }}
            onPress={() => {
              this.setState({isModalVisible: true});
              console.log('hello world');
            }}>
            {/* <Image
              source={require('./assets/fitlerIcon.png')}
              resizeMode={'center'}
              tintColor={'white'}
              style={styles.filterIconStyle}></Image> */}
            <Icon name="filter" size={25} color="white" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            // flexDirection: 'row',
            justifyContent: 'center',
            // backgroundColor: '#233F6C',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            right: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.state.mapType == 'standard'
                ? this.setState({
                    mapType: 'satellite',
                    tintNearMeColor: 'white',
                  })
                : this.setState({
                    mapType: 'standard',
                    tintNearMeColor: '#233F6C',
                  });
            }}>
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

          <TouchableOpacity
            onPress={() => this.getData(listOfVets)}
            style={styles.iconMapStyle}>
            {/* <Image
              source={require('./assets/nearMe.png')}
              tintColor={this.state.tintNearMeColor}
              resizeMode={'contain'}></Image> */}
            <Icon name="location-arrow" size={25} color="#233F6C" />
          </TouchableOpacity>
        </View>
        {/* <Dialog
          style={{
            justifyContent: 'flex-end',
            margin: 0,
            padding: 0,
            alignItems: 'center',
            flex: 1,
            // borderRadius: 30,
          }}
          dialogAnimation={
            new SlideAnimation({
              slideFrom: 'bottom',
            })
          }
          visible={this.state.visible}
          onTouchOutside={() => {
            this.setState({visible: false});
          }}>
          <DialogContent>
            <View>
              <Text>hello world</Text>
            </View>
          </DialogContent>
        </Dialog> */}
        <Modal
          isVisible={this.state.isModalVisible}
          useNativeDriver={true}
          onBackdropPress={() => {
            this.setState({isModalVisible: false});
          }}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
            padding: 0,
            alignItems: 'center',
            // flex: 1,
            height: '40%',
            // borderRadius: 30,

            // borderRadius: 30,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              overflow: 'hidden',
            }}>
            <View style={styles.closeView}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => {
                  this.setState({isModalVisible: false});
                }}>
                <Icon name="close" size={20} color={'#233F6C'} />
              </TouchableOpacity>
            </View>
            {this.state.showSearchResult &&
              this.renderListOfSeachedVet(SearchedVetList)}
            {!this.state.showSearchResult && (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  // backgroundColor: 'red',
                  // alignItems: 'center',
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    width: '30%',
                    alignItems: 'center',
                    padding: 5,
                    borderRightWidth: 5,
                    borderRightColor: '#233F6C',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={this.state.selectedVet.vetIcon}
                    resizeMode={'cover'}
                    style={{
                      width: 60,
                      height: 60,
                    }}></Image>
                  <Text>{this.state.selectedVet.vetName}</Text>
                </View>
                <View
                  style={{
                    width: '60%',
                    // backgroundColor: 'green',
                    marginRight: 10,
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      // backgroundColor: 'yellow',
                      // justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: 5,
                    }}>
                    <Icon name="phone" size={20} color={'#233F6C'} />
                    <Text style={styles.textSmall}>
                      {this.state.selectedVet.phone}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      // backgroundColor: 'yellow',
                      // justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: 5,
                    }}>
                    <Icon name="map-marker" size={20} color={'#233F6C'} />
                    <Text style={styles.textSmall}>
                      {this.state.selectedVet.adress}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      // backgroundColor: 'yellow',
                      // justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingLeft: 5,
                    }}>
                    <Icon name="flag" size={20} color={'#233F6C'} />
                    <Text style={styles.textSmall}>
                      {this.state.selectedVet.url}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  filterIconStyle: {
    width: 30,
    height: 30,
  },
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
    // marginLeft: 10,
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
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  topSearchBar: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#233F6C',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 30,
    height: 30,
    borderRadius: 15,
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 11,
  },
  closeView: {
    backgroundColor: 'white',
    padding: 10,
    width: '100%',
    alignItems: 'flex-end',
  },
  textSmall: {fontSize: 16, textAlign: 'right', marginLeft: 10},
});

export default App;
