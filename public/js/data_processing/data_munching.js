//Data munching for passing scatter plots
function passingData(){
    var passing_data_all = [];
    var keys, attempts = 0, completions = 0, yards = 0, attempts_total = 0, completions_total = 0, yards_total = 0;
    var obj = {};
    var quarters = ["Q1", "Q2", "Q3", "Q4"];

    var passing_pp = data.play_player.filter(function(d,i) { return +data.play_player[i].passing_att > 0; });
    var passing_players = d3.set(passing_pp.map(function (d) { return d.player_id; })).values();

    quarters.forEach(function(q){
        passing_players.forEach(function(e){ 
            data.play_player.forEach(function(d){
                    keys = Object.keys(d);
                    keys.forEach(function(k){
                            if (d.quarter == q && d.player_id == e && k=="passing_att"){
                                attempts += Number(d[k]);
                            }
                            if (d.quarter == q && d.player_id == e && k=="passing_cmp"){
                                completions += Number(d[k]);
                            }
                            if (d.quarter == q && d.player_id == e && k=="passing_yds"){
                                yards += Number(d[k]);
                            }
                            if (d.player_id == e && k=="passing_att"){
                                attempts_total += Number(d[k]);
                                obj["team"] = d.team;
                            }
                            if (d.player_id == e && k=="passing_cmp"){
                                completions_total += Number(d[k]);
                            }
                             if (d.player_id == e && k=="passing_yds"){
                                yards_total += Number(d[k]);
                            }
                    });
            });
            if(attempts > 0) {
                obj["completion_rate"] = Math.round(completions/attempts*100);
            }
            if (attempts == 0){
                obj["completion_rate"] = 0;
            }
            
            obj["completion_rate_total"] = Math.round(completions_total/attempts_total*100);
            obj["attempts"] = attempts;
            attempts = 0;
            obj["completions"] = completions;
            completions = 0;
            obj["yards"] = yards;
            yards = 0;
            obj["attempts_total"] = attempts_total;
            attempts_total = 0;
            obj["completions_total"] = completions_total;
            completions_total = 0;
            obj["yards_total"] = yards_total;
            yards_total = 0;
            obj["quarter"] = q;
            obj["player_id"] = e;
            passing_data_all.push(obj);
            obj = {};
        });//End passing_players foreach
    });//End quarters foreach

    data.teams.forEach(function(d, i){
        passing_data_all.forEach(function(t){
            if(d.short == t.team){
                t["color_primary"] = d.color_primary;
                t["color_secondary"] = d.color_secondary;
                t["color_tertiary"] = d.color_tertiary;
            }
            t.key = t.quarter +t.player_id
        });
    });

//    console.log("passing data all", passing_data_all);
    
    passing_data_all.forEach(function(d){
        data.players.forEach(function(p){
           if(d.player_id == p.player_id){
               d["player"] = p.full_name;
               d["first_name"] = p.first_name;
               d["last_name"] = p.last_name;
           } 
        });
    });

     passing_data = {
        q1: passing_data_all.filter(function(d,i){ return Number(passing_data_all[i].quarter.substring(1,2)) == 1}),

        q2: passing_data_all.filter(function(d,i){ return Number(passing_data_all[i].quarter.substring(1,2)) < 3}),

        q3: passing_data_all.filter(function(d,i){ return Number(passing_data_all[i].quarter.substring(1,2)) < 4}),

        q4: passing_data_all
    };
//    console.log("passing data", passing_data);
}

