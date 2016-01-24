'use strict'

// import $ from 'jquery';

const ROOT_URL = "http://robs-cors-server.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/";
const AREA_URL = "http://robs-cors-server.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/lan";
const PROF_URL = "http://robs-cors-server.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesgrupper?yrkesomradeid=3";
const KOMMUN_URL = "http://robs-cors-server.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/kommuner?lanid=";
const YRKES_IN_AREA = "http://robs-cors-server.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?kommunid=";
const GET_ADD = "https://cors-anywhere.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/";
const GET_LOGO = "http://api.arbetsformedlingen.se/af/v0/platsannonser/";
const BYPROF_URL = "http://robs-cors-server.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?yrkesid=";
const TEXT_URL = "http://robs-cors-server.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?nyckelord=";
var myFirebaseRef = new Firebase("https://jobbapi.firebaseio.com/");


$(document).ready(function() {

  var ref = new Firebase("https://jobbapi.firebaseio.com/latest");
  ref.orderByChild("timestamp").limitToLast(5).on("child_added", function(snapshot) {

    var snap = snapshot.val();

    renderFeed(snap);
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  var strRef = new Firebase("https://jobbapi.firebaseio.com/searchStr");
  strRef.orderByChild("timestamp").limitToLast(5).on("child_added", function(snapshot) {

    var snap = snapshot.val();

    renderWordFeed(snap);
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });



  $('#textInputBtn').on('click',function(){
  window.$('#myTab li:eq(2) a').tab('show');
    let searchStr = $('#textInput').val();
   callTestApi(TEXT_URL + searchStr, "srcStr");
  });
$('#byArea, #byJob').addClass('hidden');

$('.collapse').on('hidden.bs.collapse', function () {
  var target = '#'+$(this).attr('data-parent');
  $(target).removeClass('collapse-open');
});

$('#areaSearch').on('click',function(){
  $('#byArea').removeClass('hidden');
  $('#byJob').addClass('hidden');
  $('#yrkesannons').find('tbody').empty();
  callTestApi(AREA_URL,this.id)
});

$('#jobSearch').on('click',function(){
  $('#byJob').removeClass('hidden');
  $('#byArea').addClass('hidden');
  callTestApi(PROF_URL,this.id)
  });



// SEARCH_BY_AREA -START-
  $('#lanTempl').on('click', 'td', function(e){
    $('#kommuner, #yrkesannons').find('tbody').empty();
    window.$('#myTab li:eq(1) a').tab('show');
      var id = $(this).attr('id');
      var name =   $(this).closest('table').attr('id');
         callTestApi(KOMMUN_URL + id, name)



  });



  $('#kommunTempl').on('click', 'td', function(){
    $('#yrkesannons').find('tbody').empty();
    window.$('#myTab li:eq(2) a').tab('show');
        var id = $(this).attr('id');
        var name =   $(this).closest('table').attr('id');
         callTestApi(YRKES_IN_AREA + id + '&yrkesomradeid=3', name)
         $('#item3').addClass('active');
  });


  $('#areaAdsTempl').on('click', 'td', function(){
        var id = $(this).attr('id');
        var name =   $(this).closest('table').attr('id');
         callTestApi(GET_ADD + id , name)
  });
// SEARCH_BY_AREA -END-



// var onImageError = function(element) {
//   console.log('failed to load', element.src)
//   element.remove();
// }



// SEARCH_BY_PROFESSION -START-
  $('#profTempl').on('click', 'td', function(){
    window.$('#myTabJob li:eq(1) a').tab('show');
        var id = $(this).attr('id');
          var name =   $(this).closest('table').attr('id');
          callTestApi(ROOT_URL + 'yrken?yrkesgruppid='+ id, name)
  });

  $('#yrkesgrupperTempl').on('click', 'td', function(){
    window.$('#myTabJob li:eq(2) a').tab('show');
        var id = $(this).attr('id');
        var name =   $(this).closest('table').attr('id');
        callTestApi(BYPROF_URL + id, name)
      $('#item3Job').addClass('active');
  });
  $('#yrkesAdsTempl').on('click', 'td', function(){

        var id = $(this).attr('id');
        var name =   $(this).closest('table').attr('id');
         callTestApi(GET_ADD + id , name)
  });
  // SEARCH_BY_PROFESSION -END-


  // CLICK SingleAnnons -START-



  $('#feedTempl').on('click','a', function(){

      callTestApi(GET_ADD + this.id, "fromLatest")
  });



});




      function callTestApi(url, name) {
        $('#kommunSpin').addClass('show');
        $.ajax({
             url:  url,
             type: 'GET',
             success: function(res) {
                 $('#kommunSpin').removeClass('show');
                createTable(res,name,url);
             },
              error: function(err) { alert(err); },
          });
      }




//Kan göras snyggare?
function createTable(data,name, url) {
  console.log(name);
switch (name) {
  //AREA_CASES
  case "areaSearch":
  renderLan(data.soklista.sokdata)
    break;
  case "lan":
  renderKommun(data.soklista.sokdata)
    break;
  case "kommuner":
    renderAreaAds(data.matchningslista.matchningdata)
    break;
//PROFESSION_CASES
  case "jobSearch":
  renderProf(data.soklista.sokdata)
    break;
  case "yrkesgrupper":
  renderYrkesgrupper(data.soklista.sokdata)
      break;
  case "yrken":
  renderYrkesAds(data.matchningslista.matchningdata)
      break;
  case "yrkesannons":
  renderAdd(data.platsannons.annons)
      break;
  case "fromLatest":
  renderAddfromLatest(data.platsannons.annons, url, myFunction)
      break;
  case "srcStr":
  renderAddsByStr(data.matchningslista.matchningdata)
      break;
    default:
      console.log('oh no');
      break;
  }
}


function renderAddsByStr(data) {
  console.log(data);
  var stamp = Date.now()
  var timestamp = new Date();
  var time = timestamp.toTimeString();
  var day = timestamp.toDateString();
  var templ = $('#areaAdsTemplate').html(),
   compiled = Handlebars.compile(templ),
   rendered = compiled({areaAdd: data});
   $('#areaAdsTempl').html(rendered);

   var latestRef = myFirebaseRef.child("searchStr");
   latestRef.push({
       string: $('#textInput').val(),
       hits: data.length,
       day: day,
       time: time,
       timestamp: Firebase.ServerValue.TIMESTAMP
   });
}


function renderLan(data) {
  var templ = $('#lanTemplate').html(),
   compiled = Handlebars.compile(templ),
   rendered = compiled({lan: data});
   $('#lanTempl').html(rendered);
}

function renderKommun(data) {
  var templ = $('#kommunTemplate').html(),
   compiled = Handlebars.compile(templ),
   rendered = compiled({kommun: data});
   $('#kommunTempl').html(rendered);
}

function renderAreaAds(data) {
console.log(data);
  var templ = $('#areaAdsTemplate').html(),
   compiled = Handlebars.compile(templ),
   rendered = compiled({areaAdd: data});
   $('#areaAdsTempl').html(rendered);
}

function renderProf(data) {

  var templ = $('#profTemplate').html(),
   compiled = Handlebars.compile(templ),
   rendered = compiled({prof: data});
   $('#profTempl').html(rendered);
}

function renderYrkesgrupper(data) {

  var templ = $('#yrkesgrupperTemplate').html(),
   compiled = Handlebars.compile(templ),
   rendered = compiled({yrkesgrupp: data});
   $('#yrkesgrupperTempl').html(rendered);
}



function renderYrkesAds(data) {
  console.log(data);;
  var templ = $('#yrkesAdsTemplate').html(),
   compiled = Handlebars.compile(templ),
   rendered = compiled({yrkesAdd: data});
   $('#yrkesAdsTempl').html(rendered);
}


function renderAdd(data) {
console.log(data);
  data.logo = GET_LOGO + data.annonsid + '/logotyp';
var stamp = Date.now()
var timestamp = new Date();
var time = timestamp.toTimeString();
var day = timestamp.toDateString();

  var templ = $('#adTemplate').html();
  var compiled = Handlebars.compile(templ);
  var theCompiledHtml = compiled(data);
  $('#adTempl').html(theCompiledHtml);

var latestRef = myFirebaseRef.child("latest");
latestRef.push({
    id: data.annonsid,
    rubrik: data.annonsrubrik,
    kommun: data.kommunnamn,

    day: day,
    time: time,
    timestamp: Firebase.ServerValue.TIMESTAMP
});
}


function renderAddfromLatest(data, url) {


  data.logo = GET_LOGO + data.annonsid + '/logotyp';
  var templ = $('#adTemplate').html();
  var compiled = Handlebars.compile(templ);
  var theCompiledHtml = compiled(data);
  $('#adTempl').html(theCompiledHtml);



};

 window.myFunction = function(el) {
   el.remove();
  console.log('failed to load', el.src)

}


function renderFeed(data) {
console.log(data);
data.logo = GET_LOGO + data.id + '/logotyp';
  var templ = $('#feedTemplate').html();
  var compiled = Handlebars.compile(templ);
  var theCompiledHtml = compiled(data);
  $('#feedTempl').prepend(theCompiledHtml);
  $("#feedTempl").fadeIn(1000);
};

function renderWordFeed(data) {
console.log(data);
data.logo = GET_LOGO + data.id + '/logotyp';
  var templ = $('#wordFeedTemplate').html();
  var compiled = Handlebars.compile(templ);
  var theCompiledHtml = compiled(data);
  $('#wordFeedTempl').prepend(theCompiledHtml);
  $("#wordFeedTempl").fadeIn(1000);
};

//Helpers

Handlebars.registerHelper('trimString', function(passedString) {
    var theString = passedString.substring(0,500);
    return new Handlebars.SafeString(theString + "...")
});

Handlebars.registerHelper('trimDate', function(passedString) {
    var theString = passedString.substring(0,9);
    return new Handlebars.SafeString(theString)
});

Handlebars.registerHelper('myFunction', function(el) {
  el.remove();
});
