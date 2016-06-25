var Konva = require('../../node_modules/konva/konva.js');
require('./input.js');

var canvasWidth = 600,//window.innerWidth;
	canvasHeight = 500,//window.innerHeight;
	direction = 'right',
	arrowDirection = '',
    arrowSpeed  = 6,
	wizardSpeed = 0.5,
	wizards = [], // коллекция врагов
	lights = [], // массив объектов молний
	health = 100;
	arrows = [],
    health = 100,
    countEnemies = 2,
    lastFire = Date.now(), // для расчета стрельбы
    score = 0;
 
var stage = new Konva.Stage({
	container: 'container',
	width: canvasWidth,
	height: canvasHeight
}); 
 
var layer = new Konva.Layer();

var simpleText = new Konva.Text({
    x: 15,
    y: 15,
    text: 'text',
    fontSize: 18,
    fill: 'black'
});
 
layer.add(simpleText);

/* анимация каждого кадра игрока прописана в координатах
по принципу x, y, width, height
*/
var animationsWizard = {};
var animationsLight = {
    light: [
        2, 405, 40, 39,
        46, 405, 40, 39,
        90, 405, 40, 39,
        134, 405, 40, 39,
        178, 405, 40, 39,
        222, 405, 40, 39,
        266, 405, 40, 39,
        310, 405, 40, 39,
        354, 405, 40, 39,
        398, 405, 40, 39,
        442, 405, 40, 39,
        486, 405, 40, 39,
        530, 405, 40, 39
    ]
}

var animationsWizard = {
	walkRight: [
	2, 131, 48, 49,
	52, 131, 48, 49,
	102, 131, 48, 49,
	152, 131, 48, 49,
	202, 131, 48, 49,
	252, 131, 48, 49,
	302, 131, 48, 49,
	352, 131, 48, 49,
	402, 131, 48, 49,
	452, 131, 48, 49,
	502, 131, 48, 49,
	552, 131, 48, 49,
	602, 131, 48, 49,
	652, 131, 48, 49,
	702, 131, 48, 49,
	752, 131, 48, 49,
	802, 131, 48, 49,
	752, 131, 48, 49
  ],
  walkLeft: [
	2, 191, 48, 49,
	52, 191, 48, 49,
	102, 191, 48, 49,
	152, 191, 48, 49,
	202, 191, 48, 49,
	252, 191, 48, 49,
	302, 191, 48, 49,
	352, 191, 48, 49,
	402, 191, 48, 49,
	452, 191, 48, 49,
	502, 191, 48, 49,
	552, 191, 48, 49,
	602, 191, 48, 49,
	652, 191, 48, 49,
	702, 191, 48, 49,
	752, 191, 48, 49,
	802, 191, 48, 49,
	752, 191, 48, 49
  ],
  idleRight: [ // игрок стоит и смотрит вправо
	2, 10, 48, 49,
	52, 10, 48, 49,
	102, 10, 48, 49,
	152, 10, 48, 49,
	202, 10, 48, 49,
	252, 10, 48, 49,
	302, 10, 48, 49,
	352, 10, 48, 49
  ],
  idleLeft: [
	2, 72, 48, 49,
	52, 72, 48, 49,
	102, 72, 48, 49,
	152, 72, 48, 49,
	202, 72, 48, 49,
	252, 72, 48, 49,
	302, 72, 48, 49,
	352, 72, 48, 49
  ],
  attackLeft: [
    25, 250, 48, 67,
    123, 250, 48, 67,
    221, 250, 48, 67,
    319, 250, 48, 67,
    417, 250, 48, 67,
    515, 250, 48, 67,
    613, 250, 48, 67,
    711, 250, 48, 67,
    809, 250, 48, 67,
    907, 250, 48, 67,
    1005, 250, 48, 67,
    1103, 250, 48, 67
  ],
  attackLeft: [
    25, 327, 48, 67,
    123, 327, 48, 67,
    221, 327, 48, 67,
    319, 327, 48, 67,
    417, 327, 48, 67,
    515, 327, 48, 67,
    613, 327, 48, 67,
    711, 327, 48, 67,
    809, 327, 48, 67,
    907, 327, 48, 67,
    1005, 327, 48, 67,
    1103, 327, 48, 67
  ],
  attackRight: [
    25, 250, 48, 67,
    123, 250, 48, 67,
    221, 250, 48, 67,
    319, 250, 48, 67,
    417, 250, 48, 67,
    515, 250, 48, 67,
    613, 250, 48, 67,
    711, 250, 48, 67,
    809, 250, 48, 67,
    907, 250, 48, 67,
    1005, 250, 48, 67,
    1103, 250, 48, 67
  ],
  die: [
    2, 460, 48, 50,
    54, 460, 48, 50,
    104, 460, 48, 50,
    154, 460, 48, 50,
    204, 460, 48, 50,
    254, 460, 48, 50
  ]
};

