const notFound = (req, res, next) => {
    const err = new Error(`Not Found - ${req.orignalUrl}`);
    res.status(404);
    next(err);
}

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    
    if(err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resouce Not Found';
    }

    return res.status(statusCode).json({message, stack: process.env.NODE_ENV ==='production' ? null: err.stack });
    /*if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "file is too large" });
        }

        if (error.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({ message: "File limit reached" });
        }

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json("File must be an image(.jpg, .png, .fif");
        }
    }*/

    

    
    
}


module.exports = {notFound, errorHandler};