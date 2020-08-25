import React , {useState} from 'react'
import {Link} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import styled from "styled-components";
import TextField from '@material-ui/core/TextField';
import { styled as muistyled } from '@material-ui/core/styles';
import DateRangePicker from 'react-daterange-picker'
import DateFnsUtils from '@date-io/date-fns'
import { TimePicker , MuiPickersUtilsProvider,} from "@material-ui/pickers";
import axios from 'axios';
import Crypto from "crypto-js"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Map from "./Map"
import 'react-daterange-picker/dist/css/react-calendar.css'
import '../styles/Add.css'

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

    if (error.toString().indexOf(TCKNO) !== -1) return false;

    return true;
}




const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const STextField = muistyled(TextField)({
    width: '100%',
    marginLeft: '20px'
})

const SClock = muistyled(TimePicker)`
    && .MuiPickersTimePickerToolbar-toolbarLandscape{
        background-color:black;
    }
`

const Btn = styled.button`
        box-shadow:none;
        background-color:#FF4D50;
        border-radius:5px;
        text-align:center;
        cursor:pointer;
        margin-left: 20px;
        width:100px;
        color:white;
        font-weight:bold;
        font-family: 'Roboto', sans-serif;
        width:40%;
        height:40px;
        font-size:30px;
    `



class Add extends React.Component{
    state ={
        loc:[],
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
        i:0
    }

    onDateSelect = dates => this.setState({dates})
    onTimeSelect = time => this.setState({time})
    onNameSelect = eventName => this.setState({eventName:eventName.target.value})
    onOrganizerSelect = organizer => this.setState({organizer:organizer.target.value})
    onOrganizerKeySelect = organizerKey => this.setState({organizerKey:organizerKey.target.value})
    onDescriptionSelect = description => this.setState({description:description.target.value})
    onQuotaSelect = quota => this.setState({quota:quota.target.value})


    sendForm = (formEvent) =>   {
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
            console.log(event.startDate)
            console.log(event.endDate)
            axios.post("http://localhost:8080/events",event)
            .then(response => {
                console.log(response)
                this.openSucess(response.data);
            }).catch(error => {
                console.log(error.response);
                this.openError(error.response.data);
            })
        }
        formEvent.preventDefault();
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
           return item.index !== id; 
        });
        console.log(k)
        this.setState({extraQuestions:k});
    }

    mapSelect = (loc) => {
        console.log(loc)
        this.setState({loc:loc})
    }

    render(){

        let extraQuestions = this.state.extraQuestions.map((item,index)=> {
            var qid = "qid_"+index
            var qtxt= "qtxt_"+index
            return (
                <Grid container xspacing={3} key={item.index}>
                    <Grid item xs={1}>
                        <div className="eq_add" onClick={() => this.removeExtra(item.index)}>
                            <span></span>
                            <span></span>
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <STextField required id={qid} onChange={state=>{this.changeExtraId(index,state.target.value)}} label="QuestionId" value={this.state.extraQuestions[index]["id"]} margin="normal" variant="outlined" />
                    </Grid>
                    <Grid item xs={9}>
                        <STextField required id={qtxt} onChange={ state=> {this.changeExtraText(index,state.target.value)}}   label="Question" value={this.state.extraQuestions[index]["text"]} margin="normal" variant="outlined" />
                    </Grid>
                </Grid>
            )
        })
        

        return (
            <>
            <div className="addContainer">
                
                <Link to="/" className="cross">
                    <span></span>
                    <span></span>
                    <span></span>
                </Link>
                <form onSubmit={this.sendForm}>

                <Grid container spacing={3} >
                    <Grid item xs={6}>
                        <STextField required id="Event Name" onChange={this.onNameSelect} value={this.state.eventName} label="Event Name" variant="outlined" />
                    </Grid>
                    <Grid item xs={3}>
                        <STextField required id="Organizer"  onChange={this.onOrganizerSelect} value={this.state.organizer} label="Organizer name" variant="outlined" />
                    </Grid>
                    <Grid item xs={3}>
                    <STextField required id="OrganizerKey"  type="password" onChange={this.onOrganizerKeySelect} value={this.state.organizerKey} label="Organizer Key" variant="outlined"s />
                        
                    </Grid>
                    <Grid item xs={12}>
                        <STextField required id="Description" onChange={this.onDescriptionSelect} value={this.state.description} multiline label="Description" variant="outlined"/>
                    </Grid>
                    <Grid item xs = {1}> 
                        <STextField required type="number" id="Quota" onChange={this.onQuotaSelect}   value={this.state.quota}   label="Quota"       variant="outlined"/>
                    </Grid>
                    <Grid item xs={6} >
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
                            <SClock
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
                        <Map onSelect={this.mapSelect}/>
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

                <Btn type="submit" >Gönder</Btn>
                </form >
            </div>

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

export default Add;
export const AddButton = ()=>(
    // <div className="top">
    //     <div className='topLogo'>
    //         <img src = 'https://image.flaticon.com/icons/svg/3078/3078971.svg'></img>
    //         LOGOLOGOLOGOLOGOLOGO
    //     </div>
        <div  className="addButtonContainer">
                <span></span>
                <span></span>
                
                <Link to="/new" className="text">
                    Etkinlik Ekleyin
                </Link>

                <Link to="/signup" className="text">
                    Kayit olun
                </Link>
        </div>
    // </div>
    )

export const Signup = ()=>{

    const [sucess, setsucess] = useState(false)
    const [error, seterror] = useState(false)
    const [message, setmessage] = useState("")

    const openSucess = (message) => {
        setsucess(true);
        setmessage(message);
    }

    const openError = (message) => {
        seterror(true);
        setmessage(message);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setsucess(false);
        seterror(false);
    };

    const addAccount = (formEvent) => {
        if(!CheckTCKNO(tckno)){
            openError("Hatalı Kimlik Numarası")
        }
        else{
            const key = Crypto.SHA256(password).toString();
            console.log(key)
            let user = {
                name:name,
                email:email,
                TCKno:tckno,
                secretKey:key
            }
            axios.post("http://localhost:8080/events/signup",user).then(result=>{
                console.log(result)
                openSucess(result.data)
            }).catch(error=> {
                openError(error.response.data)
                console.log(error)
            })
        }
        formEvent.preventDefault();
    }
    
    const [name,changeName] =  useState("")
    const [email,changeEmail] = useState("")
    const [tckno,changeTckno] = useState("")
    const [password,changePassword] = useState("")

    return (<>
        <div className="addContainer">
                
                <Link to="/" className="cross">
                    <span></span>
                    <span></span>
                    <span></span>
                </Link>
                <form onSubmit={addAccount}>
                <STextField required id="name" label="isim" value={name} onChange={(target) => changeName(target.target.value)}></STextField>
                <STextField required id="email" label="email" value={email} onChange={(target) => changeEmail(target.target.value)}></STextField>
                <STextField required id="tckno" label="Kimlik Numarası" value={tckno} onChange={(target) => changeTckno(target.target.value)}></STextField>
                <STextField required id="password" type="password" label="Şifre" value={password} onChange={(target) => changePassword(target.target.value)}></STextField>

                <Btn type="submit">Üye Ol</Btn>
                </form>
        </div>

        <Snackbar open={sucess} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
            {message}
        </Alert>
        </Snackbar>
        <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
            {message}
        </Alert>
        </Snackbar>
        </>
    )
}