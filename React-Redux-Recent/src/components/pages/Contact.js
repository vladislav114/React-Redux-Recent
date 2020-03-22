import React from "react";
import "./Contact.css";
export default function Contact() {
  return (
    <div className="container contact">
      <h1 className="heading">CONTACT US</h1>

      <div className="row">
        <div className="col col-12 col-lg-6">
          <div className="location">
            <h2 className="heading">OUR LOCATION</h2>
            <iframe
              className="location__map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1751.1458635434371!2d77.09153145796869!3d28.621017550069936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x5ea2f33e2f759c2f!2sMaharaja%20Surajmal%20Institute!5e0!3m2!1sen!2sin!4v1574018158401!5m2!1sen!2sin"
              frameborder="0"
            ></iframe>
          </div>
        </div>
        <div className="col col-12 col-lg-6">
          <div className="contact-us">
            <div className="contact-us__address">
              <h2 className="contact-us__address-heading">Address</h2>
              <div>
                Maharaja Surajmal Institute C-4, Janakpuri, New Delhi-110058
              </div>
            </div>
            <div className="contact-us__address">
              <h2 className="contact-us__address-heading">Phone</h2>
              <div>+91-8282828282</div>
            </div>
            <div className="contact-us__address">
              <h2 className="contact-us__address-heading">Email</h2>
              <div>contactmsievents@gmail.com</div>
            </div>

            <h2 className="heading">Drop Us A Mail!</h2>
            <a href="mailto:contactmsievents@gmail.com">
              <button className="btn-dark"> Contact Us</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
