import React ,{useState, useEffect} from "react"
import styled from "styled-components"
import DateRangePicker from 'react-daterange-picker'
import DateFnsUtils from '@date-io/date-fns'
import { TimePicker , MuiPickersUtilsProvider,} from "@material-ui/pickers";
import axios from 'axios';
import Crypto from "crypto-js";
import {Link} from "react-router-dom"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Map from "./Map"
import "../styles/Application.css"

//https://www.yusufsezer.com.tr/javascript-tc-kimlik-no-dogrulama/
const CheckTCKNO = (TCKNO)=>{
    //just have some available for me
    if(TCKNO.length < 5) return true;
    var odd = 0,
      even = 0,
      total = 0,
      sum = 0,
      i = 0,
      error = [11111111110, 22222222220, 33333333330, 44444444440, 55555555550, 66666666660, 7777777770, 88888888880, 99999999990];;

    if (TCKNO.length !== 11) return false;
    if (isNaN(TCKNO)) return false;
    if (TCKNO[0] === 0) return false;

    odd = parseInt(TCKNO[0]) + parseInt(TCKNO[2]) + parseInt(TCKNO[4]) + parseInt(TCKNO[6]) + parseInt(TCKNO[8]);
    even = parseInt(TCKNO[1]) + parseInt(TCKNO[3]) + parseInt(TCKNO[5]) + parseInt(TCKNO[7]);

    odd = odd * 7;
    total = Math.abs(odd - even);
    if (total % 10 !== TCKNO[9]) return false;

    for (var i = 0; i < 10; i++) {
      sum += parseInt(TCKNO[i]);
    }

    if (sum % 10 !== TCKNO[10]) return false;

    if (error.toString().indexOf(TCKNO) != -1) return false;

    return true;
}

// const checkEmail = (email)=>{
//     if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(myForm.emailAddr.value))
//   {
//     return (true)
//   }
//     alert("You have entered an invalid email address!")
//     return (false)
// }
const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const ApplicationContainer = styled.div`
    position:absolute;
    width:80%;
    height 90%;
    top:5%;
    background-color:white;
    border-radius:10%;
    padding:2%;
    box-shadow:black;
    font-family: roboto;
    overflow:hidden;
`

const H1 = styled.h1`
    font-size: 72px;
    width: 70%;
    color: black;
`
const RightSide = styled.div`
    position:absolute;    
    width:25%;
    right:0;
    top:80px;
`
const H2 = styled.h2`
    font-size:32px;
    font-weight:thin;
    overflow:hidden;
`

const P = styled.p`
    position:relative;
    font-size:20px;
    width:50%;
    margin-top:10px;
`

const H3 = styled.h3`
    margin-top:100px;
    font:Size 30px;
    font-weight:thin;
`

const Footer = styled.div`
    position:absolute;
    bottom:0;
    top:80%;
    width:100%;
    font-size:32px;
`

const Apply = styled.div`
    height:50%;
    width:40%;
    min-width:200px;
    text-align:center;
    background: #FF4D50;
    border-radius:20px;
    cursor:pointer;
    color:black;
`

const Modify = styled.div`
    position:absolute;
    height:50%;
    width:30%;
    min-width:120px;
    text-align:center;
    background:#FF4D50;
    top:0;
    right:10%;
    border-radius:20px;
    cursor:pointer;
    color:black;
`


const ModifyButton = styled.button`
    height:40px;
    width:30%;
    min-width:120px;
    text-align:center;
    background:#FF4D50;
    bottom:0;
    right:10%;
    border-radius:20px;
    cursor:pointer;
    color:black;
    font-family:roboto;
    font-size:32px;
    
`



class ApplicationForm extends React.Component{
    state = {
        name:"",
        email:"",
        tckno:"",
        extra:[],
        event:{name:"",description:"",startDate:"",endDate:"",extraQuestions:[],organizer:{name:""},lon:0,lat:0},
        sucessOpen:false,
        errorOpen:false,
        message:""
    
    }

    componentDidMount(){
        this.retrieveData();
        console.log("component Mounted");   
    }

    onNameSelect = name =>this.setState({name:name.target.value})
    onEmailSelect = email => this.setState({email:email.target.value})
    onTcknoSelect = tckno => this.setState({tckno:tckno.target.value})
    setevent = event => this.setState({event:event.target.value})
    
    setExtraQuestion = (id,text) => {
        let k = [...this.state.extra];
        k = k.filter((item) => {
            if(item.id === id)
                item.text = text;
            return item;
        })
        this.setState({extra:k})
    }
    
    retrieveData = ()=>{
        axios.get("http://localhost:8080/events/"+this.props.match.params.id)
            .then(response => {
                this.setState({event:response.data})
                
                let k = []
                this.state.event.extraQuestions.forEach(item => k.push({id:item.id,text:""}))
                console.log(k)
                this.setState({extra:k});
            })
            .catch(error => console.log(error))
    }


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

