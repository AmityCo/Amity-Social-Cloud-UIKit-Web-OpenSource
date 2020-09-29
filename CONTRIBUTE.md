# UiKit for Web contribution guide

## Requirements

- git
- nodejs

## Getting started

1. `git clone git@gitlab.com:upstra/web/ui-kit.git`
2. `cd ui-kit`
3. `npm install`
4. `npm run storybook`

## Contribution flow

1. `git checkout origin/develop && git checkout -b feature/UKT-xxx`
2. Do some magic ~
3. `git push origin`
4. Submit your PR and attach labels "Awaiting review" and "Awaiting QA"
5. Pass your ticket to "Ready to QA" in JIRA
6. When the code review is validated, the reviewer will remove the "Awaiting review" label. If there is no other label left, the reviewer will add the label "To be Merged"
7. When the QA validates the feature, **you** will remove the "Awaiting QA" label. If there is no other label left, **you** should add the label "To be Merged"

Whenever appropriate, the "To be merged" shall be merged at once.

## About Storybook

[Storybook](https://storybook.js.org/) is a web application which provides a safe and independent environment to build isolated, testable components and user journey.

In the context of Ui-Kit, we use it in development phase to deploy faster, QA phase to test in isolated context, and production phase as documentation and show-case tool.

### How to work with Storybook

When creating a component, simply create a `Component.stories.js` file containing your storybook stories. More on how to write stories [here](https://storybook.js.org/docs/react/writing-stories/introduction). We have installed the plugins `controls` and `actions`, so make sure you use them wisely.

## Publishing

The publication of the library is entirely automated and controlled by CI. To publish a version, the only necessary command is `npm version` with the according version increment, as per `semver` semantics (`major`, `minor`, `patch`). **The patches can be released freely but the minor and major must be approved by a project manager before release.**
