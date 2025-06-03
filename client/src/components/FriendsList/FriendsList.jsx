import React from 'react'


const FriendsList = ({friend}) => {
  return (
    <li className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-100 transition duration-200 cursor-pointer">
              <img
                src={friend.profilePicture}
                alt="User"
                className="w-8 h-8 rounded-full border-2 border-orange-200"
              />
              <span className="text-orange-700 font-medium">{friend.username}</span>
            </li>
  )
}

export default FriendsList