    apply = (formEvent)=>{
        if(!CheckTCKNO(this.state.tckno)){
            this.openError("Hatalı Kimlik Numarası")
        }
        // if(!checkMail(this.state.mail)){
        //     this.openError("Hatalı E-mail")
        // }
        else{
        const application ={
            name:this.state.name,
            email:this.state.email,
            tckno:this.state.tckno,
            extraQuestions:this.state.extra
         }

         axios.post("http://localhost:8080/events/"+this.props.match.params.id,application)
            .then(response => {console.log(response);this.openSucess(response.data)})
            .catch(error => {console.log(error.response);this.openError(error.response.data)})
        }
        formEvent.preventDefault();
    }

    
    render(){
        var extraQuestions = "Ekstra soru bulunmadi";
        if(this.state.event.extraQuestions!=null)
            extraQuestions = this.state.event.extraQuestions.map((item,index)=>{ 
                var eid = "";
                if(this.state.extra[index]!=null)
                    eid = this.state.extra[index].text;
                return <>
                    <Grid item xs={6}>
                        {item.text}
                    </Grid>
                    <Grid item xs={6}>
                        <TextField required id={"q_"+index} onChange={ state => this.setExtraQuestion(item.id,state.target.value)}   label="Answer" value={eid} margin="normal" variant="outlined" />
                    </Grid>
                </>})   
        var id = this.props.match.params.id;
        return (<>
            <ApplicationContainer>
                
                <Link to={"/events/"+id} className="cross">
                    <span></span>
                    <span></span>
                    <span></span>
                </Link>
    
                <form onSubmit={this.apply}>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <TextField required id="name" onChange={this.onNameSelect} value={this.state.name} label="isim" variant="outlined"/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField required id="email"onChange={this.onEmailSelect} value={this.state.email} label="email" variant="outlined"/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField required id="Tckno" onChange={this.onTcknoSelect} value={this.state.tckno} label="TC Kimlik no." variant="outlined"/>
                    </Grid>
                    {extraQuestions}
                </Grid>
    
                <Footer>
                    <ModifyButton >Başvur</ModifyButton>
                </Footer>
                </form>
            </ApplicationContainer>
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
        </>
        )
    }
}


export class ModifyPopup extends React.Component{
    state ={
        eventName:"",
        organizer:"",
        organizerKey:"",
        description:"",
        quota:"",
        time:"",
        dates:"",
        extraQuestions:[],
        sucessOpen:false,
        errorOpen:false,
        message:"",
        loc:[]
    }

    onDateSelect = dates => this.setState({dates})
    onTimeSelect = time => this.setState({time})
    onOrganizerKeySelect = organizerKey => this.setState({organizerKey:organizerKey.target.value})
    onDescriptionSelect = description => this.setState({description:description.target.value})
    onQuotaSelect = quota => this.setState({quota:quota.target.value})

    componentDidMount(){
        this.retrieveData();
        console.log("component mounted ")
    }

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

    modify = (formEvent)=>{
        if(this.state.dates.start === undefined || this.state.dates.end === undefined){
            this.openError("Tarih giriniz")
        }
        else if(this.state.time == null) {
            this.openError("Saat giriniz")
        }
        else if(isNaN(parseFloat(this.state.quota))){
            this.openError("Kota sayı olmalı")
        }
        else if(this.state.loc.length !== 2){
            this.openError("Konum seçiniz")
        }
        else{
            let event = {
                id:null,
                title:this.state.eventName,
                description:this.state.description,
                extraQuestions:this.state.extraQuestions,
                startDate:this.state.dates.start._d,
                endDate:this.state.dates.end._d,
                time:this.state.time,
                quota:this.state.quota,
                lon:this.state.loc[0],
                lat:this.state.loc[1],
                organizer:{
                    name: this.state.organizer,
                    secretKey: Crypto.SHA256(this.state.organizerKey).toString()
                }
            }
            axios.patch("http://localhost:8080/events/"+this.props.match.params.id,event)
            .then((response)=>{
                console.log(response);
                this.openSucess(response.data);
            }).catch(error => {
                console.log(error);
                this.openError(error.response.data)
            })
        }
        formEvent.preventDefault();
    }

    retrieveData(){
        axios.get("http://localhost:8080/events/"+this.props.match.params.id)
            .then(response => {
                var event = response.data;
                this.setState({
                    eventName:event.title,
                    organizer:event.organizer.name,
                    description:event.description,
                    quota:event.quota,
                    time:event.time,
                    extraQuestions:event.extraQuestions,
                    loc:[event.lon,event.lat]
                })
                console.log("done")
            })
            .catch(error=>console.log(error))
    }
    changeExtraId = (index,id) => {
        let k = [...this.state.extraQuestions];
        k[index] = {index:k[index].index,id:id,text:k[index].text}
        this.setState({extraQuestions:k})
    }


    changeExtraText = (index,text) => {
        let k = [...this.state.extraQuestions];
        k[index] = {index:k[index].index,id:k[index].id,text:text}
        this.setState({extraQuestions:k})
    }

    addExtraQuestion = () => {
        let k = this.state.extraQuestions;
        let i = this.state.i;
        k.push({index:i,id:null,text:null});
        i++;
        this.setState({i:i,extraQuestions:k});
    }

