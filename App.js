import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { PermissionsAndroid } from 'react-native';

export default function App() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        requestSMSPermission();
    }, []);

    const requestSMSPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_SMS,
                {
                    title: "SMS Permission",
                    message: "This app needs access to your SMS to display them.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("SMS permission granted");
                listSMS();
            } else {
                console.log("SMS permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const listSMS = () => {
        let filter = {
            box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
            // the next 4 filters should NOT be used together, they are OR-ed so pick one
            read: 0, // 0 for unread SMS, 1 for SMS already read
            _id: 1234, // specify the msg id
            address: '+1888------', // sender's phone number
            body: 'How are you', // content to match
            // the next 2 filters can be used for pagination
            indexFrom: 0, // start from index 0
            maxCount: 10, // count of SMS to return each time
        };

        SmsAndroid.list(
            JSON.stringify(filter),
            (fail) => {
                console.log("Failed with this error: " + fail);
            },
            (count, smsList) => {
                console.log('Count: ', count);
                console.log('List: ', smsList);
                var arr = JSON.parse(smsList);
                setMessages(arr);
            },
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SMS Inbox</Text>
            <FlatList
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text style={styles.address}>{item.address}</Text>
                        <Text style={styles.body}>{item.body}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    messageContainer: {
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    address: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    body: {
        color: '#333',
    },
});