//Filters data for action type (passing, receiving, rushing). Returns full game data set
function tableData(act, fields, labels) {
    var field_names = {};
    fields.forEach(function(d,i){
        if(fieldsForTables[act].sort_type[i] == "float"){
            field_names[d] = 0;
            field_names["total_"+d] = 0;
        }
        if(fieldsForTables[act].sort_type[i] == "string"){
            field_names[d] = "";
        }
    });
    
    if(act == "passing") {
    var action_pp = data.play_player.filter(function(d,i) { return +data.play_player[i]["passing_att"] > 0; });
    }
     if(act == "receiving") {
    var action_pp = data.play_player.filter(function(d,i) { return +data.play_player[i]["receiving_rec"] > 0; });
    }
    if(act == "rushing") {
    var action_pp = data.play_player.filter(function(d,i) { return +data.play_player[i]["rushing_att"] > 0; });
    }
    
    var action_data_all = [];
    var obj = {};
    var numerator = 0, denominator =1;
    
    var players = d3.set(action_pp.map(function (d) { return d.player_id; })).values();
    
    players.forEach(function(e){
        quarters.forEach(function(q){
            fields.forEach(function(f, i){
                obj["player_id"] = e;
                action_pp.forEach(function(d){
                        keys = Object.keys(d);
                        keys.forEach(function(k){
                                if (d.quarter == q && d.player_id == e && k == f){
                                    field_names[k] += d[k];
                                }
                                if (d.player_id == e && k == f){
                                    field_names["total_"+k] += d[k];
                                }
                        });
                });
//            if(fieldsForTables[act].sort_type[i] == "string"){
//               obj[fieldsForTables[act].labels[i]] = d3.set(field_names[f]).values().toString;
//                field_names[f] = "";
//            }
            if(fieldsForTables[act].sort_type[i] == "float"){
                obj[q+"_"+fieldsForTables[act].labels[i]] = field_names[f];
                field_names[f] = 0;
                obj["total_"+fieldsForTables[act].labels[i]] = field_names["total_"+f];
                field_names["total_"+f] = 0;    
            }
            });
        if(act == "passing") {
            //Yards Per Completion
            numerator = fieldsForTables[act].labels[2]; //Yards
            denominator = fieldsForTables[act].labels[4]; //Completion
            if(denominator > 0) {
                obj[q+"_Avg. Yards"] = Math.round(obj[q+"_"+numerator]/obj[q+"_"+denominator]);
                obj["total_Avg. Yards"] = Math.round(Number(obj["total_"+numerator])/Number(obj["total_"+denominator]));
            }
            
            if(denominator < 1) {
                obj[q+"_Avg. Yards"] = 0;
                obj["total_Avg. Yards"] = 0;
            }
            
            //Completion %
            numerator = fieldsForTables[act].labels[4];
            denominator = fieldsForTables[act].labels[3];
            if(denominator > 0) {   
                obj[q+"_Compl. %"] = Math.round(obj[q+"_"+numerator]/obj[q+"_"+denominator]*100);
                obj["total_Compl. %"] = Math.round(obj["total_"+numerator]/obj["total_"+denominator]*100);
            }
            
            if(denominator < 1 ){
                obj[q+"_Compl. %"] = 0;
                obj["total_Compl. %"] = 0;
            }
            
            }
            
            if(act == "receiving") {
                numerator = fieldsForTables[act].labels[4];
                denominator = fieldsForTables[act].labels[3];
                obj[q+"_Avg. Yards"] = Math.round(obj[q+"_"+numerator]/obj[q+"_"+denominator]);
                obj["total_Avg. Yards"] = Math.round(Number(obj["total_"+numerator])/Number(obj["total_"+denominator]));
            }
            
            if(act == "rushing") {
                numerator = fieldsForTables[act].labels[3];
                denominator = fieldsForTables[act].labels[2];
                obj[q+"_Avg. Yards"] = Math.round(obj[q+"_"+numerator]/obj[q+"_"+denominator]);
                obj["total_Avg. Yards"] = Math.round(Number(obj["total_"+numerator])/Number(obj["total_"+denominator]));
            }
        });
        action_data_all.push(obj);
        obj = {};
    });
    console.log("table data", action_data_all);
    action_data_all.forEach(function(d){
        action_pp.forEach(function(a){
            data.players.forEach(function(p){
                if(d.player_id == a.player_id && d.player_id == p.player_id) {
                    d["team"] = a.team;
                    d["player"] = p.full_name;
                    d["first_name"] = p.first_name;
                    d["last_name"] = p.last_name;
                }
            });
        });
    });
//    console.log("action_data_all", action_data_all);
    return action_data_all;   
}

//Filters fill game data set for a specific quarter. Used in tables and bar graphs.
function datasetQuarter(act, qtr) {
    
    var data_in = tableData(act, fieldsForTables[act].fields, fieldsForTables[act].labels);
    
    var players = d3.set(data_in.map(function (d) { return d.player_id; })).values();
    
    dataset = [];
    dataObj = {};
    var dkeys;
    
    var fields = [];
    var period = qtr+"_";
    
    data_in.forEach(function(d){
        dkeys = Object.keys(d);
            dkeys.forEach(function(k){
                if(k.substring(0,period.length) == period){
                    fields.push(k.substring(period.length, k.length));
                }
                if(k == "player"|| k == "player_id" || k == "team"){
                    fields.push(k);
                }
            });
    });
    
    fields = d3.set(fields).values();
    
    data_in.forEach(function(d){
        dkeys = Object.keys(d);
        fields.forEach(function(f){
            dkeys.forEach(function(k){
                if(period+f == k) {
                   dataObj[f] = d[k];
                }
                
                if(k == "team"){
                    dataObj["Team"] = d[k];
                }
                
                if(k == "player"){
                    dataObj["Player"] = d[k];
                }
                
                if(k == "player_id"){
                    dataObj[k] = d[k];
                }
            });
        });
    dataset.push(dataObj);
    dataObj ={};
    });
    
    if(act == "passing"){
        var filter = "Pass Completions";
    }
    
    if(act == "receiving"){
        var filter = "Receptions";
    }
    
    if(act == "rushing"){
        var filter = "Carries";
    }
    
    dataset = dataset.filter(function(d){return d[filter] > 0;});
    
    dataset.forEach(function(d){
            if(d["Team"] == teams.home){
                d["color_primary"] = teams.home_team_data[0].color_primary;
                d["color_secondary"] = teams.home_team_data[0].color_secondary;
                d["color_tertiary"] = teams.home_team_data[0].color_tertiary;
            }
            
            if(d["Team"] == teams.away){
                d["color_primary"] = teams.away_team_data[0].color_primary;
                d["color_secondary"] = teams.away_team_data[0].color_secondary;
                d["color_tertiary"] = teams.away_team_data[0].color_tertiary;
            }
    });
    
    return dataset;
}
