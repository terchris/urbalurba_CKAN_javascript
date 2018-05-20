


/**  tags Displays all tags on a organization as list items
 * 
 */
function tags(tags) {
    return `
  ${tags.map(tag => ` <li> <a href=""> ${tag.trim()}</a></li> `).join("")}
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


/**
    * The user.about field is free txt. This code figures out how to read it.
    * If the field is empty. Well then its empty and we do nothing
    * if it contains text. Then we display the text (no test for lenght)
    * if it is a json string we try to get the fields
    * The user.about json looks like this { "title":"Boss", "aboutdisplay":"Self made man and genius", "profilepictureurl":"http://icons.iconarchive.com/icons/designbolts/free-male-avatars/128/Male-Avatar-Bowler-Hat-icon.png", "phone":"90054123", "email":"jalmar@jalla.no"}
 */
function getExtendedUserProperties(user) {


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





/**
 *  Figuring out what icon to symbolize organisation type
 * Icon set https://linearicons.com/free
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
function displayUserAvatars(users) {

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

/** displayMemberContactInfo
 * 
 * 
 */
function displayMemberContactInfo(member){

    return `

    <!-- START org info-->
    <div class="list-group">

        <div class="list-group-item">
            <small class="text-muted mr-3">
                <i class="icon-location-pin"></i>  ${member.main_adddress}</small>
        </div>

        <div class="list-group-item">
            <small class="text-muted mr-3">
                <i class="icon-phone"></i>  ${member.phone}</small>
        </div>

        <div class="list-group-item">
            <small class="text-muted mr-3">
                <i class="icon-globe"></i>  ${member.website}</small>
        </div>

        <div class="list-group-item">
            <small class="text-muted mr-3">
                <i class="icon-user"></i>  ${member.contact_name}</small>
        </div>

        <div class="list-group-item">
            <small class="text-muted mr-3">
                <i class="fa fa-industry"></i>  ${member.organization_type}</small>
        </div>


        <div class="list-group-item">

            <small class="text-muted mr-3">
                <i class="icon-check"></i>  SBN medlem: ${member.member}</small>
            <small class="text-muted mr-3">
                <i class="icon-badge"></i>  SBN Prime medlem</small>
        </div>

    </div>
    <!-- SLUTT org info-->





    `;
}



/** displayMemberProfileCard
 * Takes member object as parameter and creates a card with member info
 * 
 */
function displayMemberProfileCard(member) {

    return `
    <div class="card">

    
    <img class="card-img-top img-fluid" src="${member.image_display_url}" onerror="this.onerror=null;this.src='${organizationImageDefaut}';" alt="${member.display_name}">    


    <div class="card-body">
        <h4 class="card-title">${member.display_name}
            ${member.organization_type ? orgType(member.organization_type) : ""} 
        </h4>
        <h6 class="card-subtitle mb-2 text-muted">${member.slogan}</h6>

        ${displayMemberContactInfo(member)}

    </div>
</div>

`;

}

/** displayMemberTagsCard
 * Takes member object as parameter and creates a card with tags info
 * 
 */
function displayMemberTagsCard(member) {

    return `
    <div class="card">
        <div class="card-header">
            Tags
        </div>
        <div class="card-body">
            <ul>
                ${member.tags ? tags(member.tags) : ""}
            </ul>    
        </div>
    </div>
    `;

}

/** displayMemberTagsSidebar displays the tags for a member in the sidebar
 * 
 */

function displayMemberTagsSidebar(member){

    if (member.tags != undefined) {
        var tagArray = member.tags.split(',');
        return `
        <div class="widget__content-NODEFINE">
            <ul>
                ${member.tags ? tags(tagArray) : ""}
            </ul>    
        </div>
        `;
    }
    else
    return `
    <div class="widget__content-NODEFINE">
       Ingen Tags definert. Se Acando for eksempel   
    </div>
    `;


}

/** displayMemberDescriptionCard
 * Takes member object as parameter and creates a card with about info
 * 
 */
function displayMemberDescriptionCard(member) {

    return `
    <div class="card">
        <div class="card-header">
            Om
        </div>
        <div class="card-body">
            <div class="list-group">
                <div class="list-group-item">            
                    ${member.description}
                </div>
            </div>
        </div>
    </div>
    `;

}



/**
 * 
 * 
 */
function articleTemplateCard(article,member) {

    return `
    <div>

        <div class="card">
            <div class="card-header">
                ${article.what}
            </div>
            <div class="card-body">
                ${article.text}
            </div>
            <div class="card-footer">
                <small>
                    <i class="icon-user"></i>
                    ${article.who}
                </small>
                <small>
                    <i class="icon-home"></i>
                    ${article.virksomhet}
                </small>
            </div>

        </div>

    </div>

    `;

}


function displayArticles(member) {

    var memberArticles = globalSBNnetworkInfo.filter(function(matchingMember) {
        return matchingMember.name == member.name;
    });
    
    // we must attach to the div id employees the first time because it has taken time to fetch the employees
    document.getElementById("SBNnetworkInfo_resource_id").innerHTML =  `
    <div class="container">
        <div class="row">
            ${memberArticles.map(articleTemplateCard).join("")}         
        </div>
    </div>
    `;    

}



/**
 * Read articles that has name=member.name 
 * 
 */
function readSBNnetworkInfo(member){

    if(Array.isArray(globalSBNnetworkInfo)){ // the array is already read
        displayArticles(member); 
    }else{
       // First call. Read it from server
        var client = new CKAN.Client(ckanServer, myAPIkey);
    
        client.action('datastore_search', { resource_id: SBNnetworkInfo_resource_id }, 
            function(err, result) {
                if (err != null) { //some error - try figure out what
                    debugger;
                    mylog(mylogdiv, "SBNnetworkInfo_resource_id ERROR: " +JSON.stringify(err));
                    console.log("SBNnetworkInfo_resource_id ERROR: " +JSON.stringify(err));
                } else // we have read the resource     
                {
                    globalSBNnetworkInfo = result.result.records;
                }       
                    displayArticles(member);     
            });

    }
}



/**
 * displays the card for a organization
 * 
 *
 */

function memberTemplateCard(member) {
    return `
    <div class="col-sm-6 col-md-2 urbacard" onclick="displayMemberOverlay('${member.id}')"> 
    
       
       ${(member.member != "no") ? '<div class="card border-success" >' : '<div class="card" >'}

          <img class="card-img-top img-fluid" src="${member.image_display_url}" onerror="this.onerror=null;this.src='${organizationImageDefaut}';" alt="${member.display_name}">

          
          <div class="card-body" style="
          padding-top: 0px;
          padding-bottom: 5px;
          padding-left: 5px;
          padding-right: 5px;
      ">                      
             <h5 class="card-title">${member.display_name}</h5>              
             <h6 class="card-subtitle mb-2 text-muted">${member.slogan}</h6>
             <div class="collapse" id="collapse-${member.name}">
                <p class="card-text">${member.description}</p>
                <p class="card-tags">${member.tags}</p>
             </div>
          </div>
       
          <div class="card-footer" style="
          padding-left: 6px;
          padding-right: 6px;
          padding-top: 0px;
          padding-bottom: 1px;
      ">
                 ${member.organization_type ? orgType(member.organization_type) : ""} 
                 ${member.description.length > 50 ? ` <i class="icon-info text-dark"></i> ` : ""}
                 ${member.phone ? ` <i class="icon-phone text-dark"></i> ` : ""}
                 ${ ((isValidResource(member.employees)) || (Array.isArray(member.employees))  )  ? ` <i class="icon-people"></i> ` : ""}
                 ${member.tags ? ` <i class="icon-tag text-dark"></i> ` : ""}              
                ${member.package_count > 0 ? ` <i class="fa fa-database text-muted"></i> ` : ""}                
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



/** employeeTemplateSidebar
 * Used to display employees in sidebar
 */
function employeeTemplateSidebar(employee) {

    return `    
    <!-- start employee -->
    <div class="list-group-item list-group-item-divider">
        <div class="avatar float-right">
            <img class="rounded-circle img-fluid d-block mx-auto" src="${employee.profilbilde}" onerror="this.onerror=null;this.src='${avatarImageDefaut}';" >
        </div>
        <div>
            <strong>${employee.fornavn} ${employee.etternavn}</strong>
        </div>
        <div>${employee.tittel}</div>
        <div>
            <small class="text-muted mr-3">
                <i class="icon-screen-smartphone"></i> <a href="tel:${employee.mobil}"> ${employee.mobil}
            </small>
    
            ${(employee.linkedin.length > 10) ? '<a href="${employee.twitter}" target="_blank"><small class="text-muted"><i class="icon-social-linkedin"></i></small></a> ' : ""}

            ${(employee.twitter.length > 10) ? '<a href="${employee.twitter}" target="_blank"><small class="text-muted"><i class="icon-social-twitter"></i></small></a> ' : ""}

        </div>

        <small class="text-muted">
            <i class="icon-envelope"></i>  ${employee.epost}
        </small>
    </div>
<!-- end employee -->
 `;




}

/** employeeTemplateRow Displays employees in a row 
 * 
 */
function employeeTemplateRow(employee) {


    return `
    <!-- start employee -->
    <div class="col-lg-4 col-sm-6 text-center mb-4">    
        <img class="rounded-circle img-fluid d-block mx-auto" src="${employee.profilbilde}" onerror="this.onerror=null;this.src='${avatarImageDefaut}';" >
        <h3>${employee.fornavn} ${employee.etternavn}
            <small>${employee.tittel}</small>
        </h3>
        <div>
            <small class="text-muted">
                <i class="icon-envelope"></i>  ${employee.epost}
            </small>
            <small class="text-muted mr-3">
                <i class="icon-screen-smartphone"></i> <a href="tel:${employee.mobil}"> ${employee.mobil}
            </small>
        </div>

        
        <a href="${employee.linkedin}" target="_blank">
            <small class="text-muted mr-3">
                <i class="icon-social-linkedin"></i>
            </small>
        </a>

        <a href="${employee.twitter}" target="_blank">
            <small class="text-muted">
                <i class="icon-social-twitter"></i>
            </small>
        </a>      
    </div>
  <!-- end employee -->
    `;


}


/** displayEmployeesSidebar
 * 
 */
function displayEmployeesSidebar(member) {


    return `
    <!-- start employees -->
    <div class="list-group">
        ${member.employees.map(employeeTemplateSidebar).join("")}         
    </div>
  <!-- end employees -->
    `;


}

/*** displays all employees for a member.
 * 
 */

function  displayEmployeesRow(member){

    return `
    <!-- start employees -->
    <div class="row">
        <div class="col-lg-12">
        <h2 class="my-4">Team</h2>
        </div>
        ${member.employees.map(employeeTemplateRow).join("")}
         
    </div>
  <!-- end employees -->
    `;
}



/** readEmployees reads all employees 
 * and adds it to the member object in the global array
 * Default the member.employees contains a resource_id for a dataset containing all employees 
 * If this function has run before, then the member.employees contains a array of all emplyees
 */
function readEmployees(member) {
   
    if (member.hasOwnProperty('employees')) {   // if the field employees is present. 
        if (isValidResource(member.employees)) { // the member has a valid pointer to a dataset resource


            
            var client = new CKAN.Client(ckanServer, myAPIkey);

            client.action('datastore_search', { resource_id: member.employees }, 
                function(err, result) {

                    if (err != null) { //some error - try figure out what
                        debugger;
                        mylog(mylogdiv, "readEmployees ERROR: " +JSON.stringify(err));
                        console.log("readEmployees ERROR: " +JSON.stringify(err));
                    } else // we have read the resource
                    {
                        member.employees = JSON.parse(JSON.stringify(result.result.records));     // copy the employees array to the member 
                        // we must attach to the div id employees the first time because it has taken time to fetch the employees
                        document.getElementById("employees").innerHTML =  `
                            ${displayEmployeesSidebar(member)} 
                        `;
        
                }
                
            });
            
        } 
        else if(Array.isArray(member.employees)){ // employees are already read into member object
            // when the employees are already in the array we can just output them
            return `
                ${displayEmployeesSidebar(member)} 
            `;
        }
        else 
        return `
        Kontaktpersoner ikke definert. Se Acando for hvordan kontakter vises når de er registrert
         `;
    }
    else 
    return `
    Kontaktpersoner ikke definert. Se Acando for hvordan kontakter vises når de er registrert..
     `;

}





/*** Test if a resurce_id is valid.
* A valid resource_id is llike this:
* 88ad7fac-f90c-4ae2-ba01-bcceb1486137
* Lenght = 36 
*****/
function isValidResource(resource_id) {

//TODO: write the code to validate the resource_id
    if (resource_id != undefined){
        var n = resource_id.length;
        if (n == 36)
            return true;
        else
            return false;
    }
}



function tidyOrganizations(members) {
    // Remove the organizations that are not "member": "yes",
    // Remove the ckan admin user from the list of users in the organization
    // call setUserProperties to figure out how to intepret the user.about field
  

    newMemberArray = []; // All members are copied into this array.


    for (var i = 0; i < members.length; i++) {    //loop members
        //        if (members[i].member == 'yes') {  // we want only those marked member

        newMember = JSON.parse(JSON.stringify(members[i])); // copy the full member object

       

        // handle the ckan users for the member org 
        originalNumUsers = newMember.users.length; // count the original number
        delete newMember.users;  //delete the users
        let newUserArray = []; // we will copy all user that are not admin into this array

        for (var usrcount = 0; usrcount < originalNumUsers; usrcount++) { // loop users

            if (isAdminUser(members[i].users[usrcount].name)) {
                mylog(mylogdiv, "Admin user removed from : " + members[i].name) // not copied the admin user

            } else {
                theUser = getExtendedUserProperties(members[i].users[usrcount]); // set the properties for the user           
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



/** getMembersDummyData
 * To avoid waiting for ckan server to return all members we just populate 
 * the screen with the first n member cards
 * 
 * The global array that holds members is globalMembers 
 */
function getMembersDummyData(){

    globalMembers = [
        {
            "package_count": 0,
            "num_followers": 0,
            "contact_name": "",
            "id": "ee3a213d-5836-4f72-ae77-8ef5d4472503",
            "display_name": "abb",
            "approval_status": "approved",
            "title": "",
            "member": "no",
            "state": "active",
            "is_organization": true,
            "type": "organization",
            "website": "http://www.abb.no",
            "description": " El-produkter, roboter og drivsystemer, industriell automatisering og kraftnett.",
            "main_adddress": "",
            "slogan": "Industriell automatisering",
            "name": "abb",
            "created": "2018-04-17T22:57:13.282926",
            "organization_type": "private",
            "employees": "",
            "image_display_url": "http://bucket.urbalurba.com/logo/abb.jpg",
            "insightly_tags": "Hurtigruten2018",
            "image_url": "http://bucket.urbalurba.com/logo/abb.jpg",
            "revision_id": "83b01469-3f20-412c-9f36-4e88db5e57be",
            "insightly_id": "107445495",
            "users": [
                {
                    "email_hash": "590c06df50b74f292f2258d1e64f323e",
                    "about": null,
                    "capacity": "admin",
                    "name": "urbalurbaadmin",
                    "created": "2018-04-14T00:11:07.970227",
                    "openid": null,
                    "sysadmin": true,
                    "activity_streams_email_notifications": false,
                    "state": "active",
                    "number_of_edits": 330,
                    "display_name": "urbalurbaadmin",
                    "fullname": null,
                    "id": "55f915f3-510e-4ab6-bdfb-fd8f0e6437a9",
                    "number_created_packages": 3,
                    "userProfileURL": "http://data.urbalurba.com/user/urbalurbaadmin",
                    "profilepictureurl": "",
                    "aboutdisplay": ""
                }
            ]
        },
        {
            "package_count": 0,
            "num_followers": 0,
            "contact_name": "",
            "id": "a27f3c27-11ef-4f04-921f-629fb58a9799",
            "display_name": "ABAX AS",
            "approval_status": "approved",
            "title": "ABAX AS",
            "member": "no",
            "state": "active",
            "is_organization": true,
            "type": "organization",
            "website": "https://www.abax.no/",
            "description": "Elektronisk kjørebok, utstyrskontroll og digital prosjektstyring",
            "main_adddress": "",
            "slogan": "Elektronisk kjørebok",
            "name": "abax-as",
            "created": "2018-04-17T22:41:34.215029",
            "organization_type": "private",
            "employees": "",
            "image_display_url": "http://bucket.urbalurba.com/logo/abax.jpg",
            "insightly_tags": "Hurtigruten2018",
            "image_url": "http://bucket.urbalurba.com/logo/abax.jpg",
            "revision_id": "a69fdd01-a464-4093-96e2-1737772eea7b",
            "insightly_id": "98965342",
            "users": [
                {
                    "email_hash": "590c06df50b74f292f2258d1e64f323e",
                    "about": null,
                    "capacity": "admin",
                    "name": "urbalurbaadmin",
                    "created": "2018-04-14T00:11:07.970227",
                    "openid": null,
                    "sysadmin": true,
                    "activity_streams_email_notifications": false,
                    "state": "active",
                    "number_of_edits": 330,
                    "display_name": "urbalurbaadmin",
                    "fullname": null,
                    "id": "55f915f3-510e-4ab6-bdfb-fd8f0e6437a9",
                    "number_created_packages": 3,
                    "userProfileURL": "http://data.urbalurba.com/user/urbalurbaadmin",
                    "profilepictureurl": "",
                    "aboutdisplay": ""
                }
            ]
        },
        {
            "package_count": 2,
            "num_followers": 0,
            "contact_name": "Dan Vigeland",
            "id": "5b60c765-ad61-4e9e-876d-5a19653a846b",
            "display_name": "Acando:)",
            "approval_status": "approved",
            "is_organization": true,
            "member": "yes",
            "state": "active",
            "type": "organization",
            "website": "https://www.acando.no/",
            "description": "Acando er et konsulentselskap som jobber med digitale transformasjoner i offentlig og private virksomheter. Teknologi er en sentral driver til forandring, men det er brukerens evne og ønske om å ta teknologien i bruk som skaper verdi. Med teknisk spisskompetanse og inngående innsikt i brukeratferd og forretningsutvikling drevet av digitalisering, skaper vi idéer, løsninger og mobiliserer organisasjoner til forandring.\r\nEt av våre satsningsområder er Smart City der Intelligente Transportsystemer (ITS) og selvkjørende minibusser i alminnelig trafikkmiljø, er en del av satsningen.",
            "main_adddress": "Tordenskioldsgate 8-10, 0160 Oslo",
            "phone": "93001000",
            "organization_number": "979191138",
            "slogan": "Digitalt konsulentselskap",
            "name": "acando",
            "created": "2018-04-16T19:18:33.457075",
            "organization_type": "private",
            "employees": "2dfb69b8-a9cc-47f2-a894-803001703737",
            "image_display_url": "http://bucket.urbalurba.com/logo/acando.jpg",
            "insightly_tags": "",
            "tags": "Selvkjørende, autonom, smart transport, smart mobility, buss,banan",
            "image_url": "http://bucket.urbalurba.com/logo/acando.jpg",
            "title": "Acando",
            "revision_id": "284d8271-bdeb-4173-9169-acf505ca856c",
            "insightly_id": "95288967",
            "users": [
                {
                    "email_hash": "590c06df50b74f292f2258d1e64f323e",
                    "about": null,
                    "capacity": "admin",
                    "name": "urbalurbaadmin",
                    "created": "2018-04-14T00:11:07.970227",
                    "openid": null,
                    "sysadmin": true,
                    "activity_streams_email_notifications": false,
                    "state": "active",
                    "number_of_edits": 330,
                    "display_name": "urbalurbaadmin",
                    "fullname": null,
                    "id": "55f915f3-510e-4ab6-bdfb-fd8f0e6437a9",
                    "number_created_packages": 3,
                    "userProfileURL": "http://data.urbalurba.com/user/urbalurbaadmin",
                    "profilepictureurl": "",
                    "aboutdisplay": ""
                }
            ]
        },
        {
            "website": "http://www.afconsult.com/",
            "display_name": "ÅF Lighting Norge",
            "description": "Rådgivning, offentlig belysning",
            "image_display_url": "http://bucket.urbalurba.com/logo/af-logo-tag-black.jpg",
            "organization_type": "startup",
            "created": "2018-04-18T01:22:38.620441",
            "name": "af-lighting-norge",
            "member": "yes",
            "is_organization": true,
            "state": "active",
            "image_url": "http://bucket.urbalurba.com/logo/af-logo-tag-black.jpg",
            "title": "ÅF Lighting Norge",
            "type": "organization",
            "package_count": 0,
            "slogan": "Rådgivning, offentlig belysning",
            "revision_id": "7b021d2e-5b70-4d16-91aa-9bb6ca7832f4",
            "insightly_id": "114887093",
            "num_followers": 0,
            "id": "a5e05ae1-dbe8-4579-95ec-9aec292dcce3",
            "approval_status": "approved",
            "users": [
                {
                    "email_hash": "590c06df50b74f292f2258d1e64f323e",
                    "about": null,
                    "capacity": "admin",
                    "name": "urbalurbaadmin",
                    "created": "2018-04-14T00:11:07.970227",
                    "openid": null,
                    "sysadmin": true,
                    "activity_streams_email_notifications": false,
                    "state": "active",
                    "number_of_edits": 330,
                    "display_name": "urbalurbaadmin",
                    "fullname": null,
                    "id": "55f915f3-510e-4ab6-bdfb-fd8f0e6437a9",
                    "number_created_packages": 3,
                    "userProfileURL": "http://data.urbalurba.com/user/urbalurbaadmin",
                    "profilepictureurl": "",
                    "aboutdisplay": ""
                }
            ]
        },
        {
            "package_count": 0,
            "num_followers": 0,
            "contact_name": "Gjermund Lanestedt",
            "id": "ba175754-a1b9-4e9f-9e31-f7f7268baa2b",
            "display_name": "Agenda Kaupang",
            "approval_status": "approved",
            "is_organization": true,
            "member": "yes",
            "state": "active",
            "type": "organization",
            "website": "https://www.agendakaupang.no/",
            "description": "Agenda Kaupang er et norsk konsulentselskap. Vi tilbyr analyse, utredning og rådgiving innen områdene ledelse, styring, økonomi og organisasjonsutvikling. Agenda Kaupangs kunder er primært i offentlig sektor, samt blant bedrifter og organisasjoner i arbeidslivet.",
            "main_adddress": "Holtet 45, 1368 Stabekk",
            "phone": "95195648",
            "organization_number": "968938525",
            "slogan": "Rådgivere for offentlig sektor",
            "name": "agenda-kaupang",
            "created": "2018-04-16T19:30:53.207288",
            "organization_type": "private",
            "employees": "",
            "image_display_url": "http://bucket.urbalurba.com/logo/agenda.jpg",
            "insightly_tags": "",
            "image_url": "http://bucket.urbalurba.com/logo/agenda.jpg",
            "title": "Agenda Kaupang",
            "revision_id": "1dc171bd-cbf1-4312-b31c-d3f706e49820",
            "insightly_id": "90622205",
            "users": [
                {
                    "email_hash": "590c06df50b74f292f2258d1e64f323e",
                    "about": null,
                    "capacity": "admin",
                    "name": "urbalurbaadmin",
                    "created": "2018-04-14T00:11:07.970227",
                    "openid": null,
                    "sysadmin": true,
                    "activity_streams_email_notifications": false,
                    "state": "active",
                    "number_of_edits": 330,
                    "display_name": "urbalurbaadmin",
                    "fullname": null,
                    "id": "55f915f3-510e-4ab6-bdfb-fd8f0e6437a9",
                    "number_created_packages": 3,
                    "userProfileURL": "http://data.urbalurba.com/user/urbalurbaadmin",
                    "profilepictureurl": "",
                    "aboutdisplay": ""
                }
            ]
        },
        {
            "package_count": 0,
            "num_followers": 0,
            "contact_name": "",
            "id": "0c6fc289-a443-4e32-9cab-6b59830a8076",
            "display_name": "AISPOT",
            "approval_status": "approved",
            "title": "AISPOT",
            "member": "yes",
            "state": "active",
            "is_organization": true,
            "type": "organization",
            "website": "https://aispot.no/",
            "description": "Aispot helps retail and destinations engage customers and increase loyalty. Enabling the concept of Future Shopping. Clients Simply connect to – and publish to their customers through a shared mobile platform utilizing beacons, QR, club, mobile Wallet and a range of ready-made services",
            "main_adddress": "",
            "slogan": "IoT og app for varehandel og reiseliv",
            "name": "aispot",
            "created": "2018-04-16T20:19:21.829200",
            "organization_type": "private",
            "employees": "",
            "image_display_url": "http://bucket.urbalurba.com/logo/aispot.jpg",
            "insightly_tags": "",
            "image_url": "http://bucket.urbalurba.com/logo/aispot.jpg",
            "revision_id": "08a4b0cf-7f13-4398-82ad-86cf5ec23ecc",
            "insightly_id": "120108147",
            "users": [
                {
                    "email_hash": "590c06df50b74f292f2258d1e64f323e",
                    "about": null,
                    "capacity": "admin",
                    "name": "urbalurbaadmin",
                    "created": "2018-04-14T00:11:07.970227",
                    "openid": null,
                    "sysadmin": true,
                    "activity_streams_email_notifications": false,
                    "state": "active",
                    "number_of_edits": 330,
                    "display_name": "urbalurbaadmin",
                    "fullname": null,
                    "id": "55f915f3-510e-4ab6-bdfb-fd8f0e6437a9",
                    "number_created_packages": 3,
                    "userProfileURL": "http://data.urbalurba.com/user/urbalurbaadmin",
                    "profilepictureurl": "",
                    "aboutdisplay": ""
                }
            ]
        }

    ];





}

/** displayMemberCards display all members in the 
 * array globalMembers
 * 
 */
function displayMemberCards() {

    document.getElementById("app").innerHTML = `
    <!-- start cards -->
    <div class="row">    
    ${globalMembers.map(memberTemplateCard).join("")}
    </div>
    <!-- End cards -->

    `;

}

/** displayMemberOverlay displays the info on the member
 * it is called when the user click on a member card
 * takes the member_id as parameter and uses it to find the member to be displayed in the global array globalMembers
 */

function displayMemberOverlay(member_id) {
                 


    var member = globalMembers.find(function (member) { return member.id === member_id; }); //get the member object
    document.getElementById("displayProfile").innerHTML = `



 <div class="container" style="background-color:white">

    <button type="button" class="close closebtn" aria-label="Close">
            <span aria-hidden="true">&times;</span>            
    </button>
    <section>

    
        <div style=" padding-top: 10px">
                
            <div class="jumbotron">
                <h1 class="display-3">${member.display_name}</h1>
                <p class="slogan">${member.slogan}</p>

            </div>
        </div>
        </section>
        
        <!-- start middle section-->
        <section>

            <div class="container">
                <!-- main and aside is placed in a row -->
                <div class="row no-gutters">
                    <main class="col-md-8 col-lg-8">
                        <div>
                            <div class="hidden-md-up">
                                <!-- terchris: denne vises på mobil skjerm -->                               
                                <img class="card-img-top img-fluid" src="${member.image_display_url}" onerror="this.onerror=null;this.src='${organizationImageDefaut}';" alt="${member.display_name}">    
                            </div>
                            <p class="leadtext">${member.description} </p>
                            
                        </div>
                        <div id="SBNnetworkInfo_resource_id">
                         .   
                        </div>
                        ${readSBNnetworkInfo(member)}
                        jalla


                    </main>
                    <aside class="col-md-4 col-lg-3 TCsidebar" >
                        <div class="TCsidebar__offset-wrapper">
                            <div class="hidden-sm-down">
                                <!-- terchris: denne vises på pc skjerm. Oppå topp banner eller under avh av oppløsning -->
                                <img class="card-img-top img-fluid" src="${member.image_display_url}" onerror="this.onerror=null;this.src='${organizationImageDefaut}';" alt="${member.display_name}">    
                            </div>
                        </div>
                        <!-- Start widgets-->
                        <div class="widgets-NODEFINE">


                            <div class="widget widget--widget_meta">
                                <h3 class="widget__title">Tags</h3>
                                ${displayMemberTagsSidebar(member)}
                            </div>

                            <div class="widget widget--widget_meta">
                                <h3 class="widget__title">Kontakt info</h3>
                                ${displayMemberContactInfo(member)}
                            </div>


                            <div class="widget widget--widget_meta">
                                <h3 class="widget__title">Kontaktpersoner</h3>
                                <div id="employees">
                                    ${readEmployees(member)}
                                </div>
                            </div>



                        </div>
                        <!-- Stop widgets-->
                    </aside>
                </div>
            </div>

        </section>
        <!-- end middle section-->



    </div>

           
           `;



    document.getElementById("memberOverlay").style.width = "100%";
}

        

function closeMemberOverlay() {
            document.getElementById("memberOverlay").style.width = "0%";
}
 




var myAPIkey = ""; // TODO: figure out how to set this a secure way
var ckanServer = "http://data.urbalurba.com/"; // change to your own to test or use http://demo.ckan.org
//ckanServer = "http://172.16.1.96/";
var avatarImageDefaut="http://icons.iconarchive.com/icons/designbolts/free-male-avatars/128/Male-Avatar-Bowler-Hat-icon.png";
//var avatarImageDefaut = "http://icons.iconarchive.com/icons/icons8/windows-8/128/Users-Name-icon.png";
var organizationImageDefaut = "http://bucket.urbalurba.com/logo/dummylogo.png";

const SBNnetworkInfo_resource_id = "0cd73796-e873-4079-a976-46cd765b6523";
let adminUsersToRemove = ["terchris"]; // the ckan main admin is usually a member. so remove that one

// For logging to screen
const mylogdiv = "mylogdiv"; //there must be a div with this name in the html file
const globalMyLog = false;

var globalSBNnetworkInfo; // First time we access SBN articles we read all of them and store them here
var globalMembers = []; // we need to access the member array after the cards are rendered



/**
 * This is the starting function. It reads the organisations from CKAN 
 * and displays the organizations/members as cards
 */
function loadOrganizationsFromCKAN() {

        var ckanParameters = { all_fields: "true", include_extras: "true", include_users: "true" }; // See API description for what parameters to use
    
        var client = new CKAN.Client(ckanServer, myAPIkey);

        client.action('organization_list', { all_fields: "true", include_extras: "true", include_users: "true" }, 
            function(err, result) {
                if (err != null) { //some error - try figure out what
                    mylog(mylogdiv, "organization_list ERROR: " +JSON.stringify(err));
                    console.log("organization_list ERROR: " +JSON.stringify(err));
                } else // we have read the data
                {
                    //globalMembers = JSON.parse(JSON.stringify(result.result.records));     
                    globalMembers = tidyOrganizations(result.result); // add and remove stuff
                    displayMemberCards(); // display the members fetched into globalMembers array                    
            }
            
        });

    
    
    
        $('a[data-toggle="tooltip"]').tooltip({
            animated: 'fade',
            placement: 'bottom',
            html: true
        });
    
    
        searching();
        getMembersDummyData();
        displayMemberCards(); 
    
    
    
    
    // for dockument ready use: });
    
    };
    
    