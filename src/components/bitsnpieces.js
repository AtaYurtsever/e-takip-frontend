//TODO:   lokasyon bilgisi servera koy
//TODO:   lokasyon check yaz
//TODO:   lokasyon gostermeyi unutma






if(this.state.dates.start == undefined || this.state.dates.end == undefined){
    this.openError("Tarih giriniz")
}
else if(this.state.time == null) {
    this.openError("Saat giriniz")
}
else if(isNaN(parseFloat(this.state.quota))){
    this.openError("Kota sayı olmalı")
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



///------------------------
/// FUNCTIONAL COMPONENT
///-------------------------

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