animationsPlayer = {
  idleRight: [
    0, 20, 50, 51,
    53, 20, 50, 51,
    107, 20, 50, 51
  ],
  idleLeft: [
    0, 79, 50, 51,
    53, 79, 50, 51,
    107, 79, 50, 51
  ],
  walkLeft: [
    161, 79, 50, 51,
    214, 79, 50, 51,
    267, 79, 50, 51,
    319, 79, 50, 51
  ],
  walkRight: [
    161, 20, 50, 51,
    214, 20, 50, 51,
    267, 20, 50, 51,
    319, 20, 50, 51
  ],
  attackRight: [
    371, 20, 50, 51,
    435, 20, 50, 51,
    547, 20, 50, 51
  ],
  attackLeft: [
    378, 79, 50, 51,
    435, 79, 50, 51,
    488, 79, 50, 51
  ]
};
 
function moveBullet() {
    // молния
    var i;
    for(i = 0; i < lights.length; i++) {
        if (lights[i].frameIndex() > (animationsLight.light.length) / 4 - 2) {
            lights[i].setX(-10000); // сдвигаем за край экрана
            lights.splice(i,1); //удаляем 1 эл. с индексом i
        }
    }

    // Update all the arrows
    for(var i = 0; i < arrows.length; i++) {
        var arrow = arrows[i];
 
        switch(arrow.direction) {
        case 'right': arrow.setX(arrow.attrs.x + arrowSpeed); 
            break;
        default:
            arrow.setX(arrow.attrs.x - arrowSpeed);
        }
         
        // удаляем стрелы за экраном
        if (arrow.attrs.x < 0 || arrow.attrs.x > canvasWidth) {
            arrows.splice(i, 1);
            arrow.setX(-1000);
            i--;
        }
    }
 
}

function animationAttack() {
     
    if (player.frameIndex() >= 2) {
        makeBullet('arrow');
    }
     
}

function gameOver() {
    gameLoop.stop();
    document.getElementById('score').innerText = score;
    document.getElementById('dead').style.display = "block";
    document.getElementById('container').style.display = "none";
}

function getHealth(count) {
    if (health <= 0) {
        health = 0;
        gameOver();
    }
    health += 0.1;
     
    if (health > 100) {
        health = 100;
    }
     
}

function makeEnemy(type, x, y) {
 
    if (type == 'wizard') {
        wizard = new Konva.Sprite({ // так же, как и для игрока
            x: x,
            y: y,
            image: wizardImg,
            animation: 'idleRight',
            animations: animationsWizard,
            frameRate: 7,
            frameIndex: 0
        });
        wizard.direction = 'right';
        wizard.action = '';
        wizard.mana = 0;
         
        wizards.push(wizard); // добавляем врага в список
    }
 
     // add the shape to the layer
    layer.add(wizard);
    // add the layer to the stage
    stage.add(layer);
    // start sprite animation
    wizard.start();
}

function makeBullet(type, x, y) {
     
    if (type == 'light') {
        light = new Konva.Sprite({
            x: x,
            y: y,
            image: lightImg,
            animation: 'light',
            animations: animationsLight,
            frameRate: 7,
            frameIndex: 0
        });
        lights.push(light);
        // add the shape to the layer
        layer.add(light);
        // add the layer to the stage
        stage.add(layer);
        // start sprite animation
        light.start();
         
    }

    if (type == 'arrow') {
        var x = player.attrs.x;
            var y = player.attrs.y;
        
        var arrow = new Konva.Image({
            x: player.attrs.x + 25,
            y: player.attrs.y + 20,
            image: playerImg,
            width: 30,
            height: 10
        });
         
        // вырезаем стрелу из изображения игрока
        arrow.crop({
          x: 7,
          y: 150,
          width: 30,
          height: 10
        });
         
        arrow.direction = 'left';
        player.attrs.animation = 'idleLeft';
        if (direction == 'right') {
            arrow.direction = 'right';
            player.attrs.animation = 'idleRight';
         
            arrow.crop({
              x: 7,
              y: 137,
              width: 30,
              height: 10
            });
             
        }
         
        player.arrows--;        
        player.frameIndex(0);
         
        arrows.push(arrow);
 
         // add the shape to the layer
        layer.add(arrow);
        // add the layer to the stage
        stage.add(layer);
 
            lastFire = Date.now();
    }
}

