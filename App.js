import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import FadeInView from './components/FadeInView';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import { InstantSearch } from 'react-instantsearch-native';
import algoliasearch from 'algoliasearch/lite';

import config from './config';
import SearchBox from './components/SearchBox';
import Hits from './components/Hits';

const searchClient = algoliasearch(
    config.ALGOLIA_APP_ID,
    config.ALGOLIA_API_KEY,
);

const recordingOptions = {
    // android not currently in use. Not getting results from speech to text with .m4a
    // but parameters are required
    android: {
        extension: '.m4a',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
    },
    ios: {
        extension: '.wav',
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
};

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.recording = null;
        this.state = {
            isFetching: false,
            isRecording: false,
            query: '',
        }
    }

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    }

    deleteRecordingFile = async () => {
        try {
            const info = await FileSystem.getInfoAsync(this.recording.getURI());
            await FileSystem.deleteAsync(info.uri)
        } catch(error) {
            console.log("There was an error deleting recording file", error);
        }
    }

    getTranscription = async () => {
        this.setState({ isFetching: true });
        try {
            const info = await FileSystem.getInfoAsync(this.recording.getURI());
            console.log(`FILE INFO: ${JSON.stringify(info)}`);
            const uri = info.uri;
            const formData = new FormData();
            formData.append('file', {
                uri,
                type: 'audio/x-wav',
                name: 'speech2text'
            });
            const response = await fetch(config.CLOUD_FUNCTION_URL, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            console.log(data);
            this.setState({ query: data.transcript });
        } catch(error) {
            console.log('There was an error reading file', error);
            this.stopRecording();
            this.resetRecording();
        }
        this.setState({ isFetching: false });
    }

    startRecording = async () => {
        const { status } = await Permissions.getAsync(Permissions.AUDIO_RECORDING);
        if (status !== 'granted') return;

        this.setState({ isRecording: true });
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: true,
        });
        const recording = new Audio.Recording();

        try {
            await recording.prepareToRecordAsync(recordingOptions);
            await recording.startAsync();
        } catch (error) {
            console.log(error);
            this.stopRecording();
        }

        this.recording = recording;
    }

    stopRecording = async () => {
        this.setState({ isRecording: false });
        try {
            await this.recording.stopAndUnloadAsync();
        } catch (error) {
            // Do nothing -- we are already unloaded.
        }
    }

    resetRecording = () => {
        this.deleteRecordingFile();
        this.recording = null;
    }

    handleOnPressIn = () => {
        this.startRecording();
    }

    handleOnPressOut = () => {
        this.stopRecording();
        this.getTranscription();
    }

    handlQueryChange = (query) => {
        this.setState({ query });
    }



    render() {
        const { isRecording, query, isFetching } = this.state;
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    {isRecording &&
                        <FadeInView>
                            <FontAwesome name="microphone" size={32} color="#48C9B0" />
                        </FadeInView>
                    }
                    {!isRecording &&
                        <FontAwesome name="microphone" size={32} color="#48C9B0" />
                    }
                    <Text>Voice Search</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPressIn={this.handleOnPressIn}
                        onPressOut={this.handleOnPressOut}
                    >
                        {isFetching && <ActivityIndicator color="#ffffff" />}
                        {!isFetching && <Text>Hold for Voice Search</Text>}
                    </TouchableOpacity>
                </View>
                <View style={{paddingHorizontal: 20}}>
                    <InstantSearch

                        indexName={config.ALGOLIA_INDEX}
                        searchClient={searchClient}
                    >
                        <SearchBox query={query} onChange={this.handlQueryChange} />
                        <Hits />
                    </InstantSearch>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#48C9B0',
        paddingVertical: 20,
        width: '90%',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
    }
});
