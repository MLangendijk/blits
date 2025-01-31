# Blits - Lightning 3 App Development Framework

## Styling and positioning Elements

The core building block of a Blits template is the Element tag. The Element tag corresponds directly to a node in the Lightning 3 Renderer. You can style and position Elements via _attributes_, much like you would do in HTML.

Blits Elements have a specific set of attributes that can be set, loosely modeled after the properties of a Lightning 3 renderer node. In certain cases Blits provides more developer friendly names or accepts a wider range of values, and transparently takes care of the translation into L3 renderer instructions.

### Positioning and Dimensions

In order to position and set the dimensions of an Element, the following attributes can be used.

  - `x` - the x position of the Element in pixels, relative to it's parent - allows negative values and decimals
  - `y` - the y position of the Element in pixels, relative to it's parent - allows negative values and decimals
  - `z` - the z index of the element (optionally `zIndex` can be used as an alias)
  - `w` - the width of the element in pixels (optionaly `width` can be used as an alias)
  - `h` - the height of the element in pixels (optionaly `height` can be used as an alias)

All positioning and dimension related attributes, when not specified, default to `0`.

```xml
<Element x="100" y="100" w="800" h="400">
  <Element x="40" y="80" w="300" h="300" z="10" />
  <Element x="60" y="120" w="200" h="200" z="0" />
</Element>
```

### Colors

By default Elements have a transparent background color. The `color` attribute can be used to give an Element a color.

For those familiar with Lightning 2: colors have gotten a lot easier with Blits! Under the hood the Lightning 3 renderer still uses the somewhat unfamiliar, but efficient `0xffc0ffee` syntax. In Blits you can specify colors as you are used to in HTML and CSS.

Blits accepts the following color formats and makes sure that they are mapped in a way the Lightning 3 renderer can understand.

- hexadecimal (i.e. `#ff4433`)
- hexadecimal with an alpha channel (i.e `#55553380`)
- hexadecimal shorthands (i.e. `#333`)
- rgb (i.e. `rgb(180, 30, 50)`)
- rgba (i.e `rgba(40, 30, 180, 0.5)`)
- html color names (i.e. `red`, `blue`, `skyblue`, `tomato`)

HSL and HSLA formats are planned to be added in the future.

```xml
<Element w="200" h="200" color="#ff4433" />
<Element w="200" h="200" color="#55553380" />
<Element w="200" h="200" color="#333" />
<Element w="200" h="200" color="rgb(180, 30, 50)" />
<Element w="200" h="200" color="rgba(40, 30, 180, 0.5)" />
<Element w="200" h="200" color="black" />
<Element w="200" h="200" color="red" />
<Element w="200" h="200" color="skyblue" />
```

#### Basic linear gradients

The color attribute can also be used to specify basic linear gradients.

A linear gradient can be defined by specifying an _object literal_ as the `color` attribute instead of a single color. The object can consist of a mix of `top`, `bottom`, `left`, `right` keys, with the color to use for that side as a value. If a specific side isn't specified, it defaults to `transparent`. Again you can use "normal" notation for the colors (like hexadecimal or rgba) and you are free to mix and match formats.

```xml
<Element w="200" h="200" color="{top: 'red', bottom: 'blue'}" />
<Element w="200" h="200" color="{left: 'rgba(255,255,255,.5)', right: '#000'}" />
<Element w="200" h="200" color="{left: '#aaa333', top: 'aqua', bottom: rgb(255,100,20)'}" />
<Element w="200" h="200" color="{bottom: 'black'}" />
```

### Alpha and visibility

The opacity of an Element, can be controlled by setting the `alpha` attribute. This attribute accepts a value between `0` (fully transparent) and `1` (completely visible).

The value of alpha is also being applied recursively to the children of the Element that has its alpha set. If you just want the background color of an Element to be semi-transparent, you should set the alpha channel in the color instead of applying the alpha attribute.

```xml
  <Element w="200" h="200" color="blue" alpha="0.8">
    <Element w="100" h="100" color="red" alpha="0.3" />
  </Element>
```

### Rotation and scaling

If you want to rotate an Element, you can use the `rotation` attribute. The rotation attribute in Blits accepts values in degrees. The rotation of an Element is also automatically applied to any children down the tree.

```xml
<Element w="200" h="200" color="blue" rotation="90">
  <Element w="100" h="100" color="red" rotation="240" />
</Element>
```

For scaling an Element the `scale` attribute is used. This attribute can be any numeric value starting at `0`. The default value is `1`, which means no scaling. Any value below `1` will scale down the element and values greater than `1` will scale the element up.

Similar to rotation, scale is also applied recursively to children down the tree of the Element that has it's `scale` attribute set.

```xml
<Element w="200" h="200" color="blue" scale="0.5" />
<Element w="200" h="200" color="#000" scale="2.3" />
```

### Mounting point

For advanced positioning the `mount` attribute can come in handy. By default when you set the `x` and `y` position of an Element, the _top-left_ corner will be set to that position. But in some cases you may want to align the position starting at a different corner, or even any arbitray point in between.

The `mount` attribute accepts an _object literal_ that allows you to precisely control the mount position on the _x-axis_ and the mount position on the _y-axis_. The default value is `{x: 0, y: 0}`, which refers to the _top-left_ corner.

In order to align the position starting at the _bottom-right_ corner, we would set `mount` to `{x: 1, y: 1}` and `{x: 0.5, y: 0.5}` would align the position at the _center_ of the Element.

If you omit either the `x` or the `y` key from the _object literal_, it's value will default to `0`.

```xml
<Element w="200" h="200" x="20" y="100" color="#333" mount="{x: 0.5, y: 0.8}" />
<Element w="200" h="200" x="800" y="400" color="#333" mount="{y: 1}" />
```

### Pivot point

The pivot point of an Element comes into play when it's rotated or scaled. The pivot point defaults to the center of the Element, which means that when setting `rotation` it rotates around the middle. And when the Element is scaled it scales from the center out.

But sometimes you may want rotate around the left corner, or scale from the right side out. This can be controlled by adding the `pivot` attribute to the Element and, similar to the `mount` attribute, specify an _object literal_ with a `x` and a `y` key.

Both `y` and `x` values should be anything between `0` and `1`, where `{x: 0, y: 0}` sets the pivot point to the _top-left_ corner and `{x: 1, y: 1}` refers to the _bottom-right_ corner. The default pivot value is `{x: 0.5, y: 0.5}` (i.e. the center) and if you omit `x` or `y` in your pivot object, it will default to `0.5`.

```xml
<Element w="200" h="200" x="20" y="100" pivot="{x: 0.5, y: 0.8}" rotation="69" />
<Element w="200" h="200" x="800" y="400" pivot="{y: 1}" scale="3" />
```
