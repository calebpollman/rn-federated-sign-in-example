/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StyleSheet, Button} from 'react-native';

import {Amplify} from 'aws-amplify';
import {signInWithRedirect, signOut} from 'aws-amplify/auth';
import {ConsoleLogger as Logger} from 'aws-amplify/utils';
import config from '../amplifyconfiguration.json';

import {useDeepLinking, useIsSignedIn} from './utils';

Amplify.configure(config);

Logger.LOG_LEVEL = 'DEBUG' as unknown as null;

function App(): JSX.Element {
  useDeepLinking();

  const {isSignedIn} = useIsSignedIn();

  return (
    <SafeAreaView style={styles.container}>
      <Button
        title={isSignedIn ? 'Sign Out' : 'Go to hosted UI'}
        onPress={() => {
          if (isSignedIn) {
            console.log('Sign Out');
            signOut({global: true});
          } else {
            console.log('To hosted UI');

            signInWithRedirect({provider: 'Google'});
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
  },
});

export default App;
