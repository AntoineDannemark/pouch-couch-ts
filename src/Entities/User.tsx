import BaseEntity from './BaseEntity'

// export interface UserInterface {
//     firstName: string
//     lastName: string 
//     email: string 
//     password: string
// }

class User extends BaseEntity {
    firstName: string
    lastName: string 
    email: string
    password: string

    constructor(user: {_id?: string, firstName: string, lastName: string, email: string, password: string}) {
        super(user._id)
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.email = user.email
        this.password = user.password
    }

    sayHi() :void {
        console.log('Hi')
        console.log(this)
    }
}

export default User;