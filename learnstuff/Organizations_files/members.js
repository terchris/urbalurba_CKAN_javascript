


/* Displays all tags on a organization */
function tags(tags) {
    return `
  ${tags.map(tag => ` ${tag} `).join("")}
`;
}

/* Writes text to a div - used for logging 
Se global variable to false to stop logging or just remove the divTag*/
function mylog(divTag, logTxt) {
    if (globalMyLog) {
        var element = document.getElementById(divTag);
        document.getElementById(divTag).innerText = element.innerText + logTxt + " :--  ";
    }
}


/* Test if a string is a valid json string */
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}



/* Inserts the search box */
function displaySearchbox(noMembers) {
    debugger;
    return `
    <div class="jumbotron jumbotron-fluid">
    <div class="container">
        <h1 class="display-3">Smarte Byer Norge - Nettverket</h1>
        <p class="lead">
            Smarte Byer Norge nettverket er i første rekke et uformelt nettverk der alle aktører som er interessert i smartbyutvikling
            kan finne hverandre, møtes på nøytral grunn, diskutere, dele erfaringer og bistå hverandre.
    </div>
</div>




<div>
    REMOVE THIS Logging:
    <p id="mylogdiv"></p>
</div>






`;
}



function setUserProperties(user) {
    // The user.about field is free txt. This code figures out how to read it.
    // If the field is empty. Well then its empty and we do nothing
    // if it contains text. Then we display the text (no test for lenght)
    // if it is a json string we try to get the fields

    // The user.about json looks like this { "title":"Boss", "aboutdisplay":"Self made man and genius", "profilepictureurl":"http://icons.iconarchive.com/icons/designbolts/free-male-avatars/128/Male-Avatar-Bowler-Hat-icon.png", "phone":"90054123", "email":"jalmar@jalla.no"}


    user.userProfileURL = ckanServer + "user/" + user.name; //Set the URL you go to when clicking on the user
    user.profilepictureurl = ""; // assume no picture



    if ($.isEmptyObject(user.about)) {
        user.aboutdisplay = ""; // about field is empty - don't display anything about the user
    } else if (isJson(user.about)) {
        // the about field contains a json string
        var userAboutObj = JSON.parse(user.about);
        for (var i in userAboutObj) {
            user[i] = userAboutObj[i]; // copy the attributes. whatever they may be
        }
        if (user.title != "") {
            user.aboutdisplay = user.title; // Display the tilte if there is one
        }

    } else {
        user.aboutdisplay = user.about; // there is some text there. Assume we can just display it
    }


    return user;
}





/* Figuring out what icon to symbolize organisation type
Icon set https://linearicons.com/free
*/
function orgType(orgType) {

    const researchIcon = 'graduation-cap';
    const publicIcon = 'institution';
    const startupIcon = 'rocket';
    const privateIcon = 'industry';
    const civilSocietyIcon = 'group';
    const defaultIcon = 'support';

    var icon = '';
    var orgTypeDisplayTxt = '';
    /* The case values here must correspond with the names in the extended schema for urbalurba*/
    switch (orgType) {
        case 'research':
            icon = researchIcon;
            orgTypeDisplayTxt = 'FoU';
            break;
        case 'public':
            icon = publicIcon;
            orgTypeDisplayTxt = 'Offentlig';
            break;
        case 'startup':
            icon = startupIcon;
            orgTypeDisplayTxt = 'Startup';
            break;
        case 'private':
            icon = privateIcon;
            orgTypeDisplayTxt = 'Privat';
            break;
        case 'civil_society':
            icon = civilSocietyIcon;
            orgTypeDisplayTxt = 'Sivilsamfunn';
            break;

        default:
            icon = defaultIcon;
    }

    return `<i class="fa fa-${icon} fa-sm mt-4" data-toggle="tooltip" data-placement="top" title="${orgTypeDisplayTxt}"></i>`;
}



