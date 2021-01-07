import React, { useState, useEffect } from 'react'
import User from './Entities/User'
import { localDB, remoteDB } from './db'

function App() {
    const [ firstName, setFirstName ] = useState<string>("")
    const [ lastName, setLastName ] = useState<string>("")
    const [ email, setEmail ]= useState<string>("")
    const [ password, setPassword ]= useState<string>("")
    const [ users, setUsers ] = useState<any>([])
    const [ update, setUpdate ] = useState<boolean>(false);
    const [ isEdit, setIsEdit ] = useState<boolean>(false);
    const [ currentID, setCurrentID ] = useState<string>("");

    useEffect(() => {
        localDB
            .allDocs({
                include_docs: true,
            })
            .then((result: any) => {
                let nextUsers: any[] = [];
                result.rows.forEach((row: any) => nextUsers.push(new User(row.doc)))
                setUsers(nextUsers)
            })
            .catch(err => console.log(err))
    }, [update])

    const logLocalDB = () => {
        localDB.info().then(info => console.log(info.doc_count))
    }

    const logRemoteDB = () => {
        remoteDB.info().then(info => console.log(info.doc_count))
    }

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value)
    }

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value)
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = () => {        
        if (isEdit && currentID) {
            localDB.get(currentID).then(doc => {
                console.log(doc)

                    doc.firstName = firstName;
                    doc.lastName = lastName;
                    doc.email = email;
                    doc.password = password;                

                return localDB.put(doc);
            }).then(res => {
                setIsEdit(false)
                setFirstName("")
                setLastName("")
                setEmail("")
                setPassword("")
                setUpdate(!update);
            }).catch(err => console.log(err))
        } else {
            let newUser = new User({
                firstName,
                lastName,
                email,
                password
            });

            localDB
                .put(newUser)
                .then(res => {
                    setFirstName("")
                    setLastName("")
                    setEmail("")
                    setPassword("")
                    setUpdate(!update)               
                })
                .catch(err => console.log(err))
        }
    }

    // const handleSayHi = () :void => {
    //     if (user !== undefined) user.sayHi()
    // }

    const handleDeleteUser = (user: any) => {
        localDB.get(user._id)
            .then(doc => {
                localDB.remove(doc);
                setUpdate(!update);
            })
            .catch(err => console.log(err));
    }

    const handleEditUser = (user: any) => {
        setIsEdit(true)
        setFirstName(user.firstName)
        setLastName(user.lastName)
        setEmail(user.email)
        setPassword(user.password)
        setCurrentID(user._id)
        // localDB.get(user._id)
        //     .then(doc => {
        //         localDB.remove(doc);
        //         setUpdate(doc);
        //     })
        //     .catch(err => console.log(err));
    }

    const renderUsers = () => {
        return users.length 
            ? (
                <table>
                    <thead>
                        <tr>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                        </tr>                    
                    </thead>
                    <tbody>
                        {users.map((user: any) => (
                            <tr key={user._id}>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td><button onClick={() => handleDeleteUser(user)}>X</button></td>
                                <td><button onClick={() => handleEditUser(user)}>X</button></td>
                            </tr> 
                        ))}
                    </tbody>
                </table>
            )
            : null
    } 

    const replicate = () => {
        localDB.sync(remoteDB).on('complete', () => {
            setUpdate(!update)
            console.log('replication success')
        }).on('error', function (err) {
            console.log('replication error: ' + err)
        });
    }

    return (
        <div className="App">
            <button className={"ctl"} onClick={logLocalDB}>log localDB docs count</button>
            <button className={"ctl"} onClick={logRemoteDB}>log remoteDB docs count</button>
    <h2>{isEdit ? "EDIT" : "CREATE"}</h2>
            <span style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <p style={{margin: '0 1rem'}}>{"First Name:"}</p>
                <input type="text" onChange={handleFirstNameChange} value={firstName}/>
            </span>
            <span style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <p style={{margin: '0 1rem'}}>{"Last Name:"}</p>
                <input type="text" onChange={handleLastNameChange} value={lastName}/>
            </span>
            <span style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <p style={{margin: '0 1rem'}}>{"Email:"}</p>
                <input type="text" onChange={handleEmailChange} value={email}/>
            </span>
            <span style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <p style={{margin: '0 1rem'}}>{"Password:"}</p>
                <input type="text" onChange={handlePasswordChange} value={password}/>
            </span>
            <button className={"ctl"} onClick={handleSubmit}>submit</button>
            {renderUsers()}
            <button className={"ctl"} onClick={replicate}>bidirectionnal replication</button>
        </div>
    )
}

export default App
