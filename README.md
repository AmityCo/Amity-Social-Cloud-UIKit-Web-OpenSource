# Amity UI-Kit for Web (Open-Source)

## Prerequisites

Prior to commencing the installation process, kindly ensure that the following prerequisites are installed on your system:

- [Node.js](https://nodejs.org/) LTS version (currently version 20)
- [pnpm](https://pnpm.io/) version 8

## (Optional) Installation of PNPM

To install PNPM, please execute the following command:

```
corepack enable pnpm
```

Reference: https://pnpm.io/installation#using-corepack

## Installation

To integrate the Amity UI-Kit with your existing project, please follow the steps outlined below:

1. Clone the repository by executing the following command:

   ```
   git clone https://github.com/AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource.git
   ```

2. Navigate to the directory of the cloned repository:

   ```
   cd ./Amity-Social-Cloud-UIKit-Web-OpenSource
   ```

3. Install the required dependencies using pnpm:

   ```
   pnpm install
   ```

4. Build the project:

   ```
   pnpm run build
   ```

5. Pack the project:

   ```
   pnpm pack
   ```

   This command will generate a file named `amityco-ui-kit-open-source-<version>.tgz`.

6. Navigate to the directory of your application:

   ```
   cd <path-to-your-app>
   ```

7. Link the Amity UI-Kit repository to your application using one of the following package managers:

   - NPM:

     ```
     npm i file:<path-to-amity-ui-kit-repository>/<path-to-tgz-file> --save
     ```

   - Yarn (Classic):

     ```
     yarn add file:<path-to-amity-ui-kit-repository>/<path-to-tgz-file>
     ```

   - PNPM:

     ```
     pnpm i file:<path-to-amity-ui-kit-repository>/<path-to-tgz-file>
     ```

## Documentation

For comprehensive information and guidance on utilizing the Amity UI-Kit, kindly refer to our extensive online documentation available at [https://docs.amity.co](https://docs.amity.co).

Should you require further assistance or have any inquiries, please do not hesitate to contact our dedicated UI-Kit support team at **developers@amity.co**. We are committed to assisting you in maximizing the potential of the Amity UI-Kit.

## Contributing

We cordially invite contributions from the community to assist in the improvement and enhancement of the Amity UI-Kit. If you are interested in contributing to this project, kindly review our [contributing guide](https://github.com/AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource/blob/develop/contributing.md) for guidelines and best practices.

Thank you for selecting the Amity UI-Kit for your web development requirements!

### Frequently Asked Questions (FAQ)

Q: I encountered a types error while attempting to run `pnpm build`.
A: Please ensure that your project structure resembles the following:

```
- your_app
  - src
- Amity-Social-Cloud-UIKit-Web-OpenSource
  - src
```

Q: The modifications I made to the code do not appear to be applied.
A: Please attempt to execute `npm cache clean` or `npm cache clean --force` to resolve this issue.
