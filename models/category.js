const mongoose = require('mongoose');

//schema 

const categorySchema = mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  color: {
      type: String,
  },
  icon: {
      type: String,   
  },
})

//we set _id to id only for access to all over diffrent application 
categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true
})
exports.Category = mongoose.model('Category',categorySchema);