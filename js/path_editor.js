$(function() 
{
	// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
			      return  window.requestAnimationFrame       || 
			              window.webkitRequestAnimationFrame || 
			              window.mozRequestAnimationFrame    || 
			              window.oRequestAnimationFrame      || 
			              window.msRequestAnimationFrame     || 
			              function(/* function */ callback, /* DOMElement */ element){
			                window.setTimeout(callback, 1000 / 60);
			              };
			    })();

	var equationHandler = function( t ) {};

	var application = {
		resultContext 		: null,
		precision 			: 80,
		amplitude			: 58,
		pass				: 600,
		speed			  	: 260,
		simulations 	  	: [],
		currentSimulation 	: 0
	};

	var renderer = {
		context : null,
		size 	: { w : 800, h : 600 	},
		center  : { x :   0, y : 0 		} 
	};

	var object = {
		graphicElement 	: null,
		position 		: { x : 0, y : 0 },
		velocity 		: { x : 1, y : 1.5 },
		amplitude 		: 50
	};

	var variables = {
		a : 1.0,
		b : 2.0,
		c : 3.0,
		d : 4.0,
		e : 5.0,
		f : 6.0
	};
	var v = variables;	//< Shortcut.

	// Simulation 1.	
	application.simulations[application.simulations.length] = {
		name 			: "Courbe de Trochoïdes",
		variablesCount  : 2,
		patterns		: [[ 2.0, 5.0 ]],
		method 			: function( t )
		{
			object.position.x = v.a * Math.cos( t ) + Math.cos( v.b * t );
			object.position.y = v.a * Math.sin( t ) - Math.sin( v.b * t );
		}
	};

	// Simulation 2.	
	application.simulations[application.simulations.length] = {
		name 			: "Courbe de Lissajous",
		variablesCount  : 4,
		patterns		: [[ 5.0, 3.0, 5.0, 2.0 ]],
		method 			: function( t )
		{
			object.position.x = v.a * Math.sin( v.c * t + v.a);
			object.position.y = v.b * Math.cos( v.d * t + v.b);
		}
	};

	// Simulation 3.	
	application.simulations[application.simulations.length] = {
		name 			: "Courbe de Wallis",
		variablesCount  : 2,
		patterns		: [[ 2.0, -3.0 ]],
		method 			: function( t )
		{
			object.position.x = v.a * ( 1 + Math.sin(t) );
			object.position.y = (v.a * 2) / v.b * ( ( 1 + Math.sin(t) ) * Math.cos( t ) ) ;
		}
	};

	// Simulation 4.	
	/*application.simulations[application.simulations.length] = {
		name 			: "Courbe de Piriforme",
		variablesCount  : 2,
		patterns		: [[ 3.0, 3.0 ]],
		method 			: function( t )
		{
			object.position.x = ( v.a * t ) / Math.pow( (1 + t), v.b ) ;
			object.position.y = Math.pow( (v.a * t), 2 ) / Math.pow( (1 + t), v.b ) ;
		//	x = a(1 + sin t) , y = a2/b   (1 + sin t)cos t
		}
	};*/

	// Simulation 5.	
	application.simulations[application.simulations.length] = {
		name 			: "Hypocycloïde",
		variablesCount  : 2,
		patterns		: [[ 3.0, 3.0 ]],
		method 			: function( t )
		{
			object.position.x = v.a * Math.cos(t) + v.b * Math.cos( v.a * t ); 
			object.position.y = v.b * Math.sin(t) + v.a * Math.sin( v.b * t ); 
		}
	};

	// Simulation 7.	
	application.simulations[application.simulations.length] = {
		name 			: "???",
		variablesCount  : 2,
		patterns		: [[ 3.0, 3.0 ]],
		method 			: function( t )
		{
			object.position.x = Math.cos( v.a * t ) - v.b * Math.cos( t ) + 1 ;
			object.position.y = Math.sin( t * v.a * t) - v.b * Math.sin( t );
		}
	};

	function init()
	{
		// Init renderer.
		renderer.context 	= Raphael( "editor", renderer.size.w, renderer.size.h );
		renderer.center.x   = renderer.size.w / 2;
		renderer.center.y   = renderer.size.h / 2;

		// Create object.
		object.graphicElement = renderer.context.circle( 50, 40, 10 );
		object.graphicElement.attr("fill", "#f00");
		object.graphicElement.attr("stroke", "#000");
		object.graphicElement.attr("opacity", 1);
	};

 	var time = 0;
	function loop()
	{
		time++;

		requestAnimFrame( loop );
		update( time / application.speed );
			draw();
	};

	function update( t )
	{
		try 
		{
		equationHandler( t );
		} 
		catch (e) { }
	};

	function draw()
	{
		try 
		{
			object.graphicElement.attr(
			{
				'cx' : (object.position.x * application.amplitude) + renderer.center.x,
				'cy' : (object.position.y * application.amplitude) + renderer.center.y 
			});
			object.graphicElement.animate({hsb: [Math.random(), Math.random(), Math.random()]}, 1e3);
		} 
		catch (e) { }
	};

	function drawPath()
	{
		var data = [];
		for( var i = 0; i < application.pass; i++ )
		{
			equationHandler( i / application.precision );
			data[data.length] = { x :  (object.position.x * application.amplitude) + renderer.center.x, y :  (object.position.y * application.amplitude) + renderer.center.y };
		}

		// Reset
		object.position.x = 0;
		object.position.y = 0;

		// Generate path's string.
		var prePath = "M";
		var path 	= "";
		for(var i = 0; i < data.length; i++ )
		{
			path += "L " + data[i].x + " " + data[i].y;
		}

		path = prePath + data[0].x + " " + data[0].y + path;

		// Draw it.
		if( application.resultContext != null )	{
			application.resultContext.remove();
		}
		application.resultContext = renderer.context.path( path );
		application.resultContext.attr("stroke", "#000");

		// Fix Z-index.
		object.graphicElement.toFront();
	};

	function initInterface()
	{
		// Amplitude slider.
		 $( "#amplitude" ).slider({
		 	min 	: 20,
		 	max 	: 100,
		 	value	: application.amplitude,
		 	slide: function( event, ui )
		 	{
		 		application.amplitude = ui.value;
		 		drawPath();
		 	}
		 });

		// Amplitude slider.
		 $( "#speed" ).slider({
		 	min 	: 50,
		 	max 	: 490,
		 	value	: application.speed,
		 	slide: function( event, ui )
		 	{
		 		application.speed = 500 - ui.value;
		 	}
		 });

		// Variable A.
		 $( "#v_a" ).slider({
		 	min 	: -10,
		 	max 	: 10,
		 	value	: 0,
		 	slide: function( event, ui )
		 	{
		 		v.a = ui.value;
		 		$('#l_a').html('(' + v.a + ')');
				drawPath();
		 	}
		 });

		// Variable B.
		 $( "#v_b" ).slider({
		 	min 	: -10,
		 	max 	: 10,
		 	value	: 0,
		 	slide: function( event, ui )
		 	{
		 		v.b = ui.value;
		 		$('#l_b').html('(' + v.b + ')');
				drawPath();
		 	}
		 });

		// Variable C.
		 $( "#v_c" ).slider({
		 	min 	: -10,
		 	max 	: 10,
		 	value	: 0,
		 	slide: function( event, ui )
		 	{
		 		v.c = ui.value;
		 		$('#l_c').html('(' + v.c + ')');
				drawPath();
		 	}
		 });

		// Variable A.
		 $( "#v_d" ).slider({
		 	min 	: -10,
		 	max 	: 10,
		 	value	: 0,
		 	slide: function( event, ui )
		 	{
		 		v.d = ui.value;
		 		$('#l_d').html('(' + v.d + ')');
				drawPath();
		 	}
		 });


		// Amplitude slider.
		 $( "#speed" ).slider({
		 	min 	: 50,
		 	max 	: 490,
		 	value	: application.speed,
		 	slide: function( event, ui )
		 	{
		 		application.speed = 500 - ui.value;
		 	}
		 });

		// Code editor.
		$('#v_code').click( function()
		{
			var code = application.simulations[application.currentSimulation].method.toString();

			// break the textblock into an array of lines
			var lines = code.split('\n');
			lines.splice(0 , 2);
			lines.splice( lines.length - 1 , lines.length);
			var newtext = lines.join('\n');
			newtext = newtext.replace(/\t/g, '').split('\r\n');

			$('#codeeditor textarea').val(newtext  );
			$('#codeeditor').fadeToggle();
		});

		$('#codeeditor button').click( function()
		{
			var code = $(this).parent().children('textarea').val();
			try 
			{
				var funcStr = "var func = function( t ) \n { \n" + code + " \n };";
				eval( funcStr );

				application.simulations[application.currentSimulation].method = func;

				loadSimulation(application.currentSimulation);
				drawPath();
			} 
			catch (e) 
			{
			    if (e instanceof SyntaxError) {
			        alert(e.message);
			    }
			}
		});

		$('#closeeditor').click(function(){

			$('#codeeditor').fadeToggle();
		});

		// Add simulations
		var list = $('#simulation');
		for( var i = 0; i < application.simulations.length; i++ )
		{
			list.append('<option value="' + i + '">' + application.simulations[i].name + '</option>');
		}

		list.change( function()
		{
			var id = $(this).val();
			loadSimulation( id );
		});
	};

	function loadSubSimulation( simulation, patternId )
	{
		var p = simulation.patterns[patternId];
		for( var i = 0; i < p.length; i++ )
		{
			v[i] = p[i];
		}

		$("#v_a").slider( "value", v.a );
		$("#v_b").slider( "value", v.b );
		$("#v_c").slider( "value", v.c );
		$("#v_d").slider( "value", v.d );
	};

	function loadSimulation( id )
	{
		if( id > application.simulations.length ) {
			alert('This simulation does not exist!')
		}

		application.currentSimulation = id;

		var simulation = application.simulations[id];
		loadSubSimulation( simulation, 0 );
		equationHandler = simulation.method;
		drawPath();
	};

	// Start scene.
	init();
	initInterface();

	// Default animation.
	loadSimulation( 0 );

	// Run the machine!
	drawPath();
	loop();
});