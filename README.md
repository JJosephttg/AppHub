# AppHub
Allows you to save commonly used apps for quick and easy launch/access

# Installation
1. Install Nodejs (When asked about node-gyp/compiling with C++ check it)
2. Install VS 2019 Community with C++ Development MSBuild Tools v142 and Windows SDK (For SQLite3 library)
3. Clone repository and run the following commands: `npm config set msvs_version 2019` and `npm config set msbuild_path "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Current\Bin\MSBuild.exe"`
4. Run `npm install` via commandline in the directory
5. Run `npm start` to start both the react server and application. You may have to do npm run build to build the sqlite3 library
