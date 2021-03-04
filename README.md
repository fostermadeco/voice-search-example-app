# Voice Search Example App

**NOTE: this only works in iOS not Android**

React Native app built with Expo that uses a Google Cloud Function and Google Speech API to populate Aloglia Instant Search. Only works on iOS.

Note: run this on a recent node version > v14.0.5.

## Getting Started

Rename the `config.json.example` file to `config.json` and replace the cloud function property value. The Aloglia config variables are all set to a test Algolia index that returns results for a fake e-commerce site.

```
yarn
yarn start
```

Because this app uses the Audio API, test it using the Expo app on a device and not the iOS simulator.

See [this repo](https://github.com/fostermadeco/audio-to-text-gcloud) for more info about the Google Cloud Function for the Speech API.