# My docs folder

Files here are the production version of files in the code.
If a file is named sbn_members.html in code it will be named members.html here
(spent hours debugging the wrong file once. So now they have different names)




## Installing in Squarespace

1. copy files
Copy sbn_members.* to the /docs folder
rename them to remove the beginning sbn_ 

2. test that it works
http://ckan.urbalurba.com/member.html


3. change url links in members.html
```
    <link rel="stylesheet" type="text/css" href="http://ckan.urbalurba.com/members.css">
    <script src="http://ckan.urbalurba.com/members.js"></script>
```
4. on a page in Squarespace insert a code-block
In members.html select all between the  <body> </body> and paste it the code block.

5. Tell squarespace to load javascript and css 
In Squarespace go to settings on the page you have the code block. 
Under Advanced. Paste into PAGE HEADER CODE INJECTION
Paste from below:

```
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossorigin="anonymous">
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
   
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
        crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
        crossorigin="anonymous"></script>


    <link rel="stylesheet" type="text/css" href="http://ckan.urbalurba.com/members.css">
    <script src="http://ckan.urbalurba.com/members.js"></script>
```