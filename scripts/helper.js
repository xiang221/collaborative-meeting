hexo.extend.helper.register("page_url", function (path, options) {
  return this.url_for(path, options).replace(/index\.html$/, "");
});

hexo.extend.filter.register("after_generate", function () {
  hexo.locals
    .get("pages")
    .filter((page) => page.layout == "false")
    .forEach((page) => {
      hexo.route.remove(page.path);
    });
});

hexo.extend.helper.register("__", function (link) {
  var lang = this.page.lang;
  var target = link.split(".");
  var find = hexo.locals.get("pages").filter(function (p) {
    return p.id == target[0] && p.lang == lang;
  }).data;

  if (find.length == 0) return null;

  var result = find[0];
  target.shift();
  target.forEach((i) => {
    result = result[i];
  });
  if (result == undefined) return null;

  return result;
});

const path = require("path");
hexo.extend.filter.register("before_post_render", function (data) {
  let source = data.source.replace(/\.[^/.]+$/, "").replace(/^_posts\//, ""); // md path 不包含副檔名
  let filename = source.split("/").pop().split("."); // 檔名
  let lang = "zh-tw";
  let prefix = "";
  if (filename.length > 1) {
    prefix = filename.pop();
    source = source.replace(/\.[^/.]+$/, ""); // 移除附檔名
    lang = prefix;
  }

  let link = path.join(prefix, source.replace(/index$/, ""), "/");
  data.__permalink = link; // For post
  data.path = link; // For page
  data.lang = lang;
  return data;
});

hexo.extend.helper.register("embed_link", function (link, options) {
  const url = new URL(link);
  if (url.hostname == "www.youtube.com" && url.pathname == "/watch") {
    id = url.searchParams.get("v");
    link = `https://www.youtube.com/embed/${id}`;
    try {
      if (options.autoplay) {
        link += `?autoplay=1&loop=1&mute=1&&playlist=${id}`;
      }
    } catch (e) {}
  } else if (url.hostname == "issuu.com") {
    id = url.pathname.split("/")[3];
    user = url.pathname.split("/")[1];
    link = `https://e.issuu.com/embed.html?pageLayout=singlePage&hideIssuuLogo=true&u=${user}&d=${id}`;
  }
  return link;
});

hexo.extend.helper.register("dept", function (key, col) {
  var find = hexo.locals.get("pages").filter(function (p) {
    return p.id == "department";
  }).data;

  if (find.length == 0) return null;

  var data = find[0];
  var lang = this.page.lang;

  var result = data.items.find(function (p) {
    return (
      p["zh-tw"]["name"] == key ||
      p["zh-tw"]["fullname"] == key ||
      p["en"]["name"] == key ||
      p["en"]["fullname"] == key
    );
  });
  if (result == undefined) return "2222";
  
  if (col == "id")
    return result["id"];
  else
    return result[lang][col];
});
