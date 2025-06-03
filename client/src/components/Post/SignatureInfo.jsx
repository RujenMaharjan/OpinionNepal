import React, { useEffect, useState } from 'react'
import { getUserData } from '../../utils/api/api';
import { Link } from 'react-router-dom';
import profilepic from '../../assets/noProfile.png';
function SignatureInfo({signatureId}) {
    const [person, setPerson] = useState({});
   useEffect(() => {
        const getUserInfo = async () => {
            if (!signatureId) return;
            try { 
                const res = await getUserData(signatureId);
                setPerson(res.data.userInfo || {}); 
            } catch (error) {
                console.error("Error fetching user info:", error);
                setPerson({}); 
            }
        };
        getUserInfo();
    }, [signatureId]);

  return (
    <li className='petitionDialog__list__item' key={person._id}>
        <Link to={`/profile/${person.username}`} className='petitionDialog__list__item__link'>

        <img
            src={person.profilePicture || profilepic} 
            alt="profilepic"
            className='w-[32px] h-[32px] rounded-full object-cover'
        />
        <span className='font-bold ml-[10px] mr-[10px]'>
            {person.username || "Unknown User"}
        </span>
        </Link>
    </li>
  )
}

export default SignatureInfo