/* displays the profile images for each user */
function avatars(users) {

    return `
            <!-- Start avatars -->
            <div class="avatars-stack mt-2">

                ${users.map(users => ` 
                <div class="avatar">
                <a href="${users.userProfileURL}" data-toggle="tooltip" data-placement="top" title="${users.display_name} ${users.aboutdisplay}">
                    <img class="img-avatar" src="${users.profilepictureurl}" onerror="this.onerror=null;this.src='${avatarImageDefaut}';">
                    </a>
                </div>  
            `).join("")}
            </div>     
            <!-- stop avatars --> 
`;
}






/* displays the card for a organization */


function memberTemplate(member) {
    return `
    <div class="col-sm-6 col-md-4 urbacard"> 
       <div class="card">

          <img class="card-img-top img-fluid" src="${member.image_display_url}" onerror="this.onerror=null;this.src='${organizationImageDefaut}';" alt="${member.display_name}">

          ${member.users ? avatars(member.users) : ""}

          <div class="card-body">                     
             <h4 class="card-title">${member.display_name} ${member.organization_type ? orgType(member.organization_type) : ""}</h4>              
             <h6 class="card-subtitle mb-2 text-muted">${member.slogan}</h6>
             <div class="collapse" id="collapse-${member.name}">
                <p class="card-text">${member.description}</p>
                <p>TAGS ${member.tags ? tags(member.tags) : ""}</p>
             </div>
          </div>
       
          <div class="card-footer">Mer iinfo
                <div class="card-header-actions">
                    <a href="#" class="card-header-action btn-minimize" data-toggle="collapse" data-target="#collapse-${member.name}" aria-expanded="true">
                    <i class="icon-info"></i>
                </a>
                <a href="#" class="card-header-action btn-setting">
                   <i class="icon-tag"></i>
                </a>
                <a href="#" class="card-header-action btn-close">
                   <i class="icon-location-pin"></i>
                </a>
                <a href="#" class="card-header-action btn-close">
                    <i class="icon-bulb"></i>
             </a>

             </div>
          </div>
      
       </div>
    </div>
  <!-- end card -->
    `;
}



/* Connects the search to the searchbox 
* The must class must exist <input type="text" class="searchboxfield" placeholder="Search..." />
* and must be loaded and ready before this function executes
* The search is quite nifty. A target is set on the div that we want to seatch in.
* the name of the target is urbacard
* Important. In order not just hide, but also reorganize the output on the screen, 
* the target must be set on the outer div that is to be removed.
*     <div class="col-sm-6 col-md-4 urbacard"> 
*       <div class="card">
*
* */
function searching(){
    $('.searchboxfield').on('input', function () { // connect to the div named searchboxfield
        var $targets = $('.urbacard'); // 
        $targets.show();
        debugger;
        var text = $(this).val().toLowerCase();
        if (text) {
            $targets.filter(':visible').each(function () {
                debugger;
                mylog(mylogdiv, text);
                var $target = $(this);
                var $matches = 0;
                // Search only in targeted element
                $target.find('h2, h3, h4, p').add($target).each(function () {
                    tmp = $(this).text().toLowerCase().indexOf("" + text + "");
                    debugger;
                    if ($(this).text().toLowerCase().indexOf("" + text + "") !== -1) {
                        debugger;
                        $matches++;
                    }
                });
                if ($matches === 0) {
                    debugger;
                    $target.hide();
                }
            });
        }

    });


}






/* Test if a user is an admin */
function isAdminUser(name) {
    // Check if a user is in the lis of admins that should not be displayed
    // return true if the user is an admin

    isAdminUserReturn = false;
    for (var i = 0; i <= adminUsersToRemove.length; i++) {
        if (adminUsersToRemove[i] == name) {
            isAdminUserReturn = true;
            break;
        }

    }
    return isAdminUserReturn;
}




