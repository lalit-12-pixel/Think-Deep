import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";

const Faq = () => {
  return (
    <>
      <Helmet>
        <title>FAQs | ThinkDeep</title>
      </Helmet>

 
      <section className="bg-dark text-white text-center py-5">
        <div className="container">
          <h1 className="display-5 fw-bold">Frequently Asked Questions</h1>
          <p className="lead">Find answers to common questions about ThinkDeep</p>
        </div>
      </section>


      <section className="container my-5">
        <div className="accordion" id="faqAccordion">
    
          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeadingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqCollapseOne"
                aria-expanded="true"
                aria-controls="faqCollapseOne"
              >
                What is ThinkDeep.com about?
              </button>
            </h2>
            <div
              id="faqCollapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="faqHeadingOne"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                ThinkDeep is a community platform for tech, lifestyle, learning, and sharing ideas. It's your digital hub to explore, connect, and grow.
              </div>
            </div>
          </div>


          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeadingTwo">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqCollapseTwo"
                aria-expanded="false"
                aria-controls="faqCollapseTwo"
              >
                Is it free to join?
              </button>
            </h2>
            <div
              id="faqCollapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="faqHeadingTwo"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Yes! Signing up and being a part of the community is completely free.
              </div>
            </div>
          </div>


          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeadingThree">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqCollapseThree"
                aria-expanded="false"
                aria-controls="faqCollapseThree"
              >
                Can I contribute my own content?
              </button>
            </h2>
            <div
              id="faqCollapseThree"
              className="accordion-collapse collapse"
              aria-labelledby="faqHeadingThree"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Absolutely! Once you're signed in, you can share posts, comment, and contribute to discussions.
              </div>
            </div>
          </div>

    
          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeadingFour">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqCollapseFour"
                aria-expanded="false"
                aria-controls="faqCollapseFour"
              >
                How can I report inappropriate content?
              </button>
            </h2>
            <div
              id="faqCollapseFour"
              className="accordion-collapse collapse"
              aria-labelledby="faqHeadingFour"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                You can report posts directly via the “Report” button. Our moderators will review it promptly.
              </div>
            </div>
          </div>


          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeadingFive">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqCollapseFive"
                aria-expanded="false"
                aria-controls="faqCollapseFive"
              >
                Is there a mobile app?
              </button>
            </h2>
            <div
              id="faqCollapseFive"
              className="accordion-collapse collapse"
              aria-labelledby="faqHeadingFive"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                We're working on it! A mobile app is in development and will be available soon for iOS and Android.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Faq;
