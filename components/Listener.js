import { DeviceEventEmitter } from 'react-native';

export const Listener = () =>{
    DeviceEventEmitter.addListener('sms_onDelivery', (msg) => {
        console.log(msg);
    });
}
