const path = require('path');
const { v4: uuidv4 } = require('uuid');


const uploadFile = ( files, validExtensions = ['png','jpg','PNG','JPG'], folder = '' ) => {

    return new Promise( (resolve, reject) => {

        const { file_upload } = files;
        const file_name_info = file_upload.name.split('.');
        const file_extension = file_name_info[ file_name_info.length - 1 ];

        if(!validExtensions.includes(file_extension)){
            return reject(`La extensión ${file_extension} no está permitida - ${validExtensions}`)
        }
            
        const tempName = uuidv4() + '.' + file_extension;

        const uploadPath = path.join( __dirname, '../uploads/', folder, tempName );
    
        file_upload.mv(uploadPath, function(err) {
            if (err){
                return reject(err)
            }
            
            return resolve(tempName)
            
        });

    })

}


module.exports = {
    uploadFile
}