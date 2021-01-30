import React, { Component } from  'react';
import { Text, View, StyleSheet, Switch, Button, Modal, Alert } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Picker } from '@react-native-community/picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Icon } from 'react-native-elements';
import Moment from 'moment';
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';

let viewRef;

class Reservation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date: new Date(),
            mode: 'date',
            showDateTimePicker: false,
        }
    }

    async obtainNotificationPermission(){
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if(permission.status !== Permissions.PermissionStatus.GRANTED) {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if(permission.status !==  Permissions.PermissionStatus.GRANTED) {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    };
    
    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.setNotificationHandler({
            handleNotification: async ()=>({
                shouldPlaySound: true,
                shouldShowAlert: true,
                shouldSetBadge: false
            })
        })

        Notifications.scheduleNotificationAsync({
            content: {
                title:'Your Reservation',
                body: 'Reservation for ' +date+ ' requested',
                color: '#512DA8',
                vibrate: true,
                sound: true
            },
            trigger: null
        });
    };

    async obtainCalendarPermission() {
        let permission = await Calendar.getCalendarPermissionsAsync();
        if( permission.status !== Permissions.PermissionStatus.GRANTED) {
            permission = await Calendar.requestCalendarPermissionsAsync();
            if(permission.status !== Permissions.PermissionStatus.GRANTED)
                Alert.alert('Permission not granted to access calendar');
        }
        return permission;
    };

    async getDefaultCalendarSource() {
        const calendars = await Calendar.getCalendarsAsync();
        const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
        return defaultCalendars[0].source;
    };

    async addReservationToCalender(date) {
        await this.obtainCalendarPermission();
        const defaultCalendarSource =
            Platform.OS === 'ios'
            ? await getDefaultCalendarSource()
            : { isLocalAccount: true, name: 'Expo Calendar' };
        const newCalendarID = await Calendar.createCalendarAsync({
            title: 'Expo Calendar',
            color: 'blue',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: 'internalCalendarName',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
        const newEventID = Calendar.createEventAsync(
            newCalendarID,
            {
                title:'Con Fusion Table Reservation',
                startDate: date,
                endDate: new Date(Date.parse(date)+7200000),
                timeZone:'Asia/Taipei',
                location:'121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
            }
        )
    };

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            viewRef.zoomIn(1000);
        })
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    handleReservation() {
        console.log(JSON.stringify(this.state));
        Alert.alert(
            'Your Reservation OK?',
            'Number of Guests: ' + this.state.guests +
            '\nSmoking? ' + this.state.smoking+
            '\nDate and Time: ' + this.state.date,
            [
                {text:'Cancel', onPress: () => {this.resetForm();}, style:'cancel'},
                {text:'OK', onPress:() => {
                    this.presentLocalNotification(this.state.date); 
                    this.addReservationToCalender(this.state.date);
                    this.resetForm(); }
                }
            ],
            {cancelable: false}
        )
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: new Date(),
            mode: 'date',
            showDateTimePicker: false,
        });
    }

    render() {
        return(
            <Animatable.View ref={r => viewRef = r}>
                <ScrollView>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                            <Picker.Item label="1 person" value="1"></Picker.Item>
                            <Picker.Item label="2 people" value="2"></Picker.Item>
                            <Picker.Item label="3 people" value="3"></Picker.Item>
                            <Picker.Item label="4 people" value="4"></Picker.Item>
                            <Picker.Item label="5 people" value="5"></Picker.Item>
                            <Picker.Item label="6 people" value="6"></Picker.Item>
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking/{'\n'}Non-Smoking?</Text>
                        <Switch style={styles.formItem}
                            value={this.state.smoking}
                            trackColor='#512DA8'
                            onValueChange={(value) => this.setState({smoking: value})}>
                        </Switch>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date and Time</Text>
                        <TouchableOpacity
                                style={{
                                    flex: 3,
                                    padding: 10,
                                    borderColor: '#512DA8',
                                    borderWidth: 2,
                                    flexDirection: "row"
                                }}
                                onPress={() => this.setState({ showDateTimePicker: true, mode: 'date' })}
                        >
                            <Icon type='font-awesome' name='calendar' color='#512DA8' />
                            <Text >
                                {' ' + Moment(this.state.date).format('DD-MMM-YYYY h:mm A') }
                            </Text>
                        </TouchableOpacity>
                        {/* Date Time Picker */}
                        {this.state.showDateTimePicker && (
                            <DateTimePicker
                                value={this.state.date}
                                mode={this.state.mode}
                                minimumDate={new Date()}
                                minuteInterval={30}
                                onChange={(event, date) => {
                                    if (date === undefined) {
                                        this.setState({ showDateTimePicker: false });
                                    }
                                    else {
                                        this.setState({
                                            showDateTimePicker: this.state.mode === "time" ? false : true,
                                            mode: "time",
                                            date: new Date(date)
                                        });
                                    }
                                }}
                            />
                        )}
                    </View>
                    <View style={styles.formRow}>
                        <Button
                            onPress={() => this.handleReservation()}
                            title='Reserve'
                            color='#512DA8'
                            accessibilityLabel='learn more about this purple button'>
                        </Button>
                    </View>
                </ScrollView>
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem:{
        flex: 3,
    },
    modal: {
        backgroundColor:'#FFF',
        justifyContent:'space-between',
        margin:20,
        top:'25%',
        height:'40%'
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20,
     },
     modalText: {
         fontSize: 18,
         margin: 10,

     }

});

export default Reservation;