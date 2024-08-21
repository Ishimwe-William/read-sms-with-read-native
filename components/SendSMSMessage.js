import SmsAndroid from 'react-native-get-sms-android';

export const SendSMSMessage = ({phoneNumber, message}) => {
    SmsAndroid.autoSend(phoneNumber,
        message,
        (fail) => {
            console.log('Failed with this error: ' + fail);
        },
        (success) => {
            console.log('SMS sent successfully');
        },
    );
}
