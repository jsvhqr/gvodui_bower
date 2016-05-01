/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('partialsApplication', []);


angular.module('partialsApplication').controller('DownloaderController', ['BackendService','PartialsStateService', function (BackendService, PartialsStateService) {

        var self = this;
        self.filename = PartialsStateService.filename;
        self.identifier = PartialsStateService.identifier;
        self.result;
        self.downloading = false;


        self.download = function () {
            var JSONObj = {"name ": self.filename, "identifier": self.identifier};
            BackendService.download(JSONObj).then(function (result) {
                self.result = result;
                self.downloading = true;
            });

        };

    }]);
angular.module('partialsApplication').controller('UploaderController', ['BackendService', 'PartialsStateService', function (BackendService, PartialsStateService) {

        var self = this;
        self.filename = PartialsStateService.filename;
        self.identifier = PartialsStateService.identifier;
        self.result;
        self.uploading = false;


        self.upload = function () {
            var JSONObj = {"name ": self.filename, "identifier": self.identifier};
            BackendService.upload(JSONObj).then(function (result) {
                self.result = result;
                self.uploading = true;
            });

        };

    }]);
angular.module('partialsApplication').controller('StoperController', ['BackendService', 'PartialsStateService', function (BackendService, PartialsStateService) {

        var self = this;
        self.filename = PartialsStateService.filename;
        self.identifier = PartialsStateService.identifier;
        self.result;
        self.stoped = false;


        self.stop = function () {
            var JSONObj = {"name ": self.filename, "identifier": self.identifier};
            BackendService.stop(JSONObj).then(function (result) {
                self.result = result;
                self.stoped = true;
            });

        };

    }]);

angular.module('partialsApplication').controller('LibraryController', ['BackendService', 'PartialsStateService', function (BackendService, PartialsStateService) {

        var self = this;
        self.identifier = PartialsStateService.identifier;
        self.filename = PartialsStateService.filename;
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

            BackendService.addFile(JSONObj).then(function (result) {
                self.result = result;
            });

        };

        self.getLibraryContents = function () {

            BackendService.getLibraryContents().then(function (result) {
                self.result = result;
            });

        };

        self.getLibraryElement = function () {
            var JSONObj = {"identifier": self.identifier, "name": self.filename};
            BackendService.getLibraryElement(JSONObj).then(function (result) {
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

            PartialsStateService.filename = name;
            PartialsStateService.identifier = identifier;
            
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


angular.module('partialsApplication').controller('RestStatusController', ['BackendService', 'PartialsStateService', function (BackendService, PartialsStateService) {

    var self = this;
    self.result;

    self.checkStatus = function(){
        BackendService.checkStatus(PartialsStateService.url,PartialsStateService.port).then(function(result){
            self.result = result;
        })
    };

}]);

angular.module('partialsApplication').controller('RestHostController', ['PartialsStateService', function (PartialsStateService) {

    var self = this;
    self.url = PartialsStateService.url;
    self.port = PartialsStateService.port;

    self.setURL = function(url){
        PartialsStateService.url = url;
    }

    self.setPORT = function(port){
        PartialsStateService.port = port;
    }

}]);

angular.module('partialsApplication').factory('PartialsStateService',[function(){
        
        var self = this;
        self.identifier = "";
        self.filename = "";
        self.url = "";
        self.port = "";
        
        return self;
        
    }]);

angular.module('partialsApplication').factory('BackendService', ['$http', function ($http) {
        var service = {
            download: function (json) {
                return $http(
                        {
                            method: 'PUT',
                            url: 'http://bbc1.sics.se:18183/torrent/download',
                            data: json
                        });
            },
            upload: function (json) {
                return $http(
                        {
                            method: 'PUT',
                            url: 'http://bbc1.sics.se:18183/torrent/upload',
                            data: json
                        });
            },
            stop: function (json) {
                return $http(
                        {
                            method: 'PUT',
                            url: 'http://bbc1.sics.se:18183/torrent/stop',
                            data: json
                        });
            },
            getLibraryContents: function () {
                return $http(
                        {
                            method: 'GET',
                            url: 'http://bbc1.sics.se:18183/library/contents'
                        });
            },
            addFile: function(json){
                return $http(
                        {
                            method: 'PUT',
                            url: 'http://bbc1.sics.se:18183/library/add',
                            data: json
                        });
            },
            getLibraryElement: function(json){
                return $http(
                        {
                            method: 'PUT',
                            url: 'http://bbc1.sics.se:18183/library/element',
                            data: json
                        });
            }
            

        };

        return service;
    }]);

