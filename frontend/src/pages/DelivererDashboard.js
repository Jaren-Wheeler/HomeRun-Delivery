<<<<<<< Updated upstream
import {useState, useEffect} from 'react-router-dom';

=======
import {useState, useEffect} from 'react';
import MapComponent from '../components/MapComponent';
import DelivererOptions from '../components/DelivererOptions';
>>>>>>> Stashed changes

const delivererDashboard = () => {

    return (
<<<<<<< Updated upstream
        <div class="map-container">
=======
        <div style={{display:'flex', flexDirection: 'column', height: '100vh', gap: '1rem'}}>
            <div style={{height: '10vh', display: 'flex', flexDirection: 'column'}}>
                <h2 style={{textAlign: "center"}}>Find Jobs</h2>
                <div style={{alignSelf: "flex-end", marginRight: '1rem'}}>
                    <DelivererOptions ></DelivererOptions>
                </div>
            </div>
            <MapComponent style={{height: '90vh'}}></MapComponent>
        </div>   
    )
}
>>>>>>> Stashed changes

        </div>
    )
}