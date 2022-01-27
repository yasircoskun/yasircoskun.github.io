### XSS via Markdown

Note that if you can inject a markdown, you can inject javascript as well.

for example look [here](https://codebeautify.org/markdown-viewer)

```markdown
<details style='padding-left:0em'>
	<summary>XSS</summary>
    <script>alert('xss')</script>
</details>
```

`- Sayonara`