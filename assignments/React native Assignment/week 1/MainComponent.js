import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import Home from './HomeComponent';
import About from './AboutComponent';
import Contact from './ContactComponent';

{/** USE OF CURRENT VERSION OF REACT NATIVE NAVIGATION

 Adoption of hints from https://reactnavigation.org/docs/stack-navigator/,
 https://reactnavigation.org/docs/drawer-based-navigation and
 https://www.coursera.org/learn/react-native/discussions/weeks/1/threads/8PifLG4EQ724nyxuBDO9DQ

 npm install @react-navigation/native
 expo install react-native-gesture-handler react-native-reanimated react-native-screens
 react-native-safe-area-context @react-native-community/masked-view
 npm install @react-navigation/stack
 npm install @react-navigation/drawer
 npm install @react-native-community/masked-view
 npm install react-native-safe-area-context
 */
}

const MenuNavigator = createStackNavigator();

function MenuNavigatorScreen() {
    return (
        <MenuNavigator.Navigator
            initialRouteName='Menu'
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#512DA8'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    color: '#fff'
                }
            }}
        >
            <MenuNavigator.Screen
                name='Menu'
                component={Menu}
            />
            <MenuNavigator.Screen
                name='Dishdetail'
                component={Dishdetail}
                options={{headerTitle: 'Dish Detail'}}
            />
        </MenuNavigator.Navigator>
    );
}

const HomeNavigator = createStackNavigator();

function HomeNavigatorScreen() {
    return (
        <HomeNavigator.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#512DA8'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    color: '#fff'
                }
            }}
        >
            <HomeNavigator.Screen
                name='Home'
                component={Home}
                options={{headerTitle: 'Home'}}
            />
        </HomeNavigator.Navigator>
    );
}

const AboutNavigator = createStackNavigator();

function AboutNavigatorScreen() {
    return (
        <AboutNavigator.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#512DA8'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    color: '#fff'
                }
            }}
        >
            <AboutNavigator.Screen
                name="About Us"
                component={About}
                options={{headerTitle: 'About Us'}}
            />
        </AboutNavigator.Navigator>
    );
}

const ContactNavigator = createStackNavigator();

function ContactNavigatorScreen() {
    return (
        <ContactNavigator.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#512DA8'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    color: '#fff'
                }
            }}
        >
            <ContactNavigator.Screen
                name="Contact Us"
                component={Contact}
                options={{headerTitle: 'Contact Us'}}
            />
        </ContactNavigator.Navigator>
    );
}

const Drawer = createDrawerNavigator();

function MainNavigator() {
    return (
        <Drawer.Navigator initialRouteName="Home"
                          drawerStyle={{
                                  backgroundColor: '#D1C4E9'
                              }}
        >
            <Drawer.Screen name="Home" component={HomeNavigatorScreen}/>
            <Drawer.Screen name="About Us" component={AboutNavigatorScreen}/>
            <Drawer.Screen name="Menu" component={MenuNavigatorScreen}/>
            <Drawer.Screen name="Contact Us" component={ContactNavigatorScreen}/>
        </Drawer.Navigator>

    );
}

class Main extends Component {

    render() {

        return (
            <NavigationContainer>
                <MainNavigator/>
            </NavigationContainer>
        );
    }
}

export default Main;
