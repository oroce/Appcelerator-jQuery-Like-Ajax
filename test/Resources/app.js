Ti.include( "/libs/jasmine-1.0.2.js" );
Ti.include( "/libs/jasmine-titanium.js" );

var _ = require( "/libs/underscore" );

var $ = require( "/libs/util" );
// Include all the test files
Ti.include( "/test.js" );

jasmine.getEnv().addReporter(new jasmine.TitaniumReporter());
jasmine.getEnv().execute();