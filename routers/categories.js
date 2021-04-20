const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

//API's Operations

// Get the categories List
// url -> http://localhost:3000/api/v1/categories
router.get(`/`, async (req,res)=> {
    const categoryList = await Category.find();
    if(!categoryList){
        res.status(500).json({success: false})
    }
    res.status(200).send(categoryList);
})

// Get the particular category by id 
// url -> http://localhost:3000/api/v1/categories/6065bb23110c49327828621e

router.get('/:id', async (req,res)=> {
    const category = await Category.findById(req.params.id);
    if(!category){
        return res.status(500).json({success: false, message: 'Category with the given id is not found'})
    }
    res.status(200).send(category);
})

// Add a new Category


// router.post('/', (req,res)=>{
//     let category = new Category ({
//         name: req.body.name,
//         icon: req.body.icon,
//         color: req.body.color
//     })

    
//     category.save()
//     .then((createdCategory => {
//         res.status(201).json(createdCategory)
//     })).catch((err)=> {
//         res.status(500).json({
//             error: err,
//             success: false
//         })
//     })
// })

router.post('/', async (req,res)=> {
    let category = new Category({
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon
    })

    category.save();
    if(!category)
    return res.status(404).send('the category cannot created!')

    res.send(category);
})

// Deleting a Category

//http://localhost:3000/api/v1/categories/6065c41da5af8c0558250c4c -> This is Url
//Category deleted by particular id 

router.delete('/:id', async (req,res)=> {
 Category.findByIdAndRemove(req.params.id).then(category=>{
     if(category){
         return res.status(200).json({success: true, message: 'the category is deleted!'})
     }else {
         return res.status(400).json({success: false, message: 'the category not found'})
     }
 }).catch(err=>{
    return res.status(400).json({success:false, error: err})
 })
})

// Update a category 


router.put('/:id', async (res,req)=>{
   const category = await Category.findByIdAndUpdate(
       req.params.id,
        {
            name: req.body.name,
            color: req.body.color,
            icon: req.body.icon
       },
       {new: true}
   )

     category.save()
     .then((createdCategory => {
          res.status(201).json(createdCategory)
      })).catch((err)=> {
          res.status(500).json({
              error: err,
              success: false
          })
      })
   res.send(category);
})



//Modal

module.exports = router;