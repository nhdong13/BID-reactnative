/* eslint-disable nonblock-statement-body-position */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Picker } from 'react-native';
import { CheckBox } from 'native-base';
import { retrieveToken } from 'utils/handleToken';
import { updateBsProfile, getProfile } from 'api/babysitter.api';

import { MuliText } from 'components/StyledText';
import colors from 'assets/Color';
// import { RadioButton } from 'react-native-paper';
export default class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
      startDaytime: '08',
      endDayTime: '09',
      startNightTime: '17',
      endNightTime: '18',
      sitterId: 0,
    };
  }

  async componentDidMount() {
    await this.getUserId().then(() => {
      const { sitterId } = this.state;
      if (sitterId != 0) {
        getProfile(sitterId).then((res) => {
          const { daytime, evening, weeklySchedule } = res;
          const startDaytime = daytime.split('-')[0];
          const endDayTime = daytime.split('-')[1];
          const startNightTime = evening.split('-')[0];
          const endNightTime = evening.split('-')[1];
          this.setState({
            startDaytime,
            endDayTime,
            startNightTime,
            endNightTime,
          });
          const workDays = weeklySchedule.split(',');
          workDays.forEach((day) => {
            switch (day) {
              case 'MON':
                this.setState({ mon: true });
                break;
              case 'TUE':
                this.setState({ tue: true });
                break;
              case 'WED':
                this.setState({ wed: true });
                break;
              case 'THU':
                this.setState({ thu: true });
                break;
              case 'FRI':
                this.setState({ fri: true });
                break;
              case 'SAT':
                this.setState({ sat: true });
                break;
              case 'SUN':
                this.setState({ sun: true });
                break;
              default:
                console.log(
                  'Error in getprofile sitter -> CalendarScreen -> switch',
                );
                break;
            }
          });
        });
      }
    });
  }

  getUserId = async () => {
    await retrieveToken().then((res) => {
      const { userId } = res;
      if (userId != 0) {
        this.setState({ sitterId: userId });
      }
    });
  };

  updateSchedule = () => {
    console.log('update schedule went');
    const {
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      sun,
      startDaytime,
      endDayTime,
      startNightTime,
      endNightTime,
      sitterId,
    } = this.state;
    const workDays = [];
    const dayTime = [startDaytime, endDayTime];
    const nightTime = [startNightTime, endNightTime];

    if (mon) workDays.push('MON');
    if (tue) workDays.push('TUE');
    if (wed) workDays.push('WED');
    if (thu) workDays.push('THU');
    if (fri) workDays.push('FRI');
    if (sat) workDays.push('SAT');
    if (sun) workDays.push('SUN');

    const stringWorkDays = workDays.join();
    const stringDayTime = dayTime.join('-');
    const stringNightTime = nightTime.join('-');

    console.log(
      'PHUC: CalendarScreen -> updateSchedule -> stringDayTime',
      stringDayTime,
    );
    console.log(
      'PHUC: CalendarScreen -> updateSchedule -> stringNightTime',
      stringNightTime,
    );
    console.log(
      'PHUC: CalendarScreen -> updateSchedule -> workDays',
      stringWorkDays,
    );

    const body = {
      daytime: stringDayTime,
      evening: stringNightTime,
      weeklySchedule: stringWorkDays,
    };

    updateBsProfile(sitterId, body);
  };

  render() {
    const {
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      sun,
      startDaytime,
      endDayTime,
      startNightTime,
      endNightTime,
    } = this.state;
    return (
      <View>
        <View style={{ marginTop: 35, alignItems: 'center' }}>
          <MuliText style={styles.headerTitle}>Lịch</MuliText>
          <MuliText style={styles.grayOptionInformation}>
            Lịch giữ trẻ của tôi
          </MuliText>
        </View>

        <View style={{ marginTop: 30, marginBottom: 15, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <MuliText style={styles.dayText}>T2</MuliText>
            <MuliText style={styles.dayText}>T3</MuliText>
            <MuliText style={styles.dayText}>T4</MuliText>
            <MuliText style={styles.dayText}>T5</MuliText>
            <MuliText style={styles.dayText}>T6</MuliText>
            <MuliText style={styles.dayText}>T7</MuliText>
            <MuliText style={styles.dayText}>CN</MuliText>
          </View>
        </View>

        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          {/* Radio button */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 12,
              marginLeft: -15,
            }}
          >
            <CheckBox
              style={styles.radioButton}
              checked={mon}
              onPress={() => this.setState({ mon: !this.state.mon })}
            />
            <CheckBox
              style={styles.radioButton}
              checked={tue}
              onPress={() => this.setState({ tue: !this.state.tue })}
            />
            <CheckBox
              style={styles.radioButton}
              checked={wed}
              onPress={() => this.setState({ wed: !this.state.wed })}
            />
            <CheckBox
              style={styles.radioButton}
              checked={thu}
              onPress={() => this.setState({ thu: !this.state.thu })}
            />
            <CheckBox
              style={styles.radioButton}
              checked={fri}
              onPress={() => this.setState({ fri: !this.state.fri })}
            />
            <CheckBox
              style={styles.radioButton}
              checked={sat}
              onPress={() => this.setState({ sat: !this.state.sat })}
            />
            <CheckBox
              style={styles.radioButton}
              checked={sun}
              onPress={() => this.setState({ sun: !this.state.sun })}
            />
          </View>
          {/* End Radio button */}
        </View>

        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <MuliText>Sáng</MuliText>
          <View style={{ flexDirection: 'row', marginBottom: 15 }}>
            <Picker
              selectedValue={startDaytime}
              style={{ height: 50, width: 150 }}
              onValueChange={(itemValue) => {
                this.setState({ startDaytime: itemValue });
                if (parseInt(itemValue, 10) > parseInt(endDayTime, 10)) {
                  this.setState({ endDayTime: itemValue });
                }
              }}
            >
              <Picker.Item label="08:00" value="08" />
              <Picker.Item label="09:00" value="09" />
              <Picker.Item label="10:00" value="10" />
              <Picker.Item label="11:00" value="11" />
              <Picker.Item label="12:00" value="12" />
              <Picker.Item label="13:00" value="13" />
              <Picker.Item label="14:00" value="14" />
              <Picker.Item label="15:00" value="15" />
              <Picker.Item label="16:00" value="16" />
              <Picker.Item label="17:00" value="17" />
            </Picker>

            <Picker
              selectedValue={endDayTime}
              style={{ height: 50, width: 150 }}
              onValueChange={(itemValue) => {
                this.setState({ endDayTime: itemValue });
                if (parseInt(itemValue, 10) < parseInt(endDayTime, 10)) {
                  this.setState({ startDaytime: itemValue });
                }
              }}
            >
              <Picker.Item label="09:00" value="09" />
              <Picker.Item label="10:00" value="10" />
              <Picker.Item label="11:00" value="11" />
              <Picker.Item label="12:00" value="12" />
              <Picker.Item label="13:00" value="13" />
              <Picker.Item label="14:00" value="14" />
              <Picker.Item label="15:00" value="15" />
              <Picker.Item label="16:00" value="16" />
              <Picker.Item label="17:00" value="17" />
            </Picker>
          </View>

          <MuliText>Chiều</MuliText>
          <View style={{ flexDirection: 'row' }}>
            <Picker
              selectedValue={startNightTime}
              style={{ height: 50, width: 150 }}
              onValueChange={(itemValue) => {
                this.setState({ startNightTime: itemValue });
                if (parseInt(itemValue, 10) > parseInt(endNightTime, 10)) {
                  this.setState({ endNightTime: itemValue });
                }
              }}
            >
              <Picker.Item label="17:00" value="17" />
              <Picker.Item label="18:00" value="18" />
              <Picker.Item label="19:00" value="19" />
              <Picker.Item label="20:00" value="20" />
              <Picker.Item label="21:00" value="21" />
              <Picker.Item label="22:00" value="22" />
              <Picker.Item label="23:00" value="23" />
            </Picker>

            <Picker
              selectedValue={endNightTime}
              style={{ height: 50, width: 150 }}
              onValueChange={(itemValue) => {
                this.setState({ endNightTime: itemValue });
                if (parseInt(itemValue, 10) < parseInt(endNightTime, 10)) {
                  this.setState({ startNightTime: itemValue });
                }
              }}
            >
              <Picker.Item label="18:00" value="18" />
              <Picker.Item label="19:00" value="19" />
              <Picker.Item label="20:00" value="20" />
              <Picker.Item label="21:00" value="21" />
              <Picker.Item label="22:00" value="22" />
              <Picker.Item label="23:00" value="23" />
            </Picker>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => this.updateSchedule()}
          >
            <MuliText style={{ color: 'white', fontSize: 16 }}>Lưu</MuliText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
CalendarScreen.navigationOptions = {
  title: 'Lịch',
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  submitButton: {
    width: 200,
    height: 50,
    padding: 10,
    marginTop: 20,
    backgroundColor: '#315F61',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 10,
  },
  dayText: {
    marginHorizontal: 10,
    width: 22,
  },
  radioButton: {
    marginHorizontal: 11,
    // width: 22,
    // height: 22,
  },
  hide: {
    backgroundColor: 'white',
    width: 95,
  },
  netWorkContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 15,
    height: 200,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10,
  },
  textReview: {
    marginLeft: 8,
    marginRight: 100,
    flex: 1,
  },
  line: {
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    marginTop: 10,
    marginHorizontal: 25,
  },
  reivewContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  nameReview: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#315F61',
  },
  optionInformation: {
    color: '#bdc3c7',
    fontSize: 13,
    paddingLeft: 15,
    fontWeight: '400',
  },
  textOption: {
    marginHorizontal: 5,
  },
  informationText: {
    fontSize: 13,
    marginTop: 20,
    flexDirection: 'row',
    color: '#bdc3c7',
    // backgroundColor: 'red',
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 15,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800',
  },
  detailContainer: {
    marginHorizontal: 25,
    marginTop: 20,
  },
  profileImg2: {
    width: 60,
    height: 70,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    marginLeft: 10,
  },
  profileImg: {
    width: 100,
    height: 100,
    overflow: 'hidden',
    marginTop: 10,
  },
  childrenInformationContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    borderRadius: 15,
    height: 100,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 1,
  },
  grayOptionInformation: {
    color: '#bdc3c7',
    fontSize: 11,
    fontWeight: '200',
    marginLeft: 10,
  },
});
