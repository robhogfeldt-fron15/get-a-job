"use strict";function renderAddsByStr(e){console.log(e);var a=new Date,r=a.toTimeString(),t=a.toDateString(),n=$("#areaAdsTemplate").html(),s=Handlebars.compile(n),o=s({areaAdd:e});$("#areaAdsTempl").html(o);var l=myFirebaseRef.child("searchStr");l.push({string:$("#textInput").val(),hits:e.length,day:t,time:r,timestamp:Firebase.ServerValue.TIMESTAMP})}function renderLan(e){var a=$("#lanTemplate").html(),r=Handlebars.compile(a),t=r({lan:e});$("#lanTempl").html(t)}function renderKommun(e){var a=$("#kommunTemplate").html(),r=Handlebars.compile(a),t=r({kommun:e});$("#kommunTempl").html(t)}function renderAreaAds(e){console.log(e);var a=$("#areaAdsTemplate").html(),r=Handlebars.compile(a),t=r({areaAdd:e});$("#areaAdsTempl").html(t)}function renderProf(e){var a=$("#profTemplate").html(),r=Handlebars.compile(a),t=r({prof:e});$("#profTempl").html(t)}function renderYrkesgrupper(e){var a=$("#yrkesgrupperTemplate").html(),r=Handlebars.compile(a),t=r({yrkesgrupp:e});$("#yrkesgrupperTempl").html(t)}function renderYrkesAds(e){console.log(e);var a=$("#yrkesAdsTemplate").html(),r=Handlebars.compile(a),t=r({yrkesAdd:e});$("#yrkesAdsTempl").html(t)}function renderAdd(e){console.log(e),e.logo=GET_LOGO+e.annonsid+"/logotyp";var a=new Date,r=a.toTimeString(),t=a.toDateString(),n=$("#adTemplate").html(),s=Handlebars.compile(n),o=s(e);$("#adTempl").html(o);var l=myFirebaseRef.child("latest");l.push({id:e.annonsid,rubrik:e.annonsrubrik,kommun:e.kommunnamn,day:t,time:r,timestamp:Firebase.ServerValue.TIMESTAMP})}function renderAddfromLatest(e){e.logo=GET_LOGO+e.annonsid+"/logotyp";var a=$("#adTemplate").html(),r=Handlebars.compile(a),t=r(e);$("#adTempl").html(t)}function renderFeed(e){console.log(e),e.logo=GET_LOGO+e.id+"/logotyp";var a=$("#feedTemplate").html(),r=Handlebars.compile(a),t=r(e);$("#feedTempl").prepend(t),$("#feedTempl").fadeIn(1e3);var n=$("#feedTempl div.childWrap").length;if(n>4){$("#feedTempl div:last-child").remove();var s=$("#feedTempl div:first-child");s.effect("highlight",{},3e3)}}function renderWordFeed(e){console.log(e),e.logo=GET_LOGO+e.id+"/logotyp";var a=$("#wordFeedTemplate").html(),r=Handlebars.compile(a),t=r(e);$("#wordFeedTempl").prepend(t),$("#wordFeedTempl").fadeIn(1e3);var n=$("<label>").text(" "+e.string+" ");n.css({backgroundColor:"#ddd",marginLeft:"10px",padding:"5px"}),$("#searchLabels").prepend(n);var s=$("#searchLabels label").length;if(s>4){$("#searchLabels label:last-child").remove();var o=$("#searchLabels label:first-child");o.effect("highlight",{},3e3)}}function callTestApi(e,a){$(".mdl-spinner").addClass("show"),$.ajax({url:e,type:"GET",success:function(r){createTable(r,a,e),$(".mdl-spinner").removeClass("show")},error:function(e){$(".mdl-spinner").removeClass("show"),alert("Hoppsan, det tog längre tid än väntat.\n Försök igen!")},timeout:8e3})}var ROOT_URL="http://robs-cors-server.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/",AREA_URL="http://robs-cors-server.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/lan",PROF_URL="http://robs-cors-server.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesgrupper?yrkesomradeid=3",KOMMUN_URL="http://robs-cors-server.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/kommuner?lanid=",YRKES_IN_AREA="http://robs-cors-server.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?kommunid=",GET_ADD="https://cors-anywhere.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/",GET_LOGO="http://api.arbetsformedlingen.se/af/v0/platsannonser/",BYPROF_URL="http://robs-cors-server.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?yrkesid=",TEXT_URL="http://robs-cors-server.herokuapp.com/http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?nyckelord=",myFirebaseRef=new Firebase("https://jobbapi.firebaseio.com/");$(document).ready(function(){var e=new Firebase("https://jobbapi.firebaseio.com/latest");e.orderByChild("timestamp").limitToLast(4).on("child_added",function(e){var a=e.val();renderFeed(a)},function(e){console.log("The read failed: "+e.code)});var a=new Firebase("https://jobbapi.firebaseio.com/searchStr");a.orderByChild("timestamp").limitToLast(5).on("child_added",function(e){var a=e.val();renderWordFeed(a)},function(e){console.log("The read failed: "+e.code)}),$("#textInputBtn").on("click",function(){window.$("#myTab li:eq(2) a").tab("show");var e=$("#textInput").val();callTestApi(TEXT_URL+e,"srcStr")}),$("#byArea, #byJob").addClass("hidden"),$(".collapse").on("hidden.bs.collapse",function(){var e="#"+$(this).attr("data-parent");$(e).removeClass("collapse-open")}),$("#areaSearch").on("click",function(){$("#byArea").removeClass("hidden"),$("#byJob").addClass("hidden"),$("#yrkesannons").find("tbody").empty(),$(".kommunSpin").addClass("show"),callTestApi(AREA_URL,this.id)}),$("#jobSearch").on("click",function(){$("#byJob").removeClass("hidden"),$("#byArea").addClass("hidden"),callTestApi(PROF_URL,this.id)}),$("#lanTempl").on("click","td",function(){$("#kommuner, #yrkesannons").find("tbody").empty(),window.$("#myTab li:eq(1) a").tab("show");var e=$(this).attr("id"),a=$(this).closest("table").attr("id");callTestApi(KOMMUN_URL+e,a)}),$("#kommunTempl").on("click","td",function(){$("#yrkesannons").find("tbody").empty(),window.$("#myTab li:eq(2) a").tab("show");var e=$(this).attr("id"),a=$(this).closest("table").attr("id");callTestApi(YRKES_IN_AREA+e+"&yrkesomradeid=3",a),$("#item3").addClass("active")}),$("#areaAdsTempl").on("click","td",function(){var e=$(this).attr("id"),a=$(this).closest("table").attr("id");callTestApi(GET_ADD+e,a)}),$("#profTempl").on("click","td",function(){window.$("#myTabJob li:eq(1) a").tab("show");var e=$(this).attr("id"),a=$(this).closest("table").attr("id");callTestApi(ROOT_URL+"yrken?yrkesgruppid="+e,a)}),$("#yrkesgrupperTempl").on("click","td",function(){window.$("#myTabJob li:eq(2) a").tab("show");var e=$(this).attr("id"),a=$(this).closest("table").attr("id");callTestApi(BYPROF_URL+e,a),$("#item3Job").addClass("active")}),$("#yrkesAdsTempl").on("click","td",function(){var e=$(this).attr("id"),a=$(this).closest("table").attr("id");callTestApi(GET_ADD+e,a)}),$("#feedTempl").on("click","a",function(){callTestApi(GET_ADD+this.id,"fromLatest")})}),window.myFunction=function(e){e.remove(),console.log("failed to load",e.src)};var createTable=function(e,a,r){switch(console.log(a),a){case"areaSearch":renderLan(e.soklista.sokdata);break;case"lan":renderKommun(e.soklista.sokdata);break;case"kommuner":renderAreaAds(e.matchningslista.matchningdata);break;case"jobSearch":renderProf(e.soklista.sokdata);break;case"yrkesgrupper":renderYrkesgrupper(e.soklista.sokdata);break;case"yrken":renderYrkesAds(e.matchningslista.matchningdata);break;case"yrkesannons":renderAdd(e.platsannons.annons);break;case"fromLatest":renderAddfromLatest(e.platsannons.annons,r,myFunction);break;case"srcStr":renderAddsByStr(e.matchningslista.matchningdata);break;default:console.log("oh no")}};Handlebars.registerHelper("trimString",function(e){var a=e.substring(0,500);return new Handlebars.SafeString(a+"...")}),Handlebars.registerHelper("trimDate",function(e){var a=e.substring(0,9);return new Handlebars.SafeString(a)}),Handlebars.registerHelper("myFunction",function(e){e.remove()});