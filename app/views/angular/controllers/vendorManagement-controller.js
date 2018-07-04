
myApp.controller("VendorManagementController",["$http",'$location','cartService','SweetAlert',
	function($http,$location,cartService,SweetAlert){
	
	var main = this ; 

	this.firstname
	
	this.lastname;
	this.email ;
	this.password;
	 
	 this.entity = {}
	 main.Profiles = []
	 this.vendorInit = function(){
cartService.getAllVendorsApi("vendor").then(function(response){
var vendors = [];
for(var i=0; i<response.data.data.length; i++){
	
	vendors.push({
		    id : response.data.data[i]._id,
	        firstname : response.data.data[i].firstName,
	        lastname : response.data.data[i].lastName,
	        email : response.data.data[i].email,
	        password : response.data.data[i].password,
	        role : "vendor",
	        editable : false
	      });
		
}
main.Profiles = vendors;

})
	 }
	 
	 main.customers = []
	 this.customerInit = function(){
cartService.getAllVendorsApi("customer").then(function(response){
for(var i=0; i<response.data.data.length; i++){
	
	main.customers.push({
		    id : response.data.data[i]._id,
	        firstname : response.data.data[i].firstName,
	        lastname : response.data.data[i].lastName,
	        email : response.data.data[i].email
	      });
		
}
console.log(main.customers);


	 })
}


	 this.edit = function(index){
	   this.entity = this.Profiles[index];
	   this.entity.index = index;
	   this.entity.editable = true;
	 }
	    
	 this.delete = function(index){
	   
	   cartService.deleteVendorApi(this.Profiles[index].id).then(function(response){
            console.log(response);

			if(response.status == 200){

				SweetAlert.swal({
				   title: "Success",
				   text:""+response.data.message+"",
				   	type: "success",
				   confirmButtonColor: "#de463b",confirmButtonText: "Ok",
				   closeOnConfirm: true}); 
					
			main.Profiles.splice(index,1);
			}
            
	   })
	 }
	    
	 this.save = function(index){
	   this.Profiles[index].editable = false;
	   	var signupData = {

			firstname : this.Profiles[index].firstname,
			lastname: this.Profiles[index].lastname,
			email: this.Profiles[index].email,
			password: this.Profiles[index].password,
			role: 'vendor'
		};

		cartService.addVendorApi(signupData)
		.then(function successCallback(response){
			console.log(response);
			if(response.data.message != "Vendor Updated"){
			main.Profiles.splice(main.Profiles.length-1,1);
main.Profiles.push({
		    id : response.data.data._id,
	        firstname : response.data.data.firstName,
	        lastname : response.data.data.lastName,
	        email : response.data.data.email,
	        password : response.data.data.password,
	        role : "vendor",
	        editable : false
	      });
}
			//IF ALREADY LOGGED IN USER TRIES TO SIGN UP, GO TO LOGIN SCREEN
			if(response.status == 200 || response.data.loggedIn != undefined){

				SweetAlert.swal({
				   title: "Success",
				   text:""+response.data.message+"",
				   	type: "success",
				   confirmButtonColor: "#de463b",confirmButtonText: "Ok",
				   closeOnConfirm: true}); 
					
			
			}

			else{

					SweetAlert.swal({
						title:"OOPS!",
					  	text: ""+response.data.message+"",
					   	type: "info",
					   	showCancelButton: false,
					   	confirmButtonColor: "#de463b",confirmButtonText: "OK!",
					   	closeOnConfirm: true});
	
			}		

		}, function errorCallback(reason){
				console.log(reason);
				console.log("Error in Post");
			})
	   
	 }
	    
	 this.add = function(){
	   this.Profiles.push({
	    firstname : "",
	    lastname : "",
        email : "",
        password : "",
        role : "vendor",
        editable : true
	   })
	 }
}])