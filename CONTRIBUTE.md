# EkoMessagingSDKUIKitWeb

## Development

### Dependencies

```
npm ci
```

### Start storybook

```
npm run storybook
```

### Building

```
npm run build
```

### Storybook

To run a live-reload Storybook server on your local machine:

```
npm run storybook
```

To export your Storybook as static files:

```
npm run storybook:build
```


Add the component to `index.js` exports if you want the library to export the component.


## Publishing

```
npm publish
```

The `"prepublishOnly": "npm run build"` script in `package.json` will execute before publish occurs, ensuring the `build/` directory and the compiled component library exist.


## How to customize components

### globally
```
  <UiKitProvider customComponents={{ MessageList: CustomMessageList }} theme={{ primary: 'red' }}>
    <ChannelsPage />
  </UiKitProvider>
```


### per component
```
  <ChannelsPage customComponents={{ Message: CustomMessageList }} />
```