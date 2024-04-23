# Amity UI-Kit for Web (Open-Source)

## Prerequisites

Before getting started, ensure that you have the following prerequisites installed on your system:

- [Node.js](https://nodejs.org/) LTS version (currently version 20)
- [pnpm](https://pnpm.io/) version 8

## How to install PNPM (Optional)

```
corepack enable pnpm
```

Ref: https://pnpm.io/installation#using-corepack

## Running Storybook (Optional)

To run Storybook and view the UI components in isolation, follow these steps:

1. Clone the Amity UI-Kit repository:

   ```
   git clone https://github.com/AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource.git
   ```

2. Navigate to the cloned repository's directory:

   ```
   cd Amity-Social-Cloud-UIKit-Web-OpenSource
   ```

3. Install the dependencies using pnpm:

   ```
   pnpm install
   ```

4. Create a `.env` file at the root of the project with the following content:

   ```
   STORYBOOK_API_REGION=<API_REGION>
   STORYBOOK_API_KEY=<API_KEY>
   ```

   Replace `<API_REGION>` and `<API_KEY>` with your actual credentials.

5. Run Storybook:

   ```
   pnpm run storybook
   ```

6. Open your browser and navigate to `http://localhost:6006` to view the Storybook interface.

## Installation

To install the Amity UI-Kit together with another project, follow these steps:

1. Clone the repository using the following command:

   ```
   git clone https://github.com/AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource.git
   ```

2. Navigate to the cloned repository's directory:

   ```
   cd ./Amity-Social-Cloud-UIKit-Web-OpenSource
   ```

3. Install the dependencies using pnpm:

   ```
   pnpm install
   ```

4. Build the project:

   ```
   pnpm run build
   ```

5. Navigate to your application's directory:

   ```
   cd <path-to-your-app>
   ```

6. Link the Amity UI-Kit repository to your application using one of the following package managers:
   - NPM:
     ```
     npm link file:<path-to-amity-ui-kit-repository> --save
     ```
   - Yarn (Classic):
     ```
     yarn add file:<path-to-amity-ui-kit-repository>
     ```
   - PNPM:
     ```
     pnpm i file:<path-to-amity-ui-kit-repository>
     ```

## Documentation

For detailed information and guidance on using the Amity UI-Kit, please refer to our comprehensive online documentation available at [https://docs.amity.co](https://docs.amity.co).

If you require further assistance or have any questions, please don't hesitate to contact our dedicated UI-Kit support team at **developers@amity.co**. We are here to help you make the most of the Amity UI-Kit.

## Contributing

We welcome contributions from the community to help improve and enhance the Amity UI-Kit. If you are interested in contributing to this project, please review our [contributing guide](https://github.com/AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource/blob/develop/contributing.md) for guidelines and best practices.

Thank you for choosing the Amity UI-Kit for your web development needs!

### FAQ

Q: I tried to run `pnpm build` and it throws a types error.
A: Try to structure your project to be like this:

```
- your_app
  - src
- Amity-Social-Cloud-UIKit-Web-OpenSource
  - src
```
