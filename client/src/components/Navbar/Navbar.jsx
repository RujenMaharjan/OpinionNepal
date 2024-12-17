import React from 'react'
import { Logo } from '../Logo/Logo'
import { IoSearch } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import './Navbar.css';

export const Navbar = () => {
  return (
    <div className="Main">
        <div className="left bg-red-700" style={{flex:3}}>
            <div className="logodiv">
                <Logo/>
            </div>
        </div>

        <div className="center" style={{flex:5}}>
            <div className="searchBar">
                <IoSearch className='searchIcon'/>
                <input type="text" className="search"/>

            </div>
        </div>

        <div className="right" style={{flex:4}}>
            <div className="tabLinks">
                <div className="tabLink1">Home</div>
                <div className="tabLink2">Timeline</div>
            </div>
            <div className="tabIcons">
                <div className="tabIcon1">
                    <IoPerson/>
                    <span className=''>1</span>
                </div>
                <div className="tabIcon2">
                    <IoChatboxEllipsesSharp/>
                    <span className=''>2</span>
                </div>
                <div className="tabIcon3">
                    <IoIosNotifications/>
                    <span className=''>3</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar