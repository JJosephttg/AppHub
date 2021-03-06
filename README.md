# AppHub
Allows you to save commonly used apps for quick and easy launch/access

# Installation
1. Download one of the releases (AppHubSetup exe) available
2. Run the installer and go through the wizard
3. The application is installed and ready for use!

# Development Installation
1. Install Nodejs (When asked about node-gyp/compiling with C++ check it)
2. Install VS 2019 Community with C++ Development MSBuild Tools v142 and Windows SDK (For SQLite3 library)
3. Clone repository and run the following commands: `npm config set msvs_version 2019` and `npm config set msbuild_path "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Current\Bin\MSBuild.exe"`
4. Run `npm install` via commandline in the directory
5. Run `npm start` to start both the react server and application. You may have to do npm run build to build the sqlite3 library


# Using AppHub
The main screen of AppHub displays a preview of all the apps you currently have for assigned categories. This is also where favorites are pinned and can be readily accessed.

![Main Screen](READMEAssets/MainScreen.jpg)

Clicking View more on any of these categories will give you all the apps for that category you clicked. To get back to the main screen you can click the icon located on the top left of the window in the toolbar.

![App Listing Screen](READMEAssets/QuickLaunchListing.jpg)

Adding an app is as simple as clicking the + button on the toolbar and hitting save once you have filled everything out.

![Save App Dialog](READMEAssets/SaveApp.jpg)