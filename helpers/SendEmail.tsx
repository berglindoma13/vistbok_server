const nodemailer = require("nodemailer");
const Email = require('email-templates');
import prismaInstance from "../lib/prisma"

// const path = require('path');

// import "../emailTemplates/invalidProducts.html";

// import "../emailTemplates/invalidProducts/"

export const SendEmailAPI = async(req: any, res: any) => {
    // SendEmail();
    sendInvalidEmail();
    return res.status(200).send('email sent')
}

const sendInvalidEmail = async() => {

    const filterValidDate = (val) => {
        if(val.certificateid === 1 || val.certificateid === 2 || val.certificateid === 3) {
          return !!val.validDate && val.validDate > new Date()
        }
        else {
          return true
        }
    }

    // get all products and their certificates
    const AllProducts = await prismaInstance.product.findMany({
        include:{
          certificates: {
            include: {
              certificate : true
            }
          }
        }
    })

    // remove certificates that are not valid 
    const filteredProductList = AllProducts.map(prod => {
        const filteredCertificates = prod.certificates.filter(filterValidDate)
        prod.certificates = filteredCertificates;
        return prod
    })

    // only get the products with no valid certificates
    const InvalidProducts = filteredProductList.filter(prod => prod.certificates.length == 0)

    const invalidCompId = InvalidProducts.filter(prod => prod.companyid == 1)

    console.log("loka filtered list length", AllProducts)
}

const SendEmail = async() => {
    // send email from test mail now - change so it sends from visttorg and to the correct email
    const hostname = "smtp.gmail.com";
    const username = "mariavinna123@gmail.com"; 
    const password = "cxapowxvwkejbrzl"; // const password = "marraom123%";

    var list = ["bla", "tveir", "þrír"];
    var test = list.toString();
   
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: hostname,
        auth: {
            user: username,
            pass: password,
        },
    });

    const emailTemplate = new Email({ 
        preview: false,
        send: true,
        transport: transporter,
        message: {
            attachments: [{
                filename: 'Vorur.txt',
                content: test,
            }]
        }
    });

    emailTemplate.send({
        template: '../emailTemplates/invalidProducts',
        message: {
            to: "maria.omarsd99@gmail.com",  
        },
    }).catch(console.error)
    // console.log("Message sent: %s", info.response);
}