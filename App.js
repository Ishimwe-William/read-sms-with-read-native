import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, Button, PermissionsAndroid} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

const MessageItem = React.memo(({address, body}) => (
    <View style={styles.messageContainer} >
        <Text style={styles.address} selectable={true}>{address}</Text>
        <Text style={styles.body} selectable={true}>{body}</Text>
    </View>
));

export default function App() {
    const [messages, setMessages] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

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

    const listSMS = useCallback(() => {
        let filter = {
            box: 'inbox', // Retrieve all inbox messages
        };

        SmsAndroid.list(
            JSON.stringify(filter),
            (fail) => {
                console.log("Failed with this error: " + fail);
            },
            (count, smsList) => {
                console.log('Count: ', count);
                let allMessages = JSON.parse(smsList);

                // Filter messages where address or body contains 'M-Money'
                let filteredMessages = allMessages.filter(message =>
                    message.address.includes('Money') ||
                    message.body.includes('Money')
                );

                setMessages(filteredMessages);
                setRefreshing(false); // Stop refreshing
            },
        );
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        listSMS(); // Refresh the list
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SMS Inbox</Text>
            <TouchableOpacity onPress={handleRefresh}
                              style={{
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: 10,
                                  borderRadius: 5,
                                  borderWidth: 2,
                                  backgroundColor:'transparent',
                                  borderColor: '#459682'
                              }}>
                <Text>Refresh</Text>
            </TouchableOpacity>
            <FlatList
                data={messages}
                extraData={messages} // Ensure FlatList updates with new data
                keyExtractor={(item) => item._id}
                renderItem={({item}) => (
                    <MessageItem address={item.address} body={item.body}/>
                )}
                refreshing={refreshing}
                onRefresh={handleRefresh}
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
