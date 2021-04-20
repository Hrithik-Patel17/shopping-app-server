const {Order} = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();

//API's Operation 
//sort({'dateOrdered': -1}) -> sorting order by date -> -1 denotes new order comes with first 
router.get(`/`,async (req,res)=> {
 const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1}); // .populate is used for showing the deep detail about something like user array
 
 if(!orderList){
     res.status(500).json({success: false})
 }
 res.send(orderList);
})

//By ID
router.get(`/:id`,async (req,res)=> {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name').sort({'dateOrdered': -1}) // .populate is used for showing the deep detail about something like user array
    .populate({path: "orderItems", populate: {path: "product", populate: "category"} }) // if you want to get details of product inside the array of orderItem then this will applicable path method
    if(!order){
        res.status(500).json({success: false})
    }
    res.send(order);
   })

router.post('/', async (req,res)=> { 
  const orderItemsIds = req.body.orderItems.map(orderItem=>{  // creating the loop for getting the orders id only
      const newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product
      })

       newOrderItem.save();

      return newOrderItem._id; // only we get orders id

     
  })

  const OrderItemsIdsResolved =  orderItemsIds
  console.log(OrderItemsIdsResolved)
  
  const totalPrices = await Promise.all(OrderItemsIdsResolved.map(async (orderItemId)=>{
    const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
    const totalPrice = orderItem.product.price * orderItem.quantity;
    return totalPrice
}))
   const totalPrice = totalPrices.reduce((a,b)=> a+b,0);
   console.log(totalPrice);

    let order = new Order({
        orderItems: OrderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })

    order.save();
    if(!order)
    return res.status(404).send('the order cannot created!')

    res.send(order);
})


// Admin can only update the status of Order 
// So we update the status
router.put('/:id',async (req, res)=> {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true}
    )

    if(!order)
    return res.status(400).send('the order cannot be update!')

    res.send(order);
})

 router.delete('/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get('/get/totalsales', async (req, res)=> {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
})



router.get(`/get/count`, async (req, res) =>{
    const orderCount = await Order.countDocuments((count) => count)

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
})

router.get(`/get/userorders/:userid`, async (req, res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        }).sort({'dateOrdered': -1});

    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
})



module.exports = router;