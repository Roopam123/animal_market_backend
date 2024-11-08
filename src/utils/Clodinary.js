import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// fs = file system

cloudinary.config({
    cloud_name: 'dudlgojag',
    api_key: '621723971675964',
    api_secret: 'PMxGELGFzalOOOuWrW-IAMRbAXM'
});

const uploadOnCludinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // Upload the file on cloudinary
        const fileUploadRes = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath);
        return fileUploadRes;
    } catch (error) {
        console.log("Error on the uploadOnCludinary function", error);
        fs.unlinkSync(localFilePath); // remove local file path if file feaild on upload on cloudinary
        return null;
    }
}


export { uploadOnCludinary };