import React, { Fragment, useState, useEffect, useRef, useContext } from 'react'
import { FaSearch } from 'react-icons/fa';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { BiMessageAdd } from 'react-icons/bi';
import queryString from 'query-string'
import axios from 'axios'
import * as io from 'socket.io-client';
import { AuthContext } from '../App';
import { Redirect } from 'react-router-dom'

const END_POINT = 'http://127.0.0.1:5000/';

const Home = ({location}) => {

    const { state } = useContext(AuthContext)

    //useRef for use socket io global
    const socketRef = useRef()

    const [allFriend, setFriend] = useState({
        allFriend: []
    })

    const [findFriend, setFindFriend] = useState(false)
    
    const [response, setResponse] = useState("")

    const [search, setSearch] = useState("")

    const [alreadyFriend, setalreadyFriend] = useState("")
    
    const [searchData, setSearchData] = useState({
        searchData: []
    })

    const [sender, setSender] = useState("")
    
    const [receiver, setReceiver] = useState("")

    const [message, setMessage] = useState("")

    const [chat, setChat] = useState([])

    const [typing, setTyping] = useState('')

    const handleFind = () => {
        if(findFriend) {
            setFindFriend(false)
            setSearchData({
                searchData: []
            })
        } else {
            setFindFriend(true)
        }
    }

    const handleSearchAlreadyFriend = event => {
        setalreadyFriend(event.target.value)
    }

    const getFriend = () => {
        axios.get(END_POINT + 'friends',{
            params: {
                uuid: '13d55e50-1a75-46c8-9617-64166ff00720',
                name: alreadyFriend
            }
        }).then(res => {
            setFriend({
                allFriend: res.data
            })
        }).catch(e => {
            console.log(e)
        })
    }

    const handleSearch = event => {
        setSearch(event.target.value)
    }

    const searchFriend = () => {
        if(search) {
            axios.get(END_POINT + 'searchFriends',{
                params: {
                    name: search
                }
            }).then(res => {
                setSearchData({
                    searchData: res.data
                })
                console.log(res.data)
            })
        }
    }

    const onSelectedUser = (receiver) => {
        setReceiver(receiver)
    }

    const handleMessage = event => {
        setMessage(event.target.value)
    }

    const handleTyping = event => {
        // const socket = io(END_POINT,{transports: ['websocket']})
        socketRef.current.emit('typing', {
            sender: sender,
            type: true
        })
    }

    console.log(location.search)
    useEffect(() => {
        // const socket = io(END_POINT,{transports: ['websocket']})
        socketRef.current = io(END_POINT,{transports: ['websocket']})
        // const {name} = queryString.parse(location.search)
        setSender(state.username)
        console.log(state.username)
        getFriend()
        console.log(socketRef.current)
        socketRef.current.emit('user_connected', state.username)
        socketRef.current.on('new_message', data => {
            setChat((chat) => [...chat, data])
            console.log(data)
        })
        // socket.on('typing', data => {
        //     if(data.type === true) {
        //         console.log('sedang mengetik', data.sender)
        //         setInterval(() => {
        //           setTyping('')  
        //         }, 1000);
        //         setTyping(data.sender)
        //     }
        // })

        console.log(chat)

        //eslint-disable-next-line

        return () => {
            socketRef.current.disconnect()
        }

    },[END_POINT, location.search, alreadyFriend,chat, state])
    
    const sendMessage = () => {
        // event.preventDefault();
        // const socket = io(END_POINT,{transports: ['websocket']})
        console.log(sender)
        console.log(receiver)
        socketRef.current.emit('send_message',{
            uuid: '13d55e50-1a75-46c8-9617-64166ff00720',
            sender: sender,
            receiver: receiver,
            message: message
        })
        setChat((chat) => [...chat, {
            uuid: '13d55e50-1a75-46c8-9617-64166ff00720',
            sender: sender,
            receiver: receiver,
            message: message
        }])
        setMessage('')
    }

    console.log(chat.length)

    if(!state.isAuthenticated) {
        return <Redirect to="/" />
    }

    return(
        <Fragment>
            <div className="w-full h-screen container mx-auto flex justify-between p-6">
                <div className="w-3/12">
                    <div className="w-full">
                        <div className="w-full flex flex-col justify-center items-center">
                            <div className="flex justify-between w-full items-center">
                                <h1 className="font-bold text-primary text-4xl">{typing}</h1>
                                <button className="inline-block bg-primary rounded-lg py-1 px-2 text-white font-bold focus:outline-none">LOGOUT</button>
                            </div>
                            <div className="w-full flex flex-col justify-center items-center mt-8">
                                <img className="rounded-full object-cover w-32 h-32" src="https://placeimg.com/640/480/any" alt=""/>
                                <h1 className="text-gray-900 font-bold">Marcus Albert</h1>
                            </div>
                            <div className="flex w-full flex-col">
                                <div className="flex w-full justify-end mt-8">
                                    {findFriend ?
                                    <div className="flex mr-2 flex-wrap items-stretch w-full relative h-15 bg-white rounded-md pr-2">
                                        <div className="flex -mr-px justify-center w-15 p-2">
                                            <div
                                            className="flex items-center leading-normal bg-white rounded text-xl px-2 whitespace-no-wrap text-primary">
                                            <AiOutlineUserAdd/>
                                            </div>
                                        </div>
                                        <input
                                          type="text"
                                          onChange={handleSearch}
                                          className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 px-3 relative self-center text-xl text-blue-500 outline-none"
                                          placeholder="Find your friends..."
                                        />
                                        <button onClick={searchFriend} className="inline-block bg-primary -mr-2 rounded-lg py-1 px-2 text-white font-bold focus:outline-none">Find</button>
                                    </div>
                                    :
                                    <h1 className="text-primary text-lg mr-2">says to more friends</h1>
                                    }
                                    <button onClick={handleFind} className="inline-block bg-primary rounded-lg py-1 px-2 text-white font-bold focus:outline-none">{findFriend ? <div>Friends</div> : <div>Find</div> }</button>
                                </div>
                                {!findFriend ?
                                <div className="flex flex-wrap items-stretch w-full relative h-15 bg-white rounded-md mb-4 mt-2 pr-2">

                                    <div className="flex -mr-px justify-center w-15 p-2">
                                        <div
                                        className="flex items-center leading-normal bg-white rounded text-xl px-2 whitespace-no-wrap text-primary">
                                        <FaSearch/>
                                        </div>
                                    </div>
                                    <input
                                      type="text"
                                      onChange={handleSearchAlreadyFriend}
                                      className="flex-shrink flex-grow flex-auto leading-normal w-px border-0 h-10 px-3 relative self-center text-xl text-blue-500 outline-none"
                                      placeholder="Search..."
                                    />
                                </div>
                                :
                                <div className="mt-2"></div>
                                }
                            </div>
                            <div className="flex flex-col w-full scroll-navbar">

                                {
                                    !findFriend ?
                                    allFriend.allFriend.map(friend =>{
                                        return (
                                            <button key={friend.id} onClick={() => onSelectedUser(friend.user.name)} className="flex w-full items-center my-2 focus:outline-none">
                                                <img className="rounded-full object-cover w-12 h-12 mr-2" src="https://placeimg.com/640/480/any" alt=""/>
                                                <div className="flex flex-col items-start">
                                                    <h1 className="font-bold">{friend.user.name}</h1>
                                                    <h2 className="">Hi, How are you marcus...</h2>
                                                </div>
                                            </button>
                                        )
                                    })
                                    :
                                    
                                    searchData.length ? 
                                    <div>
                                        Find your friend
                                    </div> 
                                    : 
                                    searchData.searchData.map(friend => {
                                        return (
                                            <button key={friend.id} onClick={() => onSelectedUser(friend.user.name)} className="flex w-full justify-between items-center my-2 focus:outline-none">
                                                <div className="flex">
                                                    <img className="rounded-full object-cover w-12 h-12 mr-2" src="https://placeimg.com/640/480/any" alt=""/>
                                                    <div className="flex flex-col items-start">
                                                        <h1 className="font-bold">{friend.name}</h1>
                                                        <h2 className="">Hi, How are you marcus...</h2>
                                                    </div>
                                                </div>
                                                <BiMessageAdd className="text-xl"/>
                                            </button>
                                        )
                                    }) 
                                    
                                }

                                
                                
                            </div>
                        </div>
                    </div>                   
                </div>
                <div className="w-7/12 h-full bg-white rounded-xl relative">
                    <div className="absolute bottom-0 w-full h-24 p-4">
                        <div className="bg-lightsecondary w-full h-full rounded-md flex justify-between items-center">
                            <input onChange={handleMessage} value={message} onKeyPress={handleTyping} className="w-9/12 px-2 h-8 mx-2 my-3 rounded-md" type="text"/>
                            <button onClick={sendMessage} className="w-2/12 h-8 bg-primary rounded-md text-white font-bold focus:outline-none mx-2 my-3">Send</button>
                        </div>
                    </div>
                    <div className="w-full h-full rounded-xl p-8 scroll-content">
                        <ul className="flex flex-col w-full list-content">
                           
                            {chat.length ?
                                chat.map(data => {
                                    return (
                                        <li className={`flex py-4 items-center w-full ${ data.sender === sender ? "justify-end" : "justify-start" }`}>
                                            <div className={`flex align-middle ${ data.sender === sender ? "flex-row-reverse" : "" }`}>
                                                <img className="rounded-full object-cover w-12 h-12" src="https://placeimg.com/640/480/any" alt=""/>
                                                { data.sender === sender ?
                                                <div className="flex flex-col mr-3 items-end">
                                                    <div className="flex-wrap rounded-md py-1 px-2 bg-primary">
                                                        <h1 className="text-sm">{data.message}</h1>
                                                    </div>  
                                                    <p className="text-xs">07.06</p>
                                                </div>
                                                :
                                                <div className="flex flex-col ml-3">
                                                    <div className="flex-wrap rounded-md py-1 px-2 bg-lightsecondary">
                                                        <h1 className="text-sm">{data.message}</h1>
                                                    </div>  
                                                    <p className="text-xs">07.06</p>
                                                </div>    
                                                }
                                            </div>
                                        </li>
                                    )
                                })
                                :
                                <div></div>   
                            }

                        </ul>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Home;