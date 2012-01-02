(function(){

	describe( "Test parameters", function(){
		
		it( "timeout should be 1000", function(){
			var xhr = $.ajax({
				type: "GET",
				url: "http://google.com",
				timeout: 1000
			});
			
			expect( xhr.getTimeout() ).toEqual( 1000 );
			
			//xhr.abort();
		});
		
		it( "http://google.com should be http://google.com", function(){
			var xhr = $.ajax({
				data: {
					"q":"appcelerator"
				},
				url: "http://google.com"
			});
			expect( xhr.url ).toEqual( "http://google.com?q=appcelerator" );
			
			//xhr.abort();
		});
		
		it( "success should be called, make sure you have internet connection", function(){
			
			spyOn( $, "ajax" ).andCallFake( function(options) {
        		options.success();
    		});
			var cbSuccess = jasmine.createSpy();
			
			var cbError = jasmine.createSpy();
			
			var xhr = $.ajax({
				url:"http://httpstat.us/200",
				success: cbSuccess,
				error: cbError
			});
			
			expect( cbSuccess ).toHaveBeenCalled();
	
			expect( cbError ).not.toHaveBeenCalled();
	
			//xhr.abort();
		});
		
		it( "error should be called, make sure you have internet connection", function(){
			
			spyOn( $, "ajax" ).andCallFake( function(options) {
        		options.error();
    		});
			var cbSuccess = jasmine.createSpy();
			
			var cbError = jasmine.createSpy();
			
			var xhr = $.ajax({
				url:"http://httpstat.us/404",
				success: cbSuccess,
				error: cbError
			});
			
			expect( cbSuccess ).not.toHaveBeenCalled();
	
			expect( cbError ).toHaveBeenCalled();
	
			//xhr.abort();
		});
		
		it( "global events", function(){
			
			var cbStart = jasmine.createSpy();
			
			Ti.App.addEventListener( "ajaxStart", cbStart );
			Ti.App.addEventListener( "ajaxStart", function( e ){
				expect( e.url ).toEqual( "http://google.com" );
			});
			var xhr = $.ajax({
				url:"http://google.com"
			});
			
			waits( 10000 );
			
		});
	});

})();