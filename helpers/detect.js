module.exports.register = function (Handlebars, options, params) {
  Handlebars.registerHelper('bodyClass', function (options) {
      var bodyClass = '';
      if (this.page.basename === 'index' || this.page.basename === 'index_ar') {
          bodyClass = 'home__page'
      } else {
          bodyClass = 'inner__page'
      }
      return bodyClass;
  });

  Handlebars.registerHelper('pageClass', function (options) {
      var pageClass = '__'+this.page.basename
      return pageClass;
  });

  Handlebars.registerHelper('dir', function (options) {
      var page = this.page.basename,
          rtl = '';
      if (page.lastIndexOf("_ar") > 0) {
          rtl = 'rtl';
      } else {
          rtl = 'ltr';
      }
      return rtl;
  });

  Handlebars.registerHelper('isRTL', function(condition, options) {
    var pName = this.page.basename;
    if (pName.lastIndexOf("_ar") > 0) {
      return options.fn(this);
    }else{

        return options.inverse(this);
      }
  });

  Handlebars.registerHelper('isPage', function(condition, options) {
      if (this.page.basename === 'index' || this.page.basename === 'index_ar') {
          return options.fn(this);
      } else {
          return options.inverse(this);
      }
    });


  Handlebars.registerHelper('style', function (options) {
      var style = '';
      if (this.page.basename === 'index' || this.page.basename === 'index_ar') {
          style = 'main'
      } else {
          style = 'page'
      }
      return style;
  });

  Handlebars.registerHelper("menuActiveClass", function(v1, options) {
    var lastIndex = this.page.basename.lastIndexOf("_ar");
    var str = this.page.basename.substring(0, lastIndex);
    if (v1 === this.page.basename || v1 === str) {
      return "active";
    }
    return "";
  });

  Handlebars.registerHelper("page_ar", function(v1, options) {
      if (this.page.basename.lastIndexOf("_ar") > 0) {
        var lastIndex = this.page.basename.lastIndexOf("_ar");
        var str = this.page.basename.substring(0, lastIndex);
        return str + ".html";
      } else {
        return this.page.basename + "_ar.html";
      }
    });

    Handlebars.registerHelper("menuLink", function(v1, options) {
      if (this.page.basename.lastIndexOf("_ar") > 0) {
        page_link = v1 + "_ar.html";
      } else {
        page_link = v1 + ".html";
      }
      return page_link;
    });

    Handlebars.registerHelper("langName", function(v1, v2, options) {
      if (this.page.basename.lastIndexOf("_ar") > 0) {
        lang_name = v1;
      } else {
        lang_name = v2;
      }
      return lang_name;
    });
};
