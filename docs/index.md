# My docs folder

### members
members is a small pice of code that reads organizations from the CKAN server an display them as bootstrap 4 cards.
[members.html](http://ckan.urbalurba.com/members.html)



Files here are the production version of files in the code.
If a file is named sbn_members.html in code it will be named members.html here
(spent hours debugging the wrong file once. So now they have different names)

## Installing in Squarespace

1. copy files

Copy sbn_members.* to the /docs folder
rename them to remove the beginning sbn_ 


2. change url links in members.html
```
    <link rel="stylesheet" type="text/css" href="http://ckan.urbalurba.com/members.css">
    <script src="http://ckan.urbalurba.com/members.js"></script>
```

3. Test that it works

http://ckan.urbalurba.com/member.html


4. On a page in Squarespace insert a code-block

In members.html select all between the  <body> </body> and paste it the code block.

I have this test page
 http://www.smartebyernorge.no/test


5. Tell squarespace to load javascript and css 

In Squarespace go to settings on the page you have the code block. 
Under Advanced. Paste into PAGE HEADER CODE INJECTION
See members.html head tags. 
All between "Squarespace header copy start" and "Squarespace header copy Stop" goes into the PAGE HEADER CODE INJECTION. 

```
    <!-- Squarespace header copy start. Paste to Settings - Advanced - PAGE HEADER CODE INJECTION-->

    <!-- From coreui.io START-->
    <!-- Icons-->
    <link href="http://ckan.urbalurba.com/vendors/css/flag-icon.min.css" rel="stylesheet">
    <link href="http://ckan.urbalurba.com/vendors/css/font-awesome.min.css" rel="stylesheet">
    <link href="http://ckan.urbalurba.com/vendors/css/simple-line-icons.css" rel="stylesheet">
    <!-- Main styles for this application -->
    <link href="http://ckan.urbalurba.com/css/style.css" rel="stylesheet">
    <!-- From coreui.io STOP-->


    <!-- From coreui.io START-->
    <!-- Bootstrap and necessary plugins-->
    <script src="http://ckan.urbalurba.com/vendors/js/jquery.min.js"></script>
    <script src="http://ckan.urbalurba.com/vendors/js/popper.min.js"></script>
    <script src="http://ckan.urbalurba.com/vendors/js/bootstrap.min.js"></script>
    <script src="http://ckan.urbalurba.com/vendors/js/pace.min.js"></script>
    <script src="http://ckan.urbalurba.com/vendors/js/perfect-scrollbar.min.js"></script>
    <script src="http://ckan.urbalurba.com/vendors/js/coreui.min.js"></script>
    <!-- From coreui.io STOP-->

    <!-- CKAN api -->
    <script src="http://okfnlabs.org/ckan.js/ckan.js"></script>


    <script src="http://ckan.urbalurba.com/members.js"></script>
    <link href="http://ckan.urbalurba.com/members.css" rel="stylesheet">

    <!-- when publishing change to this:
        <script src="http://ckan.urbalurba.com/members.js"></script>
        <link href="http://ckan.urbalurba.com/members.css" rel="stylesheet">
-->

    <!-- Squarespace header copy Stop-->
```