function tidyOrganizations(members) {
    // Remove the organizations that are not "member": "yes",
    // Remove the ckan admin user from the list of users in the organization
    // call setUserProperties to figure out how to intepret the user.about field
    // tidy upp the employees field: convert it to a object

    newMemberArray = []; // All members are copied into this array.


    for (var i = 0; i < members.length; i++) {    //loop members
        //        if (members[i].member == 'yes') {  // we want only those marked member

        newMember = JSON.parse(JSON.stringify(members[i])); // copy the full member object

        if (newMember.hasOwnProperty('employees')) {   // if the field employees is present. make sure it is converted to a object
            if (isJson(newMember.employees)) {
                // the about field contains a json string
                var tempEmployeesObj = JSON.parse(newMember.employees);
                newMember.employees = tempEmployeesObj;
                //newMember.employees = JSON.parse(JSON.stringify(newMember.employees)); // seems to be the way one copies an array in javascript
            } else
                mylog(mylogdiv, "ERR: misformed employees in " + newMember.display_name + ": employees=" + newMember.employees + "=");

        } else
            mylog(mylogdiv, "No employees in " + newMember.display_name);



        // handle the ckan users for the member org 
        originalNumUsers = newMember.users.length; // count the original number
        delete newMember.users;  //delete the users
        let newUserArray = []; // we will copy all user that are not admin into this array

        for (var usrcount = 0; usrcount < originalNumUsers; usrcount++) { // loop users

            if (isAdminUser(members[i].users[usrcount].name)) {
                mylog(mylogdiv, "Admin user removed from : " + members[i].name) // not copied the admin user

            } else {
                theUser = setUserProperties(members[i].users[usrcount]); // set the properties for the user           
                newUserArray.push(theUser);            // and add it to the new list of users belonging to the org
            }
        }
        newMember.users = JSON.parse(JSON.stringify(newUserArray)); // seems to be the way one copies an array in javascript

        newMemberArray.push(newMember); // copy the organization. it is a member
        //        } else {
        //            // organization from result set in CKAN is not a member
        //            mylog(mylogdiv,"Not a member" + members[i].display_name);
        //        }

    }

    return newMemberArray;

}






var ckanServer = "http://data.urbalurba.com/"; // change to your own to test or use http://demo.ckan.org
//ckanServer = "http://172.16.1.96/";
var avatarImageDefaut="http://icons.iconarchive.com/icons/designbolts/free-male-avatars/128/Male-Avatar-Bowler-Hat-icon.png";
//var avatarImageDefaut = "http://icons.iconarchive.com/icons/icons8/windows-8/128/Users-Name-icon.png";
var organizationImageDefaut = "http://bucket.urbalurba.com/logo/dummylogo.png";


let adminUsersToRemove = ["terchris"]; // the ckan main admin is usually a member. so remove that one

// For logging to screen
const mylogdiv = "mylogdiv"; //there must be a div with this name in the html file
const globalMyLog = false;



/* loadOrganizationsFromCKAN
* to initiate you must put <body onload="loadOrganizationsFromCKAN()"> 
* in the html doc that uses this javascript - NO THAT DOESNT WORK
***/
function loadOrganizationsFromCKAN() {
// This cant be used in squarespace. Must use onload $(document).ready(function () {

    var organization_list_api = "/api/3/action/organization_list"; //the API. See http://docs.ckan.org/en/latest/api/index.html?highlight=organization_list#ckan.logic.action.get.organization_list
    var ckanURL = ckanServer + organization_list_api;
    var ckanParameters = { all_fields: "true", include_extras: "true", include_users: "true" }; // See API description for what parameters to use



    $.ajax({
        url: ckanURL,
        dataType: "jsonp",  // required: we want jsonp. See why here https://en.wikipedia.org/wiki/JSONP                
        data: ckanParameters,   // optional: but we use it to get all fields in this example
        cache: "false"      // optional: tell it to get it from the server each time                
    })
        .done(function (data) {
            if (data.success == true) { // CKAN sets success = true if the API was OK
                mylog(mylogdiv, "data.success");

                justMembers = tidyOrganizations(data.result); // add and remove stuff
                mylog(mylogdiv, "justMembers finished");
                mylog(mylogdiv, "JSON:" + JSON.stringify(justMembers));

                document.getElementById("app").innerHTML = `
                <!-- start cards -->
                <div class="row">    
                ${justMembers.map(memberTemplate).join("")}
                </div>
                <!-- End cards -->
           
           `;
            }
        })
        .fail(function () {
            alert("Failed: ", JSON.stringify(data));
            console.log(JSON.stringify(data));
            
        });



    $('a[data-toggle="tooltip"]').tooltip({
        animated: 'fade',
        placement: 'bottom',
        html: true
    });


    searching();




// for dockument ready use: });

};


