import { useRef, useState } from "react"
import "./TopBar.css"
export default function TopBar() {
    const [currentMode, setCurrentMode] = useState({})


    const topMiniSubGroupRef = useRef()
    const onClickTime = () => {
        // if (Object. == "time")
        
    }

    return (
        <div id="topbar">
            <div className="group">
                <div id="topbar-sub-group">
                    <button className="button">punctuation</button>
                    <button className="button">numbers</button>
                </div>
                <div id="topbar-main-group">
                    <button className="button">time</button>
                    <button className="button">words</button>
                    <button className="button">quote</button>
                    <button className="button">custom</button>
                </div>
                <div id="topbar-mini-sub-group"></div>
            </div>
        </div>
    )
}   