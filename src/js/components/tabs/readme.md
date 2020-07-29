## tabs
The tabs component turns an array of trigger elements and panel elements into clickable tabs.

## Sample Markup
````html
<button class="tab-trigger" aria-controls="tab1">Tab 1</button>
<button class="tab-trigger" aria-controls="tab2">Tab 2</button>

<div>
  <div class="tab-panel" aria-hidden="true" aria-labelledby="tab1">
    Tab 1 Content
  </div>

  <div class="tab-panel" aria-hidden="true" aria-labelledby="tab2">
    Tab 2 Content
  </div>
</div>
````

## Usage
The `initialize()` function takes the trigger elements as the first argument, and the panel elements as the second argument.
````javascript
tabs.initialize(
  document.getElementsByClassName('tab-trigger'),
  document.getElementsByClassName('tab-panel')
);

`````
