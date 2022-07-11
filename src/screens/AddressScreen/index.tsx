import { View, Text, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform} from 'react-native'
import React, {useEffect, useState} from 'react'
import {Picker} from '@react-native-picker/picker';
import styles from './styles';
import countryList from 'country-list';
import Button from '../../components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import {DataStore, Auth, graphqlOperation} from 'aws-amplify';
import {Order, OrderProduct, CartProduct} from '../../models'
import { createPaymentIntent } from '../../graphql/mutations';
import { useStripe } from '@stripe/stripe-react-native';

const countries = countryList.getCodeList();




const AddressScreen = () => {
    const [country, setCountry] = useState(countries[0], code);
    const [fullname, setFullname] = useState('')
    const [phone, setPhone] = useState('')

    const [address, setAddress] = useState('')
    const [addressError, setAddressError] = useState('Invalid Address');
    const [city, setCity] = useState('')
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const navigation = useNavigation();
    const route = useRoute();

    const {initPaymentSheet, presentPaymentSheet} = useStripe();

    const amount = Math.floor(route.params?.totalPrice * 100 || 0);

    useEffect(() => {
        fetchPaymentIntent();
      }, []);
    
      useEffect(() => {
        if (clientSecret) {
          initializePaymentSheet();
        }
      }, [clientSecret]);

    const fetchPaymentIntent = async () => {
        const response = await API.graphql(
          graphqlOperation(createPaymentIntent, {amount}),
        );
        setClientSecret(response.data.createPaymentIntent.clientSecret);
      };

    const initializePaymentSheet = async () => {
        if (!clientSecret) {
          return;
        }
        const {error} = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
        });
        console.log('success');
        if (error) {
          Alert.alert(error);
        }
      };

    const openPaymentSheet = async () => {
        if (!clientSecret) {
          return;
        }
        const {error} = await presentPaymentSheet({clientSecret});
    
        if (error) {
          Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
          saveOrder();
          Alert.alert('Success', 'Your payment is confirmed!');
        }
      };

    const saveOrder = async () => {
        // get user details 
        const userData = await Auth.currentAuthenticatedUser();
        //create a new order
        const newOrder = await DataStore.save(
            new Order({
                userSub: userData.attributes.sub,
                fullName: fullname, 
                phoneNumber: phone, 
                country, 
                city, 
                address,

            }),
        );

        //fetch all cart items
        const cartItems = await DataStore.query(CartProduct, cp => 
            cp.userSub('eq', userData.attributes.sub),
            );

        //attach all cart items to the order 
        await Promise.all(
            cartItems.map(cartItem => DataStore.save(new OrderProduct({
                quantity: cartItem.quantity,
                option: cartItem.option,
                productID: cartItem.productIF,
                OrderID: newOrder.id,
            }),
            ),
            ),
        )

        //delete all cart items 
        await Promise.all(cartItems.map(cartItem => DataStore.delete(cartItem)));
        
        //navigate home
        navigation.navigate('home');


    };

    const onCheckout = () => {
        if (!!addressError) {
            Alert.alert("Fix all field errors before submitting")
        }

        if (!fullname) {
            Alert.alert("Please fill in your full name")
            return;
        }

        if (!phone) {
            Alert.alert("Please fill in your phone number")
            return;
        }

        // handle payments
        openPaymentSheet();
    };

    const validateAddress = () => {
        if (address.length < 3) {
        setAddressError('Address is too short');
        }
    }

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
    <ScrollView style={styles.root}>
      <View style={styles.row}>
        <Picker
        onValueChange={setCountry}
        selectedValue={country}
        >
            {countries.map(country => (
                <Picker.Item value={country.code} label={country.name} />
            ))}
        </Picker>
        </View>

        {/* Full name */}
        <View style={styles.row}>
            <Text style={styles.label}>Full name (first & last name)</Text>
            <TextInput 
            style={styles.input} 
            placeholder="Full name"
            value={fullname}
            onChangeText={setFullname}
            />
        </View>

        {/* Phone Number */}
        <View style={styles.row}>
            <Text style={styles.label}>Phone number</Text>
            <TextInput 
            style={styles.input} 
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType={'phone-pad'}
            />
        </View>

        {/* Address */}
        <View style={styles.row}>
            <Text style={styles.label}>Address</Text>
            <TextInput 
            style={styles.input} 
            placeholder="Address"
            value={address}
            onEndEditing={validateAddress}
            onChangeText={text => {
                setAddress(text); 
                setAddressError('');
            }}
            />
        </View>

        {/* Address */}
        <View style={styles.row}>
            <Text style={styles.label}>City</Text>
            <TextInput 
            style={styles.input} 
            placeholder="City"
            value={city}
            onChangeText={setCity}
            />
            {!!addressError && (
            <Text style={styles.errorLabel}>{addressError}</Text>
            )}
        </View>
        
        <Button text='Checkout' onPress={onCheckout} /> 

    </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default AddressScreen;