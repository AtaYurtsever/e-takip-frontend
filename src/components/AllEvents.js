import React from "react"
import {BrowserRouter,Link} from "react-router-dom"
import styled from "styled-components";
import "../styles/Card.css"
import "../styles/Header.css"
import axios from "axios"

const CollBtn = styled.div`
        background-color:#FFFFFF;
        border-radius:5px;
        text-align:center;
        cursor:pointer;
        margin-left: 20px;
    `

class AllEvents extends React.Component{
    state = {
        collapse:false,
        events:[]
    }

    componentDidMount(){
        console.log("Component Mounted")
        this.retrieveData();
    }

    setCollapse = (inp) => this.setState({collapse:inp})

    retrieveData = () => {
        axios.get("http://localhost:8080/events").then((result) => {
            console.log(result.data);
            this.setState({events:result.data})
        })
    }

    render(){
            var  ArticleC
            var btnText
            if(this.state.collapse === false){
                btnText = "Daha Fazla"
                ArticleC = styled.div`
                    height:0;
                    overflow:hidden;
                    
                    transition: clip-path 0.5s
                `
            }
            else{
                btnText = "Küçült"
                ArticleC = styled.div`
                    height:auto;
                    clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
                    transition: articleC_expand 0.5s
                `
            }

            let firstCards = this.state.events.map((item,index)=>{
                if(index < 4){
                    return(
                        <li key={"li_item_"+index} className="articles__article" style={{__animation_order:index}}>
                            <Link to={"/events/"+item.id} className="articles__link" target="/">
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
                }
                else return ""
            })

            let collapseCards = this.state.events.map((item,index)=>{
                if(index >= 4){
                    return(
                        <li key={"li_item_"+index} className="articles__article" style={{__animation_order:index}}>
                            <Link to={"/events/"+item.id} className="articles__link" target="/">
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
                }
                else return ""
            })

            if(collapseCards === null) collapseCards = "No extra"

            return(
                <>
                <div className="articles">
                    <BrowserRouter>
                    {firstCards}
                    </BrowserRouter>
                </div>  


                <ArticleC className="articles articles_collapse"  style={{width:`100%`}}>
                    <BrowserRouter>
                    {collapseCards}
                    </BrowserRouter>
                </ArticleC>
                
                <CollBtn onClick={()=>this.setCollapse(!this.state.collapse)} style={{width:"100px",height:"20px"}}>
                    {btnText}
                </CollBtn>
                </>
            )
    }
}


export default AllEvents
export const AllEventsHeader = () => {
    return (
        <div className="Header">
            
            <h1>Tum Etkinlikler</h1>
        </div>
    )
} 