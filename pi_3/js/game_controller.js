const back = "../resources/back.png";
const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
"../resources/so.png","../resources/tb.png","../resources/to.png"];

var inicia = false;
var time=0;
var dificulty = "";

var game = new Vue({
	el: "#game_id",
	data: {
		username:'',
		current_card: [],
		items: [],
		num_cards: 2,
		bad_clicks: 0
	},
	created: function(){
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
		var menu_data = JSON.parse(json);
		this.num_cards = menu_data.cards;
		dificulty = menu_data.dificulty;
		this.username = sessionStorage.getItem("username","unknown");
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		for (var i = 0; i < this.items.length; i++){
			this.current_card.push({done: false, texture: this.items[i]});
		}
		if(menu_data.dificulty == "hard"){
			time = 1200;
		}

		else if(menu_data.dificulty == "normal"){
			time = 2400;
		}

		else{
			time = 3600;
		}
		
		setTimeout(() => {
			console.log("Delayed for 1 second.");
			for (var i = 0; i < this.items.length; i++){
				Vue.set(this.current_card, i, {done: false, texture: back});
			}

			inicia = true;
		},time);
	},
	methods: {
		clickCard: function(i){
			if (!this.current_card[i].done && this.current_card[i].texture === back)
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		}
	},
	watch: {
		current_card: function(value){
			if (value.texture === back || inicia == false) return;
			var front = null;
			var i_front = -1;
			for (var i = 0; i < this.current_card.length; i++){
				if (!this.current_card[i].done && this.current_card[i].texture !== back){
					if (front){
						if (front.texture === this.current_card[i].texture){
							front.done = this.current_card[i].done = true;
							this.num_cards--;
						}
						else{
							Vue.set(this.current_card, i, {done: false, texture: back});
							Vue.set(this.current_card, i_front, {done: false, texture: back});
							this.bad_clicks++;
							break;
						}
					}
					else{
						front = this.current_card[i];
						i_front = i;
					}
				}
			}			
		}
	},
	computed: {
		score_text: function(){
			var fallos = 10;
			if(dificulty == "hard"){
				fallos = 20;
			}
			else if(dificulty == "normal"){
				fallos = 15;
			}
			return 100 - this.bad_clicks * fallos;
		}
	}
});





