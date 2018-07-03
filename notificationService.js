const picklejs = require('picklejs');
const rp = require('request-promise');
const nodemailer = require('nodemailer');

class NotificationService {

    constructor() {
        this.subscribers = []
    }

    subscribeIfNot(_keyValue,_email) {
        if(!_keyValue.value.includes(_email)){
            _keyValue.value.push(_email);
        }
    }

    subscribe(_idArtist,_email) {
        let dict = this.subscribers.find(sub => sub.key === _idArtist);
        if(dict) {
            this.subscribeIfNot(dict[0],_email);
        } else {
            this.subscribers.push({key:_idArtist,value:[_email]});
        }
    }

    desubscribeIfNot(_keyValue,_email) {
        _keyValue.value = _keyValue.value.filter(email => email !== _email);
    }

    desubscribe(_idArtist, _email){
        let dict = this.subscribers.find(sub => sub.key === _idArtist);
        if(dict) {
            this.desubscribeIfNot(dict,_email);
        } else {
            throw new Error("No existe artista");
        }
    }

    emailsFormArtist (_idArtist) {
        let dictArtist = this.subscribers.find(sub => sub.key === _idArtist)
        if (dictArtist){
            return dictArtist.value;
        } else {
            throw new Error("No existe artista");
        }

        //Otra forma de hacerlo
        /*
        try{
            this.subscribers.find(sub => sub.key === _idArtist).value
        } catch(err) {
            return
        }
        */
    }

    notifyArtist(_idArtist) {

    }

    deleteArtist(_idArtist) {
        this.subscribers = this.subscribers.filter(keyValue => keyValue.key !== _idArtist);
    }


    save(filename) {
        new picklejs.FileSerializer().serialize(filename, this);
      }
    
    static load(filename = 'notificationService.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [NotificationService];
    fs.registerClasses(...classes);
    return fs.load(filename);
    }


    
}

function main(){
    console.log("ejecutado");
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // server para enviar mail desde gmail
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
    user: 'correounqfy@gmail.com',
    pass: 'relojroto',
    },
    });
    // setup email data with unicode symbols
    const mailOptions = {
    from: '"Subscription Service" correounqfy@gmail.com', // sender address
    to: 'urielintemperie@gmail.com, drako.cjs@gmail.com', // list of receivers
    subject: 'Prueba', // Subject line
    text: 'asdadadas', // plain text body
    html: '<b>Hello world?</b>' // html body
    };
    // enviando mail con callbacks
    /*
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
    console.log(error);
    } else {
        console.log(info);
    });
    */
   // send mail with defined transport object
     
   transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
    console.log("TERMINE");
}

main();