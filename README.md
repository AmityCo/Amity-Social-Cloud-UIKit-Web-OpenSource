# Amity Ui-Kit for Web (open-source)

## Getting started

### Installation

Here are the steps to install ui-kit together with another project.

1. git clone git@github.com:AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource.git
2. cd ./Amity-Social-Cloud-UIKit-Web-OpenSource
3. npm ci
4. npm link
5. npm link ./`<path-to-your-app>`/node_modules/react ./`<path-to-your-app>`/node_modules/react-dom
6. npm build
7. cd ./`<path-to-your-app>`
8. npm link @amityco/ui-kit-open-source --save

** We need to link react module to react module in destination project so that react is the same instance otherwise we will encounter [issues with react hook](https://medium.com/bbc-product-technology/solving-the-problem-with-npm-link-and-react-hooks-266c832dd019).

### Documentation

Please refer to our online documentation at https://docs.amity.co or contact a Ui-Kit representative at **developers@amity.co** for support.

## Contributing

See [our contributing guide](https://github.com/EkoCommunications/AmityUiKitWeb/blob/develop/CONTRIBUTING.md)   
