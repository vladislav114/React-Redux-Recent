import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "./Slider.css";
import { withRouter } from "react-router-dom";

class Slider extends Component {
  static defaultProps = {
    images: []
  };

  render() {
    const { images } = this.props;
    return (
      <div>
        <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true}>
          {images.map(image => (
            <div key={image._id}>
              <img src={image.data.url} />
              <p
                onClick={() => {
                  this.props.history.push(`/event/${image.event.id}`);
                }}
                className="legend"
              >
                {image.event.msg && image.event.msg}
              </p>
            </div>
          ))}
        </Carousel>
      </div>
    );
  }
}

export default withRouter(Slider);
