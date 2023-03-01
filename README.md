### **A very compact and small library that provides reactivity technology to your code, like vue or react.**
## [Playground](https://codesandbox.io/s/sharp-bas-o8gzju?file=/index.html)
## Usage
```html
<script src="https://unpkg.com/reemjs"></script>
```
Put this code in your `head` tag
***
After connecting the library, add code below to your tag `body`
```html
<script>
  RemJs.data({
    userName:"Tony",
    num:228,
    status:true,
    arr:[1,2,3,4,5]
  })
</script>
```
The object inside the `data()` function is a list with your variables. You can write any variable and then use them in your HTML
***









```html
<p in>hello {userName}</p>
```
Use a special attribute `in` to insert your variable in HTML element. Write the variables in `{ }` to display them

```html
<p in>your number is {num * 2}</p>
```
In the brackets you can also write any 'JS' expression, but there should be the presence of at least one variable, in the other it will not work
***










## attribute if
```html
<div if="num > 5">
  <p>number more than 5</p>
</div>
```
Use the `if` attribute to hide and show the element depending on the condition
***
## attribute bind
```html
<input bind="checked:status" type="checkbox">
```
Use attribute `bind` to tie the property of an element with your variable
***
## attribute css
```html
<p css="fontSize:num">Lorem ipsum</p>
```
Use attribute `css` to dynamically change the styles of your element
***
## attribute on
```html
<input on="click:num++" type="checkbox">
```
Use attribute `on` to add an event to your HTML element
***
## attribute each
```html
<ul each="arr">
  <li>item {$$}</li>
</ul>
```
Use attribute `each`, to iterate the array. In the middle of the block with this attribute, there should be only 1 element that will be repeated, all content and other elements should be placed in it. Use '$$' to get the current array item
<br>
*This attribute is still in development, many things may not work.
***
## Work in script
```js
const dt = RemJs.data({
  userName:"Tony",
  num:228,
  status:true,
  arr:[1,2,3,4,5]
})

console.log(dt.num)

dt.num = 123
console.log(dt.num)
```
To work with variables in the script, you need to return the object from the function `data()`

****








## Examples


```html
<button on="click: count++" in>
  count is: {count}
</button>

<script>
  RemJs.data({ count:0 })
</script>
```
live preview [click](https://remjs.netlify.app/tests/1)



```html
<h1>
  color is:
  <span css="color:color" in>
    {color}
  </span>
</h1>

<script> 
  const dt = RemJs.data({ color:'red' })
    
  setTimeout(()=>{ dt.color = 'blue' }, 1000)
</script>
```
live preview [click](https://remjs.netlify.app/tests/2)