function actEnemies() {
 
    for(i = 0; i < wizards.length; i++) {
        wizards[i].mana++;
        if (wizards[i].mana > 200 && wizards[i].attrs.animation == 'idleLeft') {
            wizards[i].action = 'makeLight';
            wizards[i].attrs.animation = 'attackLeft';
            wizards[i].setY(wizards[i].attrs.y - 18);
            wizards[i].mana -= 200;
            wizards[i].frameIndex(0);
        }
        if (wizards[i].mana > 200 && wizards[i].attrs.animation == 'idleRight') {
            wizards[i].action = 'makeLight';
            wizards[i].attrs.animation = 'attackRight';
            wizards[i].setY(wizards[i].attrs.y - 18);
            wizards[i].mana -= 200;
            wizards[i].frameIndex(0);
        }
         
        // кастование молнии
        if (wizards[i].action == 'makeLight' && wizards[i].frameIndex() > 10) {
            wizards[i].setY(wizards[i].attrs.y + 18);
            makeBullet('light', Math.floor((Math.random() * 200) + player.attrs.x- 100), Math.floor((Math.random() * 200) + player.attrs.y - 100));
            wizards[i].action = 'stay';
            wizards[i].frameIndex(0);
        }
 
 
        if (wizards[i].action == 'die' && wizards[i].frameIndex() > 4) {
            wizards[i].setX(-1000);
            wizards.splice(i, 1);
            score += 100;
            updateDifficult();
        }       
    }
}

