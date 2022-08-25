const fs = require('fs');
const markdownIt = require('markdown-it');

module.exports = function (config) {
  config.setLiquidOptions({
    dynamicPartials: true,
  });

  // Static assets to pass through
  config.addPassthroughCopy('./src/images');
  config.addPassthroughCopy('./src/public');
  config.addPassthroughCopy('./src/styles');
  config.addPassthroughCopy('./src/main.js');


  let markdownLibrary = markdownIt({
    html: true,
    linkify: true
  })
  .use(function(md) {
    // Recognize Mediawiki links ([[text]])
    md.linkify.add("[[", {
      validate: /^\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/,
      normalize: match => {
        const parts = match.raw.slice(2,-2).split("|");
        parts[0] = parts[0].replace(/.(md|markdown)\s?$/i, "");
        match.text = (parts[1] || parts[0]).trim();
        match.url = `/content${parts[0].trim()}/`;
      }
    })
  })

  config.setLibrary("md", markdownLibrary);

  return {
    dir: {
      input: 'src',
      output: '_site',
    },
    passthroughFileCopy: true,
    templateFormats: ['html', 'md', 'liquid'],
    htmlTemplateEngine: 'liquid',
    dataTemplateEngine: 'liquid',
  };
};
