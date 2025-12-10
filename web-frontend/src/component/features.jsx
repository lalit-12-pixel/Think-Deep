import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <>
      <Helmet>
        <title>Features | ThinkDeep</title>
      </Helmet>


      <section className="bg-primary text-white text-center py-5" style={{userSelect:"none"}}>
        <div className="container">
          <h1 className="display-5 fw-bold">Platform Features</h1>
          <p className="lead">Explore what makes ThinkDeep a unique and powerful community platform</p>
        </div>
      </section>


      <section className="container py-5" style={{userSelect:"none"}}>
        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h4 className="card-title fw-bold">📝 Post & Share</h4>
                <p className="card-text">
                  Create content, share ideas, and connect with an audience that values your voice.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h4 className="card-title fw-bold">👥 Community Interaction</h4>
                <p className="card-text">
                  Engage in meaningful discussions, comment, like, and collaborate with others.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h4 className="card-title fw-bold">🔍 Personalized Feed</h4>
                <p className="card-text">
                  Get curated content based on your interests and activity within the community.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h4 className="card-title fw-bold">📱 Mobile Friendly</h4>
                <p className="card-text">
                  Seamlessly access the platform from any device with responsive design.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h4 className="card-title fw-bold">🎯 Gamified Experience</h4>
                <p className="card-text">
                  Earn points, badges, and unlock new features as you grow with the community.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h4 className="card-title fw-bold">🔒 Secure & Private</h4>
                <p className="card-text">
                  Your data is protected with industry-standard privacy and security measures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className=" py-5 text-center" style={{userSelect:"none"}}>
        <div className="container">
          <h2 className="fw-bold mb-3">Ready to experience ThinkDeep?</h2>
          <p className="lead">Join the platform and start sharing your thoughts today.</p>
          <Link to="/" className="btn btn-primary btn-lg mt-2">Get Started</Link>
        </div>
      </section>
    </>
  );
};

export default Features;
