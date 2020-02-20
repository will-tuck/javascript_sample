document.getElementById('left').style.display = "none";
    var text;
    var url_params = new URLSearchParams(window.location.search);
    var job_id = url_params.get('id');
    var back_url = window.location.href;
    back_url = back_url.substring(0,back_url.indexOf("/viewposition"));
    setAll(document.getElementsByClassName("back"), "<a class=\"mybtn\" href = \"" + back_url + "\">all postings</a></p>");
    var post = undefined;
    callAPI();

    //update the displayed information with the post information once it is accessed
    function update(){
        // console.log(post)
        //id does not exist
        if(post == undefined){
            document.getElementById('left').innerHTML = "";
            document.getElementById('page_title').innerHTML = "<h1>Position not found</h1>";
            document.getElementById('desc').innerHTML = "<h2>The specified position no longer exists.</h2><br/>Please review our career site for other opportunities.";
            setAll(document.getElementsByClassName('apply'),"");
            return;
        } else if(post == "404error"){
            document.getElementById('left').innerHTML = "";
            document.getElementById('page_title').innerHTML = "<h1>Technical Error</h1>";
            document.getElementById('desc').innerHTML = "<h2>A technical issue has occurred.</h2><br/>Please <a href=" + window.location + ">reload</a> the page. If the problem persists, please try again another time.";
            setAll(document.getElementsByClassName('apply'),"");
        } else{
            var allowed_cats=["Officer", "Biostatistics","Clinical Development","Clinical Pharmacology","External Innovation","Medical Affairs","Pharmacovigilance-Safety","Research & Development Operations","Regulatory/Quality","Translational Medicine","CMC","HR & Administrative Operations","Finance","IT","Legal","Commercial Operations","Marketing","Access","New Product Planning","Sales", "Biomarker", "Discovery","Administrative"];
            var allowed_types=["Employee","Contractor", "Regular", "Inpatriate"];

            var new_cat = post.Job_Family_Reference[0].Job_Family_ID;
            switch (new_cat){
              case "Information Technology":
                new_cat = "IT"
                break;

                case "JFG_R&D Clinical Operations":
                new_cat = "Clinical Development"
                break;

                case "Medical Affairs":
                new_cat = "Pharmacovigilance-Safety"
                break;

                case "System Admin":
                new_cat = "IT"
                break;

                case "Purchasing":
                new_cat = "Marketing"
                break;

                case "JFG_R&D Discovery":
                new_cat = "Clinical Development"
                break;
								
								case "Clinical Trials":
                new_cat = "Clinical Development"
                break;
            }

            if(post.Job_Posting_Site_Reference_Job_Posting_Site_ID != "BBI" || !allowed_cats.includes(new_cat) || !allowed_types.includes(post.Job_Type_Reference_Employee_Type_ID)){
                post = undefined;
                update();
                return;
            }
            document.getElementById('left').style.display = "block";
            var title = post.Job_Posting_Title;
            var desc = post.Job_Posting_Description;
            document.getElementById('page_title').innerHTML = "<h1>" + title + "</h1>";
            document.getElementById('desc').innerHTML = desc;
            setAll(document.getElementsByClassName('apply'), "<a class=\"mybtn\" target=\"_blank\" href=\"" + post.External_Apply_URL + "\">Apply</a>");
            configureInfo();
            return;
        }
    }

    //sets the innerHTML of all elements in 'arr' to 'html'
    //used for applying the same html to all instances of things like apply buttons on the page
    function setAll(arr, html){
        for(var i=0;i<arr.length;i++){
            arr[i].innerHTML = html;
        }
    }

    //configure the info on the side bar
    function configureInfo(){


        var new_cat = post.Job_Family_Reference[0].Job_Family_ID;
            switch (new_cat){
              case "Information Technology":
                new_cat = "IT"
                break;

                case "JFG_R&D Clinical Operations":
                new_cat = "Clinical Development"
                break;

                case "Medical Affairs":
                new_cat = "Pharmacovigilance-Safety"
                break;

                case "System Admin":
                new_cat = "IT"
                break;

                case "Purchasing":
                new_cat = "Marketing"
                break;

                case "JFG_R&D Discovery":
                new_cat = "Clinical Development"
                break;

                case "Clinical Trials":
                new_cat = "Clinical Development"
                break;
            }





        document.getElementById('id').innerHTML = job_id;
        document.getElementById('cats').innerHTML = new_cat;
        if (post.Job_Type_Reference_Employee_Type_ID == "Regular"){
            document.getElementById('job_type').innerHTML = "Employee";
        } else {
            document.getElementById('job_type').innerHTML = "Contractor";
        } 
        if(post.Job_Posting_Location_Data.Primary_Location_Reference_Location_ID == 'Cambridge'){
            document.getElementById('loc').innerHTML = "Cambridge, Massachusetts"
        } else {
            document.getElementById('loc').innerHTML = post.Job_Posting_Location_Data.Primary_Location_Reference_Location_ID;
        }
    }

    //make the call to the Workato recipe to retrieve the information
    function callAPI(){
        var data = JSON.stringify({
            "id": job_id
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if(this.status == 404){
                    post = "404error";
                } else {
                    try{
                        var data = JSON.parse(this.responseText);
                        if(data.jobPostings.length > 0){ //posting found
                            //we only care about the first posting (there should only be one)
                            post = JSON.parse(data.jobPostings[0].postingData);
                            console.log(post)
                        } else { //no postings for that ID
                            post = undefined;
                        }
                    }
                    //JSON parse failure
                    catch(err){
                        console.log(err.message);
                    }
                }
                update();
            }   
        });
        //recipe URL goes here
        xhr.open("POST", "https://link");
        xhr.setRequestHeader("Content-Type", "application/json");
        //user API-Token goes here
        xhr.setRequestHeader("API-Token", "token");
        xhr.send(data);
    }