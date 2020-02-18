import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import PhotoView from '@merryjs/photo-viewer';
const imagesArray = [
  {src: require('./assets/catacat.jpeg')},
  {src: require('./assets/catcat2.jpeg')},
  {src: require('./assets/catcat3.png')},
  {src: require('./assets/catcat4.jpeg')},
  {src: require('./assets/catcat5.jpeg')},
  {src: require('./assets/catcat1.jpg')},
];
const cat = require('./assets/catacat.jpeg');
const photos = [
  {
    source: imagesArray[0].src,
    // title: 'Flash End-of-Life',
    // summary:
    //   'Adobe announced its roadmap to stop supporting Flash at the end of 2020. ',
    // // must be valid hex color or android will crashes
    // titleColor: '#f90000',
    // summaryColor: 'green',
  },
  {
    source: imagesArray[1].src,
    // title: 'Local image',
  },

  {
    source: imagesArray[2].src,
  },
  {
    source: imagesArray[3].src,
  },
  {
    source: imagesArray[4].src,
  },
  {
    source: imagesArray[5].src,
  },
];
export default class PocZoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      clickedPhoto: 1,
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.topTitle}>Photo Viewer : POC</Text>
        </View>
        <FlatList
          style={{flex: 1, backgroundColor: 'white', width: '100%'}}
          data={photos}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() =>
                this.setState({clickedPhoto: index, visible: true})
              }
              style={{
                flex: 1,
                flexDirection: 'column',
                // margin: 1,
                // width: '33.33%',
                height: 100,
                backgroundColor: 'white',
              }}>
              <Image
                resizeMode={'cover'}
                source={item.source}
                style={{height: 100, width: undefined}}
              />
            </TouchableOpacity>
          )}
          //Setting the number of column
          numColumns={3}
          keyExtractor={(item, index) => index}
        />
        <PhotoView
          visible={this.state.visible}
          data={photos}
          hideStatusBar={true}
          initial={this.state.clickedPhoto}
          onDismiss={e => {
            // don't forgot set state back.
            this.setState({
              visible: false,
            });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  topBar: {
    backgroundColor: 'white',
    width: '100%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    // borderBottomWidth: 1,
    // borderBottomColor: '#999',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  topTitle: {
    color: 'black',
    fontSize: 16,
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
