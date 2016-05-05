//Display Team Logos and Scores at the top of the page    
function gameInfo() {
     teams = {
            home: data.game.home_team.toString(),
            away: data.game.away_team.toString()
        };
         
    score("home");
    
    d3.select("#city")
            .text(teams["home_team_data"][0].city+", "+teams["home_team_data"][0].state);
    d3.select("#stadium")
            .text(teams["home_team_data"][0].stadium);
    d3.select("#date")
            .text(data.game.start_time);
    
    score("away");
    
    console.log("teams array", teams);
    
    function score(h) {
        
        var other;
    
        if (h == "home"){
            other ="away";
        } else {
            other = "home";
        }
            
        teams[h+"_team_data"] = data.teams.filter(function(d,i) { return data.teams[i].short == teams[h]; });
    
        teams[other+"_team_data"] = data.teams.filter(function(d,i) { return data.teams[i].short == teams[other]; });
    
        teams[h+"_score"] = +data.game[h+"_score"];
        
        teams[other+"_score"] = +data.game[other+"_score"];
        
        //Winning team's score is colored, losing score is gray
        if(teams[h+"_score"] > teams[other+"_score"]) {
            teams[h+"_score_color"] = teams[h+"_team_data"][0].color_primary;
            
            teams[other+"_score_color"] = "#ABABAB";
        }
        if (teams[h+"_score"] == teams[other+"_score"]) {
            teams[other+"_score_color"] = "#ABABAB";
            
            teams[h+"_score_color"] =  "#ABABAB";
        }
        if (teams[h+"_score"] < teams[other+"_score"]) {
            
            teams[other+"_score_color"] = teams[other+"_team_data"][0].color_primary;
            
            teams[h+"_score_color"] =  "#ABABAB";
        }
    
        d3.select("#"+h+"_team_icon")
            .attr("data", "assets/teams/assets_"+teams[h]+".svg")
            .attr("width", 250);
    
        d3.select("#"+h+"_team_png")
            .attr("data", "assets/teams/assets_"+teams[h]+".png")
            .attr("width", 250);
    
        d3.select("#"+h+"_team")
            .append("font")
            .attr("color", teams[h+"_score_color"])
            .append("h1")
            .attr("class", "score")
            .text(data.game[h+"_score"]);
        
        d3.select("#"+h+"_name_label")
            .append("font")
            .attr("color", teams[h+"_team_data"][0].color_primary)
            .text(teams[h+"_team_data"][0].city +" "+ teams[h+"_team_data"][0].name);
    
    } //End of score function
    
}

function makeTableOld(act, data_in, qtr, id){
    
    var headerObjs = [];
    var hObj = {};
    
    fieldsForTables[act].labels.forEach(function(d,i){
        hObj["label"] = d,
        hObj["sort_type"] = fieldsForTables[act].sort_type[i],
        headerObjs.push(hObj);
        hObj = {};
    });
    
    
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
    
        var white = "#FFFFFF";
        var green = "#7DC15A";

        var colored_column_data = dataset.map(function(d){ return +d["Yards"];});

        //Colorscale receptions
        var colorScale_column = d3.scale.linear()
            .domain(d3.extent(colored_column_data))
            .range([white, green]);
    
        // columns is the actual object column in the CSV
        // headers is what i want on the top of the table
        var table = d3.select(id).append("table"),
            thead = table.append("thead"),
            tbody = table.append("tbody");
        
        var header = headerObjs.map(function(d){ return d.label});
        var sorts = headerObjs.map(function(d){ return d.sort_type});
        var columns = header;
    
        // append the header row
        thead.append("tr")
            .selectAll("th")
            .data(header)
            .enter()
            .append("th")
            .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(dataset)
            .enter()
            .append("tr");

        // create a cell in each row for each column
        // At this point, the rows have data associated.
        // So the data function accesses it.
        var cells = rows.selectAll("td")
            .data(function(row) {
                // he does it this way to guarantee you only use the
                // values for the columns you provide.
                return columns.map(function(column) {
                    // return a new object with a value set to the row's column value.
                    return { value: row[column], column: column };
                });
            })
            .enter()
            .append("td")
            .style("background-color", function(d){
                if (d.column == "Yards") {
                    return colorScale_column(+d.value);
                }
            })
            .text(function(d) { return d.value; });
    
    d3.selectAll("th")
					.data(sorts)
					.attr("data-sort", function(d) {return d;});
    
     $(id + " table").stupidtable();
    
}

