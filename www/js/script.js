var app = {
	tesoros: 0,
	umbral: 10,
	diametro: 48,
	alto: 0, 
	ancho: 0,
	vx: 0,
	vy: 0,
	puntos: 0, 
	punText: null,
	bola: null,
	target: null,
	enemigo: null,

	inicio: function () {
		app.alto = document.documentElement.clientHeight;
		app.ancho = document.documentElement.clientWidth;
		app.iniciaJuego();
		app.vigilaSensores();
	},
	iniciaJuego: function () {
		function preload() {
			game.scale.forceOrientation(false, true);
			game.physics.startSystem(Phaser.ARCADE);
			game.stage.backgroundColor = '#f27d0c';
			game.load.image('bola', 'img/PokeBall.png');
			game.load.spritesheet('diamond', 'img/diamondspinning.png', 30, 30, 34);
			game.load.spritesheet('ruby', 'img/rubyspinning.png', 30, 30, 34);
			game.load.spritesheet('sapphire', 'img/sapphirespinning.png', 30, 30, 34);
			game.load.spritesheet('emerald', 'img/emeraldspinning.png', 30, 30, 34);
			game.load.spritesheet('enemigo', 'img/enemigos.png', 120, 116.45, 66);
		}
		function create() {
			app.punText = game.add.text(10, 10, app.puntos, {fontSize: '2em', fill: '#767676'});
			app.bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
			app.bola.health = 1000;
			//app.enemigo = game.add.sprite(app.inicioX(), app.inicioY(), 'enemigo');
			app.target = game.add.group();
			app.enemigo = game.add.group();
			app.enemigo.enableBody = true;
			app.createTarget('ruby');
			app.createTarget('emerald');
			app.createTarget('sapphire');
			app.createTarget('sapphire');
			app.creaEnemigo();
			
			//Situa gemas
			//app.target.diamond = game.add.sprite(app.inicioX(), app.inicioY(), 'diamond');
			//app.target.ruby = game.add.sprite(app.inicioX(), app.inicioY(), 'ruby');
			//app.target.sapphire = game.add.sprite(app.inicioX(), app.inicioY(), 'sapphire');
			//app.target.emerald = game.add.sprite(app.inicioX(), app.inicioY(), 'emerald');
			//app.target.scale.setTo(0.05,0.05);
			//app.target.frame = Math.floor((Math.random() * 88));
			//Anima gemas
			//app.target.diamond.animations.add('spin');
			//app.target.ruby.animations.add('spin');
			//app.target.sapphire.animations.add('spin');
			//app.target.emerald.animations.add('spin');
			//Activa animaciones
			//app.target.diamond.animations.play('spin',20,true);
			//app.target.ruby.animations.play('spin',20,true);
			//app.target.sapphire.animations.play('spin',20,true);
			//app.target.emerald.animations.play('spin',20,true);
			
			game.physics.arcade.enable(app.bola);
			game.physics.arcade.enable(app.target);
			game.physics.arcade.enable(app.enemigo);
			
			app.bola.body.collideWorldBounds = true;
			app.bola.body.bounce.setTo(0.5,0.5);
			app.bola.body.onWorldBounds = new Phaser.Signal();
			app.bola.body.onWorldBounds.add(app.atacado, this);
                        
                        app.cursors = game.input.keyboard.createCursorKeys();
			
		}
		function update() {
                        app.vigilaTeclado();
			app.bola.body.velocity.x = app.vx * -5* (10 + app.tesoros) ;
			app.bola.body.velocity.y = app.vy * 5* (10 + app.tesoros);
			game.physics.arcade.enable(app.target);
			game.physics.arcade.enable(app.enemigo);
			game.physics.arcade.overlap(app.bola,app.target,app.botin,null,this);
			game.physics.arcade.collide(app.bola,app.enemigo,app.atacado,null,this);
                        app.compruebaPuntos();
			app.punText.text = "Puntos: "+app.puntos+" Record: "+localStorage.getItem("record")+" Vida: "+app.bola.health;
			if(app.bola.health < 1){
				app.punText.text = "Has muerto";
				app.bola.kill();
                                setTimeout(app.recomienza, 1000);
			}
		}

		var estados = {preload: preload, create: create, update: update};
		var game = new Phaser.Game(app.ancho, app.alto, Phaser.AUTO, 'phaser', estados)
	},
	createTarget: function(type = null){
		gems = ['diamond','ruby','ruby','emerald','emerald','emerald','sapphire','sapphire','sapphire','sapphire'];
		if(type == null){
			type = gems[Math.floor(Math.random()*gems.length)];
		};
		app.target.create(app.inicioX(), app.inicioY(), type);
		//  Now using the power of callAll we can add the same animation to all coins in the group:
		app.target.callAll('animations.add', 'animations', 'spin', null, 20, true);
		//  And play them
		app.target.callAll('animations.play', 'animations', 'spin');
	},
	creaEnemigo: function(){
		app.enemigo.create(app.inicioX(), app.inicioY(), 'enemigo', Math.floor((Math.random() * 66)));
		app.enemigo.forEach(app.fisicaEnemigo,this);
	},
	fisicaEnemigo: function(e){
		e.body.collideWorldBounds = true;
		e.body.onWorldBounds = new Phaser.Signal();
		e.body.bounce.setTo(0.3, 0.3);
                e.scale.setTo(0.4,0.4);
	},
	botin: function(){
		if(arguments[1].key == 'diamond'){
			app.puntos += 100;
		}else if(arguments[1].key == 'ruby'){
			app.puntos += 25;
		}else if(arguments[1].key == 'emerald'){
			app.puntos += 5;
		}else if(arguments[1].key == 'sapphire'){
			app.puntos += 1;
		};
		app.punText.text = app.puntos;
		app.tesoros++;
		app.target.remove(arguments[1]);
		app.createTarget();
		if(Math.random() > 0.8){
			app.creaEnemigo();
		}
	},
	atacado: function(){
		app.bola.health -= 3;
	},
	pared: function(){
		app.bola.health -= 1;
	},
        compruebaPuntos: function(){
            if(typeof(localStorage.getItem("record")) != 'undefined'){
                if(localStorage.getItem("record") < app.puntos){
                    localStorage.setItem("record", app.puntos);
                };
            }else{
                localStorage.setItem("record", app.puntos);
            };
        },
	inicioX: function () {
		return app.aleatorio(app.ancho - app.diametro);
	},
	inicioY: function () {
		return app.aleatorio(app.alto - app.diametro);
	},
	aleatorio: function (numero) {
		return Math.floor(Math.random() * numero);
	},
	vigilaSensores: function () {
		var opciones = {frequency: 100};
		function onError() {
			console.log('Error');
		}
		function onSuccess(datosAceleracion) {
			app.detectaAgitacion(datosAceleracion);
			app.registraMovimiento(datosAceleracion);
		}
		navigator.accelerometer.watchAcceleration(onSuccess, onError, opciones);
	},
	registraMovimiento: function (datosAceleracion) {
		app.vx = datosAceleracion.x;
		app.vy = datosAceleracion.y;
	},
	detectaAgitacion: function (datosAceleracion) {
		var acX = datosAceleracion.x > app.umbral;
		var acY = datosAceleracion.y > app.umbral;
		if (acX || acY) {
			console.log('agitacion');
		}
	},
        vigilaTeclado: function(){
            if(app.cursors.up.isDown){
                app.vy--;
            };
            if(app.cursors.down.isDown){
                app.vy++;
            };
            if(app.cursors.left.isDown){
                app.vx++;
            };
            if(app.cursors.right.isDown){
                app.vx--;
            };
        },
	recomienza: function(){
		document.location.reload(true);
	}
}
if ('addEventListener' in document) {
	document.addEventListener('deviceready', function () {
		app.inicio();
	}, false);
}
