var gameObj = function (){
	const back = "../resources/back.png";
	const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
	"../resources/so.png","../resources/tb.png","../resources/to.png"];
	let l_partida = null;
	if (sessionStorage.idPartida && localStorage.partides){
		let arrayPartides = JSON.parse(localStorage.partides);
		if (sessionStorage.idPartida < arrayPartides.length)
			l_partida = arrayPartides[sessionStorage.idPartida];
	}
	var vueInstance = new Vue({
		el: "#game_id",
		data: {
			username:'',
			current_card: [],
			items: [],
			num_cards: 2,
			bad_clicks: 0,
			dificulty: "easy",
			iniciat: false
		},
		created: function(){
			if (l_partida){
				this.username = l_partida.username;
				this.current_card = l_partida.current_card;
				this.items = l_partida.items;
				this.num_cards = l_partida.num_cards;
				this.bad_clicks = l_partida.bad_clicks;
				this.iniciat = true
			}
			else{
				var time = 0;
				this.username = sessionStorage.getItem("username","unknown");
				var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"easy"}';
				var game_data = JSON.parse(json);
				this.num_cards=game_data.cards;
				this.dificultat=game_data.dificulty;
				this.items = items.slice(); // Copiem l'array
				this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
				this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
				this.items = this.items.concat(this.items); // Dupliquem els elements
				this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
				for (var i = 0; i < this.items.length; i++){
					this.current_card.push({done: false, texture: this.items[i]});
				}

				
				if(game_data.dificulty == "easy"){
					time = 3600;
				}
		
				else if(game_data.dificulty == "normal"){
					time = 2400;
				}
		
				else{
					time = 1200;
				}
				
				setTimeout(() => {
					console.log("Delayed for 1 second.");
					for (var i = 0; i < this.items.length; i++){
						Vue.set(this.current_card, i, {done: false, texture: back});
					}
		
					this.iniciat = true;
				},time);
			}
			sessionStorage.clear();
		},
		methods: {
			clickCard: function(i){
				if (!this.current_card[i].done && this.current_card[i].texture === back)
					Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
			},
			 save: function(){
				let partida = {
					username: this.username,
					current_card: this.current_card,
					items: this.items,
					num_cards: this.num_cards,
					bad_clicks: this.bad_clicks
				}
				let arrayPartides = [];
				if(localStorage.partides){
					arrayPartides = JSON.parse(localStorage.partides);
					if(!Array.isArray(arrayPartides)) arrayPartides = [];
				}
				arrayPartides.push(partida);
				localStorage.partides = JSON.stringify(arrayPartides);
				loadpage("../");
			}
		},
		watch: {
			current_card: function(value){
				if(this.iniciat == true){
					if (value.texture === back) return;
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
			
			}
		},
		computed: {
			score_text: function(){
				var misses = 20;
				if (this.dificulty=="easy"){
					misses=10;
				}
				else if (this.dificulty=="normal"){
					misses=20;
				}
				else {
					misses=35;
				}
				return 100 - this.bad_clicks * resta;
			}
		}
	});
	return {};
}();






