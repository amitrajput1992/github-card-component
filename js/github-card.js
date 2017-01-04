function GithubCard(userId, app){
    this.userID = userId;
    this.imgURL = "";
    this.app = app;
    this.userData = null;
}
GithubCard.prototype.setUserImgURL = function(imgURL){
    this.imgURL = imgURL;
};
GithubCard.prototype.render = function(){
    this.retrieveUserData();
};
GithubCard.prototype.retrieveUserData = function(){
    var self = this;
    var response = null;
    var url = 'https://api.github.com/users/';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url + this.userID);
    xhr.onreadystatechange = function () {
    	if (xhr.readyState === xhr.DONE) {
    		status = xhr.status;
    		if ((status >= 200 && status < 300) || status === 304 || status === 0) {
    			response = JSON.parse(xhr.response || xhr.responseText);
                self.userData = response;
                if(!self.app.userExists(response.login)){
                    self.app.users.push(response);
                    sessionStorage.users = JSON.stringify(self.app.users);
                }    
                self.renderCard(response);
                if (self.app.users.length > 1) {
                	self.app.sortCards();
                }
    		}
    	}
    };
    xhr.send();
};
GithubCard.prototype.renderCard = function(data){    
    var cardHTML = "<div class='user' id='" + data.login + "'><div id='avatar' class='user-avatar'><span id='close" + data.login + "' class='close-button'></span><img src='" + data.avatar_url + "'></div>" + 
    "<div class='user-data'><div class='user-name'>" + data.name + "</div><div id='location" + data.login + "'><div class='user-extras'>Location:&nbsp;" + data.location + "</div></div><div id='followers" + data.login + "'><div class='user-extras'>Followers:&nbsp;" + data.followers + "</div></div></div>" + 
    "</div></div>";
    this.app.mainContainer.find("#card-container").append(cardHTML);
    this.attachEventsForCard(data.login);
    
};
GithubCard.prototype.attachEventsForCard = function(login){
    var self = this;
    this.app.mainContainer.find("#" + login).hover(function(){
        $(this).find(".user-name, .user-extras").addClass("text-decoration");
    }, function(){
        $(this).find(".user-name, .user-extras").removeClass("text-decoration");
    });
    this.app.mainContainer.find("#" + login).click(function(){
        var url = "https://github.com/" + login;
        window.location = url;
    });
    this.app.mainContainer.find("#close" + login).click(function(event){
        event.stopPropagation();
        self.app.mainContainer.find("#" + login).remove();
        function findAndRemove(array, property, value) {
        	array.forEach(function (result, index) {
        		if (result[property] === value) {
        			array.splice(index, 1);
        		}
        	});
        }
        findAndRemove(self.app.users, "login", login);
        sessionStorage.users = JSON.stringify(self.app.users);
    });
};