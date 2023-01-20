### **A very compact and small library that provides reactivity technology to your code, like vue or react.**
## Usage
```html
<script src="https://remjs.netlify.app/app.min.js"></script>
```
Put this code in your `head` tag
***
After you've included the library, add the code below to your `body` tag
```html
<button on="click: count++" in>
  count is: {count}
</button>

<script>
  RemJs.data({ count:0 })
</script>
```
live preview [click](https://remjs.netlify.app/tests/1)
***
Use special attributes to change the content on the page:
- if - hides or shows the element depending on the condition `if="cond"` 

example: `if="num > 5"`
- on - adds listener events to the element `on="event:your_code"`

example: `on="click:num++"`
- in - is used to insert a variable into the text of an element `<p in>{your_code}</p>`

example: `<p in>your name {userName}</p>`
- css - used to style elements `css="css_property:your_code"`

example: `css="color: isValid ? 'green' : 'red'"`
- bind - use to bind some element value to a variable `bind="element_property:your_code"`

example: `<input bind="value: userName>"`
****
To change variables through a script, use the object that will return app.data()
```html
<h1 in>color is: {color}</h1>

<script> 
  const dt = RemJs.data({ color:'red' })
  
  setTimeout(()=>{ dt.color = 'blue' }, 1000)
</script>
```
live preview [click](https://remjs.netlify.app/tests/2)
