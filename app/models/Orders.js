
// defining a mongoose schema 
// including the module

var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;



var ordersSchema = new Schema({

	customername	  	: {type:String,default:''},
	customerId			: {type:mongoose.Schema.Types.ObjectId},
	orderdetail			: []
},{timestamps:true});



// create the model for users and expose it to our app
module.exports = mongoose.model('Order', ordersSchema);