function updateDifficult () {
    countEnemies = score / 1000;
    console.log(countEnemies)
 
    while (wizards.length < countEnemies) {
        if (getRandomInt(0, 1)) {
            makeEnemy('wizard', -50, getRandomInt(50, 450));                        
        }
        else {
            makeEnemy('wizard', 600, getRandomInt(50, 450));
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function moveEnemies() {
    // перебираем все элементы в массиве
    wizards.forEach(function(wizard) {
    	if (wizard.action != 'makeLight' && wizard.action != 'makeLight' && wizard.action != 'die') {
	        // чтобы враг смотрел в нужную сторону, прописали анимацию
	        if (wizard.direction == 'right') {
	            wizard.attrs.animation = 'idleRight';
	        }
	        else {
	            wizard.attrs.animation = 'idleLeft';
	        }
	         
	        // идем слева направо
	        if (wizard.attrs.x < 30) {
	            wizard.setX(wizard.attrs.x + wizardSpeed);
	            wizard.attrs.animation = 'walkRight';
	            wizard.direction = 'right';
	            wizard.action = 'go'; // обозначение действия, понадобится в дальнейшем
	        }
	 
	        // идем справа налево
	        if (wizard.attrs.x > canvasWidth - 70) {
	            wizard.setX(wizard.attrs.x - wizardSpeed);
	            wizard.attrs.animation = 'walkLeft';
	            wizard.direction = 'left';
	            wizard.action = 'go';
	        }
    	}
    });
 
}

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}
 
function boxCollides(pos, size, pos2, size2) {  
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}
 
function checkCollisions() {
     
    var pos = [],
        posPlayer = [],
        size = [],
        sizePlayer = [],
        enemyPos = [],
        enemySize = [];
 
    posPlayer[0] = player.attrs.x;
    posPlayer[1] = player.attrs.y;
     
    enemySize[0] = 50;
    enemySize[1] = 50;
 
    sizePlayer[0] = 50; // размер игрока
    sizePlayer[1] = 50;
 
     
    for(var i = 0; i < lights.length; i++) {        
         
        enemyPos[0] = lights[i].attrs.x;
        enemyPos[1] = lights[i].attrs.y;
 
        if (lights[i].frameIndex() > 3) {            
            if (boxCollides(enemyPos, enemySize, posPlayer, sizePlayer)) {
                health--;
            }
        }
         
    }
 
    size[0] = 20; // размер стрелы
    size[1] = 20;
 
    if (arrows.length) {
 
        for(var i = 0; i < arrows.length; i++) {
 
            pos[0] = arrows[i].attrs.x; // позиция стрелы
            pos[1] = arrows[i].attrs.y;
 
 
            for (var j = 0; j < wizards.length; j++) {               
             
                enemyPos[0] = wizards[j].attrs.x; // позиция мага
                enemyPos[1] = wizards[j].attrs.y;
             
                if (wizards[j].action != 'die') {
                    if (boxCollides(enemyPos, enemySize, pos, size)) {
                        // console.log('Стрела задела мага');
                        if(arrows.length){
	                        arrows[i].setX(-1000);
	                        arrows.splice(i, 1);
	                    }
 
                        wizards[j].action = 'die';
                        wizards[j].attrs.animation = 'die';
                        wizards[j].frameIndex(0);
                    }
                }
            }
             
        }
    }
}

var playerImg = new Image();
playerImg.src = './images/player.png';
var lightImg = new Image();
lightImg.src = './images/wizard.png';
var wizardImg = new Image();
wizardImg.src = './images/wizard.png'; 
 
// задаем параметры изображения спрайта игрока
var player = new Konva.Sprite({
	x: 200, // положение
	y: 150,
	image: playerImg,
	animation: 'idleRight',
	animations: animationsPlayer, // изображение со всеми анимациями
	frameRate: 7, // скорость смены кадров
	frameIndex: 0 // начальный кадр
});
player.speed = 3;
player.sizeX = 50;
player.sizeY = 50;

makeEnemy('wizard', -30, 50);
 
// добавляем спрайт игрока на игровой слой
layer.add(player);
 
// добавляем слой на стейдж
stage.add(layer);
 
// запускаем анимацию игрока
player.start();

// бесконечный цикл игры
var gameLoop = new Konva.Animation(function(frame) {
	moveBullet();
	handleInput();
	moveEnemies();
	actEnemies();
	simpleText.setAttr('text', 'Блискавок: ' + lights.length + ", Магів на карті: " + wizards.length + ', Здоров\'я: ' + Math.floor(health) + ", Рахунок:" + score);
	getHealth();
	checkCollisions();
}, layer);
gameLoop.start();
 
// отлавливание событий нажатия на "игровые" клавиши
function handleInput() {
 
	// player.attrs.animation = 'idleRight'; // движение по умолчанию
	/*if (direction == 'left') {
		player.attrs.animation = 'idleLeft';
	}
	if (direction == 'right') {
		player.attrs.animation = 'idleLeft';
	}*/
 	if (player.attrs.animation == 'attackRight' ||
        player.attrs.animation == 'attackLeft') {
        animationAttack();
        return;
    }
	if(player.attrs.animation == 'walkRight') {
		player.attrs.animation = 'idleRight';
	}

	/*if (direction == 'left') {
        player.attrs.animation = 'idleLeft';
    }*/

	if(player.attrs.animation == 'walkLeft') {
		player.attrs.animation = 'idleLeft';
	}
	if(input.isDown('DOWN') || input.isDown('s')) {
		if (player.attrs.y + player.speed < canvasHeight - player.sizeY) {
			// player.attrs.animation = 'walkRight';
			if(player.attrs.animation == 'idleRight') {
				player.attrs.animation = 'walkRight';
			}

			if(player.attrs.animation == 'idleLeft') {
				player.attrs.animation = 'walkLeft';
			}
			player.setY(player.attrs.y + 1 * player.speed);
		}
	}
 
	if(input.isDown('UP') || input.isDown('w')) {
		if (player.attrs.y - player.speed > 0) {
			// player.attrs.animation = 'walkLeft';
			if(player.attrs.animation == 'idleRight') {
				player.attrs.animation = 'walkRight';
			}

			if(player.attrs.animation == 'idleLeft') {
				player.attrs.animation = 'walkLeft';
			}
			player.setY(player.attrs.y - 1 * player.speed);
		}
	}
 
	if(input.isDown('LEFT') || input.isDown('a')) {
		if (player.attrs.x - player.speed > 0) {
			player.attrs.animation = 'walkLeft';
			player.setX(player.attrs.x - 1 * player.speed);
			direction = 'left';
		}
	}
 
	if(input.isDown('RIGHT') || input.isDown('d')) {
		if (player.attrs.x + player.speed < canvasWidth - player.sizeX) {
			player.attrs.animation = 'walkRight';
			player.setX(player.attrs.x + 1 * player.speed);
			direction = 'right';
		}
	}

	if(input.isDown('SPACE') && Date.now() - lastFire > 500) {
         
        player.attrs.animation = 'attackLeft';
        if (direction == 'right') {
            player.attrs.animation = 'attackRight';
        }
        player.frameIndex(0);
         
    }


	// player.attrs.animation = initialDirection;
}