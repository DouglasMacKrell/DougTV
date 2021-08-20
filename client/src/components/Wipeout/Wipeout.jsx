import React from 'react'
import axios from 'axios'

import './Wipeout.css'

const Wipeout = () => {
    const deleteAllBroadcasters = async () => {
        try {
            let deletedBroadcasters = await axios.delete('api/broadcasters/wipeout')
            return deletedBroadcasters
        } catch (err) {
            throw err
        }
    }

    return (
        <div className="wipeout__main-container">
            <div className="wipeout__sub-container">
                <button className="wipeout__button" onClick={() => deleteAllBroadcasters()}>Clear Database</button>
            </div>
        </div>
    )
}

export default Wipeout
