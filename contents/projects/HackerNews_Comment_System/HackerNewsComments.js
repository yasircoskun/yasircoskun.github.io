class Post {
    constructor(HN_ID, htmlContent) {
        this.root_id = HN_ID;
        this.htmlContent = htmlContent;
        this.comments = [];
    }

    add_comment(comment) {
        this.comments.push(comment);
    }
}

class HackerNewsPost extends Post {
    constructor(HN_ID, htmlContent) {
        super(HN_ID, htmlContent);
    }
}

class Comment {
    constructor(parent, by, htmlContent, createdAt) {
        this.parent = parent;
        this.by = by;
        this.htmlContent = htmlContent;
        this.createdAt = createdAt;
        this.children = [];
    }
    add_child(child) {
        this.children.push(child);
    }
}

class API {
    constructor() {}
    set_params(parameters) {
        let url = this.url;
        Object.keys(parameters).forEach((parameter_key) => {
            url = url.replace(":" + parameter_key, parameters[parameter_key]);
        });
        return url;
    }

    async get_data(api_parameters) {
        let url = this.set_params(api_parameters);
        let data = (await fetch(url)).json();
        return data;
    }
}

class Algolia_API extends API {
    constructor() {
        super();
        this.url = "https://hn.algolia.com/api/v1/items/:HN_ID";
    }
}

class HTML_Template {
    constructor() {
        this.html_template = `<span id="--[id]--" class="card" data-bs-toggle="collapse" data-bs-target="#replies---[id]--"><span class="dot"></span><span class="bridge"></span>
          <span class="dot2"></span>
          <span class="line"></span>
          <span class="header">
        <span><a href="#--[author]--">--[author]--</a> - <small>--[created_at]--</small></span>
      --[text]--
      </span>
      <div id="replies---[id]--" class="collapse replies">
        </div>
      
    </span>`;
    }

    set_params(data_obj) {
        let temp = this.html_template;
        Object.keys(data_obj).forEach((key) => {
            temp = temp.replaceAll("--[" + key + "]--", data_obj[key]);
        });
        return temp;
    }

    generate(data_obj) {
        let temp_html = this.set_params(data_obj);
        let temp = document.createElement("template");
        temp.innerHTML = temp_html;
        temp.content.firstChild["data_obj"] = data_obj;
        return temp.content.firstChild;
    }
}

class Algolia_HTML_Generator {
    constructor(json) {
        this.template = new HTML_Template();
        let root = this.template.generate(json);
        root = this.createElement(root);
        this.element = root;
    }

    createElement(root) {
        console.log("data_obj" in root);
        console.log(root);
        if ("data_obj" in root) {
            root.data_obj.children.forEach((child) => {
                root.lastElementChild.append(
                    this.createElement(this.createElement(child))
                );
            });
        } else {
            root = this.template.generate(root);
        }
        return root;
    }
}

class Offical_HackerNews_API extends API {
    constructor() {
        super();
        this.url = "http://hn.algolia.com/api/v1/items/:HN_ID";
    }
}

class API_Parameters {
    constructor(HN_ID) {
        this.HN_ID = HN_ID;
    }
}

class API_Factory {
    constructor(api_name) {
        if (api_name == "Algolia") {
            return new Algolia_API();
        } else if (api_name == "Offical_HackerNews_API") {
            return new Offical_HackerNews_API();
        } else {
            return new Algolia_API();
        }
    }
}

class HtmlGenerator {
    constructor(api_name, json) {
        if (api_name == "Algolia") {
            return new Algolia_HTML_Generator(json);
        } else if (api_name == "Offical_HackerNews_API") {
            return new Offical_HackerNews_HTML_Generator(json);
        } else {
            return new Algolia_HTML_Generator(json);
        }
    }
}

class HackerNewsComment {
    constructor(selector, api, HN_ID) {
        this.commentContainer = this.getCommentContainer(selector);
        this.api_name = api;
        this.api = new API_Factory(this.api_name);
        this.api_parameters = new API_Parameters(HN_ID);
        this.getStoryData().then((json) => {
            this.generateHTML(json);
        });
    }
    getCommentContainer(selector) {
        return document.querySelector(selector);
    }
    async getStoryData() {
        return await this.api.get_data(this.api_parameters);
    }
    generateHTML(json) {
        let htmlGenerator = new HtmlGenerator(this.api_name, json);
        this.commentContainer.className += "HackerNewsComments";
        this.commentContainer.appendChild(htmlGenerator.element);

        [...document.querySelectorAll(".line")].forEach((line) => {
            if (line.parentElement.querySelector(".replies").children.length == 0) {
                line.style.display = "none";
            } else {
                line.style.height =
                    line.parentElement
                    .querySelector(".replies")
                    .lastElementChild.querySelector(".dot2")
                    .getBoundingClientRect().top -
                    line.getBoundingClientRect().top +
                    "px";
            }
        });
    }
}