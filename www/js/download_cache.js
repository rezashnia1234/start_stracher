can_we_goto_news = "no";

function unique_array(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1)
		{
			if(e!="")
				result.push(e);
		}
    });
    return result;
}
function is_url_in_array(url,image_list) {
	var ext = "";
	var File_URL_link = encodeURI(url);
	ext = File_URL_link.substr(File_URL_link.lastIndexOf('.') + 1);
	File_URL_link = $.md5(url) + "." + ext ;
	console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    is_url_in_array / File_URL_link : ' + File_URL_link);
	if ($.inArray(File_URL_link, image_list) == -1)
	{
		var networkState = navigator.connection.type;
		if (networkState == Connection.NONE) {
			console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    is_url_in_array / no internet : ' + "images/blank.png");
			return  "images/blank.png";
		} else {
			console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    is_url_in_array / url : ' + url);
			return url;
		}
	}
	else
	{
		console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    is_url_in_array / cache exist : ' + File_URL_link);
		return Root_Path + "/temp/" + File_URL_link;
	}
}
// START DOWNLOAD FUNCTIONS :////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

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
	console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    function download');
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

	function fileSystemSuccess(fileSystem) {
		console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    function fileSystemSuccess');
		var ext = "";
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
		console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    function filetransfer 0');
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
	console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    function filetransfer 1');
	// File download function with URL and local path
	fileTransfer.download(download_link, fp,
				function (entry) {
					alert("download complete: " + entry.toURL());
					console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    download complete : ' + entry.toURL());
					console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    download complete : GapFile.extractFilename(entry.toURL()) : ' + GapFile.extractFilename(entry.toURL()));
					if(GapFile.extractFilename(entry.toURL()) == "articles_json.php")
					{
						console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    function ajax articles_version.php');
						$.ajax({ type: "GET",   
								 url: "http://smcms.ir/tmp/articles_version.php",   
								 async: false,
								 success : function(text)
								 {
									console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    download complete : setItem("last_articles_version") : ' + text	);
									window.localStorage.setItem('last_articles_version') = text;
									window.sessionStorage.setItem('can_we_goto_news',"yes");
								 }
						});
						window.sessionStorage.setItem('can_we_goto_news',"yes");
						console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    download complete : can_we_goto_news : yes');
					}
				},
                 function (error) {
					console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    download error : can_we_goto_news : no');
                     //Download abort errors or download failed errors
                     console.log('SMGROUP ::::::::::::::::::::::::::::::::::::   download error source ' + error.source);
                     console.log('SMGROUP ::::::::::::::::::::::::::::::::::::   download error target ' + error.target);
                     console.log('SMGROUP ::::::::::::::::::::::::::::::::::::   upload error code' + error.code);
                     console.log('SMGROUP ::::::::::::::::::::::::::::::::::::   fiel path : ' + fp);
                 }
	);
	console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    END function filetransfer 1');
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
function GetSavedFile(File_URL,Folder_Name,File_Name) {
	console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    GetSavedFile STRAT : ' + File_URL + "//////" + File_Name + "//////" + $.md5(File_URL));

	//File_Name = $.md5(File_URL);

	cache_file_address = "";
	//step to request a file system 
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess_GetSavedFile, fileSystemFail_fileSystemSuccess_GetSavedFile);

	function fileSystemSuccess_GetSavedFile(fileSystem) {
		var ext = "";
		var rootdir = fileSystem.root;
		var fp = rootdir.toURL(); // Returns Fulpath of local directory
		Root_Path = fp;
		
		var File_URL_link = encodeURI(File_URL);
		ext = File_URL_link.substr(File_URL_link.lastIndexOf('.') + 1); //Get extension of URL
		
		fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext ; // fullpath and name of the file which we want to give
		
		function is_fileExists(result){
			if(result)
			{
				//alert("File " +  " exists!");
				console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    GetSavedFile is_fileExists true : ' + fp);
				//cache_file_address = fp;
				cache_file_address = File_Name + "." + ext;
			}
			else
			{
				//var networkState = navigator.connection.type;
				//if (networkState == Connection.NONE) {
				//	console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    GetSavedFile no internet : ' + "images/blank.png");
					//cache_file_address = "images/blank.png";
				//} else {
					//cache_file_address = File_URL;
					console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    GetSavedFile No cache for : ' + cache_file_address + "////fp : " + fp);
					//download_list.push(File_URL);
					download_list_text_temp = window.localStorage.getItem('download_list_text');
					window.localStorage.setItem('download_list_text',download_list_text_temp + '; -,' + File_URL);
				//}
				console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    GetSavedFile is_fileExists False : ' + File_URL);
			}
			if(cache_file_address)
			{
				image_list_text_temp = window.localStorage.getItem('image_list_text');
				window.localStorage.setItem('image_list_text',image_list_text_temp + '; -,' + cache_file_address);
			}
			console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    GetSavedFile image_list_text_temp : ' + image_list_text_temp + '; -,' + cache_file_address);
		}
		function fileDownloadProblem(){
				alert("we have some problem");
		}	

		GapFile.fileExists(Folder_Name + "/" + File_Name + "." + ext, is_fileExists, fileDownloadProblem);
	}

	function fileSystemFail_fileSystemSuccess_GetSavedFile(evt) {
		//Unable to access file system
		alert(evt.target.error.code);
		//var networkState = navigator.connection.type;
		//if (networkState == Connection.NONE) {
		//	cache_file_address = "images/blank.png";
		//} else {
		//	cache_file_address = File_URL;
		//}
	}

	//image_list.push(cache_file_address);
	console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    GetSavedFile END ');
}





////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	
	
	