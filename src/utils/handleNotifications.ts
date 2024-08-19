import messaging from '@react-native-firebase/messaging';
import {HandleUserAPI} from '../apis/handleUserAPI';

export class Notifications {
  static CheckPermision = async () => {
    const authStatus = await messaging().requestPermission();

    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      this.GetFcmToken();
    } else {
      console.log('Can not permision messaging');
    }
  };

  static GetFcmToken = async () => {
    const token = await messaging().getToken();
    await HandleUserAPI.Info(
      '/update-fcmtoken',
      {
        token,
      },
      'put',
    );
  };
}
