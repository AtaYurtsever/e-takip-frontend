import React ,{useState} from "react"
import {BrowserRouter,Link} from "react-router-dom"
import Grid from '@material-ui/core/Grid';
import styled from "styled-components";
import TextField from "@material-ui/core/TextField"
import axios from "axios"
import "../styles/Card.css"
import "../styles/Header.css"



const Btn = styled.div`
        background-color:#FF4D50;
        border-radius:5px;
        text-align:center;
        cursor:pointer;
        
        width=100%;
        height=100%;
        min-height:50px;
        color:white;
        font-weight:bold;
        font-family: 'Roboto', sans-serif;
        text-align:center;
    `

function eventRenderer(events){
    
    return events.map((item,index)=>{
        return(
            <li class="articles__article" style={{__animation_order:index}}>
                <Link to={"/events/"+item.id} class="articles__link" target="/">
                    <div className="articles__content articles__content--lhs">
                        <h2 className="articles__title">{item.title}</h2>
                        <div className="articles__footer">
                            <p>{item.organizer.name}</p><time>{item.startDate.substring(5,10)}</time></div>
                    </div>
                    <div className="articles__content articles__content--rhs" aria-hidden="true">
                        <h2 className="articles__title">{item.title}</h2>
                        <div className="articles__footer">
                            <p>{item.organizer.name}</p><time>{item.startDate.substring(5,10)}</time></div>
                    </div>
                </Link>
            </li>    
        )
    })
}


const OrganizerEvents = () => {
    
    const[organizer,setOrganizer] = useState("")
    const[organizerTemp,setOrganizerTemp] = useState(organizer);
    const [events, setEvents] = useState([])

    var oString;
    if(organizer === "")
        oString = "Organizator etkinliklerini listele"
    else
        oString = organizer+"'in etkinlikleri gosteriliyor";
    return (
        <>
        <div className="Header">
            <Grid container spacing={3}>
                <Grid item xs = {7} >
                    <h1>{oString}</h1>
                </Grid>
                <Grid item xs = {3}>
                    <TextField id="getOrganizer" value={organizerTemp} onChange={event => setOrganizerTemp(event.target.value)}/>
                </Grid>
                <Grid item xs = {2}>
                    <Btn onClick={() => {
                        setOrganizer(organizerTemp)
                        axios.get("http://localhost:8080/events/name/"+organizerTemp).then((response)=>{
                            setEvents(response.data)
                        }).catch(error => console.log(error))
                    }}><h1>Listele</h1></Btn>
                </Grid>
                
            </Grid>
        </div>
        <div className="articles" style={{marginTop:"50px"}}>
            <BrowserRouter>
            {eventRenderer(events)}
            </BrowserRouter>
        </div>
        </>
    )
}

export default OrganizerEvents