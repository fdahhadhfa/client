import { useEffect, useState } from "react";
import "./GuaranteePage.css";
import Slider from "react-slick";
import axios from "axios";
import API from "./api/API";
import ReactPlayer from "react-player";

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const GuaranteePage = () => {
  const [reviews, setReviews] = useState<any[]>();
  const [playingVideo, setPlayingVideo] = useState<number>();

  const loadReviews = () => {
    API.getReviews((resp) => setReviews(resp.response));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className="guarantee">
      <h2 className="guarantee__title">Пруфы:</h2>
      <Slider
        afterChange={() => setPlayingVideo(undefined)}
        className="guarantee__proofs"
        {...sliderSettings}
      >
        {new Array(1).fill(0).map((_, index) => (
          <ReactPlayer
            playing={playingVideo === index}
            onPlay={() => setPlayingVideo(index)}
            onPause={() =>
              playingVideo === index ? setPlayingVideo(undefined) : null
            }
            url={`/videos/${index + 1}.mp4`}
            width="100%"
            height="100%"
            controls={true}
          />
        ))}
      </Slider>
      <h2 className="guarantee__title">Отзывы покупателей:</h2>
      <div className="guarantee__reviews">
        {reviews ? (
          reviews.map((review) => (
            <div className="guarantee__review">
              <div className="review__user">
                <img
                  className="review__user-avatar"
                  src={`/avatars/${review.imageId}`}
                />
              </div>
              <div className="review__content">
                <div className="review__content-top">
                  <h4 className="review__username">{review.user}</h4>
                  <div className="review__rating">
                    <h4 className="review__rating-value">{review.rate}/5</h4>
                    <img
                      src="/assets/star.svg"
                      className="review__rating-icon"
                    />
                  </div>
                </div>
                <div className="review__content-bottom">
                  <p className="review__text">{review.text}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h4 className="guarantee__loading">Загрузка...</h4>
        )}
      </div>
    </div>
  );
};

export default GuaranteePage;
