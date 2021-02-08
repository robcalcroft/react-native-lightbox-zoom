# react-native-lightbox-zoom :bulb: :white_square_button: :telescope:

[![npm version](https://badge.fury.io/js/react-native-lightbox-zoom.svg)](https://badge.fury.io/js/react-native-lightbox-zoom)

> React Native lightbox with pinch to zoom, pan, caption support and swipe to dismiss

:warning: `react-native-lightbox-zoom` requires React Native >=0.60

## Install
1. Install React and React Native (skip if you have them installed already)
2. Install `react-native-lightbox-zoom` and its dependency: `yarn add react-native-gesture-handler react-native-lightbox-zoom` - `react-native-gesture-handler` must be installed locally as duplicate copies can break your app.

## Demo video
![react native lightbox zoom demo](https://i.imgur.com/749klgE.gif)

## Props
| Property | Default Value | Description |
|-|-|-|
| `children` | **Required** | The component that is rendered on its own and then rendered in the lightbox when pressed |
| `caption` | undefined | A user given caption string that is shown below the image |
| `onLightboxShowChange` | undefined | Function called when the lightbox is shown or hidden with the argument passed to the call back being `true` or `false`. Uses include changing styles for when the Image component is rendered in lightbox.  |
| `captionStyle` | `{}` | Style object given to the `<Text>` component which renders the caption

## Example
```javascript
import { Image } from 'react-native';
import Lightbox from 'react-native-lightbox-zoom';

function LightBoxDemoApp() {
  function onLightboxShowChange(state) {
    // state is `true` or `false` relating to whether the lightbox
    // is showing or not
  }

  return (
    <Lightbox caption="Cat looking cute" onLightboxShowChange={onLightboxShowChange}>
      {/* Image is what the lightbox is designed for but you can use any component */}
      <Image
        style={[
          {
            width: 350,
            height: 245,
            alignSelf: 'center',
          },
        ]}
        source={{ uri: 'https://placekitten.com/500/350' }}
      />
    </Lightbox>
  )
}
```
