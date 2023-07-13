import React, {useEffect} from 'react';

import {Hub, HubCallback} from '@aws-amplify/core';
import {Linking} from 'react-native';

export const deepLinkHandler = (
  url: string | null | {url: string},
  shouldLog = true,
) => {
  if (!url) {
    return;
  }

  if (shouldLog) {
    console.log('Detected url:', url);
  }
};

export async function useDeepLinking(shouldLog = true): Promise<void> {
  useEffect(() => {
    const listener = Linking.addEventListener('url', deepLinkHandler);
    return listener.remove;
  }, []);

  useEffect(() => {
    Linking.getInitialURL()
      .then(url => {
        console.log('url', url);
      })
      .catch(e => {
        console.log(`Cold boot deep link error: ${e}`);
      });
  });
}

export interface UseIsSignedInParams {
  onSignIn?: () => void;
  onSignOut?: () => void;
}

interface UseIsSignedIn {
  isSignedIn: boolean;
}

const INITIAL_STATE: UseIsSignedIn = {isSignedIn: false};

export function useIsSignedIn({
  onSignIn,
  onSignOut,
}: UseIsSignedInParams = {}): UseIsSignedIn {
  const [output, setOutput] = React.useState<UseIsSignedIn>(
    () => INITIAL_STATE,
  );

  const handleEvents: HubCallback = React.useCallback(
    ({payload}) => {
      switch (payload.event) {
        case 'signIn':
        case 'autoSignIn': {
          onSignIn?.();

          setOutput({isSignedIn: true});
          break;
        }
        case 'signOut': {
          onSignOut?.();

          setOutput({isSignedIn: false});
          break;
        }

        default: {
          // we do not handle other hub events like `configured`.
          break;
        }
      }
    },
    [onSignIn, onSignOut],
  );

  React.useEffect(() => {
    const unsubscribe = Hub.listen('auth', handleEvents, 'useIsSignedIn');
    return unsubscribe;
  }, [handleEvents]);

  return output;
}
