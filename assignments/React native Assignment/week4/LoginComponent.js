import * as SecureStore from 'expo-secure-store';
import React, {Component, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert, ToastAndroid} from 'react-native';
import {Card, Icon, Input, CheckBox, Image, Button} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as Permissions from 'expo-permissions';
import {baseUrl} from '../shared/baseUrl';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Animatable from 'react-native-animatable';

class LoginTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            remember: false
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () =>{
            SecureStore.getItemAsync('userinfo')
                .then((userdata) => {
                    let userinfo = JSON.parse(userdata);
                    console.log('userinfo:' + JSON.stringify(userinfo));
                    if(userinfo) {
                        this.setState({username: userinfo.username});
                        this.setState({password: userinfo.password});
                        this.setState({remember: true});
                    } else {
                        this.setState({username: ''});
                        this.setState({password: ''});
                        this.setState({remember: false});
                    }
                });
            viewRef.flipInY(1000);
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    handleLogin() {
        console.log(JSON.stringify(this.state));
        if(this.state.remember) {
            SecureStore.setItemAsync('userinfo', JSON.stringify(this.state)).catch((error) => console.log('Could not save user info', error));
        }
        else {
            SecureStore.deleteItemAsync('userinfo').catch((error) => console.log('Could not delete user info', error));
        }
    }

    render() {
        return (
            <Animatable.View ref={ref => viewRef = ref}>
            <View style={styles.container}>
                <Input 
                    placeholder='username'
                    leftIcon={{type:'font-awesome', name:'user-o'}}
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}
                    containerStyle={styles.formInput}
                />
                <Input 
                    placeholder='password'
                    leftIcon={{type:'font-awesome', name:'key'}}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    containerStyle={styles.formInput}
                />
                <CheckBox
                    title='Remember Me'
                    center
                    checked={this.state.remember}
                    onPress={() => this.setState({remember: !this.state.remember})}
                    containerStyle={styles.formCheckBox}
                />
                <View style={styles.formButton}>
                    <Button 
                        title='Login'
                        onPress={() => this.handleLogin()}
                        buttonStyle={{
                            backgroundColor:'#512DA8'
                        }}
                    />
                </View>
            </View>
            </Animatable.View>
        );

    }
}

class RegisterTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false,
            imageUrl: baseUrl+ 'images/logo.png'
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', ()=> {
            viewRef2.flipInY(1000);
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    getImageFromCamera = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

        if(cameraPermission.status === Permissions.PermissionStatus.GRANTED
            && cameraRollPermission.status === Permissions.PermissionStatus.GRANTED) {
                let capturedImage = await ImagePicker.launchCameraAsync({
                    allowsEditing:true,
                    aspect: [4,3]
                });
                if(!capturedImage.cancelled) {
                    console.log(capturedImage);
                    this.processImage(capturedImage.uri);
                }
            }
    }

    getImageFromGallery = async () => {
        const galleryPermission = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        
        if(galleryPermission.status === Permissions.PermissionStatus.GRANTED) {
            let pickedImage = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3]
            });
            
            if(!pickedImage.cancelled) {
                console.log(pickedImage);
                this.processImage(pickedImage.uri);
            }
        }
    }

    processImage = async (imageUri) => {
        let processedImage =  await ImageManipulator.manipulateAsync(
            imageUri,
            [
                {resize:{width:400}}
            ],
            {format: 'png'}
        );
        console.log(processedImage);
        this.setState({imageUrl: processedImage.uri});
    }

    handleRegister() {
        console.log(JSON.stringify(this.state));
        if (this.state.remember)
            SecureStore.setItemAsync('userinfo', JSON.stringify({username: this.state.username, password: this.state.password}))
                .catch((error) => console.log('Could not save user info', error));
        this.resetForm();
    }

    resetForm() {
        this.setState({
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false,
            imageUrl: baseUrl+ 'images/logo.png'
        });
    }

    render() {
        return (
            <Animatable.View ref={ref => viewRef2 = ref}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image 
                            source={{uri: this.state.imageUrl}}
                            loadingIndicatorSource={require('./images/logo.png')}
                            style={styles.image}
                        />
                        <View style={{flexDirection:'row', justifyContent:'center'}}>
                            <Button 
                                icon={() => (<Icon 
                                    name='camera'
                                    type='font-awesome'
                                    color='white'
                                />)}
                                raised
                                onPress={this.getImageFromCamera}
                                buttonStyle={{
                                    backgroundColor:'#512DA8'
                                }}
                                containerStyle={{
                                    margin:10
                                }}
                            />
                            <Button 
                                icon={() => (<Icon 
                                    name='folder-open'
                                    type='font-awesome'
                                    color='white'
                                />)}
                                raised
                                onPress={this.getImageFromGallery}
                                buttonStyle={{
                                    backgroundColor:'#512DA8'
                                }}
                                containerStyle={{
                                    margin:10
                                }}
                            />
                        </View>
                    </View>
                    <Input
                        placeholder="Username"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(username) => this.setState({username})}
                        value={this.state.username}
                        containerStyle={styles.formInput}
                        />
                    <Input
                        placeholder="Password"
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        containerStyle={styles.formInput}
                        />
                    <Input
                        placeholder="First Name"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(firstname) => this.setState({firstname})}
                        value={this.state.firstname}
                        containerStyle={styles.formInput}
                        />
                    <Input
                        placeholder="Last Name"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(lastname) => this.setState({lastname})}
                        value={this.state.lastname}
                        containerStyle={styles.formInput}
                        />
                    <Input
                        placeholder="Email"
                        leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                        containerStyle={styles.formInput}
                        />
                    <CheckBox title="Remember Me"
                        center
                        checked={this.state.remember}
                        onPress={() => this.setState({remember: !this.state.remember})}
                        containerStyle={styles.formCheckBox}
                        />
                    <View style={styles.formButton}>
                        <Button
                            onPress={() => this.handleRegister()}
                            title="Register"
                            buttonStyle={{
                                backgroundColor:"#512DA8"
                            }}
                            />
                    </View>
                </View>
            </ScrollView>
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems:'center',
        margin: 20
    },
    imageContainer: {
        flex: 1,
        margin: 20
    },
    image: {
      margin: 10,
      width: 160,
      height: 120
    },
    formInput: {
        marginHorizontal: 40
    },
    formCheckBox: {
        marginHorizontal: 20,
        backgroundColor: null,
        borderWidth: 0
    },
    formButton: {
        marginHorizontal: 20,
        width:'50%'
    }
});

const BtmTab = createBottomTabNavigator();
let viewRef;
let viewRef2;
function Login({navigation}) {


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            ToastAndroid.show('Login...', ToastAndroid.LONG);
        });

        return unsubscribe;
    }, [navigation]);

    const myTabBarOption = {
        activeBackgroundColor: '#9575CD',
        inactiveBackgroundColor: '#D1C4E9',
        activeTintColor: '#ffffff',
        inactiveTintColor: 'gray'
    }

    return(
        <BtmTab.Navigator tabBarOptions={myTabBarOption}>
            <BtmTab.Screen name='Login' component={LoginTab} options={{
                title:'Login',
                tabBarIcon: ({focused,color, size}) => (
                    <Icon
                        name='sign-in'
                        type='font-awesome'
                        size={24}
                        iconStyle={{color: color}}
                    />
                )
            }}/>
            <BtmTab.Screen name='Register' component={RegisterTab} options={{
                title:'Register',
                tabBarIcon: ({focused, color, size}) => (
                    <Icon
                        name='user-plus'
                        type='font-awesome'
                        size={24}
                        iconStyle={{color: color}}
                    />
                )
            }}/>
        </BtmTab.Navigator>
    );
}

export default Login;   