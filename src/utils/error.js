
export class AuthrizationError extends Error {
    constructor(status, message){
        super()
        this.name = 'AuthrizationError'
        this.status = status
        this.message = message
    }
}
export class InternalServerError extends Error {
    constructor(status, message){
        super()
        this.name = 'InternalServerError'
        this.status = status
        this.message = message
    }
}
export class ValidationError extends Error {
    constructor(status, message){
        super()
        this.name = 'ValidationError'
        this.status = status
        this.message = message
    }
}
export class ForbiddenError extends Error {
    constructor(status, message){
        super()
        this.name = 'ForbiddenErrorexport '
        this.status = status
        this.message = message
    }
}
export class notFoundedError extends Error {
    constructor(status, message){
        super()
        this.name = 'notFoundedError '
        this.status = status
        this.message = message
    }
}