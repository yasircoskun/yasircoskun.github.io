### HackerNews Comment System

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

#### ToDo List

- [x] HackerNews Comment System for Static Pages
    - [x] Research, material acquisition and plan for the project.
    - [x] HackerNewsComments2MarkDown function will be written
    - [x] It will be included in my own Blog.
    - [ ] write this project as clean and reuseable form
    - [ ] Unofficial APIs for collecting Twitter and Reddit comments will be written with the python flask framework. It will be deployed on Heroku.
