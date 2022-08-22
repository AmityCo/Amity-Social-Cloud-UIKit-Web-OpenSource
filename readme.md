# Community Web UI Kit

UI kit for Community Web client. Forked from [Amity-Social-Cloud-UIKit-Web-OpenSource](https://github.com/AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource).

## Development
### Setting up the local environment

It is recommended to use npm v7 or greater to easily deal with peer dependencies:
```
npm i -g npm@7
```

Install the dependencies with:

```
npm install
```

> Note: If it is your first time installing,
make sure you [register to use](https://github.com/noom/webbees-handbook/blob/dc3d9d4f0aa910f34d553c351f8cbd548910dc92/pages/howto/Private_packages.md) Noom's private packages.

Set required ENV variables:
```bash
STORYBOOK_API_ENDPOINT  # Amity endpoint    -- https://api.us.amity.co
STORYBOOK_API_REGION    # Amity region      -- us
STORYBOOK_API_KEY       # Amity API key
STORYBOOK_USER1         # User ID,User Name -- TEST1345,Testko Testic
STORYBOOK_USER2         # User ID,User Name -- TEST1234,Sam Smith
```


### Running the UIkit locally

The kit is developed locally with Stoybook and running a start script that will start Storybook in watch mode:

```
npm start
```

## Release

1. Create a new branch from `develop`
2. Write your changes
3. Create a new PR with the title following the [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format
4. Merge your PR using `squash and merge` strategy
5. The new package will be released with the version generated based on the title

## Documentation

Please refer to Amity online documentation at https://docs.amity.co or contact a Ui-Kit representative at **developers@amity.co** for support.
