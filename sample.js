api().then(function(info){

  $(document).ready(function(){
    $('.code').css("visibility", "visible")
  })

  
  var btn_next = document.getElementById("btn_next");
  var btn_prev = document.getElementById("btn_prev");
  var cat_list_off = ["Officer"];
  var cat_list_rnd=["Biostatistics","Clinical Development","Clinical Pharmacology","External Innovation","Medical Affairs",
                    "Medical Writing","Pharmacovigilance-Safety", "Program Managememt","Research & Development Operations",
                    "Regulatory/Quality","Translational Medicine","CMC", "Biomarker", "Discovery"];
  var cat_list_gna=["HR & Administrative Operations","Finance","IT","Legal"];
  var cat_list_commercial=["Business Intelligence/Commercial Operations","Marketing","Access","New Product Planning","Sales"];
  var cat_list_admin=["Administrative"];
  var second_array=[];
  var jobs=[];
  var job=[];
  var cat_map = new Map();
  var locations = new Map();
  var types = new Map();
  var collect=[];
  var cat = "All";
  var page = 0;
  var sizeOfPage = 20;
  var searchTerm = undefined;

  // page data
  var arr=new_arrays(second_array, sizeOfPage)
  var arr_len = arr.length;
  var start = 1;
  var end = arr_len;

  for (var key in info){
    var y = info[key];
    for(var i=0; i<y.length; i++){
      var z = JSON.parse(y[i].postingData);

      second_array.push(z);

    }
  }



for(var i=0;i<cat_list_off.length;i++){
    cat_map.set(cat_list_off[i], 0);
  }
  for(var i=0;i<cat_list_rnd.length;i++){
    cat_map.set(cat_list_rnd[i], 0);
  }
  for(var i=0;i<cat_list_gna.length;i++){
    cat_map.set(cat_list_gna[i], 0);
  }
  for(var i=0;i<cat_list_commercial.length;i++){
    cat_map.set(cat_list_commercial[i], 0);
  }
  for(var i=0;i<cat_list_admin.length;i++){
    cat_map.set(cat_list_admin[i], 0);
  }

  
  types.set("Regular", 0);
  types.set("Inpatriate", 0);

  for(var i=0;i<second_array.length;i++){
    var company = second_array[i].Job_Posting_Site_Reference_Job_Posting_Site_ID;
    var job_cat = second_array[i].Job_Family_Reference[0].Job_Family_ID;
    var type = second_array[i].Job_Type_Reference_Employee_Type_ID;
    var loc = second_array[i].Job_Posting_Location_Data.Primary_Location_Reference_Location_ID;
    


   
    switch (job_cat){
      case "Information Technology":
        job_cat = "IT";
        second_array[i].Job_Family_Reference[0].Job_Family_ID = "IT";
        break;

        case "JFG_R&D Clinical Operations":
        job_cat = "Clinical Development";
        second_array[i].Job_Family_Reference[0].Job_Family_ID = "Clinical Development";
        break;

        case "Medical Affairs":
        job_cat = "Pharmacovigilance-Safety";
        second_array[i].Job_Family_Reference[0].Job_Family_ID = "Pharmacovigilance-Safety";
        break;

        case "System Admin":
        job_cat = "IT";
        second_array[i].Job_Family_Reference[0].Job_Family_ID = "IT";
        break;

        case "Purchasing":
        job_cat = "Marketing";
        second_array[i].Job_Family_Reference[0].Job_Family_ID = "Marketing";
        break;

        case "JFG_R&D Discovery":
        job_cat = "Clinical Development";
        second_array[i].Job_Family_Reference[0].Job_Family_ID = "Clinical Development";
        break;

        case "Clinical Trials":
        job_cat = "Clinical Development";
        second_array[i].Job_Family_Reference[0].Job_Family_ID = "Clinical Development";
        break;
    }


    if(company != "BBI" || cat_map.get(job_cat) == undefined || types.get(type) == undefined){
      second_array.splice(i,1);
      i--;
      continue;
    }
    

    cat_map.set(job_cat, cat_map.get(job_cat) + 1);
    types.set(type, types.get(type) + 1);

    
    if(locations.get(loc) == undefined){
      locations.set(loc, 1);
    } else{
      locations.set(loc, locations.get(loc)+1);
    }
  }

  var total = 0;

  $(window).ready(function(){
    for(var [key,value] of cat_map){
      if(cat_list_off.includes(key)){
        $('.off').append('<tr><td class="basic"><a id="job">'+key+'</a></td><td class="pad">('+value+')</td></tr>');
      }
      if(cat_list_rnd.includes(key)){
        $('.rnd').append('<tr><td class="basic"><a id="job">'+key+'</a></td><td class="pad">('+value+')</td></tr>');
      }
      if(cat_list_gna.includes(key)){
        $('.gna').append('<tr><td class="basic"><a id="job">'+key+'</a></td><td class="pad">('+value+')</td></tr>');
      }
      if(cat_list_admin.includes(key)){
        $('.admin').append('<tr><td class="basic"><a id="job">'+key+'</a></td><td class="pad">('+value+')</td></tr>');
      }
      if(cat_list_commercial.includes(key)){
        if(key == "Business Intelligence/Commercial Operations"){
          $('.comm').append('<tr><td class="basic"><a id="job">'+'Business Intelligence/<br />  Commercial Operations' + '</a></td><td class="pad">('+value+')</td></tr>');
        }else{
        $('.comm').append('<tr><td class="basic"><a id="job">'+key+'</a></td><td class="pad">('+value+')</td></tr>');
      }
    }
      total+=value;
    }

    for (var [key, value] of locations){
      if(key == "Cambridge"){
        new_key = "Cambridge, Massachusetts";
        $('.location_list').append(
        '<tr><td class="basic"><span class="input_span">' + new_key + ' (' + value + ') ' + '</span></td><td class="pad"><input class="input locationSelect" type="checkbox" value="' + key + '"></td></tr>'
        ); 
      } else {
        $('.location_list').append(
        '<tr><td class="basic"><span class="input_span">' + key + ' (' + value + ') ' + '</span></td><td class="pad"><input class="input locationSelect" type="checkbox" value="' + key + '"></td></tr>'
        ); 
      }
      if (locations.has('Remote') == false){
        locations.set('Remote', 0)
      } 
    }

    for(var [key, value] of types){
      if(key == "Regular"){
      $('.type_list').append(
        '<tr><td class="basic"><span class="input_span">' + 'Employee' + ' (' + value + ') ' + '</span></td><td class="pad"><input class="input typeSelect" type="checkbox" value="' + key + '"></td></tr>'
      );
      } else {
        key = "Employee"
        $('.type_list').append(
        '<tr><td class="basic"><span class="input_span">' + 'Contractor' + ' (' + value + ') ' + '</span></td><td class="pad"><input class="input typeSelect" type="checkbox" value="' + key + '"></td></tr>'
      );
      } 
    }

    $(".all_").html("<a id='job'>All</a>")
    $(".all").html("("+total+ ")")
    update();
  })

  $(".typeSelect").on("change", function(){
    page = 0;
    update();
  });

  $(".locationSelect").on("change", function(){
    page = 0;
    update();
  });

  $(".cat_list").find("td").on("click", function(){
    $(".current").removeClass("current");
    $(".change").removeClass("change");
    $(this).addClass('change');
    $(this).siblings().addClass('change');
    $(this).addClass("current")
    console.log(cat)
    cat = $(this).find("a").html();
    switch (cat){
      case "Business Intelligence/<br>  Commercial Operations":
      cat = "Business Intelligence/Commercial Operations";
      break;

      case "Research &amp; Development Operations":
      cat = "Research & Development Operations";
      break;
      
    }
    if($(this).hasClass("pad")){
      cat = $(this).siblings().find("a").html();
    }
    page = 0;
    update();
    return;
  });

  $(".cat_list").find("td").hover(
    function(){
      $(this).addClass("hover");
      $(this).siblings().addClass("hover");
    },
    function(){
      $(this).removeClass("hover");
      $(this).siblings().removeClass("hover");
    }
  );

  $('#search').on('keyup', function(){
    page = 0;
    searchTerm = document.getElementById("search").value;
    update();
  })

  $(btn_next).on("click", function(){
    page++;
    update();
  })

  $(btn_prev).on("click", function(){
    page--;
    update();
  }) 

  function update(){
    $("#page").empty();
    $("#listingTable").empty();
    $(".inside").html(cat);

    

    


    var jobTypesSelected = [];
    var locationsSelected = [];

    var locationBoxes = document.getElementsByClassName('locationSelect');
    for(var i=0;i<locationBoxes.length;i++){
      if(locationBoxes[i].checked){
        locationsSelected.push(locationBoxes[i].value);
      }
    }

    var typeBoxes = document.getElementsByClassName('typeSelect');
    for(var i=0;i<typeBoxes.length;i++){
      if(typeBoxes[i].checked){
        jobTypesSelected.push(typeBoxes[i].value);
      }
    }


    var active = second_array.filter(function (info) {
      if (cat != "All" && info.Job_Family_Reference[0].Job_Family_ID != cat){
        return false; 
      } else if(jobTypesSelected.length > 0 && !jobTypesSelected.includes(info.Job_Type_Reference_Employee_Type_ID)){
        return false;
      } else if(locationsSelected.length > 0 && !locationsSelected.includes(info.Job_Posting_Location_Data.Primary_Location_Reference_Location_ID)){
        return false;
      } else if(!isValidSearch(searchTerm, info)){
        return false;
      } else {
        return true;
      }
    });

    active.sort(function(a,b){
      var date1 = a.Job_Posting_Start_Date.split("-");
      var date2 = b.Job_Posting_Start_Date.split("-");
      if (parseInt(date1[0]) != parseInt(date2[0])){
        return parseInt(date2[0]) - parseInt(date1[0]);
      } else if(parseInt(date1[1]) != parseInt(date2[1])){
        return parseInt(date2[1]) - parseInt(date1[1]);
      } else {
        return parseInt(date2[2]) - parseInt(date1[2]);
      }
    });

    var pageSplit = new_arrays(active, sizeOfPage);
    

    for(var i=0; page < pageSplit.length && i < pageSplit[page].length; i++){
      var new_loc = pageSplit[page][i].Job_Posting_Location_Data.Primary_Location_Reference_Location_ID;
      if (new_loc == "Cambridge"){
        new_loc = "Cambridge, Massachusetts"
      }
      $('#listingTable').append('<tr class="trows"><td><a class="a_trows" href=viewposition?id='+pageSplit[page][i].Job_Requisition_ID+'>'
        +pageSplit[page][i].Job_Posting_Title+'</a></td><td class="sec_in"> <span class="locat">Location:</span><br /> ' + new_loc + '</td></tr>'
        )
    }

    var extraRows = sizeOfPage;
    if(pageSplit.length === 0){
      $("#listingTable").append('<tr class="trows"><td class="no_res">Your Search Yielded No Results</td><td>&nbsp</td></tr>');
    }
    if(page < pageSplit.length){
      extraRows = sizeOfPage - pageSplit[page].length;
    }
    for(var i=0; i < extraRows; i++)
      $("#listingTable").append('<tr class="trows"><td>&nbsp</td><td>&nbsp</td></tr>');

    end = pageSplit.length - 1;
    if(page === 0 || pageSplit.length == 0){
      $(btn_prev).prop('disabled', true).addClass('greyed_out')
    } else {
      $(btn_prev).prop('disabled', false).removeClass('greyed_out')
    }

    if(page === end || pageSplit.length == 0){
      $(btn_next).prop('disabled', true).addClass('greyed_out')
    } else {
      $(btn_next).prop('disabled', false).removeClass('greyed_out')
    }




    
    var star = (page*20)+1;
    var fin = (page*20) + pageSplit[page].length;

    $("#page").append(
      star + ' - ' + fin + ' of ' + active.length
      );


  }
})

