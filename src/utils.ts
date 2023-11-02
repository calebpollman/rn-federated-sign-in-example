import React, {useEffect} from 'react';

import {getCurrentUser} from 'aws-amplify/auth';
import {Hub} from 'aws-amplify/utils';
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
    const listener = Linking.addEventListener('url', url =>
      deepLinkHandler(url, shouldLog),
    );
    return listener.remove;
  }, [shouldLog]);

  useEffect(() => {
    Linking.getInitialURL()
      .then(url => {
        console.log('initial url', url);
      })
      .catch(e => {
        console.log(`Cold boot deep link error: ${e}`);
      });
  }, []);
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

  const handleEvent = React.useCallback(
    (capsule: any) => {
      console.log('hub capsule:', capsule);

      switch (capsule?.payload.event) {
        case 'signedIn':
        case 'autoSignIn': {
          onSignIn?.();

          setOutput({isSignedIn: true});
          break;
        }
        case 'signedOut': {
          onSignOut?.();

          setOutput({isSignedIn: false});
          break;
        }

        default: {
          break;
        }
      }
    },
    [onSignIn, onSignOut],
  );

  React.useEffect(() => {
    getCurrentUser()
      .then(() => {
        setOutput({isSignedIn: true});
      })
      .catch(() => {
        setOutput({isSignedIn: false});
      });

    const unsubscribe = Hub.listen('auth', handleEvent, 'useIsSignedIn');
    return unsubscribe;
  }, [handleEvent]);

  console.log('isSignedIn', output.isSignedIn);

  return output;
}
