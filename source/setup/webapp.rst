Web Application
====================================== 

**This app is created to run in any web server environment.** 
	Because we wanted this application to be server agnostic we decided to use firebase to store our data.  This eliminates
	the need to have different setup requirements for different operating systems and also eliminates the need to setup a database.
	You will have to create a firebase project and then enter the details in the application, but that is all that is needed.  

	You can find a working demo here at `https://mapviewer.servirglobal.net <https://mapviewer.servirglobal.net>`_
	
The setup steps
------------------

-  `Setting up firebase`_
-  `Deploying to your server`_
-  `Adding layers`_


Setting up firebase
----------------------------------
	Start by navigating to `https://console.firebase.google.com <https://console.firebase.google.com/>`_.  If you are not signed in to your
	google account it will ask you to do so before it takes you to the console.  
	
	Once at the console you will:
	
	-	Click the Add project square.
	-	Enter mapviewer in the project name box
	-	Check both of the checkboxes to accept the terms.
	-	Click Create project
	-	Click Continue
	-	Click the button that looks like </> Add Firebase to your web app
	-	Copy the code snippet that is provided, set aside in a text editor and close the dialog box
	-	Expand Develop in the left menu panel
	-	Click Database
	-	Find the Cloud Firestore section (they move it frequently, currently it is at the top) 
	-	Click Create database
	-	Click Enable (leave the default 'Start in locked mode')
	-	Click rules and remove the code that is there, rpelace it with the following Where it says EnterYourGoogleAccountEmail replace with your email.  I have the code below so you can see the pattern to add more admin users.  
	
	if you want more add || request.auth.uid != null && request.auth.token.email == 'EnterAnotherAdminUsersGoogleAccountEmail' before the semicolon  If you don't need the second user remove that line i added.  You will need at minimum 
	to add your account to administer the application
	
	::	
	
		service cloud.firestore {
			match /databases/{database}/documents {
				match /{document=**} {
				allow read: if true;
				allow write: if request.auth.uid != null && request.auth.token.email == 'EnterYourGoogleAccountEmail' || request.auth.uid != null && request.auth.token.email == 'EnterAnotherAdminUsersGoogleAccountEmail';
				}
			}
		}
	

	-	Click Data tab at the top
	-	Click Add collection
	-	Type map-writer
	- 	Click Auto ID
	-	Enter canwrite for the field
	-	Enter map-writer in the value field
	-	Click Add
	-	Click Authentication in the top left of the side menu
	-	Click Sign-in method
	-	Click Google
	-	Select your Project support email
	-	You can add your domain here as well as a development donain such as http://localhost:SomePortNumber
	-	Toggle the enabled button
	-	Click Save
	
	That's all for setting up your firebase!
	
	
	

Deploying to your server
----------------------------------
	On any web server copy the files from `https://github.com/SERVIR/MapViewer <https://github.com/SERVIR/MapViewer/>`_
	into the folder you would like to publish.  Open the file js/firebase.js go to the code that we set aside earlier.
	Copy everything inside the {  } and replace the same in firebase.js (see example below.)  Save the file. 

	::
	
		apiKey: "khjfakdhfr9ierhfifhu39849348",
		authDomain: "mapviewer-11119.firebaseapp.com",
		databaseURL: "https://mapviewer-11119.firebaseio.com",
		projectId: "mapviewer-11119",
		storageBucket: "mapviewer-11119.appspot.com",
		messagingSenderId: "665544332211"
	
	Setup the routing to the application as you would with any application on your server.

Adding layers
----------------------------------
	In a browser navigate to your application /admin.html (for my dev server it's http://localhost:53530/admin.html yours will be different)
	Click Login with Google and login.  Begin adding your data layers.  Here is a sample that you can test out if you would like.
	
	-	Display Name: Ocean Bathymetry (ETOPO1)
	-	Layer region: Global
	- 	Layer category: Water
	-	Layer opacity: 1
	-	Service url: https://gis1.servirglobal.net/arcgis/services/Global/Global_Bathymetry/MapServer/WMSServer
	-	Description: Oceanic surface model (ocean depths), integrated by NOAA/NESDIS from a diverse source of global and regional datasets, 2009. Source: Amante, C. and B. W. Eakins, ETOPO1 1 Arc-Minute Global Relief Model: Procedures, Data Sources and Analysis. NOAA Technical Memorandum NESDIS NGDC-24, 19 pp, March 2009
	-	Provider url: http://gis1.servirglobal.net/arcgis/rest/services/Global/Global_Bathymetry/MapServer
	-	Legend url: http://gis1.servirglobal.net/arcgis/rest/services/Global/Global_Bathymetry/MapServer/legend?f=pjson
	-	Layers: 0
	-	Is Time Series [ ] unchecked
	-	Parameters: 
	
	After adding click the Map Viewer link at the top to go to the user view of the application.