### XSS via Markdown

Just keep in mind if you can inject a markdown you can inject it in javascript.

for example look [here](https://codebeautify.org/markdown-viewer)

```markdown
<details style='padding-left:0em'>
	<summary>XSS</summary>
    <script>alert('xss')</script>
</details>
```

`- Sayonara`