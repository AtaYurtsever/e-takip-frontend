import React from "react"
import styled from "styled-components"
import {Link} from "react-router-dom"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import axios from "axios";
import Crypto from "crypto-js"
import CanvasJSReact from "./canvasjs.react"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import "../styles/Applicant.css"

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

// var CanvasJs = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const H1 = styled.h1`
    font-size: 72px;
    width:70%;
    margin-left:10%;
    font-family:roboto;
    color:black;
`
const HL = styled.div`
    width:95%;
    height:3px;
    border-radius:3px;
    background-color:grey;
    margin-top:5px;
    margin-bottom:5px;
`


const Modify = styled.div`
    font-family:roboto;
    position:realtive;
    height:50px;
    width:80%;
    margin:10%;
    min-width:120px;
    text-align:center;
    background:#FFFFFF;
    top:0;
    right:10%;
    right:10%;
    border-radius:20px;
    cursor:pointer;
    font-size:30px;
    color:black;
`
const Mbutton = styled.button`
    font-family:roboto;
    position:realtive;
    height:50px;
    width:80%;
    text-align:center;
    background:#FFFFFF;
    top:0;
    border-radius:20px;
    cursor:pointer;
    font-size:30px;
    color:black;
`


class Applicants extends React.Component{
    state={
        event:{title:"",organizer:{name:""}},
        secretKey:"",
        applicants:[],
        dataPoints:[],
        sucessOpen:false,
        errorOpen:false,
        message:""
    };


    openSucess = (message) => {
        this.setState({sucessOpen:true,message:message});
    }
    
    openError = (message) => {
        this.setState({errorOpen:true,message:message});
    }
    
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        this.setState({sucessOpen:false,errorOpen:false});
    };
    
    updateDataPoints = () => {
        const applicants = this.state.applicants;
        var dp = [];
        var included = []
        applicants.forEach(item => {
            var date = item.applicationDate.substring(0,10);
            if(included.includes(date))
                dp = dp.filter(item=>{
                    if(item.label === date)
                        item.y++;
                    return item;
                })
            else{
                dp.push({label:date,y:1})
                included.push(date);
            }
        })
        dp.sort((a,b)=>{
            var _a = a.label;
            var _b = b.label;

            if(_a<_b) return -1;
            if(_b<_a) return 1;
            else return 0;
        })
        console.log(dp)
        this.setState({dataPoints:dp})
    }

    onKeyChange = key => this.setState({secretKey:key.target.value})
    componentDidMount(){
        console.log("component mounted")
        axios.get("http://localhost:8080/events/"+this.props.match.params.id)
            .then(response => {console.log(response.data);
                this.setState({event:response.data})
            })
            .catch(error => console.log(error))
    }
    
    getApplicants = (formEvent)=>{
        formEvent.preventDefault();
        var id  = this.props.match.params.id;
        axios.post("http://localhost:8080/events/"+id+"/applicants",
        {
            name:this.state.event.organizer.name,
            secretKey: Crypto.SHA256(this.state.secretKey).toString()
        }).then(response=> {
            if(response.data === "")
                throw("Şifre hatalı")
            this.openSucess("Giriş başarılı");
            this.setState({applicants:response.data});
            this.updateDataPoints()   
        })
        .catch(error => this.openError(error))
    }
    render(){

        const chart = this.state.dataPoints.length === 0 ? "" :<CanvasJSChart 
        options ={{
            animationEnabled:true,
            exportEnabled:true,
            theme:"light1",
            title:{
                text:"Günlere göre başvuran katılımcı sayısı"
            },
            // axisY:{
            //     includeZero:true
            // },
            data:[{
                type:"column",
                dataPoints:this.state.dataPoints
            }]
        }}/>


        const applicants  = this.state.applicants.map((item,index) =>{
            
            const extras = item.extraQuestions.map((item,index)=>{
                return(<>
                    <Grid item xs ={4}>
                        {item.id}
                    </Grid>
                    <Grid item xs={8}>
                        {item.text}
                    </Grid>
                </>)
            })

            return (<div className="ApplicantContainer">
            <Grid container spacing={3}>
                <Grid item xs={1}>
                    {index}
                </Grid>
                <Grid item xs={3}>
                    {item.name}
                </Grid>
                <Grid item xs={4}>
                    {item.email}
                </Grid>
                <Grid item xs={4}>
                    {item.tckno}
                </Grid>
            </Grid>
            <HL/>
            <Grid container spacing={3} className="extras" >
                {extras}
            </Grid> 
        </div>)
        })

        return (<><div style={{width:"90%"}}>
        <Grid container spacing={3}>
            <Grid item xs = {2}>
                <Link to={"/events/"+this.props.match.params.id} className="applicantCross">
                    <span></span>
                    <span></span>
                    <span></span>
                </Link>
            </Grid>
            <Grid item xs={7}>
                <H1>
                    {this.state.event.title}
                </H1>
            </Grid>
            <Grid item xs={3}>
                <Link to={"/events/"+this.props.match.params.id+"/modify"} style={{ textDecoration: 'none' }}><Modify>Duzenle</Modify></Link>
            </Grid>
        </Grid>
        <form style={{marginBottom:"20px"}} onSubmit={this.getApplicants}>
            <Grid container spacing={3}>
                <Grid item xs={5}>
                    <TextField style={{width:"100%"}} disabled id="organizer name" value={this.state.event.organizer.name} label="Organizator ismi" variant="outlined"/>
                </Grid>
                <Grid item xs={5}>
                    <TextField style={{width:"100%"}} type="password" required  disabled={this.state.applicants.length !== 0}id="organizer key" value={this.state.secretKey} onChange={this.onKeyChange} label="Şifre" variant="outlined"/>
                </Grid>
                <Grid item xs={2}>
                    <Mbutton>Getir</Mbutton>
                </Grid>
            </Grid>
        </form>
        {chart}
        {applicants}
        
        <div style={{minHeight:"400px"}}/> 
        <Snackbar open={this.state.sucessOpen} autoHideDuration={6000} onClose={this.handleClose}>
        <Alert onClose={this.handleClose} severity="success">
            {this.state.message}
        </Alert>
        </Snackbar>
        <Snackbar open={this.state.errorOpen} autoHideDuration={6000} onClose={this.handleClose}>
        <Alert onClose={this.handleClose} severity="error">
            {this.state.message}
        </Alert>
        </Snackbar>
        </div>
        </>)

    }
}

export default Applicants;