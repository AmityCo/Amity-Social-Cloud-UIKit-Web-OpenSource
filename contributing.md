# Contribution guide

**Important:** before participating in our community, please read our [code of conduct](https://docs.amity.co/support/code-of-conduct). By interacting with this repository, organization, or community you agree to abide by its terms.

Please refer to the [Amity contribution guide](https://docs.amity.co/support/contribute)

# Writing code

## What You'll Need

0. [A bug or feature you want to work on](https://github.com/EkoCommunications/AmityUiKitWeb/labels/help%20wanted)!
1. [A GitHub account](https://github.com/join).
2. A copy of our Ui-Kit. See the next steps for instructions.
3. [Node](https://nodejs.org), which runs JavaScript locally. Current or LTS will both work.
4. An editor.

## Get Started

1. Install node using the version you downloaded from [nodejs.org](https://nodejs.org).
2. Open a terminal.
3. Make a fork&mdash;your own copy&mdash;of our Ui-Kit on your GitHub account, then make a clone&mdash;a local copy&mdash;on your computer. ([Here are some step-by-step instructions](https://github.com/anitab-org/mentorship-android/wiki/Fork%2C-Clone-%26-Remote)).
4. Change to the folder you made while cloning your local copy: `cd AmityUiKitWeb-OpenSource`
5. Install dependencies: `npm ci`
6. Make sure everything builds and tests pass: `npm run storybook`
7. Open your working folder in your editor.
8. Follow the directions below to add and debug a test.

### Storybook

[Storybook](https://storybook.js.org/) is a web application which provides a safe and independent environment to build isolated, testable components and user journey.

In the context of Ui-Kit, we use it in development phase to deploy faster, QA phase to test in isolated context, and production phase as documentation and show-case tool.

### How to work with Storybook

When creating a component, simply create a `Component.stories.js` file containing your storybook stories. More on how to write stories [here](https://storybook.js.org/docs/react/writing-stories/introduction). We have installed the plugins `controls` and `actions`, so make sure you use them wisely.
