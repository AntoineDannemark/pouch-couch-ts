import cuid from 'cuid'

abstract class BaseEntity {
    _id: string
    private createdAt: string
    private updatedAt: string
    private deleted: boolean

    constructor(id?: string) {
        this._id = id || cuid()
        this.createdAt = new Date().toISOString()
        this.updatedAt = new Date().toISOString()
        this.deleted = false
    }
}

export default BaseEntity
