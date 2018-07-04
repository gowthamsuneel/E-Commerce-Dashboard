
var mongoose = require('mongoose');
var express = require('express');
 
var userModel = mongoose.model('User');
var orderModel = mongoose.model('Order');
var orderRouter  = express.Router();
var responseGenerator = require("./../../libs/responseGenerator");

var crypto = require("./../../libs/crypto");
var key = "Crypto-Key";
var auth = require("./../../middlewares/authorization");


module.exports.controllerFunction = function(app) {



  //---------- API TO GET ALL ORDERS ---------------

  orderRouter.get('/allOrders',auth.checkLogin,function(req,res){
         console.log("user="+JSON.stringify(req.session.user));
var input = {};
    if(req.session.user.role == "customer"){
        input = {"customerId" : req.session.user._id}
    }
    orderModel.find(input,function(err,items){

      if(err){
        var myResponse = responseGenerator.generate(true,err,500,null);
                res.send(myResponse);
      }

      else if(items.length === 0 || items == null){

        var myResponse = responseGenerator.generate(false,"No orders available",200,null);
                res.send(myResponse);
      }

      else{
        
         console.log("attribute is " +items);
        var myResponse = responseGenerator.generate(false,"Success",200,items);
                res.send(myResponse);
      }

    })
  });

  orderRouter.get('/confirmOrder',auth.checkLogin,function(req,res){

    //FIND USER BY ID AND GET CART FIELD AS RETURN
    userModel.find({"_id":req.session.user._id},
      {cart:1,firstName:1},function(err,items){
          console.log(items);
      if(err){
        var myResponse = responseGenerator.generate(true,err,500,null);
                res.send(myResponse);
      }

      else{
        var orderDetails = new orderModel({
          customername      : items[0].firstName,
          customerId      : mongoose.Types.ObjectId(items[0]._id),
          orderdetail     : items[0].cart
        })
        orderDetails.save(function(err,items){
      if(err){
        var myResponse = responseGenerator.generate(true,err,500,null);
                res.send(myResponse);
      }
      else{
         console.log("attribute is " +items);
         userModel.findOneAndUpdate({"_id":req.session.user._id},
              {"cart":[]},
              {new:true},function(err,finalUser){

              });
        var myResponse = responseGenerator.generate(false,"Order Placed Success",200,items);
                res.send(myResponse);
          }
        })        
      }

    })


  });
    // ------- CANCEL ORDER---------

      orderRouter.get('/cancelOrder/:id',auth.checkLogin,function(req,res){
    

        orderModel.deleteOne({"_id":req.params.id},function(err,order){
           
            if(err){
                    var myResponse = responseGenerator.generate(true,err,500,null);
                    res.send(myResponse);
            }

          var myResponse = responseGenerator.generate(true,"Order Cacelled",200,order);
          res.send(myResponse);

        })

    });   
    // now making it global to app using a middleware
    // think of this as naming your api 

    app.use('/orders', orderRouter);

 
} //end contoller code
