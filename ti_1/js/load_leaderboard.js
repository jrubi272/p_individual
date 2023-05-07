function sort_leaderboard(a,b){
if(a.level<b.level){
    return -1;
}
else if(a.level>b.level){
    return 1;
}
else {
    return 1;
}
return 0;
}