function makeTable(act, qtr, id){
    
    var headerObjs = [];
    var hObj = {};
    
    fieldsForTables[act].labels.forEach(function(d,i){
        hObj["label"] = d,
        hObj["sort_type"] = fieldsForTables[act].sort_type[i],
        headerObjs.push(hObj);
        hObj = {};
    }); 
    
    var dataset = datasetQuarter(act, qtr);
    
    dataset.sort(function (a, b) {
					return b["Yards"] - a["Yards"];
        });
    
//    console.log("test dataset", dataset);
    
    var white = "#FFFFFF";
    var green = "#7DC15A";

    var colored_column_data = dataset.map(function(d){ return +d["Yards"];});

    //Colorscale receptions
    var colorScale_column = d3.scale.linear()
        .domain(d3.extent(colored_column_data))
        .range([white, green]);

    // columns is the actual object column in the CSV
    // headers is what i want on the top of the table
    var table = d3.select(id).append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    var header = headerObjs.map(function(d){ return d.label});
    var sorts = headerObjs.map(function(d){ return d.sort_type});
    var columns = header;

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(header)
        .enter()
        .append("th")
        .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(dataset)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    // At this point, the rows have data associated.
    // So the data function accesses it.
    var cells = rows.selectAll("td")
        .data(function(row) {
            // he does it this way to guarantee you only use the
            // values for the columns you provide.
            return columns.map(function(column) {
                // return a new object with a value set to the row's column value.
                return { value: row[column], column: column };
            });
        })
        .enter()
        .append("td")
        .style("background-color", function(d){
            if (d.column == "Yards") {
                return colorScale_column(+d.value);
            }
        })
        .text(function(d) { return d.value; });
    
    d3.selectAll("th")
					.data(sorts)
					.attr("data-sort", function(d) {return d;});
    
     $(id + " table").stupidtable();
    
}
    
//Use munched data to crate a scatter plot
function passingGraph(z) {
        var home_color_scale = d3.scale.linear().range(["#FFFFFF", teams.home_team_data[0].color_primary]);
        var htext_color_scale = d3.scale.linear().range([teams.home_team_data[0].color_primary,"#FFFFFF"]);
    
        var away_color_scale = d3.scale.linear().range(["#FFFFFF", teams.away_team_data[0].color_primary]);
        var atext_color_scale = d3.scale.linear().range([teams.away_team_data[0].color_primary, "#FFFFFF"]);

        home_color_scale.domain([-1,4]);
        away_color_scale.domain([-1,4]);
        
        htext_color_scale.domain([1,2]);
        atext_color_scale.domain([1,2]);
    
        var fullwidth = Math.round(window.innerWidth * .55);
        var fullheight = Math.round(window.innerHeight * .55);
//        alert("Screen Width: "+window.innerWidth+" Screen Height: "+window.innerHeight);
        var margin = {
            top: window.innerHeight*(50/682),
            left: window.innerWidth*(70/1276),
            right: window.innerWidth*(50/1276),
            bottom: window.innerWidth*(70/682)
        }; 
    
        var height = fullheight - margin.top - margin.bottom;
        var width = fullwidth - margin.left - margin.right;

        var dotRadius = window.innerWidth*.0125; 

        // fill in the margin values here.
        var xScale = d3.scale.linear()
            .range([0, width]);

        // top to bottom:
        var yScale = d3.scale.linear()
            .range([height, 0]);

        //  Custom tick count if you want it.
        // Create your axes here.
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .tickFormat(function(d) { return d + "%"; })
            .orient("bottom")
            .ticks(10); // fix this to a good number of ticks for your scale later.

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        var svg = d3.select("#"+z+"_chart_pass")
            .append("svg")
            .attr("width", fullwidth)
            .attr("height", fullheight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        
        xScale.domain([0,100]);

        yScale.domain(
                d3.extent(passing_data[z], function (d) {
                    return +d["yards"];
                }));
    
        var circles = svg.selectAll("circle")
                .data(passing_data[z], function(d) {return d.key});
        
        circles
                .enter()
                .append("circle")
                .classed("passdots", true)
                .attr("cx", function (d) {
                    return xScale(+d.completion_rate);
                })
                .attr("cy", function (d) {
                    return yScale(+d.yards);
                })
                .attr("r", function (d) {
                        if (d.attempts > 0 ) {
                            return dotRadius;
                        }
                        else {
                            return 0;
                        }
                    })
                .style("fill",
                    function (d) {
                        if (d.team == teams.home) {
                            return home_color_scale(Number(d.quarter.substring(1,2)));
                        }
                        if (d.team == teams.away) {
                            return away_color_scale(Number(d.quarter.substring(1,2)));
                        }
                    })
                .append("title")
                .text(function (d) {
                    return d.key;
                });
        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

        svg.append("text")
            .attr("class", "chartlabel xlabel")
            .attr("transform", "translate(" + width / 2 + " ," +
                height + ")")
            .style("text-anchor", "middle")
            .attr("dy", "50")
            .text("Completion Rate");
        
        svg.append("text")
            .attr("class", "plot_title")
            .attr("transform", "translate(" + width / 2 + " ," +
                0 + ")")
            .style("text-anchor", "middle")
            .attr("dy", "-20")
            .text("Passing Yards vs. Completion Rate Plot");


        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("text")
            .attr("class", "chartlabel ylabel")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left) // you may need to adjust this
            .attr("x", 0 - (height / 2)) // you may need to adjust
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Passing Yards");
    
        svg.selectAll("text.newlabels")
            .data(passing_data[z])
            .enter()
            .append("text")
            .classed("scatterlabel", true)
            .attr("x", function(d) {
                return xScale(+d.completion_rate);
            })
            .attr("y", function(d) {
                return yScale(+d.yards-2.5);
            })
            .attr("dx", function(d) {
                return xScale(-2.5);
            })
            .style("fill", function (d) {
                        if (d.team == teams.home) {
                            return htext_color_scale(Number(d.quarter.substring(1,2)));
                        }
                        if (d.team == teams.away) {
                            return atext_color_scale(Number(d.quarter.substring(1,2)));
                        }
                    })
            .text(function(d) {
                    if(d["completions"] >0) {
                        return d["quarter"] + "\r\n" + d["first_name"].substring(0,1)+"."+d["last_name"].substring(0,1);
                    }  
            });
    
    d3.selectAll(".passdots")
        .on("mouseover", cirmouseoverFunc)
        .on("mouseout", cirmouseoutFunc)
        .on("mousemove", cirmousemoveFunc);

    
    function cirmouseoverFunc(d) {
            // Adding a subtle animation to increase the dot size when over it!
        
                d3.select(this)
                    .transition()
                    .duration(50)
                    .attr("stroke", d.color_secondary)
                    .attr("stroke-width", 3);
                d3tooltip
                    .style("display", null) // this removes the display none setting from it
                   .html("<p>"+"("+d.team+") "+d.player+" passed for "+d.yards+" yards, and completed "+d.completion_rate+"% of his passes in "+d.quarter+"</p>");
    }

    function cirmousemoveFunc(d) {
                d3tooltip
                    .style("top", (d3.event.pageY - 10) + "px" )
                    .style("left", (d3.event.pageX + 10) + "px");
    }

    function cirmouseoutFunc(d) {
            // shrink it back down:
                d3.select(this)
                    .attr("stroke", "");
                d3tooltip
                    .style("display", "none");  // this sets it to invisible!
    } 
        

}