function api(){
  return Promise.resolve($.ajax({
    method: "POST",
    data : JSON.stringify({"id": "all"}),
    url: "https://link",
    headers: {
      "Content-Type": "application/json",
      "API-Token": "token"
    },
    success: function (result) {
      var result;
      window.result = result;
    },
    error: function (error) {
      $('.leftSide').css("display", "none");
      $('#page_title').html("<h1>Technical Error</h1>");
      $('.rightSide').html("<h2>A technical problem has occured.</h2><br/>Please <a href=" + window.location + ">reload</a> the page. If the problem persists, please try again another time.");
      $('.rightSide').css("visibility", "visible");
      console.log(error);
    }
  }));
}

function new_arrays(info, size){
  var arrayOfArrays = [];
  for (var i=0; i<info.length; i+=size) {
    arrayOfArrays.push(info.slice(i,i+size));
  }
  return arrayOfArrays;
}

function isValidSearch(search, info){
  if(search == undefined){
    return true;
  }
  var newSearch = search.toLowerCase().replace(/[^a-zA-z0-9.)(/\\&-]/g," ").replace(/ ( )+/g," ");
  var newTitle = info.Job_Posting_Title.toLowerCase().replace(/[^a-zA-z0-9.)(/\\&-]/g," ").replace(/ ( )+/g," ");
  var newDesc = info.Job_Posting_Description.toLowerCase().replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/[^a-zA-Z0-9 ]/g," ").replace(/ ( )+/g," ");


  return newSearch == '' || newTitle.includes(newSearch) || newDesc.includes(newSearch);
}