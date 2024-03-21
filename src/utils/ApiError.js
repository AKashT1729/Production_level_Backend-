class ApiError extends Error{
    constructor(
        statusCode,
        massage = "Something want wrong",
        errors = [],
        statck = ""
    ) {
        super(massage);
        this.statusCode = statusCode;
        this.errors= errors;
        this.data = null
        this.massage = massage;
        this.success = false

        if(statck){
            this.stack = statck
        } else {
            Error.captureStackTrace(this, this.constrictor)
        }

    }
}

export {ApiError}