//Create bar chart
function makeBarChart(id, act, qtr, metric){
    var dataset = datasetQuarter(act, qtr); 
    
    dataset.sort(function (a, b) {
					return b[metric] - a[metric];
        });
    
//    console.log("bar chart dataset", dataset);
    
    var percent = d3.format("%");
    
    var fullwidth = Math.round(window.innerWidth * .55);
    var fullheight = Math.round(window.innerHeight * .55);
    var margin = {
            top: window.innerHeight*(20/682),
            left: window.innerWidth*(100/1276),
            right: window.innerWidth*(50/1276),
            bottom: window.innerHeight*(70/682)
        }; 
    
    var height = fullheight - margin.top - margin.bottom;
    var width = fullwidth - margin.left - margin.right;

    var widthScale = d3.scale.linear()
        .range([0, width]);

    var heightScale = d3.scale.ordinal()
        .rangeRoundBands([0, height], 0.2);

    var xAxis = d3.svg.axis()
        .scale(widthScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(heightScale)
        .orient("left")
        .innerTickSize([0]);
    
    var svg = d3.select(id)
        .append("svg")
        .attr("width", fullwidth)
        .attr("height", fullheight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
    
        var all_values = dataset.map(function(d){ return +d[metric];});
        
        var min_max = d3.extent(all_values);
        
        var absmax = d3.max(dataset, function (d) {
                    return Math.abs(d[metric]);
                });
    
            if(min_max[0] < 0){
            var extent_values = [-absmax, +absmax];
            }
            if(min_max[0] >= 0){
            var extent_values = [0, absmax];
            }

        
        widthScale.domain(extent_values);
    
        heightScale.domain(dataset.map(function (d) {
                    return d["Player"];
                }));

        var rect_g = svg.selectAll("g")
                    .data(dataset)
                    .enter()
                    .append("g");

        var rects = rect_g.selectAll("rect")
                    .data(dataset)
                    .enter()
                    .append("rect")
                    .attr("class", function (d) {
                        return d["Team"]
                    })
                    .classed(act+"rect", true);

                rects.attr("x", function(d) { return widthScale(Math.min(0, d[metric])); })
                    .attr("y", function (d, i) {
                        return heightScale(d["Player"]);
                    })
                    .attr("width", function (d) {
                        return Math.abs(widthScale(d[metric]) - widthScale(0));
                    })
                    .attr("height", heightScale.rangeBand())
                    .style("fill", function(d) {return d.color_primary;});
//                    .append("title")
//                    .text(function (d) {
//                        return "(" + d["Team"] + ") " + d["Player"] + "'s receptions: " + d[metric];
//                    });

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

                svg.append("text")
                    .attr("class", "xlabel chartlabel")
                    .attr("transform", "translate(" + width / 2 + " ," +
                        height + ")")
                    .style("text-anchor", "middle")
                    .attr("dy", "45")
                    .text(metric);
        
                rect_g.append("text")
                    .attr("x", function (d) {
                        return widthScale(d[metric]);
                    })
                    .attr("y", function (d, i) {
                        return heightScale(d["Player"]);
                    })
                    .attr("dx", function(d){
                        if(d[metric] <0 ){
                            return "-20px";
                        }
                        if(d[metric] >=0){
                            return "5px";
                        }
                    })
                    .attr("dy", "1.76em")
                    .classed("barlabel", true)
                    .text(function (d) {
                        return d[metric];
                    });
    
    console.log("bar data "+act+" "+qtr, dataset);
    
    d3.selectAll("."+act+"rect")
        .on("mouseover", mouseoverFunc)
        .on("mouseout", mouseoutFunc)
        .on("mousemove", mousemoveFunc);

    
    function mouseoverFunc(d) {
            // Adding a subtle animation to increase the dot size when over it!
        
                d3.select(this)
                    .transition()
                    .duration(50)
                    .attr("stroke", d.color_secondary)
                    .attr("stroke-width", 3);
                d3tooltip
                    .style("display", null) // this removes the display none setting from it
                   .html("<p>"+"("+d.Team+") "+d.Player+" had "+d.Yards+" "+act+" yards</p>");
    }

    function mousemoveFunc(d) {
                d3tooltip
                    .style("top", (d3.event.pageY - 10) + "px" )
                    .style("left", (d3.event.pageX + 10) + "px");
    }

    function mouseoutFunc(d) {
            // shrink it back down:
                d3.select(this)
                    .attr("stroke", "");
                d3tooltip
                    .style("display", "none");  // this sets it to invisible!
    } 
} //End makeBarChart

//Create graph of plays on a field
function fieldGraph(id, qtr) {
    var subset = {};
    
    var keys;
    var type = [];
    
    var yardchange = [];
    
    var yard_plus = ["fumbles_rec_yds", "kicking_fgm_yds", "kicking_fgmissed_yds", "passing_cmp_air_yds", "passing_yds", "receiving_yds", "rushing_yds"];
    
    var yard_minus = ["defense_frec_yds", "defense_int_yds", "defense_misc_yds", "defense_sk_yds"];
    
    data.play_player.forEach(function(d,i){
        keys = Object.keys(d);
        
        keys.forEach(function (e) {
            //To determine net yardage change on a play
             yard_plus.forEach(function(y){
                 if (e == y && d[e]!== 0){
                     d.yardchange = +d[e];
                 }
             });
            
            yard_minus.forEach(function(y){
                 if (e == y && d[e] !== 0){
                     d.yardchange = -d[e];
                 }
             });
            
            //Add text that will be used to identify each type of record
        
            if (e.toString().startsWith("rushing_att") && +d[e] > 0) {
                type.push("rush");
            }
            
//            if (e.toString().startsWith("defense") && +d[e] > 0) {
//                type.push("def");
//            }
            
            if (e.toString().startsWith("defense_int") && d[e] > 0) {
//                 console.log(i + "TRUE" + d[e]);
               type.push("int");
            }
            
            if (e.toString().startsWith("fumbles_lost") && d[e] > 0) {
                type.push("fmbllost");
            }
            
            if (e.toString().startsWith("fumbles_forced") && d[e] > 0) {
                type.push("fmbl");
            }
            
            if (e.toString().startsWith("fumbles_oob") && d[e] > 0) {
                type.push("fmbl");
            }
            
            if (e.toString().startsWith("fumbles_notforced") && d[e] > 0) {
                type.push("fmbl");
            }
            
            
            if (e.toString().startsWith("kicking_fgmissed") && d[e] > 0) {
                type.push("fgmissed");
            }
            
            if (e.toString().startsWith("kicking_fgm") && d[e] > 0) {
                type.push("fgmade");
            }
            
//            if (e.toString().startsWith("kicking_tot") && d[e] > 0) {
//                type.push("ko");
//            }
            
            if (e.toString().startsWith("kicking_xpmade") && d[e] > 0) {
                type.push("xpmade");
            }
            
            if (e.toString().startsWith("kicking_xpmissed") && d[e] > 0) {
                type.push("xpmissed");
            }
            
            if (e.toString().startsWith("kickret_tds") && d[e] > 0) {
                type.push("kickrettd");
            }
            
            if (e.toString() == "passing_cmp" && d[e] > 0) {
               type.push("pass");
            }
            
//            if (e.toString().startsWith("passing_incmp") && d[e] > 0) {
//               type.push("passinc");
//                d.pprank = 1;
//            }
//            
//            if (e.toString().startsWith("passing_incmp_air_yds") && d[e] > 0) {
//                    d.x2 = d.yardline - d[e];
//            }
            
            if (e.toString().startsWith("passing_sk") && d[e] > 0) {
                type.push("sack");
            }
            
            if (e.toString().startsWith("passing_twoptm") && d[e] > 0) {
                type.push("twoptmade");
            }
            
            if (e.toString().startsWith("passing_twoptmissed") && d[e] > 0) {
                type.push("twoptmissed");
            }
            
            if (e.toString().startsWith("punting_tot") && d[e] > 0) {
               type.push("punt");
            }
            
//            if (e.toString().startsWith("receiving_tar") && d[e] > 0) {
//                type.push("target");
//            }
            
            if (e.toString().startsWith("rushing_twoptm") && d[e] > 0) {
                type.push("twoptmade");
            }
            
            if (e.toString().startsWith("rushing_twoptmissed") && d[e] > 0) {
                type.push("twoptmissed");
            }
            
        }); //End keys foreach
        d.type = type;
        
        type = [];
        yardchange = [];
    }); //End play_player foreach
    
    data.plays.forEach(function(d,i) {
        d.play_text_id = "p"+zero(d.play_id);
        
        if (d.yardline) {
        
            if(d.yardline.toString().substring(0,1) === "(") {
        
                d.yardline = +d.yardline.substring(1, d.yardline.length-1);
            
            } 
            if (isNaN(d.yardline)) {
            
                d.yardline = 0;
            }
            
         }
        
        if (d.note) {
        
        type.push(d.note.toLowerCase());
        
        }
        
        data.play_player.forEach(function(e) {
        
            if (d.play_id == e.play_id) {
            
                type.push(e.type);
                
                if (e.yardchange) {
                yardchange.push(e.yardchange);
                }
            }
        
        });//End play_player foreach

        type.sort(d3.ascending);
        d.type = d3.set(type).values().toString()
            .replace(/,/g," ")
            .trim()
            .replace(/  /g," ");
//            .replace(/ /g,"_");
        
//        console.log("play "+d.play_id+" type "+d.type);
        
//        d.yardchange = yardchange;
        d.yardchange = yardchange.reduce(function(a, b) {
            return a + b;
        },0);
   
        type = [];
        yardchange = [];
    }); //End plays foreach
    
//    console.log("plays length = "+data.plays.length);
    
    data.plays.forEach(function(d,i){
        
//        if (d.yardchange){
//        
//            d.yardplot = Number(d.yardline) + Number(d.yardchange);
//            
//        } else{
//            d.yardplot = d.yardline;
//        }
        
        if (i < data.plays.length-1) {
           d.yardplot = data.plays[i+1].yardline; 
        }
        
        if (i == data.plays.length-1) {
            d.yardplot = d.yardline;
        }
        
        if (d.note == "TD" && d.yardplot < 0) {
            
            d.yardplot = -52;
            d.type += " TD";
    
        }
        
        if (d.note == "TD" && d.yardplot > 0) {
            
            d.yardplot = 52;
            d.type += " TD";
    
        }
//        console.log(d.play_id+" "+d.type);
    });
    
    subset["plays_"+qtr] = data.plays.filter(function(d,i) { return data.plays[i].time.substring(1, 3) === qtr; });
    
    subset["drives_"+qtr] = data.drives.filter(function(d,i) { return data.drives[i].start_time.substring(1, 3) === qtr; });
    
    subset["drives_id_"+qtr] = subset["drives_"+qtr].map(function (d) { return d.drive_id; });
    
    subset["play_players_"+qtr] = [];
    
    data.play_player.filter(function(d,i) { 
        subset["plays_"+qtr].forEach(function(p){
            if (d.play_id == p.play_id) {
                 subset["play_players_"+qtr].push(d); 
            }
        });
    });
    
    var players = subset["play_players_"+qtr].map(function(d) { return d.player_id;});
    
    subset["players_"+qtr] = [];
    
    data.players.forEach(function(d){
        subset["play_players_"+qtr].forEach(function(p){
            if(d.player_id == p.player_id) {
                   subset["players_"+qtr].push(d);
            }
        });
    });
    
//    var data_q1 = {}
    
//    console.log("drives_q1", drives_q1);
//    console.log("plays_q1", plays_q1);
//    console.log("play_players_q1", play_players_q1);
//    console.log("players_q1", players_q1);
//    console.log("data_q1", data_q1);
    
    subset["dataset_"+qtr] = d3.nest()
        .key(function (d,i) {
            return d.play_text_id;})
        .sortKeys(d3.ascending)
        .entries(subset["plays_"+qtr]);
    
   var fullwidth = Math.round(window.innerWidth * .6);
    var fullheight = Math.round(window.innerHeight * .6);
    
    var margin = {
    top: Math.round(window.innerHeight * .035),
    left: Math.round(window.innerWidth * .05),
    right: Math.round(window.innerWidth * .05),
    bottom: Math.round(window.innerHeight * .1)
    };

    var height = fullheight - margin.top - margin.bottom;
    var width = fullwidth - margin.left - margin.right;

    var xScale = d3.scale.linear()
        .range([0, width]);

    var yScale = d3.scale.ordinal()
        .rangeRoundBands([0, height], 0.1);

    var xAxis = d3.svg.axis()
        .scale(xScale)
         .tickFormat(function(d) { 
             if(d == 0) {
                 return 50; 
             }
             if(d > 0) {
                 return 50-d; 
             }
              if(d < 0) {
                 return 50+d; 
             }
         })
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .innerTickSize([0]);

    //Create the empty SVG image
    var svg = d3.select(id)
                .append("svg")
                .attr("width", fullwidth)
                .attr("height", fullheight)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dotRadius = 5;
    
    xScale.domain([-60,60]); //Based on how yardline data is encoded
    
    yScale.domain(subset["drives_id_"+qtr]);
    
//    svg.append("g")
//        .attr("class", "grass");
    
    svg
        .append("rect")
        .classed("grass", true)
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#cee1d8");
    
     svg
        .append("rect")
        .classed("endzone", true)
        .classed("home", true)
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", xScale(-50))
        .attr("height", height)
        .attr("fill", teams.home_team_data[0].color_primary);
    
    svg
        .append("rect")
        .classed("endzone", true)
        .classed("away", true)
        .attr("x", xScale(50))
        .attr("y", "0")
        .attr("width", xScale(60)-xScale(50))
        .attr("height", height)
        .attr("fill", teams.away_team_data[0].color_primary);
    
    svg.append("text")
            .attr("class", "chartlabel xlabel")
            .attr("transform", "translate(" + width / 2 + " ," +
                height + ")")
            .style("text-anchor", "middle")
            .attr("dy", "50")
            .text("Yardline");
    
    svg.append("text")
            .attr("class", "endzonelabel home")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .attr("dx", "-150")
            .attr("dy", xScale(-54))
            .text(teams.home_team_data[0].name);
    
    svg.append("text")
            .attr("class", "endzonelabel away")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "middle")
            .attr("dx", "157")
            .attr("dy", xScale(-173))
            .text(teams.away_team_data[0].name);
    
    svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

    svg.append("g")
                .attr("class", "y axis")
                .attr("id", "yaxis")
                .call(yAxis);
    
    var circles = svg.selectAll("circle.plays")
    .data(subset["dataset_"+qtr], function (d) { return d.key; });
    
    circles
        .enter()
        .append("circle")
        .attr("class", function (d) { return d.values[0].type; })
        .classed("plays", true)
        .attr("id", function(d) { return d.key; })
        .attr("cx", function (d) {
            return xScale(d.values[0].yardplot);
        })
        .attr("cy", function (d) {
                    return yScale(d.values[0].drive_id);
        })
        .attr("r", dotRadius)
        .on("mouseover", cirmouseoverFunc)
        .on("mouseout", cirmouseoutFunc)
        .on("mousemove", cirmousemoveFunc);
    
      
    //console.log("all play dots", d3.selectAll(".play"));
    
        
    function cirmouseoverFunc(d) {
            // Adding a subtle animation to increase the dot size when over it!
                d3.select(this)
                    .transition()
                    .duration(50)
                    .style("opacity", 1)
                    .attr("r", dotRadius+2);
                d3tooltip
                    .style("display", null) // this removes the display none setting from it
                   .html("<p>" + d.values[0].description +
//                            "<br>Play: " + d.values[0].play_id +
//                            "<br> Yardplot: "+d.values[0].yardplot +
//                              "<br>Team: " + d.values[0].pos_team+ 
                         "</p>");
        
    }

    function cirmousemoveFunc(d) {
                d3tooltip
                    .style("top", (d3.event.pageY - 10) + "px" )
                    .style("left", (d3.event.pageX + 10) + "px");
    }

    function cirmouseoutFunc(d) {
            // shrink it back down:
                d3.select(this)
                    .transition()
                    .attr("r", dotRadius);
                d3tooltip
                    .style("display", "none");  // this sets it to invisible!
    } 
    
}

function fieldGraphBU(qtr) {
    var subdata ={};
    
    var keys;
    var type = [];
    
    var yardchange = [];
    
    var yard_plus = ["fumbles_rec_yds", "kicking_fgm_yds", "kicking_fgmissed_yds", "passing_cmp_air_yds", "passing_yds", "receiving_yds", "rushing_yds"];
    
    var yard_minus = ["defense_frec_yds", "defense_int_yds", "defense_misc_yds", "defense_sk_yds"];
    
    data.play_player.forEach(function(d,i){
        keys = Object.keys(d);
        
        keys.forEach(function (e) {
            //To determine net yardage change on a play
             yard_plus.forEach(function(y){
                 if (e == y && d[e]!== 0){
                     d.yardchange = +d[e];
                 }
             });
            
            yard_minus.forEach(function(y){
                 if (e == y && d[e] !== 0){
                     d.yardchange = -d[e];
                 }
             });
            
            //Add text that will be used to identify each type of record
        
            if (e.toString().startsWith("rushing_att") && +d[e] > 0) {
                type.push("rush");
            }
            
//            if (e.toString().startsWith("defense") && +d[e] > 0) {
//                type.push("def");
//            }
            
            if (e.toString().startsWith("defense_int") && d[e] > 0) {
//                 console.log(i + "TRUE" + d[e]);
               type.push("int");
            }
            
            if (e.toString().startsWith("fumbles_lost") && d[e] > 0) {
                type.push("fmbllost");
            }
            
            if (e.toString().startsWith("fumbles_forced") && d[e] > 0) {
                type.push("fmbl");
            }
            
            if (e.toString().startsWith("fumbles_oob") && d[e] > 0) {
                type.push("fmbl");
            }
            
            if (e.toString().startsWith("fumbles_notforced") && d[e] > 0) {
                type.push("fmbl");
            }
            
            
            if (e.toString().startsWith("kicking_fgmissed") && d[e] > 0) {
                type.push("fgmissed");
            }
            
            if (e.toString().startsWith("kicking_fgm") && d[e] > 0) {
                type.push("fgmade");
            }
            
//            if (e.toString().startsWith("kicking_tot") && d[e] > 0) {
//                type.push("ko");
//            }
            
            if (e.toString().startsWith("kicking_xpmade") && d[e] > 0) {
                type.push("xpmade");
            }
            
            if (e.toString().startsWith("kicking_xpmissed") && d[e] > 0) {
                type.push("xpmissed");
            }
            
            if (e.toString().startsWith("kickret_tds") && d[e] > 0) {
                type.push("kickrettd");
            }
            
            if (e.toString() == "passing_cmp" && d[e] > 0) {
               type.push("pass");
            }
            
//            if (e.toString().startsWith("passing_incmp") && d[e] > 0) {
//               type.push("passinc");
//                d.pprank = 1;
//            }
//            
//            if (e.toString().startsWith("passing_incmp_air_yds") && d[e] > 0) {
//                    d.x2 = d.yardline - d[e];
//            }
            
            if (e.toString().startsWith("passing_sk") && d[e] > 0) {
                type.push("sack");
            }
            
            if (e.toString().startsWith("passing_twoptm") && d[e] > 0) {
                type.push("twoptmade");
            }
            
            if (e.toString().startsWith("passing_twoptmissed") && d[e] > 0) {
                type.push("twoptmissed");
            }
            
            if (e.toString().startsWith("punting_tot") && d[e] > 0) {
               type.push("punt");
            }
            
//            if (e.toString().startsWith("receiving_tar") && d[e] > 0) {
//                type.push("target");
//            }
            
            if (e.toString().startsWith("rushing_twoptm") && d[e] > 0) {
                type.push("twoptmade");
            }
            
            if (e.toString().startsWith("rushing_twoptmissed") && d[e] > 0) {
                type.push("twoptmissed");
            }
            
        }); //End keys foreach
        d.type = type;
        
        type = [];
        yardchange = [];
    }); //End play_player foreach
    
    data.plays.forEach(function(d,i) {
        d.play_text_id = "p"+zero(d.play_id);
        
        if (d.yardline) {
        
            if(d.yardline.toString().substring(0,1) === "(") {
        
                d.yardline = +d.yardline.substring(1, d.yardline.length-1);
            
            } 
            if (isNaN(d.yardline)) {
            
                d.yardline = 0;
            }
            
            
         }
        
        if (d.note) {
        
        type.push(d.note.toLowerCase());
        
        }
        
        data.play_player.forEach(function(e) {
        
            if (d.play_id == e.play_id) {
            
                type.push(e.type);
                
                if (e.yardchange) {
                yardchange.push(e.yardchange);
                }
            }
        
        });//End play_player foreach

        type.sort(d3.ascending);
        d.type = d3.set(type).values().toString()
            .replace(/,/g," ")
            .trim()
            .replace(/  /g," ");
//            .replace(/ /g,"_");
        
        console.log("play "+d.play_id+" type "+d.type);
        
//        d.yardchange = yardchange;
        d.yardchange = yardchange.reduce(function(a, b) {
            return a + b;
        },0);
   
        type = [];
        yardchange = [];
    }); //End plays foreach
    
//    console.log("plays length = "+data.plays.length);
    
    data.plays.forEach(function(d,i){
        
//        if (d.yardchange){
//        
//            d.yardplot = Number(d.yardline) + Number(d.yardchange);
//            
//        } else{
//            d.yardplot = d.yardline;
//        }
        
        if (i < data.plays.length-1) {
           d.yardplot = data.plays[i+1].yardline; 
        }
        
        if (i == data.plays.length-1) {
            d.yardplot = d.yardline;
        }
        
        if (d.note == "TD" && d.yardplot < 0) {
            
            d.yardplot = -52;
            d.type += " TD";
    
        }
        
        if (d.note == "TD" && d.yardplot > 0) {
            
            d.yardplot = 52;
            d.type += " TD";
    
        }
        console.log(d.play_id+" "+d.type);
    });
    
    plays_q1 = data.plays.filter(function(d,i) { return data.plays[i].time.substring(1, 3) === "Q1"; });
    
    drives_q1 = data.drives.filter(function(d,i) { return data.drives[i].start_time.substring(1, 3) === "Q1"; });
    
    drives_id_q1 = drives_q1.map(function (d) { return d.drive_id; });
    
    data.play_player.filter(function(d,i) { 
        plays_q1.forEach(function(p){
            if (d.play_id == p.play_id) {
                 play_players_q1.push(d); 
            }
        });
    });
    
    var players = play_players_q1.map(function(d) { return d.player_id;});
    
    data.players.forEach(function(d){
        play_players_q1.forEach(function(p){
            if(d.player_id == p.player_id) {
                   players_q1.push(d);
            }
        });
    });
    
    var data_q1 = {}
    
//    console.log("drives_q1", drives_q1);
//    console.log("plays_q1", plays_q1);
//    console.log("play_players_q1", play_players_q1);
//    console.log("players_q1", players_q1);
//    console.log("data_q1", data_q1);
    
    var dataset_q1 = d3.nest()
        .key(function (d,i) {
            return d.play_text_id;})
        .sortKeys(d3.ascending)
        .entries(plays_q1);
    
    console.log("Q1 PBP Data", plays_q1);
//    console.log("Q1 dataset", dataset_q1);
    
    var margin = {
    top: Math.round(window.innerHeight * .035),
    left: Math.round(window.innerWidth * .20),
    right: Math.round(window.innerWidth * .05),
    bottom: Math.round(window.innerHeight * .1)
    };

    var height = fullheight - margin.top - margin.bottom;
    var width = fullwidth - margin.left - margin.right;

    var xScale = d3.scale.linear()
        .range([0, width]);

    var yScale = d3.scale.ordinal()
        .rangeRoundBands([0, height], 0.1);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .innerTickSize([0]);

    //Create the empty SVG image
    var svg = d3.select("#q1graphic")
                .append("svg")
                .attr("width", fullwidth)
                .attr("height", fullheight)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dotRadius = 5;
    
    xScale.domain([-60,60]); //Based on how yardline data is encoded
    
    yScale.domain(drives_id_q1);
    
//    svg.append("g")
//        .attr("class", "grass");
    
    svg
        .append("rect")
        .classed("grass", true)
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#cee1d8");
    
     svg
        .append("rect")
        .classed("endzone", true)
        .classed("home", true)
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", xScale(-50))
        .attr("height", height)
        .attr("fill", teams.home_team_data[0].color_primary);
    
    svg
        .append("rect")
        .classed("endzone", true)
        .classed("away", true)
        .attr("x", xScale(50))
        .attr("y", "0")
        .attr("width", xScale(60)-xScale(50))
        .attr("height", height)
        .attr("fill", teams.away_team_data[0].color_primary);
    
        
        
    
    svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

    svg.append("g")
                .attr("class", "y axis")
                .attr("id", "yaxis")
                .call(yAxis);
    
    var circles = svg.selectAll("g.plays")
    .data(dataset_q1, function (d) { return d.key; });
    
    circles
        .enter()
        .append("circle")
        .transition()
        .delay(function (d, i) {
            return i * 10;
        })
        .duration(1000)
        .attr("cx", function (d) {
            return xScale(d.values[0].yardplot);
        })
        .attr("cy", function (d) {
                    return yScale(d.values[0].drive_id);
        })
        .attr("class", function (d) { return d.values[0].type; })
        .attr("id", function(d) { return d.key; })
        .attr("r", dotRadius);
    
    
//    circles
//        .enter()
//        .append(function(d){ return svg.createElementNS("assets/plays/icons_"+d.values[0].type+".svg","g"); })
////        .attr("src", function(d){ return "assets/plays/icons_"+d.values[0].type+".png"; })
//        .transition()
//        .delay(function (d, i) {
//            return i * 10;
//        })
//        .duration(1000)
//        .attr("cx", function (d) {
//            return xScale(d.values[0].yardplot);
//        })
//        .attr("cy", function (d) {
//                    return yScale(d.values[0].drive_id);
//        })
//        .attr("class", function (d) { return d.values[0].type; })
//        .attr("id", function(d) { return d.key; });
//        .attr("r", dotRadius);
    
//    d3.selectAll(".rush").append(function (d){ 
//    return "assets/plays/icons_rush.svg";
//    });
//    
//    console.log("rush",d3.selectAll(".rush"));
//    
    d3.selectAll("circle")
        .on("mouseover", cirmouseoverFunc)
        .on("mouseout", cirmouseoutFunc)
        .on("mousemove", cirmousemoveFunc);
    
}