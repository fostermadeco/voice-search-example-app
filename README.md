# Voice Search Example App

React Native app built with Expo that uses a Google Cloud Function and Google Speech API to populate Aloglia Instant Search

## Getting Started

Rename the `config.json.example` file to `config.json` and replace the cloud function property value. The Aloglia config variables are all set to a test Alogolia index that returns results for a fake e-commerce site.

```
yarn
yarn start
yarn ios
```

Because this app uses the Audio API, test it using the Expo app and not the iOS simulator.

See [this repo](https://github.com/fostermadeco/audio-to-text-gcloud) for more info about the Google Cloud Function for the Speech API.