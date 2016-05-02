/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('partialsApplication', []);


angular.module('partialsApplication').controller('DownloaderController', ['partialsBackendServiceFactory','partialsServiceStateFactory', function (partialsBackendServiceFactory, partialsServiceStateFactory) {

        var self = this;
        self.filename = partialsServiceStateFactory.getFilename();
        self.identifier = partialsServiceStateFactory.getIdentifier();

        self.result;
        self.downloading = false;


        self.download = function () {
            var JSONObj = {"name ": self.filename, "identifier": self.identifier};
            partialsBackendServiceFactory.download(JSONObj).then(function (result) {
                self.result = result;
                self.downloading = true;
            });

        };

    }]);
angular.module('partialsApplication').controller('UploaderController', ['partialsBackendServiceFactory', 'partialsServiceStateFactory', function (partialsBackendServiceFactory, partialsServiceStateFactory) {

        var self = this;
        self.filename = partialsServiceStateFactory.getFilename();
        self.identifier = partialsServiceStateFactory.getIdentifier();

        self.result;
        self.uploading = false;


        self.upload = function () {
            var JSONObj = {"name ": self.filename, "identifier": self.identifier};
            partialsBackendServiceFactory.upload(JSONObj).then(function (result) {
                self.result = result;
                self.uploading = true;
            });

        };

    }]);
angular.module('partialsApplication').controller('StoperController', ['partialsBackendServiceFactory', 'partialsServiceStateFactory', function (partialsBackendServiceFactory, partialsServiceStateFactory) {

        var self = this;
        self.filename = partialsServiceStateFactory.getFilename();
        self.identifier = partialsServiceStateFactory.getIdentifier();

        self.result;
        self.stoped = false;


        self.stop = function () {
            var JSONObj = {"name ": self.filename, "identifier": self.identifier};
            partialsBackendServiceFactory.stop(JSONObj).then(function (result) {
                self.result = result;
                self.stoped = true;
            });

        };

    }]);

angular.module('partialsApplication').controller('LibraryController', ['partialsBackendServiceFactory', 'partialsServiceStateFactory', function (partialsBackendServiceFactory, partialsServiceStateFactory) {

        var self = this;
        self.identifier = partialsServiceStateFactory.getIdentifier();
        self.filename = partialsServiceStateFactory.getFilename();

        self.uri;
        self.size;
        self.description;
        self.result;
        self.viewToLoad;

        self.showView = new Array(0);
        self.status = false;
        self.addFile = function () {

            var fileInfo = {
                name: self.filename,
                uri: self.uri,
                size: self.size,
                description: self.description

            };

            var JSONObj = {"identifier": self.identifier, "fileInfo": fileInfo};

            partialsBackendServiceFactory.addFile(JSONObj).then(function (result) {
                self.result = result;
            });

        };

        self.getLibraryContents = function () {

            partialsBackendServiceFactory.getLibraryContents().then(function (result) {
                self.result = result;
            });

        };

        self.getLibraryElement = function () {
            var JSONObj = {"identifier": self.identifier, "name": self.filename};
            partialsBackendServiceFactory.getLibraryElement(JSONObj).then(function (result) {
                self.result = result;
            });
            self.status = true;
        };
        
        self.closeLibraryElement = function(){
            self.status = false;
        };

        self.enlarge = function (status, name, identifier, index) {

            switch (status) {
                case "NONE":
                    self.viewToLoad = "upload";
                    break;
                case "UPLOADING":
                    self.viewToLoad = "stop";
                    break;
                case "DOWNLOADING" :
                    self.viewToLoad = "stop";
                    break;
            }

            partialsServiceStateFactory.setFilename(name);
            partialsServiceStateFactory.setIdentifier(identifier);
            
            if(self.showView.length === 0){
                self.showView = new Array(self.result.data.contents.length);
                self.showView[index] = true;
            }else{
                self.showView[index] = true;
            }
            
            

        };
        
        self.minimize = function(index){
          
          self.showView[index]= false;  
            
        };


    }]);

angular.module('partialsApplication').controller('RestHostController', ['partialsServiceStateFactory', 'partialsBackendServiceFactory',  function (partialsServiceStateFactory, partialsBackendServiceFactory) {

    var self = this;
    self.url = partialsServiceStateFactory.getURL();
    self.port = partialsServiceStateFactory.getPort();

    self.setURL = function(){
        partialsServiceStateFactory.setURL(self.url);
    }

    self.setPORT = function(){
        partialsServiceStateFactory.setPort(self.port);
    }

    self.checkStatus = function(){
        partialsBackendServiceFactory.checkStatus().then(function(result){
            self.result = result;
        })
    };

}]);

angular.module('partialsApplication').factory('partialsServiceStateFactory',[function(){
        
        var state = {

            identifier : "",
            filename : "",
            url :"http://bbc1.sics.se",
            port : "18180",

            setIdentifier : function (id) {
                this.identifier = id;
            },

            setFilename : function (name) {
                this.filename = name;
            },

            getIdentifier : function () {
                return this.identifier;
            },

            getFilename : function () {
                return this.filename;
            },

            setPort : function (port) {
                this.port = port;
            },

            setURL : function (url) {
                this.url = url;
            },

            getURL : function(){
                return this.url;
            },

            getPort : function () {
                return this.port;
            }

        };


        return state;
        
    }]);

angular.module('partialsApplication').factory('partialsBackendServiceFactory', ['partialsServiceStateFactory','$http', function (partialsServiceStateFactory, $http) {

        var service = {

            download: function (json) {
                return $http({
                            method: 'PUT',
                            url: partialsServiceStateFactory.getURL() + ":" + partialsServiceStateFactory.getPort() + '/torrent/download',
                            data: json
                        });
            },
            upload: function (json) {
                return $http({
                            method: 'PUT',
                            url: partialsServiceStateFactory.getURL() + ":" + partialsServiceStateFactory.getPort() + '/torrent/upload',
                            data: json
                        });
            },
            stop: function (json) {
                return $http({
                            method: 'PUT',
                            url: partialsServiceStateFactory.getURL() + ":" + partialsServiceStateFactory.getPort() + '/torrent/stop',
                            data: json
                        });
            },
            getLibraryContents: function () {
                return $http({
                            method: 'GET',
                            url: partialsServiceStateFactory.getURL() + ":" + partialsServiceStateFactory.getPort() + '/library/contents'
                        });
            },
            addFile: function(json){
                return $http({
                            method: 'PUT',
                            url: partialsServiceStateFactory.getURL() + ":" + partialsServiceStateFactory.getPort() + '/library/add',
                            data: json
                        });
            },
            getLibraryElement: function(json){
                return $http({
                            method: 'PUT',
                            url: partialsServiceStateFactory.getURL() + ":" + partialsServiceStateFactory.getPort() + '/library/element',
                            data: json
                        });
            },
            checkStatus:  function () {
                return $http({
                        method: 'GET',
                        url: partialsServiceStateFactory.getURL() + ":" + partialsServiceStateFactory.getPort() + '/status'
                    });

            }
            

        };

        return service;
    }]);

