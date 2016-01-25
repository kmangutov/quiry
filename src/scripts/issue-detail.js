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