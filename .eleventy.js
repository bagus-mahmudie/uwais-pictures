module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "src/api": "api" });
  eleventyConfig.addPassthroughCopy({ "src/sitemap.xsl": "sitemap.xsl" });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addFilter("sitemapDate", (dateObj) => {
    const date = new Date(dateObj);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  });

  eleventyConfig.addCollection("translated", function (collectionApi) {
    const items = collectionApi.getAll();
    const map = {};

    items.forEach((item) => {
      const key = item.data.translationKey;
      if (!key) return;

      if (!map[key]) {
        map[key] = {
          key,
          idPage: null,
          enPage: null,
        };
      }

      if (item.data.lang === "id") {
        map[key].idPage = item;
      }

      if (item.data.lang === "en") {
        map[key].enPage = item;
      }
    });

    return Object.values(map);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
