import React from 'react';
import {
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import 'react-native-gesture-handler';
import { StripeProvider } from '@stripe/stripe-react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import Router from './src/router';

import { Amplify } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react-native';

import config from './src/aws-exports'
Amplify.configure(config)

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <View style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <StripeProvider publishableKey="pk_test_51JPVcpBuY6A7iCoNlOLoK8fKnNT5TlmKwJyjUS0N2tDeehWpd1JxfIqUFwvohkkoXve83AkzySfOhHtmQKlybUmw00B86Sn8Ul" >
        <Router />
      </StripeProvider>
      
    </View>
  );
};



export default withAuthenticator(App);
