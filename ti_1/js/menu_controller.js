function start_game(){
	name = prompt("User name");
	
	sessionStorage.setItem("username", name);
	
	loadpage("./html/game.html");
}

function phaser_game(){
	name = prompt("User name");
	
	sessionStorage.setItem("username", name);

	loadpage("./html/phasergame.html");
}

function inf_phaser_game(){
	name = prompt("User name");
	
	sessionStorage.setItem("username", name);
	
	loadpage("./html/infinitephasergame.html");
}

function exit (){
	if (name != ""){
		alert("Leaving " + name + "'s game");
	}
	name = "";
	loadpage("../index.html");
}

function options(){
	loadpage("./html/options.html");
}

function inf_options(){
	loadpage("./html/infiniteoptions.html");
}

function load(){
	loadpage("./html/load.html");
}

function menu_ti(){
	loadpage("./ti_1/index.html");
}

function load_lb(){
	loadpage("./html/leaderboard.html");
}
