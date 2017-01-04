function GitHubApp() {
    if(Storage!=="undefined" && sessionStorage.users){
        this.users = JSON.parse(sessionStorage.users);    
    }else{
        this.users = [];
    }
    this.sortOptions = {
        NAME: 0,
        LOCATION: 1,
        FOLLOWERS: 2
    };
    this.currentSortOption = "name";
    this.sortDesc = false;
};
GitHubApp.prototype.setDefaultSort = function(sortValue){
    this.defaultSort = sortValue;
};
GitHubApp.prototype.renderApplicationUI = function(){
    var mainContainer = $("#main-container");
    this.mainContainer = mainContainer;
    var mainContainerContent = "<div class='main-container-content'><div id='github-login'></div><hr><div id='sort-controls'></div><div id='card-container' class='cards-container'></div></div>";
    mainContainer.html(mainContainerContent);
    this.generateLoginControls();
    this.generateSortControls();
    this.attachEventsForApplication();
    if(this.users.length){
        this.sortCards();
    }
};
GitHubApp.prototype.generateLoginControls = function(){
    var githubLogin = this.mainContainer.find("#github-login");
    var loginHTML = "<div style='min-width:150px;'><div class='inline-div'><input id='githubId' type='text' placeholder='github login'></input></div>&nbsp;<div class='inline-div'><input id='addUser' type='button' value='Add'></input></div></div>";
    githubLogin.html(loginHTML);
};
GitHubApp.prototype.generateSortControls = function(){
    var sortControls = this.mainContainer.find("#sort-controls");
    var sortControlsHTML = "<div class='sort-controls'><span>Sort by:&nbsp;</span><span data-sort-option='name' id='sort-name' class='selected'>Name<span class='arrow'></span></span><span data-sort-option='location' id='sort-location'>Location</span><span data-sort-option='followers' id='sort-followers'>Followers</span></div>";
    sortControls.html(sortControlsHTML);
    this.attachEventsForSortControls(sortControls);
};
GitHubApp.prototype.attachEventsForSortControls = function(sortControls){
    var self = this;
    var prevOption = $("#sort-name");
    sortControls.on("click", "span", function(event){
        self.currentSortOption = this.getAttribute("data-sort-option");
        if($(this).hasClass("selected")){
            $(this).find(".arrow").toggleClass("toggle");
            self.sortDesc = self.sortDesc ? false : true;
        }else{
            prevOption.removeClass("selected");
            prevOption.find(".arrow").remove("span");
            $(this).addClass("selected");
            if($(this).find(".arrow")){
                $(this).append("<span class='arrow'>");
            }
            self.sortDesc = false;
            prevOption = $(this);
        }
        self.sortCards();
    });
};
GitHubApp.prototype.sortCards = function(){
    var sortKey = this.currentSortOption;
    var users = this.users;
    var self = this;
    var sortBy = (function () {
    	var _toString = Object.prototype.toString,
    	parserFunc = function (x) {
    		return x;
    	},
    	getItemFunc = function (x) {
    		return this.parser((x !== null && typeof x === "object" && x[this.prop]) || x[this.prop]);
    	};
    	return function (array, options) {
    		if (!(array instanceof Array) || !array.length)
    			return [];
    		if (_toString.call(options) !== "[object Object]")
    			options = {};
    		if (typeof options.parser !== "function")
    			options.parser = parserFunc;
    		options.desc = !!options.desc ? -1 : 1;
    		return array.sort(function (a, b) {
    			a = getItemFunc.call(options, a);
    			b = getItemFunc.call(options, b);
    			return options.desc * (a < b ? -1 :  + (a > b));
    		});
    	};
    }());
    this.sortDesc ? sortBy(users, { prop: sortKey, desc:true }): sortBy(users, { prop: sortKey});    
    this.mainContainer.find("#card-container").empty();
    for(var i=0;i<this.users.length;i++){
        var githubCard = new GithubCard(self.users[i].login, self);
        githubCard.renderCard(this.users[i]);
    }
};
GitHubApp.prototype.attachEventsForApplication = function(){
    var githubUser = "";
    var self = this;
    this.mainContainer.on("click", "#addUser", function(){
        githubUser = self.mainContainer.find("#githubId").val();
        var githubCard = new GithubCard(githubUser, self);
        githubCard.render();
        self.mainContainer.find("#githubId").val("");
    });
};
GitHubApp.prototype.userExists = function(login){
    for(var i=0;i<this.users.length;i++){
        if(this.users[i].login === login){
            return true;
        }
    }
    return false;
};