    removeExtra = (id) => {
        let k =[...this.state.extraQuestions]; 
        k = k.filter((item) => {
           return item.id !== id; 
        });
        console.log(k)
        this.setState({extraQuestions:k});
    }

    mapSelect = (loc) => {
        console.log(loc)
        this.setState({loc:loc})
    }

    loader = () => {
        if(this.state.loc.length !== 2) return "Loading"
        return  <Map onSelect={this.mapSelect}  type="update" center={this.state.loc}/>
    }

    render(){
        let extraQuestions = this.state.extraQuestions.map((item,index)=> {
            var qid = "qid_"+index
            var qtxt= "qtxt_"+index
            return (
                <Grid container xspacing={3} key={item.index}>
                    <Grid item xs={1}>
                        <div className="eq_add" onClick={() => this.removeExtra(item.id)}>
                            <span></span>
                            <span></span>
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField required id={qid} onChange={state=>{this.changeExtraId(index,state.target.value)}} label="QuestionId" value={this.state.extraQuestions[index]["id"]} margin="normal" variant="outlined" />
                    </Grid>
                    <Grid item xs={9}>
                        <TextField required id={qtxt} onChange={ state=> {this.changeExtraText(index,state.target.value)}}   label="Question" value={this.state.extraQuestions[index]["text"]} margin="normal" variant="outlined" />
                    </Grid>
                </Grid>
            )
        })
        var id = this.props.match.params.id;
        return (<>
            <ApplicationContainer style={{overflow:"scroll"}}>
                <Link to={"/events/"+id} className="cross">
                    <span></span>
                    <span></span>
                    <span></span>
                </Link>

                <form onSubmit={this.modify}>
                <Grid container spacing={3} >
                    <Grid item xs={6}>
                        <TextField disabled id="Event Name"  value={this.state.eventName} label="Event Name" variant="outlined" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField disabled id="Organizer"  value={this.state.organizer} label="Organizer name" variant="outlined" />
                    </Grid>
                    <Grid item xs = {6}> 
                        <TextField required id="Quota" onChange={this.onQuotaSelect}   value={this.state.quota}   label="Quota"       variant="outlined"/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField required id="OrganizerKey" type="password"  onChange={this.onOrganizerKeySelect} value={this.state.organizerKey} label="Organizer Key" variant="outlined"s />
                        
                    </Grid>
                    <Grid item xs={12}>
                        <TextField required id="Description" onChange={this.onDescriptionSelect} value={this.state.description} multiline label="Description" variant="outlined"/>
                    </Grid>
                    
                    <Grid item xs={7} >
                        <DateRangePicker
                        onSelect={this.onDateSelect}
                        value={this.state.dates}
                        firstOfWeek = {1}
                        minimumDate = {new Date()}
                        numberOfCalendars = {2}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <MuiPickersUtilsProvider utils = {DateFnsUtils}>
                            <TimePicker
                                required
                                autoOk
                                ampm={false}
                                variant="static"
                                orientation="landscape"
                                openTo="hours"
                                value={this.state.time}
                                onChange={this.onTimeSelect}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item xs = {12}>
                       {this.loader()}
                    </Grid>
                    {extraQuestions}
                </Grid>
                <div  className="addButtonContainer" onClick={() => this.addExtraQuestion()}>
                    <span></span>
                    <span></span>
                    
                    <div className="text">
                        Ekstra soru ekleyin
                    </div>
                </div>
                <ModifyButton type="submit">Düzenle</ModifyButton> 
                
            </form>
            </ApplicationContainer>
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
            </>
        )
    }
}

export const ApplicationPopup = (props)=>{
    const [event, setEvent] = useState({name:"",description:"",startDate:"",endDate:"",time:"",organizer:{name:""},lon:0,lat:0})
    if(event.name===""){
        axios.get("http://localhost:8080/events/"+props.match.params.id)
            .then(response => {console.log(response.data);setEvent(response.data)})
            .catch(error => console.log(error))
    }
    const loader  = ()=>{
        if(event.name === "" ) return "loading"
        else return <Map type="view"  center={[event.lon,event.lat]} />
    }
    
    return(
        <ApplicationContainer>
            <Link to="/" className="cross">
                    <span></span>
                    <span></span>
                    <span></span>
                </Link>
            <H1>{event.title} </H1>
            <P>{event.description}</P>
            <div style={{width:"70%"}}>{loader()}</div>
            <RightSide>
                <H2>Organizasyon:<br/>{event.organizer.name}</H2>
                <H3>Kota:{event.quota}<br/>Başlangıç:{event.startDate.substring(0,10)}<br/>Bitiş:{event.endDate.substring(0,10)}<br/>Saat: {event.time.substring(11,16)}</H3>
            </RightSide>
            
            <Footer>
                <Link to={"/events/"+props.match.params.id+"/apply"} style={{ textDecoration: 'none' }}><Apply>Basvur</Apply></Link>
                <Link to={"/events/"+props.match.params.id+"/moderate"} style={{ textDecoration: 'none' }}><Modify>Organizasyon İşlemleri</Modify></Link>
            </Footer>
        </ApplicationContainer>
    )
}

export default ApplicationForm;
