### HackerNews Comment System

Date: Sunday November 28, 2021 

Time: 09:12 PM (Türkiye)

Previously, I developed a project for my blog that integrates comments via `markdown` using the HackerNews Official API. However, the code of that project was too complex, actually the code of this blog page is a bit irregular. (Hope to edit soon)

I rewrote the project so that it can be used by others and is open for expansion. The project is still alpha version and I know the code is dirty. There are unused classes and poorly organized conceptual links. but I want to show my project and try it. I'm new to this platform and this is my first Show HN post.

now i will post this file on my github page and post the link of the post to 'Show HN', i will add HN post id to my blog page.

And we can see comments on my static web page. (if you write something)

#### How to add on my static pages?

```html
<script src="https://cdn.jsdelivr.net/gh/yasircoskun/yasircoskun.github.io@v0.2.1.10-alpha-hnc/contents/projects/HackerNews_Comment_System/HackerNewsComments.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/yasircoskun/yasircoskun.github.io@v0.2.1.10-alpha-hnc/contents/projects/HackerNews_Comment_System/HackerNewsComments.css" />
<div id="CommentArea"></div>
```

```javascript
new HackerNewsComment("#CommentArea", 721); 
```

721 is a HN post id i use it for try.

```javascript
new HackerNewsComment("#CommentArea"); 
```

if your page published on HN you can use this without specify HN ID. it can find your HN post via [Algolia API](https://hn.algolia.com/api).

Here are some use examples in codepen:

- [Pure version](https://codepen.io/yasircoskun/pen/rNzXwJz) (this uses your page style, i use it on my page)
- [Matrix Theme](https://codepen.io/yasircoskun/pen/jOGNzqg)

I'll write more themes and want to add more customization options.

for now,

`- sayonara`

---
<details style='padding-left:0em'>
	<summary>Old scribbles</summary>
        This project is about integrating the HackerNews Comment system into static pages like I am currently publishing. When I searched my blog on search engines, I noticed that it was not displayed in any search engine. I don't know what the reason is, but if I'm writing something, it would be nice if someone read it.

        Sharing links to my articles on HackerNews can help search engines discover my page. Even if it doesn't, I'm sure someone will discover it.

        I thought that if I could see the HackerNews comments on my own website, I could interact with my readers (if any) so I started researching.

        First, I searched for a ready-made library to embed the comments. Although there are people who have worked on this subject before, there is no trace of their work. I'm sure there are pages out there still using those codes. But instead of looking for it, I came up with a better idea. 

        I was going to write it myself, at first I thought I would have to write an API and scrape comments with web scarper, but when I clicked on the API on HackerNews' page, I was directed to a github repo. The project source codes were not available, but a working API link was available.

        https://github.com/HackerNews/API

        ```
        https://hacker-news.firebaseio.com/v0/item/{HN_POST_ID}.json?print=pretty
        ```

        By sending a request to this page with javascript, we can receive the comments and display them in a tree view like in HN. While doing this, I will convert the collected comments to the markdown format, which is often preferred on static pages.

        The following approach can be used to get a tree view in Markdown format.

        ```markdown
        <details style='padding-left:0em'>
            <summary>User: Comment</summary>
            <details style='padding-left:1em'>
                <summary>Other User: Comment</summary>
            </details>
        </details>
        ```

        While researching how I could achieve this view via markdown, I noticed some kind of XSS vector. I want to note it here too.



        To avoid this issue, I used a sanitizer named [DOMPurify](https://github.com/cure53/DOMPurify)  as suggested in the [marked.js repository](https://github.com/markedjs/marked).

        Anyway, I won't babble any more, it will be a nice project :)

        I'd better sleep now.
</details>

#### ToDo List

- [x] HackerNews Comment System for Static Pages
    - [x] Research, material acquisition and plan for the project.
    - [x] HackerNewsComments2MarkDown function will be written
    - [x] It will be included in my own Blog.
    - [ ] write this project as clean and reuseable form
    - [ ] Unofficial APIs for collecting Twitter and Reddit comments will be written with the python flask framework. It will be deployed on Heroku.
