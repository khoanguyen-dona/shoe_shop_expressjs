const router = require('express').Router()
const Comment = require('../models/Comment')
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require('./verifyToken')




//create comment with images 

router.post("/",verifyTokenAndAuthorization, async (req, res) => {  
    try {
        if(req.body.refCommentId!==''){
            await Comment.findByIdAndUpdate(req.body.refCommentId,{
                isReplied: true
            },{new: true})
        }
       
        const newComment = new Comment({
            productId: req.body.productId,
            userId: req.body.userId,
            userName: req.body.userName,
            content: req.body.content,
            avatarUrl: req.body.avatarUrl ,
            imgGallery: req.body.imgGallery,
            type: req.body.type,
            refCommentId: req.body.refCommentId,
            refCommentUserId: req.body.refCommentUserId,
            refCommentUsername: req.body.refCommentUsername,
            approved: true,
            isReplied: req.body.isReplied
        }) 
        const savedComment = await newComment.save()
        res.status(200).json({message:"Commented successfully",comment: savedComment})

    } catch(err) {
        res.status(500).json(err)
    }
      

});


//create comment with images v2

// router.post("/", upload.array('images'), async (req, res) => {
//     const uploadedUrls=[]
//     const json_comment = JSON.parse(req.body.comment)
 

//     const convertAndUploadImages = async (file) =>{
        
//         // const inputPath = file.path;
//         const avifFileName = `${Date.now()}-${file.originalname}.avif`;
//         const avifPath = path.join('uploads', avifFileName);

//         // Convert to AVIF
//         if(file.size > 3000000 ){
//             await sharp(file.buffer)
//             .toFormat('avif', { quality: 1 })
//             .toFile(avifPath);
//         } else if (file.size > 500000 && file.size < 3000000){
//             await sharp(file.buffer)
//             .toFormat('avif', { quality: 20})
//             .toFile(avifPath);
//         }  else if (file.size > 100000 && file.size < 500000){
//             await sharp(file.buffer)
//             .toFormat('avif', { quality: 40})
//             .toFile(avifPath);
//         }   else  {
//             await sharp(file.buffer)
//             .toFormat('avif', { quality: 50})
//             .toFile(avifPath);
//         }

//         // Upload to Firebase
//         const metadata ={ contentType: file.mimetype }
//         const imageName = new Date().getTime() + avifFileName
//         const imageRef = ref(storage, `comment-gallery/${imageName}`)

//         // convert image to avif file
            
//         fs.readFile(avifPath, async (err, buffer) => {  
//             if(err){
//                 console.log('err read file',err)
//             }            
//             const avif = await sharp(buffer).toFormat('avif').toBuffer()     ; 
//             await uploadBytesResumable(imageRef, avif , metadata)         
//             let imgUrl = await getDownloadURL(imageRef)
//             uploadedUrls.push(imgUrl)
//             console.log('imgUrl',imgUrl)             
                                                                                        
//         })

       
                       
//             // const avif = await sharp(buffer).toFormat('avif').toBuffer()     ; 
//             // await uploadBytesResumable(imageRef, avif , metadata)      

//             // await getDownloadURL(imageRef).then(res=>{
//             //     uploadedUrls.push(res)
//             //     console.log('imgUrl',res)             
//             // })                                                                             
      
                                                        
//         // Deleted temp images in uploads/
//         fs.unlinkSync(avifPath, (err) => {
//                 if (err) console.error('Error deleting avif file:', err);
//                 else console.log('Deleted original file');
//         })
                               
//     } 
         
//     const handleUploadComment = async () => { 
//         try {
//             console.log('upload url',uploadedUrls)
//             const newComment = new Comment({
//                 productId: json_comment.productId,
//                 userId: json_comment.userId,
//                 userName: json_comment.userName,
//                 content: json_comment.content,
//                 avatarUrl: json_comment.avatarUrl ,
//                 imgGallery: uploadedUrls,
//                 type: json_comment.type,
//                 refCommentId: json_comment.refCommentId,
//                 refCommentUserId: json_comment.refCommentUserId,
//                 refCommentUsername: json_comment.refCommentUsername,
//                 approved: true,
//                 isReplied: json_comment.isReplied
//             }) 
//             const savedComment = await newComment.save()
//             console.log('push to mongodb successfully')
//             res.status(200).json({message:"Commented successfully",comment: savedComment})

//         } catch(err) {
//             res.status(500).json(err)
//         }
//     } 
//     // Convert to avif and upload to firebase
//     try{

//         const uploadImages = async() => {
//             await Promise.all(
//                 req.files.map(file=> convertAndUploadImages(file) )          
//             )     
//         }
        
//         await uploadImages()   
//     } catch(err){

//     }finally{
//         await handleUploadComment()
//     }

//         //Upload comment to mongo db
        
    

// });



//get comments by commentId and type='comment'
router.get('/refCommentId/:commentId',  async (req, res) => {
    let type = req.query.type
    let limit = parseInt(req.query.limit) || 5
    let page = parseInt(req.query.page) || 1
    try{
        const comment_id = req.params.commentId
        const comments = await Comment.find({
            $and: [
                {refCommentId: comment_id},
                type ? {type: {$in: type }} : {}
            ]
        }).skip( limit*(page-1) ).limit(limit)

        const totalReplies = await Comment.countDocuments({
            $and: [
                {refCommentId: comment_id},
                type ? {type: {$in: type }} : {}
            ]
        })

        const hasNext = parseInt(limit*page) < totalReplies ? true : false
  
        res.status(200).json({message:'query successfully', replyData: comments, page: page, hasNext: hasNext})
    } catch(err) {
        res.status(500).json(err)
    }
} )

//get comments by productId and type='comment'
router.get('/:productId',  async (req, res) => {
    let type = req.query.type
    let limit = parseInt(req.query.limit) || 5
    let page = parseInt(req.query.page) || 1
    try{
        const product_id = req.params.productId
        const comments = await Comment.find({
            $and: [
                {productId: product_id},
                type ? {type: {$in: type }} : {}
            ]
        }).skip( limit*(page-1) ).limit(limit)
        
        const totalComments = await Comment.countDocuments({
            $and: [
                {productId: product_id},
                type ? {type: {$in: type }} : {}
            ]
        })

        const hasNext = parseInt(limit*page) < totalComments ? true : false

        res.status(200).json({message:'query successfully', replyData: comments, page: page, hasNext: hasNext })
    } catch(err) {
        res.status(500).json(err)
    }
} )

// delete comment


module.exports = router