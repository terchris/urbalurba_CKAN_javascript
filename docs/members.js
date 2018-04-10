


/* Displays all tags on a organization */
function tags(tags) {
    return `
  ${tags.map(tag => ` ${tag} `).join("")}
`;
}

/* Writes text to a div - used for logging 
Se global variable to false to stop logging or just remove the divTag*/
function mylog(divTag, logTxt){
    if (globalMyLog){
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

    const researchIcon = 'lnr-graduation-hat';
    const publicIcon = 'lnr-shirt';  /*TODO: find other */
    const startupIcon = 'lnr-rocket';
    const privateIcon = 'lnr-apartment';
    const civilSocietyIcon = 'lnr-dinner';  /*TODO: find other */
    const defaultIcon = 'lnr-question-circle';

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



    return `
  <!--- Org type icon start -->                  
  <div class="card-img-overlay ">
    <a href="" ><span class="lnr ${icon}" data-toggle="tooltip" data-placement="bottom" title="${orgTypeDisplayTxt}"></span></a>
  </div>
  <!--- Org type iCon end -->                                 `;
}



/* displays the profile images for each user */
function avatars(users) {

    return `
  <!-- Start avatars -->
  <ul class="avatars">
    ${users.map(users => ` 
    <li>
        <a href="${users.userProfileURL}" data-toggle="tooltip" data-placement="top" title="${users.display_name} ${users.aboutdisplay}">
            <img src="${users.profilepictureurl}" onError="this.onerror=null;this.src='${avatarImageDefaut}';">
        </a>
    </li>
  
    `).join("")}
  </ul>      
  <!-- stop avatars --> 
`;
}



/* displays the card for a organization */

/* This must be fixed. It is the org type and should be a owelay 
// ${member.organization_type ? orgType(member.organization_type) : ""} 
*/

function memberTemplate(member) {
    return `
  <div class="card-deck col-lg-3 col-md-4 col-sm-6 urbacard"> 
  <div class="card">
  
    
  
      <img class="card-img-top img-fluid" src="${member.image_display_url}"
          alt="${member.display_name}">

         
  
          ${member.users ? avatars(member.users) : ""}
          <h4 class="card-title">${member.display_name}</h4>

          <h6 class="card-subtitle mb-2 text-muted">
          ${member.slogan}
          </h6>
          <div id="collapse-${member.name}" class="collapse" aria-labelledby="heading-${member.name}">
            <div class="card-body">
                <p class="card-text">${member.description}</p>
            </div>
         </div>

  
      <div class="card-footer text-muted">
          <ul class="menuItems">
                <li>
                    <a class="collapsed d-block" data-toggle="collapse" href="#collapse-${member.name}" aria-expanded="true" aria-controls="collapse-${member.name}"
                        id="heading-${member.name}">
                        <span class="lnr lnr-pointer-up"></span>
                    </a>
                </li>
                <li>
                    <span class="lnr lnr-tag"></span>
                    ${member.tags ? tags(member.tags) : ""}

                </li>
                <li>
                    <span class="lnr lnr-enter"></span>
                </li>
                <li>
                    <span class="lnr lnr-home"></span>
                </li>
      
          </ul>
      
      </div>
  </div>
  <!-- end card -->
  </div> 
    `;
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




function filterOrganizations(members) {
    // Remove the organizations that are not "member": "yes",
    // Remove the ckan admin user from the list of users in the organization
    // call setUserProperties to figure out how to intepret the user.about field

    newMemberArray = []; // All members are copied into this array.


    for (var i = 0; i < members.length; i++) {    //loop members
        if (members[i].member == 'yes') {  // we want only those marked member

            newMember = JSON.parse(JSON.stringify(members[i])); // copy the full member object
            originalNumUsers = newMember.users.length; // count the original number
            delete newMember.users;  //delete the users
            let newUserArray = []; // we will copy all user that are not admin into this array

            for (var usrcount = 0; usrcount < originalNumUsers; usrcount++) { // loop users

                if (isAdminUser(members[i].users[usrcount].name)) {
                    mylog(mylogdiv,"Admin user removed from : " + members[i].name) // not copied the admin user
                    
                } else {
                    theUser = setUserProperties(members[i].users[usrcount]); // set the properties for the user           
                    newUserArray.push(theUser);            // and add it to the new list of users belonging to the org
                }
            }
            newMember.users = JSON.parse(JSON.stringify(newUserArray)); // seems to be the way one copies an array in javascript
            newMemberArray.push(newMember); // copy the organization. it is a member
        } else {
            // organization from result set in CKAN is not a member
            mylog(mylogdiv,"Not a member" + members[i].display_name);
        }

    }

    return newMemberArray;

}






var ckanServer = "http://urbalurba.no"; // change to your own to test or use http://demo.ckan.org
ckanServer = "http://172.16.1.96/";
//var avatarImageDefaut="http://icons.iconarchive.com/icons/designbolts/free-male-avatars/128/Male-Avatar-Bowler-Hat-icon.png";
var avatarImageDefaut = "http://icons.iconarchive.com/icons/icons8/windows-8/128/Users-Name-icon.png";

var organizationImageDefaut = "";
let adminUsersToRemove = ["terchris"]; // the ckan main admin is usually a member. so remove that one

// For logging to screen
const mylogdiv="mylogdiv";
const globalMyLog = false;


// function loadOrganizationsFromCKAN() {
$(document).ready(function() {

    mylog(mylogdiv, "doc ready");


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
                document.getElementById("numMembers").innerHTML =
                    `
            ${data.result.length} 
            `;
                
                justMembers = filterOrganizations(data.result); // add and remove stuff
                mylog(mylogdiv, "justMembers finished");

                document.getElementById("app").innerHTML = `
                
            ${justMembers.map(memberTemplate).join("")}
            
           
           `;
            }
        })
        .fail(function () {
            alert("Failed for some reason");
        });






$("#mybutton1").click(function() {
    alert("klikket");
    mylog(mylogdiv,"klikket");
});

$('a[data-toggle="tooltip"]').tooltip({
    animated: 'fade',
    placement: 'bottom',
    html: true
});




    
    $('.searchbox').on('input', function () {
        var $targets = $('.urbacard'); // 
        $targets.show();
debugger;
        var text = $(this).val().toLowerCase();
        if (text) {
            $targets.filter(':visible').each(function () {
                debugger;
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



});




