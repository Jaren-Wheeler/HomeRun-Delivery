import {useState, useEffect} from 'react';
import MapComponent from '../components/MapComponent';
import DelivererOptions from '../components/DelivererOptions';
import RadiusSelector from '../components/RadiusSelector';

const DelivererDashboard = () => {

    return (
        <div style={{display:'flex', flexDirection: 'column', height: '100vh', gap: '1rem'}}>
            <div style={{height: '10vh', display: 'flex', flexDirection: 'column'}}>
                <h2 style={{textAlign: "center"}}>Find Jobs</h2>
               
               <div style={{display: 'flex', width: '100%', justifyContent: "space-between"}}>
                    <div>
                        <input type='text' placeholder="Search Locations" style={{alignSelf: 'flex-start', width: "25%", fontSize: "16px"}}></input>
                        <RadiusSelector></RadiusSelector>
                    </div>
                 
                    <div style={{alignSelf: "flex-end", marginRight: '1rem'}}>
                        
                        <DelivererOptions></DelivererOptions>
                    </div>
               </div>
                
            </div>
            <MapComponent style={{height: '90vh'}}></MapComponent>
        </div>   
    )
}

export default DelivererDashboard;
