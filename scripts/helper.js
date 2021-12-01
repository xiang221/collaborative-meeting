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
  try {
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
  } catch (e) {
    return null;
  }
});

hexo.extend.helper.register("array", function (array) {
  if (Array.isArray(array)) return array;
  else return [];
});

const path = require("path");
hexo.extend.filter.register("before_post_render", function (data) {
  let html_path = data.path.split("/");

  // Set lang
  const lang = html_path[0];
  if (lang == "en" || lang == "zh-tw") {
    data.lang = lang;
  }

  if (data.layout == "false") return data;

  // Remove post folder
  if (html_path[1] == "post") {
    html_path.splice(1, 1);
  }

  // Remove zh-tw folder
  if (html_path[0] == "zh-tw") {
    html_path.shift();
  }

  // Update html file to folder. Ex: list.html => list/index.html
  const filename = html_path[html_path.length - 1];
  if (filename == "index.html") {
    html_path.pop();
  } else {
    html_path[html_path.length - 1] = filename.replace(/.html$/, "");
  }
  return data;
});

hexo.extend.helper.register("embed_link", function (link, options = {}) {
  const url = new URL(link);
  if (
    (url.hostname == "www.youtube.com" && url.pathname == "/watch") ||
    url.hostname == "youtu.be"
  ) {
    if (url.hostname == "www.youtube.com") {
      id = url.searchParams.get("v");
    } else {
      id = url.pathname.split("/")[1];
    }
    link = `https://www.youtube.com/embed/${id}`;
    if (options.autoplay) {
      link += `?autoplay=1&loop=1&mute=1&&playlist=${id}`;
    }
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
  if (result == undefined) return "NULL";

  if (col == "id") return result["id"];
  else if (col == "image") return result["image"];
  else return result[lang][col];
});

hexo.extend.helper.register("tag", function (key, col) {
  var find = hexo.locals.get("pages").filter(function (p) {
    return p.id == "tag";
  }).data;

  if (find.length == 0) return null;

  var data = find[0];
  var lang = this.page.lang;

  var result = data.items.find(
    (p) => p["id"] == key || p["name"]["zh-tw"] == key || p["name"]["en"] == key
  );
  if (result == undefined) return null;

  return result[col][lang] == undefined ? result[col] : result[col][lang];
});


hexo.extend.helper.register("find_case", function (tags) {
  tags.forEach(t => t.post = []);
  const tag_name = tags.map(i => i.name[this.page.lang]);
  console.log(tag_name);
  hexo.locals
  .get("pages")
  .filter((page) => page.layout == "post" && page.lang == this.page.lang && page.publish == "true")
  .forEach((page) => {
    if (page.tags != null)
      page.tags.forEach(t => {
        if (tag_name.includes(t)){
          tags[tag_name.indexOf(t)].post.push(page);
        }
      });
  });
  return tags;
 });