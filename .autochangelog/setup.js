// setup.js
module.exports = (hbs) => {
  hbs.registerHelper('strip', (context, options) => context.replace(options, ''))
}
