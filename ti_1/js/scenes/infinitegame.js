class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.num_card=2;
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.username="";
		this.dificulty = "easy";
		this.time = 3100;
		this.correct = 0;
		this.iniciat = false;
		this.bad_clicks=0;
        this.level = 1;
		//this.saver="";
		this.correctes=[];
		this.arrayCartes = [];
		this.items=['cb','co','sb','so','tb','to'];
    }

    preload (){	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
	}
	
    create (){	
		let l_partida=null;
		if(sessionStorage.idPartida && localStorage.partides){
			let arrayPartides=JSON.parse(localStorage.partides);
			if(sessionStorage.idPartida<arrayPartides.length)
			l_partida=arrayPartides[sessionStorage.idPartida];
		}
		if(l_partida){//Si s'empra una partida guardada agafa els valors d'aquesta
			this.score=l_partida.score;
			this.username=l_partida.username;
			this.dificulty=l_partida.dificulty;
			this.current_card=l_partida.current_card;
			this.items=l_partida.items;
			this.num_card=l_partida.num_cards;
			this.iniciat=true;
			this.time=l_partida.timer;
			this.correct=l_partida.correct;
			this.correctes=l_partida.correctes;
			this.arrayCartes=l_partida.arrayCartes;
		}
		else{//si és una partida nova inicialitza els valors que ha entrat l'usuari
			this.username = sessionStorage.getItem("username","unknown");
			var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"easy"}';
			var game_data = JSON.parse(json);
			this.num_card=game_data.cards;
			this.dificulty=game_data.dificulty;
			this.items = this.items.slice();
			this.items.sort(function(){return Math.random() - 0.5});
			this.items = this.items.slice(0, this.num_card);
			this.items = this.items.concat(this.items);
			this.items.sort(function(){return Math.random() - 0.5});
			var longitud = this.items.length;
            //en elegir el nivell al menú
            if(this.level==3){
				this.num_card=3;
				this.time=this.time/2;
			}
			else if(this.nivell==5){
				this.num_card=4;
				this.tempor=this.tempor/3;
			}
			else if(this.nivell==7){
				this.num_card=5;
				this.time=this.tempor/5;
			}
            else if(this.nivell==10){
				this.num_card=6;
				this.time=this.tempor/8;
			}
			else{
				this.time=2000;
			}
			for (var k = 0; k < longitud; k++){
				this.arrayCartes.push(this.items[k]);
			}
		}
		sessionStorage.clear();
		this.cameras.main.setBackgroundColor(0xBFFCFF);
		let x=120;
		let y=200;
		for (let v=0;v<this.arrayCartes.length;v++){
			console.log(this.arrayCartes[v]);
			this.add.image(x,y,this.arrayCartes[v]);
			x+=120;
			if(x>=550){
				x=120;
				y=y+120;
			}
		}
		
		if(this.dificulty == "hard"){
			time = 900;
		}

		else if(this.dificulty == "normal"){
			time = 2000;
		}

		else{
			time = 3100;
		}

		//this.saver = this.add.text(500, 500, 'Save game', {fill: '#fff'} );
		//this.saver.setInteractive();
		//this.saver.on('pointerup', ()=> {
			//this.save();
		//});
		
		setTimeout(() => {
			let x=120;
			let y=180;
			for (let j=0;j<this.arrayCartes.length;j++){
				let uncover=false;
				let k=0;
				while(k<this.correctes.length && !uncover){
					if(this.arrayCartes[j]===this.correctes[k]){
						uncover=true
					}
					k++;
				}
				if(!uncover){
					this.cards.create(x,y,'back');
				}
				x+=120;
				if(x>=550){
					x=120;
					y=y+120;
				}
			}
			this.iniciat=true;
			let i=0;
			this.cards.children.iterate((card)=>{
				let y=0;
				while(y<this.correctes.length){
					if(this.arrayCartes[i]===this.correctes[y]){
						i++;
					}
					else{
						y++;
					}
				}
				card.card_id=this.arrayCartes[i];
				i++;
				card.setInteractive();
				card.on('pointerup', ()=> {
					card.disableBody(true,true);
					console.log(card.card_id);
					if(this.firstClick){
						if(this.firstClick.card_id !== card.card_id){
							let mostrar=0;
							if(this.dificulty=="easy"){
								this.score-=10;
								mostrar=230;
							}
							else if(this.dificulty=="normal"){
								this.score-=20;
								mostrar=150;
							}
							else{
								this.score-=35;
								mostrar=80;
							}
							setTimeout(() => {	
								this.firstClick.enableBody(false,0,0,true,true);
								card.enableBody(false,0,0,true,true);
								this.firstClick=null;
							},mostrar);
							if(this.score<=0){
								alert("Game Over");
								loadpage("../");
							}
						}
						else{
							this.correct++;
							this.correctes.push(this.firstClick.card_id);
                            //incrementam el nivell del joc i el nombre de cartes si el nivell es imparell
                            this.level++;
                            if(this.level%2 != 0){
                                num_cards++;
                            }
							if(this.correct>=this.num_card){
								alert("You WIN!!! with "+ this.score + " points.");
								loadpage("../");
							}
							this.firstClick=null;
						}
					}
					else{
						this.firstClick=card;
					}
				},card);
			});
		}, this.time);	
	}
	save(){
		console.log(this.username);
		let partida={
			username: this.username,
			current_card: this.current_card,
			items: this.items,
			num_cards: this.num_card,
			score: this.score,
			arraycards: this.arraycards,
			correct: this.correct,
			correctes: this.correctes,
			dificulty:this.dificulty,
			timer:this.time
			
		}
		let arrayPartides=[];
		if(localStorage.partides){
			arrayPartides=JSON.parse(localStorage.partides);
			if(!Array.isArray(arrayPartides))arrayPartides=[];
		}
		arrayPartides.push(partida);
		localStorage.partides=JSON.stringify(arrayPartides);
		loadpage("../");
	}
	
	update (){	}
}

