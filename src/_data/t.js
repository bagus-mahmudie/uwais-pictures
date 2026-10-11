module.exports = function () {
  return function t(lang, key, i18n) {
    const parts = key.split(".");
    let cur = (i18n && i18n[lang]) || (i18n && i18n.id) || {};
    for (const p of parts) cur = cur?.[p];
    return cur ?? key;
  };
};
