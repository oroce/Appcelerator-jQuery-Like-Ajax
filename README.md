### Appcelerator CommonJS module, for jQuery like Ajax
Who want write something like this: <code>Ti.Network.createHTTPClient()</code>?

With this module, you can use any shortcut you have used with jQuery.

### Usage

	var _ = require( "underscore" ),
	    $ = require( "util" );

	$.ajax( /* params */ )


There are shorthands of course:

	$.getJSON
	$.post
	$.get
	

### Dependencies
Underscore.js <http://documentcloud.github.com/underscore/>

### Testing
There are some unit tests. Unfortunately for Appcelerator Titanium, there aren't any officially supported test framework.

### Documentation
TODO

### Note
This is one of my projects, to port Backbonejs into Appcelerator.
