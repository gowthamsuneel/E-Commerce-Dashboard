myApp.controller("ordersController",['cartService','SweetAlert',
	function(cartService,SweetAlert){
	
	var oc = this ; 
	oc.orders = [];
    var temp = {
    	"_id" : "",
    	"customername" : "",
    	"pdetails" : "",
    	"pprice" : "",
    	"quantity" : "",
    	"date" : "",

    }
    oc.isEmpty = true;
	oc.init = function(){
    cartService.getAllOrderApi().then(function(response){
        console.log(response);
        if(response.data.data == null){
        	oc.isEmpty = true;
        }
        else{
        	oc.isEmpty = false;
        for(var i =0 ; i< response.data.data.length;i++){
          for(var j=0; j<response.data.data[i].orderdetail.length;j++){
               oc.orders.push({
					    	"_id" : response.data.data[i]._id,
					    	"customername" : response.data.data[i].customername,
					    	"pdetails" : response.data.data[i].orderdetail[j].category,
					    	"price" : response.data.data[i].orderdetail[j].price,
					    	"quantity" : response.data.data[i].orderdetail[j].number,
					    	"date" : response.data.data[i].createdAt,
    					});    
          }
        }
    }
    });

	};

    oc.cancel = function(index){
        cartService.cancelOrderApi(oc.orders[index]._id).then(function(response){
                


            if(response.status == 200){

                SweetAlert.swal({
                   title: "Success",
                   text:""+response.data.message+"",
                    type: "success",
                   confirmButtonColor: "#de463b",confirmButtonText: "Ok",
                   closeOnConfirm: true}); 
                oc.orders.splice(index,1);
            }

        })
    }
    
	
}])