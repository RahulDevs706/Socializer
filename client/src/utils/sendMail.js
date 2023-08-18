import emailjs from "@emailjs/browser"

export  const sendMail = (name, email, code)=>{
    let success;
    var templateParams = {
        name:name,
        mail:email,
        code:code
    };

    console.log(process.env.REACT_APP_EMAIL_JS_SERVICE_ID, process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID, templateParams, process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY)

    emailjs.send(process.env.REACT_APP_EMAIL_JS_SERVICE_ID, process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID, templateParams, process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY)
    .then(()=>{
        success=true
    })
    .catch(()=>{
        success = false
    })

    return success;
}
