const { response } = require('express');
const { uploadFile } = require('../helpers/')
const { User, Product } = require('../models/')
const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)


const loadFiles = async (req, res = response) => {
    
    // Array con tipos de archivo permitidos
    const type_allowed = [ 'txt','md' ];

    // Carpeta donde se subirá el archivo
    const file_folder = '';

    // Subida de archivos
    try {
        const file_name = await uploadFile( req.files , type_allowed , file_folder ) // Para mandar un campo sin rellenar, escribir "undefined"
        res.status(200).json({
            file_upload: file_name
        })
    } catch (err) {
        res.status(400).json({
            error: err
        })
    }
    
}

const uploadFiles = async (req, res = response) => {

    const { id, collection } = req.params

    let model;

    switch ( collection ){
        case 'users':

            model = await User.findById(id)

            if( !model ){
                return res.status(400).json({
                    msg: `No existe ningún usuario con la ID ${id}`
                })
            }

            break;

        case 'products':

            model = await Product.findById(id)

            if( !model ){
                return res.status(400).json({
                    msg: `No existe ningún producto con la ID ${id}`
                })
            }

            break;
        
        default:
            
            return res.status(500).json({
                msg: "Error de validación"
            })
    }

    // Subida de archivos
    try {

        // Limpiar carpeta de imágenes si el modelo ya tiene una en BD
        if(model.img){
            const pathImage = path.join(__dirname, '../uploads', collection , model.img)
            
            if(fs.existsSync(pathImage)){
                fs.unlinkSync(pathImage)
            }
        }

        const file_name = await uploadFile( req.files , ['jpg','png','PNG','gif'] , collection )
        
        model.img = file_name
        
        await model.save();

        res.status(200).json({
            model
        })

    } catch (err) {
        res.status(400).json({
            error: err
        })
    }

}

const showFiles = async (req, res = response) => {

    const { id, collection } = req.params

    let model;

    switch ( collection ){
        case 'users':

            model = await User.findById(id)

            if( !model ){
                return res.status(400).json({
                    msg: `No existe ningún usuario con la ID ${id}`
                })
            }

            break;

        case 'products':

            model = await Product.findById(id)

            if( !model ){
                return res.status(400).json({
                    msg: `No existe ningún producto con la ID ${id}`
                })
            }

            break;
        
        default:
            
            return res.status(500).json({
                msg: "Error de validación"
            })
    }

    // Mostrar archivo
    try {

        // Comprovamos si hay una imagen subida
        if(model.img){
            const pathImage = path.join(__dirname, '../uploads', collection , model.img)
            
            // Si la imagen existe, devolvemos el archivo
            if(fs.existsSync(pathImage)){
                return res.sendFile(pathImage)
            }
        }

        // En caso de no haber imagen, devolvemos la imagen genérica que indica que no se ha encontrado la imagen
        return res.sendFile(path.join(__dirname, '../assets', 'no-image.jpg'))

    } catch (err) {
        res.status(400).json({
            error: err
        })
    }

}

const uploadFiles_cloudinary = async (req, res = response) => {

    const { id, collection } = req.params

    let model;

    switch ( collection ){
        case 'users':

            model = await User.findById(id)

            if( !model ){
                return res.status(400).json({
                    msg: `No existe ningún usuario con la ID ${id}`
                })
            }

            break;

        case 'products':

            model = await Product.findById(id)

            if( !model ){
                return res.status(400).json({
                    msg: `No existe ningún producto con la ID ${id}`
                })
            }

            break;
        
        default:
            
            return res.status(500).json({
                msg: "Error de validación"
            })
    }

    // Subida de archivos
    try {

        // Limpiar carpeta de imágenes si el modelo ya tiene una en BD
        if(model.img){
            const img_name_arr = model.img.split('/')
            const img_name = img_name_arr[img_name_arr.length - 1]
            const [ public_id ] = img_name.split('.')

            cloudinary.uploader.destroy(public_id)
        }
        
        const { tempFilePath } = req.files.file_upload
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)
        
        model.img = secure_url
        
        await model.save();

        res.status(200).json({
            model
        })

    } catch (err) {
        res.status(400).json({
            error: err
        })
    }

}

module.exports = {
    loadFiles, uploadFiles, showFiles, uploadFiles_cloudinary
}