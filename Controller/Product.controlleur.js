import { v2 as cloudinary } from 'cloudinary'
import { hasing, message } from '../Utility/Code.js';
import { Products } from '../Database/Product.js';
import { Readable } from 'stream'
import { db } from '../Database/DB.js'




cloudinary.config({
    cloud_name:'djsqlgkv2',
    api_key:'171143432965924',
    api_secret:'4H3zYL5xDd3oVzRbxDNXIC7r9GQ'
})

export const productUpload = async(req,res)=>{
    const { titre,prix,description,id_user,ref,type } = req.body;
    await Products.read();
    Products.data.lists ||=[];
    Products.data.images ||=[];
    const { lists } = Products.data
    const id_product = lists.length
    const { images } = Products.data
    const file = req.file
    if(!file) return res.status(201).send(await hasing(message('error')));
    lists.push({
        titre:titre,
        id:id_product,
        user_id:id_user,
        prix:prix,
        reference:ref,
        type:type,
        description:description,
        namefile:file.originalname,
        date:new Date().toLocaleDateString(),
        timesDate:new Date().toDateString()
    })
     const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'product', resource_type: 'image' },
          (err, result) => {
            if (err) reject(err)
            else resolve(result)
          }
        )
        Readable.from(file.buffer).pipe(stream)
      })

    const result = await streamUpload()
    images.push({
        id:images.length,
        product_id:id_product,
        url:result.secure_url
    })
    const messages = message('votre produit',true,'message')
    res.status(201).send(await hasing(messages));
    await Products.write();
}


export const getProduct = async(req,res)=>{
  await db.read()
  await Products.read();
  
  Products.data.lists ||=[]
  Products.data.images ||=[]
  const { lists,images } = Products.data
  const { users } = db.data
  if(lists.length<0 && images.length<0) return res.status(501).send(await hasing(message('aucun',false,'aucun')))
    const product = lists.map((item)=>{
      images.map((items)=>{
        if(items.product_id===item.id){
          item.url = items.url
        }
      })
      users.map((items)=>{
        if(items.id===item.user_id)
        {
          item.user = items
        }
      })
      return item;
    })

    res.status(201).send(await hasing(message('trouve',true,'','',product)));
    

}