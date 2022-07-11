import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack'
import ShoppingStack from './ShoppingCartStack';
import Entypo from 'react-native-vector-icons/Entypo'
import MenuScreen from '../screens/MenuScreen';
const Tab = createBottomTabNavigator();

const BottomTabNav = () => {
  return (

        <Tab.Navigator tabBarOption={{showLable: false, inactiveTintColor: "#ffbd7d", activeTintColor: "#e47911"}}>
            
            <Tab.Screen 
            component={HomeStack} 
            name="home" 
            options={{
                tabBarIcon: ({color}) => (
                <Entypo name="home" color={color} size={25} />
                ),
            }} />

           <Tab.Screen 
            component={HomeScreen} 
            name="profile" 
            options={{
                tabBarIcon: ({color}) => (
                <Entypo name="user" color={color} size={25} />
                ),
            }} />

            <Tab.Screen 
            component={ShoppingStack} 
            name="shoppingCart" 
            options={{
                tabBarIcon: ({color}) => (
                <Entypo name="shopping-cart" color={color} size={25} />
                ),
            }} />

            <Tab.Screen 
            component={MenuScreen} 
            name="more" 
            options={{
                tabBarIcon: ({color}) => (
                <Entypo name="menu" color={color} size={25} />
                ),
            }} />
            
            
        </Tab.Navigator>
   
  )
}

export default BottomTabNav;