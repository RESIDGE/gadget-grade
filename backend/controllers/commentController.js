var mongoose = require('mongoose'),
Comment = mongoose.model('Comment');
Product = mongoose.model('Product');
var ObjectID = require('mongodb').ObjectID;

exports.addComment = async function(req, res) {
    var newComment = new Comment(req.body);
    try {
      const savedComment = await newComment.save();
      res.status(201).json(savedComment);
    } catch (err) {
      console.log(err)
      res.status(500).send({message: 'An error occurred while adding the comment.'});
    }
};
  
exports.getReviewComments = async function(req, res) {
    try {
      const sortField = req.query.sort;
      const sortOrder = req.query.order === 'desc' ? -1 : 1; // Use 1 for ascending, -1 for descending
      // Build the sort object
      const sortObject = {};
      if (sortField) {
          sortObject[sortField] = sortOrder;
      }
      const comments = await Comment.find({review: req.params.reviewId}).sort(sortObject);
      res.status(200).json(comments);
    } catch (err) {
        res.status(500).send({message: 'An error occurred while getting the review comments.'});
    }
}

exports.getProductComments = async function(req, res) {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    
    if(!product){
        res.status(404).send("Product not found");
        return;
    }

    const comments = await Comment.find({ product: productId }).populate('review').populate('author').exec();
    // Map comments to the corresponding reviewId
    let commentsMappedByReviewId = {};
    comments.forEach(comment => {
        if(commentsMappedByReviewId[comment.review._id]) {
            commentsMappedByReviewId[comment.review._id].push(comment);
        } else {
            commentsMappedByReviewId[comment.review._id] = [comment];
        }
    });

    res.status(200).json(commentsMappedByReviewId);
  } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
  }
}

exports.getUserComments = async function(req, res) {
    try {
      const sortField = req.query.sort;
      const sortOrder = req.query.order === 'desc' ? -1 : 1; // Use 1 for ascending, -1 for descending
      // Build the sort object
      const sortObject = {};
      if (sortField) {
          sortObject[sortField] = sortOrder;
      }
      const comments = await Comment.find({author: req.params.userId}).sort(sortObject);
      res.status(200).json(comments);
    } catch (err) {
        res.status(500).send({message: 'An error occurred while getting the user comments.'});
    }
}

exports.getComment = async function(req, res) {
    try {
      const comment = await Comment.findById(req.params._id);
      if (comment) {
        res.status(200).json(comment);
      } else {
        res.status(404).send({message: 'Comment not found.'});
      }
    } catch (err) {
      res.status(500).send({message: 'An error occurred retrieving comment.'});
    }
  }
  
  
  exports.updateComment = async function(req, res) {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(req.params._id, req.body, {new:true});
        res.status(200).json(updatedComment);
    } catch (err) {
      res.status(500).send({message: 'An error occurred updating comment.'});
    }  
  }
  