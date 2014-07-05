
	
// START DOWNLOAD FUNCTIONS :///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

//First step check parameters mismatch and checking network connection if available call    download function
function DownloadFile(URL, Folder_Name, File_Name) {
	//Parameters mismatch check
	if (URL == null && Folder_Name == null && File_Name == null) {
		return;
	}
	else {
		//alert("check internet");

		//checking Internet connection availablity
		var networkState = navigator.connection.type;
		if (networkState == Connection.NONE) {
			return;
		} else {
			download(URL, Folder_Name, File_Name); //If available download function call
		}
	}
}
function download(URL, Folder_Name, File_Name) {
	//step to request a file system 
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

	function fileSystemSuccess(fileSystem) {
		var download_link = encodeURI(URL);
		ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

		var directoryEntry = fileSystem.root; // to get root path of directory
		directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
		var rootdir = fileSystem.root;

		//alert("rootdir 1 : " + fileSystem.root.fullPath);
		//alert("rootdir 2 : " + fileSystem.root.toURL() );

		//var fp = rootdir.fullPath; // Returns Fulpath of local directory
		var fp = rootdir.toURL(); // Returns Fulpath of local directory

		fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
		// download function call
		filetransfer(download_link, fp);
	}

	function onDirectorySuccess(parent) {
		// Directory created successfuly
	}

	function onDirectoryFail(error) {
		//Error while creating directory
		alert("Unable to create new directory: " + error.code);
	}

	function fileSystemFail(evt) {
		//Unable to access file system
		alert(evt.target.error.code);
	}
}
function filetransfer(download_link, fp) {
	var fileTransfer = new FileTransfer();
	// File download function with URL and local path
	fileTransfer.download(download_link, fp,
				function (entry) {
					//alert("download complete: " + entry.toURL());
				},
                 function (error) {
                     //Download abort errors or download failed errors
                     //alert("download error source " + error.source);
                     //alert("download error target " + error.target);
                     //alert("upload error code" + error.code);
                     //alert("fiel path : " + fp);
                 }
	);
}
// END DOWNLOAD FUNCTIONS ://///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
// START SHOW IMAGE FUNCTIONS ://///////////////////////////////////////////////////////////
/*
var ShowSavedImage = function(Imagename){
	alert("in ShowSavedImage ");
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, onFail);
}
*/
cache_file_address = "test";
function GetSavedFile(File_URL,Folder_Name) {
	console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    GetSavedFile STRAT : ' + File_URL + "//////" + Folder_Name);

	File_Name = $.md5(File_URL);

	cache_file_address = "";
	//step to request a file system 
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess_GetSavedFile, fileSystemFail_fileSystemSuccess_GetSavedFile);

	function fileSystemSuccess_GetSavedFile(fileSystem) {
		var rootdir = fileSystem.root;
		var fp = rootdir.toURL(); // Returns Fulpath of local directory
		
		var File_URL_link = encodeURI(File_URL);
		ext = File_URL_link.substr(File_URL_link.lastIndexOf('.') + 1); //Get extension of URL
		
		fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext ; // fullpath and name of the file which we want to give
		
		function is_fileExists(result){
			if(result)
			{
				//alert("File " +  " exists!");
				console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    GetSavedFile is_fileExists true : ' + fp);
				cache_file_address = fp;
			}
			else
			{
				//fileDoesNotExist
				//alert("file does not exist");
				//DownloadFile(File_URL, Folder_Name, File_Name);
				var networkState = navigator.connection.type;
				if (networkState == Connection.NONE) {
					cache_file_address = "img/blank.png";
				} else {
					cache_file_address = File_URL;
					download_list.push(File_URL);
				}
				console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    GetSavedFile is_fileExists False : ' + File_URL);
			}
		}
		function fileDownloadProblem(){
				alert("we have some problem");
				var networkState = navigator.connection.type;
				if (networkState == Connection.NONE) {
					cache_file_address = "img/blank.png";
				} else {
					cache_file_address = File_URL;
				}
		}	

		GapFile.fileExists(Folder_Name + "/" + File_Name + "." + ext, is_fileExists, fileDownloadProblem);
	}

	function fileSystemFail_fileSystemSuccess_GetSavedFile(evt) {
		//Unable to access file system
		alert(evt.target.error.code);
		var networkState = navigator.connection.type;
		if (networkState == Connection.NONE) {
			cache_file_address = "img/blank.png";
		} else {
			cache_file_address = File_URL;
		}
	}

	image_list.push(cache_file_address);
	console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    GetSavedFile END ');
}





////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	
	
	