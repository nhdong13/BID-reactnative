import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { MuliText } from 'components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { recommend } from 'api/sittingRequest.api';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Bsitter from 'screens/Recommend/BsitterItem';
import colors from 'assets/Color';

export default class RecommendScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchedCount: 0,
      listMatched: [],
      recommendCount: 0,
      recommendList: [],
      requestId: 0,
      request: null,
      isModalVisible: true,
      isModalVisible2: true,
    };
  }

  componentWillMount() {
    const requestId = this.props.navigation.getParam('requestId');
    const request = this.props.navigation.getParam('request');
    if (requestId && requestId != 0) {
      this.setState({ requestId }, () => this.getRecommendation());
    } else if (request !== undefined && request !== null) {
      this.setState({ request }, () => this.getRecommendation());
    } else {
      console.log('requestId not found - RecommendScreen');
    }
  }

  getRecommendation = async () => {
    if (
      this.state.requestId != 0 ||
      (this.state.request !== undefined && this.state.request != null)
    ) {
      const data = await recommend(this.state.requestId, this.state.request);
      this.setState({
        matchedCount: data.matchedCount,
        listMatched: data.listMatched,
        recommendCount: data.recommendCount,
        recommendList: data.recommendList,
      });

      return data;
    }
    return [];
  };

  changeInviteStatus = (receiverId) => {
    this.setState((prevState) => ({
      listMatched: prevState.listMatched.map((el) =>
        el.userId == receiverId ? Object.assign(el, { isInvited: true }) : el,
      ),
      recommendList: prevState.recommendList.map((el) =>
        el.userId == receiverId ? Object.assign(el, { isInvited: true }) : el,
      ),
    }));
  };

  setRequestId = (requestId) => {
    this.setState({ requestId: requestId });
    this.props.navigation.state.params.onGoBack(requestId);
  };

  callRecommend() {
    if (this.state.isModalVisible) {
      this.setState({ isModalVisible: false });
    } else {
      this.setState({ isModalVisible: true });
    }
  }

  callRecommend2() {
    if (this.state.isModalVisible2) {
      this.setState({ isModalVisible2: false });
    } else {
      this.setState({ isModalVisible2: true });
    }
  }

  // netstat -ano | findstr 3000
  render() {
    return (
      <ScrollView style={{ backgroundColor: '#dfe6e9' }}>
        <View style={styles.container}>
          {this.state.recommendList.length > 0 ||
          this.state.listMatched.length > 0 ? (
            <View>
              {this.state.recommendList.length > 0 && (
                <View style={styles.sectionContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      this.callRecommend();
                    }}
                  >
                    <View style={styles.headerSection}>
                      <Ionicons
                        name={
                          this.state.isModalVisible
                            ? 'ios-arrow-down'
                            : 'ios-arrow-up'
                        }
                        size={19}
                        style={{ marginBottom: -6, marginLeft: 15 }}
                        color="#315f61"
                      />
                      <MuliText
                        style={{
                          fontSize: 13,
                          color: '#315f61',
                          marginLeft: 5,
                        }}
                      >
                        Đề nghị ({this.state.recommendCount})
                      </MuliText>
                    </View>
                  </TouchableOpacity>
                  {this.state.isModalVisible && (
                    <ScrollView style={styles.sectionContainer2}>
                      {this.state.recommendList &&
                        this.state.recommendList.length > 0 && (
                          <FlatList
                            data={this.state.recommendList}
                            renderItem={({ item }) => (
                              <Bsitter
                                changeInviteStatus={this.changeInviteStatus}
                                setRequestId={this.setRequestId}
                                requestId={this.state.requestId}
                                request={this.state.request}
                                item={item}
                              />
                            )}
                            keyExtractor={(item) => item.user.id.toString()}
                          />
                        )}
                    </ScrollView>
                  )}
                </View>
              )}

              {this.state.listMatched.length != 0 && (
                <View style={styles.sectionContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      this.callRecommend2();
                    }}
                  >
                    <View style={styles.headerSection}>
                      <Ionicons
                        name={
                          this.state.isModalVisible2
                            ? 'ios-arrow-down'
                            : 'ios-arrow-up'
                        }
                        size={19}
                        style={{ marginBottom: -6, marginLeft: 15 }}
                        color="#315f61"
                      />
                      <MuliText
                        style={{
                          fontSize: 13,
                          color: '#315f61',
                          marginLeft: 5,
                        }}
                      >
                        Người giữ trẻ phù hợp ({this.state.matchedCount})
                      </MuliText>
                    </View>
                  </TouchableOpacity>
                  {this.state.isModalVisible2 && (
                    <ScrollView style={styles.sectionContainer2}>
                      {this.state.listMatched &&
                        this.state.listMatched.length != 0 && (
                          <FlatList
                            data={this.state.listMatched}
                            renderItem={({ item }) => (
                              <Bsitter
                                changeInviteStatus={this.changeInviteStatus}
                                setRequestId={this.setRequestId}
                                requestId={this.state.requestId}
                                request={this.state.request}
                                item={item}
                              />
                            )}
                            keyExtractor={(item) => item.user.id.toString()}
                          />
                        )}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>
          ) : (
            <View>
              <MuliText
                style={{
                  marginTop: 50,
                  color: colors.gray,
                  fontSize: 25,
                  marginHorizontal: 50,
                }}
              >
                Không tìm thấy người giữ trẻ phù hợp với lịch giữ trẻ của bạn
              </MuliText>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
    backgroundColor: '#dfe6e9',
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
    paddingHorizontal: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  sectionContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  headerSection: {
    backgroundColor: 'white',
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
    marginTop: 20,
  },
  bsitterItem: {
    flexDirection: 'row',
  },
  upperText: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginLeft: 15,
    flex: 1,
    alignItems: 'center',
  },
  lowerText: {
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
    marginTop: 10,
  },
  bsitterName: {
    fontSize: 18,
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
