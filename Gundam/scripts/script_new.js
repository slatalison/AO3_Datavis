var w = window.innerWidth,
    h = window.innerHeight;

var keyc = true, keys = true, keyt = true, keyr = true, keyx = true, keyd = true, keyl = true, keym = true, keyh = true, key1 = true, key2 = true, key3 = true, key0 = true

var focus_node = null, highlight_node = null;
var focus_link = null, highlight_line = null;

var text_center = false;
var outline = false;

var min_score = 0;
var max_score = 1;

// var color = d3.scale.linear()
//     .domain([min_score, max_score])
//     .range(["yellow", "rgb(204,203,203)"]);

var color = ["yellow", "rgb(204,203,203)"];

var highlight_color = "rgb(5,157,118)";
var highlight_trans = 0.1;

var size = d3.scale.pow().exponent(1)
    .domain([1, 100])
    .range([8, 24]);

var force = d3.layout.force()
    .linkDistance(130)
    .charge(-800)
    .size([w, h]);

var default_node_color = "rgb(204,203,203)";
var default_link_color = "black";
//var default_node_color = "rgb(3,190,100)";


var nominal_base_node_size = 8;
var nominal_text_size = 10;
var max_text_size = 12;
var nominal_stroke = 2.5;
var max_stroke = 4.5;
var max_base_node_size = 36;
var min_zoom = 0.1;
var max_zoom = 7;
var svg = d3.select("div").append("svg")
var zoom = d3.behavior.zoom().scaleExtent([min_zoom, max_zoom])
var g = svg.append("g");
svg.style("cursor", "move");


