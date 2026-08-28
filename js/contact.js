
// contact form

const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");


contactForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const subject =
        document.getElementById("subject").value;

    const message =
        document.getElementById("message").value;


    const contactMessage = {

        name: name,

        email: email,

        subject: subject,

        message: message,

        date: new Date().toLocaleString()

    };


    let messages = [];


    const savedMessages =
        localStorage.getItem("civicMessages");


    if (savedMessages) {

        try {

            messages = JSON.parse(savedMessages);

            if (!Array.isArray(messages)) {

                messages = [];

            }

        } catch (error) {

            messages = [];

        }

    }


    messages.push(contactMessage);


    localStorage.setItem(
        "civicMessages",
        JSON.stringify(messages)
    );


    formMessage.textContent =
        "Your message has been sent successfully.";

    formMessage.style.color = "green";


    contactForm.reset();

});
