export class ErrorBodyNotFound {
    constructor(timestamp, path) {
        this.timestamp = timestamp
        this.status = 404
        this.error = "Not Found"
        this.message = "student not found"
        this.path = path
    }
}