d3.json("https://gist.githubusercontent.com/slatalison/86915854dcc1ed17ba10669b2b65c88e/raw/1643144965be9cc3da1f2e6b4d7b08a242eb15dc/data_OO.json", function (error, graph) {





    var linkedByIndex = {};
    graph.links.forEach(function (d) {
        linkedByIndex[d.source + "," + d.target] = true;
    });

    function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }


    function hasConnections(a) {
        for (var property in linkedByIndex) {
            s = property.split(",");
            if ((s[0] == a.index || s[1] == a.index) && linkedByIndex[property]) return true;
        }
        return false;
    } // wll always return true since it is the same group!



    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();


    var ATrans = function (d) {
        return Math.sqrt(d.weight) / 10
    };

    

    var link = g.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", nominal_stroke)
        .style("opacity", ATrans)
        // .style("stroke", default_link_color)
        .style("stroke", function (d) {
            if (isNumber(d.score)) return color[d.score-1];
            else return default_link_color;
        })
        ;


    var node = g.selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);



    node.on("dblclick.zoom", function (d) {
        d3.event.stopPropagation();
        var dcx = (w / 2 - d.x * zoom.scale());
        var dcy = (h / 2 - d.y * zoom.scale());
        zoom.translate([dcx, dcy]);
        g.attr("transform", "translate(" + dcx + "," + dcy + ")scale(" + zoom.scale() + ")");
    });


    //search and auto centre
    var all_chara = [];
    function search_and_autocentre() {
        // loop through nodes
        for (i = 0; i < graph.nodes.length; i++) {
            all_chara.push(graph.nodes[i]['name']);
        };


        // submit genes button
        $("#test").keyup(function (e) {
            if (e.keyCode == 13) {
                console.log("click");
                find_character();
            }
        });


        $("#test").autocomplete({
            minLength: 2,
            delay: 500,
            source: all_chara
        });

        document.getElementById("check").onclick = function () {
            document.getElementById("result-box").style.display = "block";
            find_character();
        };

        function image(thisImg) {
            var img = document.createElement("IMG");
            img.src = "images/" + thisImg;
            document.getElementById('alertImg').innerHTML = '<img src="' + "images/" + thisImg + '">';
        }


        // find gene in clustergram 
        function find_character() {
            // get the searched character 
            search_chara = $('#test').val();

            if (all_chara.indexOf(search_chara) != -1) {
                // zoom and highlight found gene 

                let index = parseInt(graph.nodes[all_chara.indexOf(search_chara)]['index']);
                // var selectedNode = g.selectAll('.node')[0][index];
                // console.log(selectedNode);

                document.getElementById("result-box").innerHTML = graph.nodes[all_chara.indexOf(search_chara)]['name'] + " is in the archive";
                document.getElementById("result-box").style.backgroundColor = "rgb(150,194,78)";
                image("checked.png");

            } else {

                document.getElementById("result-box").innerHTML = search_chara + " isn't in the archive";
                document.getElementById("result-box").style.backgroundColor = "rgb(252,211,55)";
                image("help-web-button.png");
            }



        };

    };


    search_and_autocentre();
    /////////////////////// END search




    var tocolor = "fill";
    var towhite = "stroke";
    var showTag = "1";
    var hideTag = "0.3";
    if (outline) {
        tocolor = "stroke"
        towhite = "fill"
        showTag = "0.3"
        hideTag = "1"
    }


    var circle = node.append("path")

        .attr("d", d3.svg.symbol()
            .size(function (d) { return Math.PI * Math.pow(nominal_base_node_size, 2); }))

        .style(tocolor, function (d) {
            if (isNumber(d.score)) return color[d.score-1];
            else return default_node_color;
        })
        //.attr("r", function(d) { return size(d.size)||nominal_base_node_size; })
        .style("stroke-width", nominal_stroke)
        .style(towhite, default_node_color);


    var text = g.selectAll(".text")
        .data(graph.nodes)
        .enter().append("text")
        .style("font-size", nominal_text_size + "px")
        .style("text-anchor", "middle")
        .style("opacity", hideTag);

    if (text_center)
        text.text(function (d) { return d.name; })
            .style("text-anchor", "middle");
    else
        text.attr("dx", function (d) { return (size(d.size) || nominal_base_node_size); })
            .text(function (d) { return d.name; });

    node.on("mouseover", function (d) {
        set_highlight(d);
    })
        .on("mousedown", function (d) {
            d3.event.stopPropagation();
            focus_node = d;
            set_focus(d)
            if (highlight_node === null) set_highlight(d)

        }).on("mouseout", function (d) {
            exit_highlight();

        });


    d3.select(window).on("mouseup",
        function () {
            if (focus_node !== null) {
                focus_node = null;
                if (highlight_trans < 1) {

                    circle.style("opacity", 1);
                    text.style("opacity", 1);
                    link.style("opacity", 1);
                }
            }

            if (highlight_node === null) exit_highlight();
        });

    function exit_highlight() {
        highlight_node = null;
        if (focus_node === null) {
            svg.style("cursor", "move");
            if (highlight_color != "white") {
                circle.style(towhite, default_node_color);
                circle.style(tocolor, default_node_color);
                text.style("font-weight", "normal");
                text.style("opacity", hideTag);
                link.style("stroke", default_link_color);
                link.style("opacity", ATrans);
            }

        }
    }

    function set_focus(d) {
        if (highlight_trans < 1) {
            circle.style("opacity", function (o) {
                return isConnected(d, o) ? 1 : highlight_trans;
            });

            text.style("opacity", function (o) {
                return isConnected(d, o) ? 1 : highlight_trans;
            });

            link.style("opacity", function (o) {
                return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans;
            });

        }
    }





    function set_highlight(d) {
        // svg.style("cursor", "pointer");
        if (focus_node !== null) d = focus_node;
        highlight_node = d;
        // console.log(d);

        if (highlight_color != "white") {
            circle.style(towhite, function (o) {
                return isConnected(d, o) ? highlight_color : "(154,0,0)";
            });
            circle.style(tocolor, function (o) {
                return isConnected(d, o) ? highlight_color : "(154,0,0)";
            });
            text.style("font-weight", function (o) {
                return isConnected(d, o) ? "opacity" : showTag;
            });
            link.style("stroke", function (o) {
                return o.source.index == d.index || o.target.index == d.index ? highlight_color : ((isNumber(o.score) && o.score >= 0) ? color(o.score) : default_link_color);

            });
            link.style("stroke", function (o) {
                return o.source.index == d.index || o.target.index == d.index ? highlight_color : ((isNumber(o.score) && o.score >= 0) ? "opacity"(o.score) : 0.3);

            });
        }
    }




    //search
    // make row name bold 
    d3.selectAll('.text')
        .filter(function (d) { return d.name == search_chara })
        .select('text')
        .style('font-weight', 'bold');
    // highlight row name 
    d3.selectAll('.text')
        .filter(function (d) { return d.name == search_chara })
        .select('text')
        .style('opacity', 1);

    //search end


    zoom.on("zoom", function () {

        var stroke = nominal_stroke;
        if (nominal_stroke * zoom.scale() > max_stroke) stroke = max_stroke / zoom.scale();
        link.style("stroke-width", stroke);
        circle.style("stroke-width", stroke);

        var base_radius = nominal_base_node_size;
        if (nominal_base_node_size * zoom.scale() > max_base_node_size) base_radius = max_base_node_size / zoom.scale();
        circle.attr("d", d3.svg.symbol()
            .size(function (d) { return Math.PI * Math.pow(size(d.size) * base_radius / nominal_base_node_size || base_radius, 2); })
            .type(function (d) { return d.type; }))

        //circle.attr("r", function(d) { return (size(d.size)*base_radius/nominal_base_node_size||base_radius); })
        if (!text_center) text.attr("dx", function (d) { return (size(d.size) * base_radius / nominal_base_node_size || base_radius); });

        var text_size = nominal_text_size;
        if (nominal_text_size * zoom.scale() > max_text_size) text_size = max_text_size / zoom.scale();
        text.style("font-size", text_size + "px");

        g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    });

    svg.call(zoom);

    resize();
    //window.focus();
    d3.select(window).on("resize", resize).on("keydown", keydown);

    force.on("tick", function () {

        node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
        text.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node.attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    });

    function resize() {
        var width = window.innerWidth - 24, height = window.innerHeight - 88;
        svg.attr("width", width).attr("height", height);

        force.size([force.size()[0] + (width - w) / zoom.scale(), force.size()[1] + (height - h) / zoom.scale()]).resume();
        w = width;
        h = height;
    }

    function keydown() {
        if (d3.event.keyCode == 32) { force.stop(); }
        else if (d3.event.keyCode >= 48 && d3.event.keyCode <= 90 && !d3.event.ctrlKey && !d3.event.altKey && !d3.event.metaKey) {
            switch (String.fromCharCode(d3.event.keyCode)) {
                case "C": keyc = !keyc; break;
                case "S": keys = !keys; break;
                case "T": keyt = !keyt; break;
                case "R": keyr = !keyr; break;
                case "X": keyx = !keyx; break;
                case "D": keyd = !keyd; break;
                case "L": keyl = !keyl; break;
                case "M": keym = !keym; break;
                case "H": keyh = !keyh; break;
                case "1": key1 = !key1; break;
                case "2": key2 = !key2; break;
                case "3": key3 = !key3; break;
                case "0": key0 = !key0; break;
            }

            link.style("display", function (d) {
                var flag = vis_by_type(d.source.type) && vis_by_type(d.target.type) && vis_by_node_score(d.source.score) && vis_by_node_score(d.target.score) && vis_by_link_score(d.score);
                linkedByIndex[d.source.index + "," + d.target.index] = flag;
                return flag ? "inline" : "none";
            });
            node.style("display", function (d) {
                return (key0 || hasConnections(d)) && vis_by_type(d.type) && vis_by_node_score(d.score) ? "inline" : "none";
            });
            text.style("display", function (d) {
                return (key0 || hasConnections(d)) && vis_by_type(d.type) && vis_by_node_score(d.score) ? "inline" : "none";
            });

            if (highlight_node !== null) {
                if ((key0 || hasConnections(highlight_node)) && vis_by_type(highlight_node.type) && vis_by_node_score(highlight_node.score)) {
                    if (focus_node !== null) set_focus(focus_node);
                    set_highlight(highlight_node);
                }
                else { exit_highlight(); }
            }

        }
    }

});

function vis_by_type(type) {
    switch (type) {
        case "circle": return keyc;
        case "square": return keys;
        case "triangle-up": return keyt;
        case "diamond": return keyr;
        case "cross": return keyx;
        case "triangle-down": return keyd;
        default: return true;
    }
}
function vis_by_node_score(score) {
    if (isNumber(score)) {
        if (score >= 0.666) return keyh;
        else if (score >= 0.333) return keym;
        else if (score >= 0) return keyl;
    }
    return true;
}

function vis_by_link_score(score) {
    if (isNumber(score)) {
        if (score >= 0.666) return key3;
        else if (score >= 0.333) return key2;
        else if (score >= 0) return key1;
    }
    return true;
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


