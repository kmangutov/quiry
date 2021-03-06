var data = {
  "name": "flare",
  "children": 
  [
    {
      "name": "Criminal Law",
      "children": 
      [
        {"name": "AgglomerativeCluster", "size": 3938},
        {"name": "CommunityStructure", "size": 3812},
        {"name": "HierarchicalCluster", "size": 6714},
        {"name": "MergeEdge", "size": 743}
      ]
    },
    {
      "name": "Civil Law",
      "children": 
      [
        {
          "name": "Labor/Employment", 
          "children": 
          [
            {"name": "Government Regulations", "size": 1000},
            {
              "name": "Compensation & Benefits", 
              "children": 
              [
                {"name": "Party was injured while on the job", "size": 100},
                {"name": "Employer is denying compensation or benefits", "size": 150},
                {"name": "Dispute over benefits package", "size": 135},
                {"name": "Violation of contract provision", "size": 200},
                {"name": "Dispute over status as an employee", "size": 135}
              ]
            },
            {"name": "Leave", "size": 500},
            {"name": "Adverse Employment Action", "size": 1000},
            {"name": "Labor Relations", "size": 750},
            {"name": "Wages & Hours", "size": 250},
            {"name": "Safety & Health", "size": 250}
          ]
        },
        {"name": "Property", "size": 3812},
        {"name": "Torts", "size": 3812},
        {"name": "Corporate/Commercial Law", "size": 6714},
        {"name": "General Private Contract Disputes", "size": 743}
      ]
    }
  ]
}
var IssueDetail = (function(){

  var leafSelected = function(d) {
    console.log("leafSelected " + d.name);
    $('#issue-title').text(d.name);
    $('#issue-text').text("List of issue features here with graphs showing the cases")
  };

  var parentSelected = function(d) {
    console.log("leafSelected " + d.name);
    $('#issue-title').text(d.name);
    $('#issue-text').text("List of possible sub-issues here")
  };

  return {
    leafSelected: leafSelected,
    parentSelected: parentSelected
  };

})();

function stringifyObject ( obj ) {

  var seen = [];
  return JSON.stringify(obj, function(key, val) {
   if (val != null && typeof val == "object") {
        if (seen.indexOf(val) >= 0) {
            return;
        }
        seen.push(val);
    }
    return val;
  }); 
}

var margin = 20,
    diameter = 450;

var color = d3.scale.linear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

var pack = d3.layout.pack()
    .padding(2)
    .size([diameter - margin, diameter - margin])
    .value(function(d) { return d.size; })

var svg = d3.select("#issue-graph").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
  .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

//d3.json("flare.json", function(error, root) {
//  if (error) throw error;
  var root = data;

  var focus = root,
      nodes = pack.nodes(root),
      view;

  var circle = svg.selectAll("circle")
      .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
      .style("fill", function(d) { return d.children ? color(d.depth) : null; })
      .on("click", function(d) 
        { 
          if (focus !== d && "children" in d) {
            console.log("click non-leaf");
            zoom(d);
            d3.event.stopPropagation();
            IssueDetail.parentSelected(d);
          }
          else
          if(!("children" in d))  {
            console.log("click leaf");
            zoom(d.parent);
            //alert("Select");
            d3.event.stopPropagation();
            IssueDetail.leafSelected(d);
          }
        });

  var text = svg.selectAll("text")
      .data(nodes)
    .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
      .text(function(d) { return d.name; });

  var node = svg.selectAll("circle,text");

  d3.select("body")
      .style("background", color(-1))
      .on("click", function() { zoom(root); });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    var focus0 = focus; focus = d;
    console.log("zoom called target: " + stringifyObject(d));

    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll("text")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }
//});

d3.select(self.frameElement).style("height", diameter + "px");
