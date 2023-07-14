/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StyleSheet, Button} from 'react-native';

import {Amplify, Auth, Logger} from 'aws-amplify';
import {Authenticator} from '@aws-amplify/ui-react-native';
import config from './aws-exports';

import {useDeepLinking, useIsSignedIn} from './utils';

Amplify.configure(config);

Logger.LOG_LEVEL = 'DEBUG';

function App(): JSX.Element {
  // useDeepLinking();

  const {isSignedIn} = useIsSignedIn();

  console.log('isSignedIn', isSignedIn);

  return (
    // <Authenticator.Provider>
      <SafeAreaView style={styles.container}>
        <Button
          title={isSignedIn ? 'Sign Out' : 'Go to hosted UI'}
          onPress={() => {
            if (isSignedIn) {
              console.log('Sign Out');
              // Auth.signOut({global: true});
              Auth.signOut();
            } else {
              console.log('To hosted UI');

              Auth.federatedSignIn({provider: 'Google'} as any);
            }
          }}
        />
        {/* <Authenticator /> */}
      </SafeAreaView>
    // </Authenticator.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
  },
});

export default App;
