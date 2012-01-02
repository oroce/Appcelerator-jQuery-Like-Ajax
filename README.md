### Appcelerator CommonJS module, for jQuery like Ajax
Who want write something like this: <code>Ti.Network.createHTTPClient()</code>

With this module, you can use any shortcut you have used with jQuery

### Usage
<code>
var _ = require( "underscore" ),
    $ = require( "util" );

$.ajax( /* params */ )
</code>

There are shorthands of course:
<code>
$.getJSON
$.post
$.get
</code>

### Dependencies
Underscore.js <http://documentcloud.github.com/underscore/>

### Testing
There are some unit tests. Unfortunately for Appcelerator Titanium, there aren't any officially supported testing engine.

### Documentation
TODO

### Note
This is part one of my projects, to port Backbonejs into Appcelerator.

  
