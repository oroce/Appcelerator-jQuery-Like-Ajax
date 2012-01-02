(function( root ){
	var Util = function(){
		
	};
	
	var _ = root._;
	
	if (!_ && ( typeof require !== "undefined" ) ){
		_ = require('underscore')._;
	}
	
	
	Util.isFunction = _.isFunction;
	
	Util.extend = _.extend;
	
	Util.defaults = _.defaults;
	
	Util.isArray = _.isArray;

	Util.isObject = _.isObject;	

	Util.each = _.each;

	var isObject = Util.isObject,
		key,
		name;
	
	
	function ajaxStart(settings) {
		Ti.App.fireEvent( "ajaxStart", settings );
	}

	function ajaxStop( settings ) {
		Ti.App.fireEvent( "ajaxStop", settings );
	}

	function ajaxBeforeSend(xhr, settings) {
		Ti.App.fireEvent( "ajaxSend", [ xhr, settings ] );
	}
	
	function ajaxComplete( status, xhr, settings ) {

		settings.complete( xhr, status );
	
		Ti.App.fireEvent( "ajaxComplete", [ xhr, settings ] );
	
		ajaxStop( settings );
	}
	
	function ajaxSuccess(data, xhr, settings) {
		var status = "success";
		
		settings.success( data, status, xhr);
		
		Ti.App.fireEvent( "ajaxSuccess", [ xhr, settings, data ] );
		
		ajaxComplete(status, xhr, settings);
	}
	
	function ajaxError( error, type, xhr, settings ) {
	
		settings.error( xhr, type, error );
		
		Ti.App.fireEvent( "ajaxError", [ xhr, settings, error ] );
		
		ajaxComplete( type, xhr, settings );
	}

	
	
	function empty() {}
	
	Util.ajaxSettings = {
	
		type: "GET",
		
		success: empty,
		
		error: empty,
		
		complete: empty,

		xhr: function () {
			return Ti.Network.createHTTPClient();
		},

		accepts: {
			script: "text/javascript, application/javascript",
			json: "application/json",
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain"
		},
		
		timeout: 10000
	};
	
	Util.ajax = function( options ){
		
		var settings = Util.defaults( options, Util.ajaxSettings );
		
		if( !settings.url ){
			return false;
		}
		
		ajaxStart( settings );


		if ( settings.data && !settings.contentType ){
			settings.contentType = "application/x-www-form-urlencoded";
		}
		
		if ( isObject( settings.data ) ){ 
			settings.data = Util.param( settings.data );
		}
		
		if ( settings.type.match( /get/i ) && settings.data ) {
			var queryString = settings.data;
			
			if ( settings.url.match( /\?.*=/ ) ){
				queryString = "&" + queryString;
			} 
			else if ( queryString[ 0 ] != "?" ) {
				queryString = "?" + queryString;
			}
			
			settings.url += queryString;
		}
		
		var mime = settings.accepts[ settings.dataType ],
			baseHeaders = { 
				"X-Requested-With": "XMLHttpRequest"
			},
			protocol = /^([\-\w]+:)\/\//.test( settings.url ) ? RegExp.$1 : "http:",
			xhr = Util.ajaxSettings.xhr();
		
		if ( mime ){
			baseHeaders.Accept = mime;
		}
		
		settings.headers = Util.extend( baseHeaders, settings.headers || {} );
		
		xhr.onload = function(){
			var result, 
				error = false;
			//if status less than 310 instead of 300
			//XMLHttpRequest cannot handle http redirects,
			//but Appcelerator can (https://github.com/appcelerator/titanium_mobile/pull/141)
			if ( ( xhr.status >= 200 && xhr.status < 310 ) || ( xhr.status === 0 && protocol === "file:" ) ) {
				if ( mime === "application/json" && 
					!( /^\s*$/.test( xhr.responseText ) ) ) {
					
					try { 
						result = JSON.parse( xhr.responseText ); 
					}
					catch ( e ) { 
						error = e; 
					}
				}
				else{
					result = xhr.responseText;
				}
				
				if (error){
					ajaxError( error, "parsererror", xhr, settings );
				}
				else {
					ajaxSuccess( result, xhr, settings );
				}
			
			} 
			else {
				ajaxError( null, "error", xhr, settings );
			}
		};
		
		
		
		xhr.open( settings.type, settings.url );
		
		if ( settings.contentType ){
			settings.headers[ "Content-Type" ] = settings.contentType;
		}
		
		for ( var name in settings.headers ){
			if( settings.headers.hasOwnProperty( name ) ){
				xhr.setRequestHeader( name, settings.headers[ name ] );
			}
		}
		

		xhr.timeout = settings.timeout;
		xhr.send( settings.data );
		return xhr;
		
	};	
		
	Util.get = function( url, success ){ 
		return Util.ajax({ 
					url: url, 
					success: success 
				}); 
	};
	
	Util.post = function( url, data, success, dataType ){
		if ( Util.isFunction( data ) ){
			
			dataType = dataType || success;
			success = data;
			data = null;
		
		}
		
		return Util.ajax({ 
						type: "POST", 
						url: url, 
						data: data,
						success: success, 
						dataType: dataType 
					});
	};
	
	
	Util.getJSON = function( url, success ){
		return Util.ajax({ 
						url: url, 
						success: 
						success, 
						dataType: "json" 
					});
	};
		
		
	var escape = encodeURIComponent;
		
	function serialize( params, obj, traditional, scope ){
		var array = Util.isArray( obj );
		
		Util.each( obj, function( value, key ) {
			if (scope){ 
				key = traditional ? scope : scope + "[" + ( array ? "" : key ) + "]";
			}
			
			if ( !scope && array ){ 
				params.add( value.name, value.value );
			}
			else if ( traditional ? Util.isArray( value ) : isObject( value ) ){
				serialize( params, value, traditional, key );
			}
			else{ 
				params.add(key, value);
			}
		});
	}
		
		
	Util.param = function(obj, traditional){
		var params = [];
		params.add = function( k, v ){ 
			this.push( escape( k ) + "=" + escape( v ) );
		};
		serialize( params, obj, traditional );
		return params
				.join( "&" )
				.replace( "%20", "+" );
	};

	module.exports = Util;

})( this );
