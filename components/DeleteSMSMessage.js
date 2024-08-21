import SmsAndroid from 'react-native-get-sms-android';

export const DeleteSMSMessage = ({_id}) => {
    SmsAndroid.delete(_id, (fail) => {
            console.log('Failed with this error: ' + fail);
        },
        (success) => {
            console.log('SMS deleted successfully');
        },
    );
}
