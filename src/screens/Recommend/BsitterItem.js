import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { MuliText } from 'components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { createInvitation } from 'api/invitation.api';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import images from 'assets/images/images';
import colors from 'assets/Color';
import { withNavigation } from 'react-navigation';
import { STRIPE_PUBLISHABLE_KEY as stripeKey } from 'react-native-dotenv';
import Api from 'api/api_helper';
import { retrieveToken } from 'utils/handleToken';
import { createCustomer } from 'api/payment.api';

export class Bsitter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      email: '',
      name: '',
    };
  }

  componentDidMount() {
    Stripe.setOptionsAsync({
      publishableKey: stripeKey,
      androidPayMode: 'test',
    });
    this.getUserData();
  }

  getUserData() {
    retrieveToken().then((res) => {
      const { userId } = res;
      this.setState({ userId });

      Api.get('users/' + userId.toString()).then((res) => {
        this.setState({ email: res.email, name: res.nickname });
      });
    });
  }

  calAge = (dateOfBirth) => {
    const born = this.getYear(dateOfBirth);
    const now = moment().year();
    return now - born;
  };

  getYear = (dateOfBirth) => {
    const arr = dateOfBirth.split('-');
    return arr[0];
  };

  sendInvitation = async (receiverId) => {
    // console.log('it go here');
    const { requestId, request } = this.props;
    const invitation = {
      requestId: requestId,
      status: 'PENDING',
      receiver: receiverId,
    };
    // console.log(request);
    await Api.get('trackings/' + this.state.userId).then((res) => {
      // console.log(res.customerId);
      if (res.customerId == null || res.cardId == null) {
        this.createCard().then((res) => {
          if (res) {
            createInvitation(requestId, invitation, request)
              .then((response) => {
                // console.log(response);
                this.props.changeInviteStatus(receiverId);
                this.props.setRequestId(response.data.newRequest.id);
              })
              .catch((error) => console.log('aaa', error));
          }
        });
      } else {
        createInvitation(requestId, invitation, request)
          .then((response) => {
            // console.log(response);
            this.props.changeInviteStatus(receiverId);
            this.props.setRequestId(response.data.newRequest.id);
          })
          .catch((error) => console.log('aaa', error));
      }
    });
  };

  createCard = async () => {
    const token = await Stripe.paymentRequestWithCardFormAsync().catch(
      (error) => console.log(error),
    );
    // console.log('PHUC: Bsitter -> sendInvitation -> token', token);
    if (token) {
      // console.log(invitation);
      // console.log(this.state.email,
      //   token.tokenId, this.state.userId, this.state.name, token.card.cardId);
      createCustomer(
        this.state.email,
        token.tokenId,
        this.state.userId,
        this.state.name,
        token.card.cardId,
      );
    }
    return token;
  };

  changeStateOnGoBack(receiverId, requestId) {
    this.props.changeInviteStatus(receiverId);
    this.props.setRequestId(requestId);
  }

  render() {
    const { item, navigation, requestId, request } = this.props;
    return (
      <View key={item.userId} style={styles.bsitterContainer}>
        <View style={styles.bsitterItem}>
          <TouchableOpacity
            style={{ flexDirection: 'row', flexGrow: 2 }}
            onPress={() =>
              navigation.navigate('SitterProfile', {
                sitterId: item.userId,
                requestId: requestId,
                request: request,
                onGoBack: (receiverId, requestId) =>
                  this.changeStateOnGoBack(receiverId, requestId),
              })
            }
          >
            <Image source={images.parent} style={styles.sitterImage} />
            <View>
              <View style={styles.upperText}>
                <MuliText style={styles.bsitterName}>
                  {item.user.nickname} - {this.calAge(item.user.dateOfBirth)}
                </MuliText>
                {item.user.gender == 'MALE' && (
                  <Ionicons
                    name="ios-male"
                    size={20}
                    style={{ marginBottom: -2, marginLeft: 20 }}
                    color={colors.blueAqua}
                  />
                )}
                {item.user.gender == 'FEMALE' && (
                  <Ionicons
                    name="ios-female"
                    size={20}
                    style={{ marginBottom: -2, marginLeft: 20 }}
                    color={colors.pinkLight}
                  />
                )}
              </View>
              <View style={styles.lowerText}>
                <Ionicons
                  name="ios-pin"
                  size={24}
                  style={{ marginBottom: -4, marginLeft: 20 }}
                  color={colors.lightGreen}
                />
                <MuliText> {item.distance} km </MuliText>
                <Ionicons
                  name="ios-star"
                  size={24}
                  style={{ marginBottom: -4, marginLeft: 20 }}
                  color={colors.lightGreen}
                />
                <MuliText>
                  {' '}
                  {item.averageRating.toFixed(0)} ({item.totalFeedback}){' '}
                </MuliText>
              </View>
            </View>
          </TouchableOpacity>
          <View />
          {!item.isInvited && (
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={() => this.sendInvitation(item.userId)}
            >
              <MuliText style={{ color: '#78ddb6', fontSize: 16 }}>
                Mời
              </MuliText>
            </TouchableOpacity>
          )}
          {item.isInvited && (
            <MuliText style={{ color: '#B81A1A', fontSize: 16 }}>
              Đã mời
            </MuliText>
          )}
        </View>
      </View>
    );
  }
}

export default withNavigation(Bsitter);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dfe6e9',
    paddingBottom: 20,
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
  sectionContainer: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerSection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#bdc3c7',
    height: 60,
    alignItems: 'center',
    marginBottom: 15,
  },
  bsitterContainer: {
    marginVertical: 13,
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
  inviteButtonDisable: {
    marginTop: 10,
    opacity: 0.7,
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
