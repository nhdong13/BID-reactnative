import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MuliText } from 'components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import colors from 'assets/Color';
import { getCircle } from 'api/circle.api';
import { retrieveToken } from 'utils/handleToken';
import CircleItem from 'screens/parent/CircleItem';
import CircleHiredSitter from 'screens/parent/CircleHiredSitter';
import CircleFriendSitter from 'screens/parent/CircleFriendSitter';
import Toast, { DURATION } from 'react-native-easy-toast';

export default class CircleScreens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      circle: [],
      hiredSitter: [],
      friendSitter: [],
      hidedCircle: true,
      hidedHiredSitter: true,
      hidedFriendSitter: true,
    };
  }

  componentWillMount() {
    this.getCircle();
  }

  getCircle() {
    retrieveToken().then((res) => {
      const { userId } = res;
      this.setState({ userId });
    });

    getCircle()
      .then((result) => {
        this.setState({
          circle: result.data.circle,
          hiredSitter: result.data.hiredSitter,
          friendSitter: result.data.friendSitter,
        });
      })
      .catch((error) => {
        console.log('Duong: CircleScreens -> getCircle -> error', error);
      });
  }

  hidedCircle() {
    if (this.state.hidedCircle) {
      this.setState({ hidedCircle: false });
    } else {
      this.setState({ hidedCircle: true });
    }
  }

  hidedHiredSitter() {
    if (this.state.hidedHiredSitter) {
      this.setState({ hidedHiredSitter: false });
    } else {
      this.setState({ hidedHiredSitter: true });
    }
  }

  hidedFriendSitter() {
    if (this.state.hidedFriendSitter) {
      this.setState({ hidedFriendSitter: false });
    } else {
      this.setState({ hidedFriendSitter: true });
    }
  }

  showToast() {
    this.refs.toast.show("Cặc", DURATION.LENGTH_LONG);
  }

  render() {
    return (
      <ScrollView style={{ backgroundColor: '#dfe6e9' }}>
        <Toast ref="toast" position="top" />
        {/* Header vòng tròn tin tưởng của tôi */}
        {this.state.circle.length > 0 ? (
          <View style={styles.firstHeaderContainer}>
            <TouchableOpacity
              onPress={() => {
                this.hidedCircle();
              }}
              style={{ flexDirection: 'row' }}
            >
              <Ionicons
                name="ios-person"
                size={24}
                style={{ marginBottom: -4, marginLeft: 20, marginTop: 13 }}
                color={colors.darkGreenTitle}
              />
              <MuliText style={styles.headerText}>
                Những phụ huynh mà tôi biết ({this.state.circle.length})
              </MuliText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginLeft: 'auto',
                marginTop: 18,
                color: colors.lightGreen,
                marginRight: 10,
              }}
              onPress={() =>
                this.props.navigation.navigate('AddToCircle', {
                  ownerId: this.state.userId,
                  onGoBack: () => {
                    this.getCircle();
                  }
                })
              }
            >
              <MuliText style={{ color: colors.done, fontSize: 11 }}>Thêm</MuliText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.firstHeaderContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Ionicons
                name="ios-person"
                size={24}
                style={{ marginBottom: -4, marginLeft: 20, marginTop: 13 }}
                color={colors.darkGreenTitle}
              />
              <MuliText style={styles.headerText}>
                Những phụ huynh mà tôi biết ({this.state.circle.length})
              </MuliText>
            </View>
            <TouchableOpacity
              style={{
                marginLeft: 'auto',
                marginTop: 18,
                color: colors.lightGreen,
                marginRight: 10,
              }}
              onPress={() =>
                this.props.navigation.navigate('AddToCircle', {
                  ownerId: this.state.userId,
                })
              }
            >
              <MuliText style={{ color: colors.done, fontSize: 11 }}>
                Thêm
              </MuliText>
            </TouchableOpacity>
          </View>
        )}
        {/* End header */}

        {/* Item vòng tròn tin tưởng của tôi */}
        {this.state.hidedCircle && this.state.circle.length > 0 && (
          <View style={styles.itemContainer}>
            {/* Item chi tiết */}
            {this.state.circle.length > 0 && (
              <FlatList
                horizontal={true}
                data={this.state.circle}
                renderItem={({ item }) => <CircleItem item={item} />}
                keyExtractor={(item) => item.friend.user.id.toString()}
              />
            )}
            {/* End Item chi tiết */}
          </View>
        )}
        {/* End item */}

        {/* Header người giữ trẻ đã thuê */}
        {this.state.hiredSitter.length > 0 && (
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => {
                this.hidedHiredSitter();
              }}
              style={{ flexDirection: 'row' }}
            >
              <Ionicons
                name="ios-person"
                size={19}
                style={{ marginBottom: -4, marginLeft: 20, marginTop: 13 }}
                color={colors.darkGreenTitle}
              />
              <MuliText style={styles.headerText}>
                Người giữ trẻ đã thuê ({this.state.hiredSitter.length})
              </MuliText>
            </TouchableOpacity>
          </View>
        )}
        {/* End header */}

        {/* Item của người giữ trẻ đã thuê */}
        {this.state.hidedHiredSitter && this.state.hiredSitter.length > 0 && (
          <View>
            {/* Item chi tiết */}
            {this.state.hiredSitter.length > 0 && (
              <FlatList
                style={styles.itemContainer}
                data={this.state.hiredSitter}
                renderItem={({ item }) => <CircleHiredSitter item={item} />}
                keyExtractor={(item) => item.userId.toString()}
              />
            )}
            {/* End Item chi tiết */}
          </View>
        )}
        {/* End item */}

        {/* Header bạn bè */}
        {this.state.friendSitter.length > 0 && (
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => {
                this.hidedFriendSitter();
              }}
              style={{ flexDirection: 'row' }}
            >
              <Ionicons
                name="ios-person"
                size={19}
                style={{ marginBottom: -4, marginLeft: 20, marginTop: 13 }}
                color={colors.darkGreenTitle}
              />
              <MuliText style={styles.headerText}>
                Người trông trẻ bạn bè đã thuê ({this.state.friendSitter.length}
                )
              </MuliText>
            </TouchableOpacity>
          </View>
        )}
        {/* End header */}

        {/* Item bạn bè */}
        {this.state.hidedFriendSitter && this.state.friendSitter.length > 0 && (
          <View>
            {/* Item chi tiết */}
            {this.state.friendSitter.length > 0 && (
              <FlatList
                style={styles.itemContainer}
                data={this.state.friendSitter}
                renderItem={({ item }) => <CircleFriendSitter item={item} />}
                keyExtractor={(item) => item.userId.toString()}
              />
            )}
            {/* End Item chi tiết */}
          </View>
        )}
        {/* End item */}
      </ScrollView>
    );
  }
}
CircleScreens.navigationOptions = {
  title: 'Vòng tròn tin tưởng',
};
const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  firstHeaderContainer: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderColor: colors.gray,
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#fff',
    height: 60,
  },
  headerContainer: {
    borderColor: colors.gray,
    borderWidth: 0,
    borderBottomWidth: 2,
    flexDirection: 'row',
    marginTop: 6,
    backgroundColor: '#fff',
    height: 60,
  },
  headerText: {
    marginTop: 18,
    fontSize: 10,
    color: colors.darkGreenTitle,
    marginLeft: 10,
  },
  textDeselect: {
    marginTop: 5,
    fontSize: 10,
    color: colors.lightGreen,
  },
  container: {
    flex: 1,
    backgroundColor: '#dfe6e9',
    paddingBottom: 10,
  },
  textInput: {
    borderColor: '#EEEEEE',
    width: 300,
    height: 60,
    borderWidth: 2,
    borderRadius: 30,
    padding: 10,
    fontFamily: 'muli',
  },
  sectionContainer2: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    marginTop: 10,
    height: 300,
  },
  sectionContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerSection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#bdc3c7',
    height: 60,
    alignItems: 'center',
    marginBottom: 10,
  },
  notfoundMessage: {
    backgroundColor: 'white',
    flex: 1,
    padding: 20,
    marginTop: 10,
  },
  bsitterContainer: {
    marginTop: 5,
  },
  bsitterItem: {
    flexDirection: 'row',
    marginTop: 10,
  },
  upperText: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginLeft: 15,
    flex: 1,
    alignItems: 'center',
  },
  lowerText: {
    marginLeft: 18,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  submitButton: {
    width: 300,
    height: 60,
    padding: 10,
    backgroundColor: '#315F61',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButton: {
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 20,
    marginRight: 10,
  },
  bsitterName: {
    fontSize: 13,
    fontWeight: '400',
    color: '#315F61',
  },
  contentContainer: {
    paddingTop: 30,
  },
  buttonContainer: {
    paddingTop: 30,
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  sitterImage: {
    width: 65,
    height: 65,
    borderRadius: 20,
    resizeMode: 'contain',
  },
});
