import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import BlogCard from "../components/BlogCard";
import Container from "../components/Container";
import { services } from "../utils/Data";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import moment from "moment";
import { getAllProducts } from "../features/products/productSlilce";
import ReactStars from "react-rating-stars-component";
import { addToWishlist } from "../features/products/productSlilce";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { productSevice } from "../features/products/productService";
const handleUpdateTopSellingTags = async () => {
  try {
    const result = await productSevice.updateTopSellingTags();
    console.log(result.message);
  } catch (error) {
    console.error("Error updating top selling tags:", error);
  }
};

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 1500,
};

const Home = () => {
  const blogState = useSelector((state) => state?.blog?.blog);
  const productState = useSelector((state) => state?.product?.product);
  const [wishlist, setWishlist] = useState([]);
  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getblogs();
    getProducts();
  }, []);
  const getblogs = () => {
    dispatch(getAllBlogs());
  };

  const getProducts = () => {
    dispatch(getAllProducts());
  };

  useEffect(() => {
    setWishlist(wishlistState || []);
  }, [wishlistState]);

  const isProductInWishlist = (productId) => {
    return wishlist?.some((item) => item._id === productId);
  };

  const addToWish = (productId) => {
    if (isProductInWishlist(productId)) {
      dispatch(addToWishlist(productId)); // Dispatch action để xóa
      setWishlist(wishlist.filter((item) => item._id !== productId));
    } else {
      dispatch(addToWishlist(productId)); // Dispatch action để thêm
      const product = productState.find((item) => item._id === productId);
      setWishlist([...wishlist, product]);
    }
  };
  return (
    <>
      <Container class1="home-wrapper-1 py-5">
        <div className="row">
          <div className="col-12">
            <Slider {...settings}>
              {/* Slide 1 */}
              <div>
                <div className="main-banner position-relative">
                  <img
                    src="images/banner.jpg"
                    className="img-fluid rounded-3 custom-banner-img"
                    alt="main banner"
                  />
                </div>
              </div>
              {/* Slide 2 */}
              <div>
                <div className="main-banner position-relative">
                  <img
                    src="images/banner1.jpg"
                    className="img-fluid rounded-3 custom-banner-img"
                    alt="main banner"
                  />
                </div>
              </div>
              {/* Slide 3 */}
              <div>
                <div className="main-banner position-relative">
                  <img
                    src="images/banner2.jpg"
                    className="img-fluid rounded-3 custom-banner-img"
                    alt="main banner"
                  />
                </div>
              </div>
              <div>
                <div className="main-banner position-relative">
                  <img
                    src="images/banner3.jpg"
                    className="img-fluid rounded-3 custom-banner-img"
                    alt="main banner"
                  />
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </Container>

      <Container class1="home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="servies d-flex align-items-center justify-content-between">
              {services?.map((i, j) => {
                return (
                  <div className="d-flex align-items-center gap-15" key={j}>
                    <img src={i.image} alt="services" />
                    <div>
                      <h6>{i.title}</h6>
                      <p className="mb-0">{i.tagline}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>

      <Container class1="featured-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3
              className="section-heading text-center"
              onClick={handleUpdateTopSellingTags}style={{ cursor: 'pointer' }}
            >
              Bán chạy nhất
            </h3>
          </div>
          {productState &&
            productState
              .filter((item) => item.tags === "Bán chạy nhất") // Filter by tag
              .slice(0, 4) // Limit to 4 products
              .map((item, index) => (
                <div key={index} className={"col-3"}>
                  <div className="product-card position-relative">
                    <div className="wishlist-icon position-absolute">
                      <button
                        className="border-0 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn chặn sự kiện nhấp chuột không mong muốn
                          addToWish(item?._id);
                        }}
                      >
                        {isProductInWishlist(item._id) ? (
                          <AiFillHeart className="fs-5 text-danger" />
                        ) : (
                          <AiOutlineHeart className="fs-5 text-muted" />
                        )}
                      </button>
                    </div>

                    <div className="product-image">
                      {item?.images?.[0]?.url ? (
                        <img
                          src={item.images[0].url}
                          alt="product image"
                          height={"250px"}
                          width={"260px"}
                          onClick={() => navigate("/product/" + item?._id)}
                        />
                      ) : (
                        <p>Hình ảnh không khả dụng</p>
                      )}
                    </div>
                    <div className="product-details">
                      <h6 className="brand">{item?.brand}</h6>
                      <h5 className="product-title">
                        {item?.title?.substr(0, 70) + "..."}
                      </h5>
                      <ReactStars
                        count={5}
                        size={24}
                        value={item?.totalrating}
                        edit={false}
                        activeColor="#ffd700"
                      />
                      <p className="price">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item?.price)}
                      </p>
                    </div>
                    <div className="action-bar position-absolute">
                      <div className="d-flex flex-column gap-15"></div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </Container>

      <Container class1="special-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading text-center">
              Được tìm kiếm nhiều nhất
            </h3>
          </div>
        </div>
        <div className="row">
          {productState &&
            productState
              .filter((item) => item.tags === "Được tìm kiếm nhiều nhất") // Filter by tag
              .slice(0, 4) // Limit to 4 products
              .map((item, index) => (
                <div key={index} className={"col-3"}>
                  <div className="product-card position-relative">
                    <div className="wishlist-icon position-absolute">
                      <button
                        className="border-0 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn chặn sự kiện nhấp chuột không mong muốn
                          addToWish(item?._id);
                        }}
                      >
                        {isProductInWishlist(item._id) ? (
                          <AiFillHeart className="fs-5 text-danger" />
                        ) : (
                          <AiOutlineHeart className="fs-5 text-muted" />
                        )}
                      </button>
                    </div>

                    <div className="product-image">
                      {item?.images?.[0]?.url ? (
                        <img
                          src={item.images[0].url}
                          alt="product image"
                          height={"250px"}
                          width={"260px"}
                          onClick={() => navigate("/product/" + item?._id)}
                        />
                      ) : (
                        <p>Hình ảnh không khả dụng</p>
                      )}
                    </div>
                    <div className="product-details">
                      <h6 className="brand">{item?.brand}</h6>
                      <h5 className="product-title">
                        {item?.title?.substr(0, 70) + "..."}
                      </h5>
                      <ReactStars
                        count={5}
                        size={24}
                        value={item?.totalrating}
                        edit={false}
                        activeColor="#ffd700"
                      />
                      <p className="price">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item?.price)}
                      </p>
                    </div>
                    <div className="action-bar position-absolute">
                      <div className="d-flex flex-column gap-15"></div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </Container>

      <Container class1="popular-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading text-center">Phổ biến nhất</h3>
          </div>
        </div>
        <div className="row">
          {productState &&
            productState
              .filter((item) => item.tags === "Phổ biến") // Filter by tag
              .slice(0, 4) // Limit to 4 products
              .map((item, index) => (
                <div key={index} className={"col-3"}>
                  <div className="product-card position-relative">
                    <div className="wishlist-icon position-absolute">
                      <button
                        className="border-0 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn chặn sự kiện nhấp chuột không mong muốn
                          addToWish(item?._id);
                        }}
                      >
                        {isProductInWishlist(item._id) ? (
                          <AiFillHeart className="fs-5 text-danger" />
                        ) : (
                          <AiOutlineHeart className="fs-5 text-muted" />
                        )}
                      </button>
                    </div>

                    <div className="product-image">
                      {item?.images?.[0]?.url ? (
                        <img
                          src={item.images[0].url}
                          alt="product image"
                          height={"250px"}
                          width={"260px"}
                          onClick={() => navigate("/product/" + item?._id)}
                        />
                      ) : (
                        <p>Hình ảnh không khả dụng</p>
                      )}
                    </div>
                    <div className="product-details">
                      <h6 className="brand">{item?.brand}</h6>
                      <h5 className="product-title">
                        {item?.title?.substr(0, 70) + "..."}
                      </h5>
                      <ReactStars
                        count={5}
                        size={24}
                        value={item?.totalrating}
                        edit={false}
                        activeColor="#ffd700"
                      />
                      <p className="price">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item?.price)}
                      </p>
                    </div>
                    <div className="action-bar position-absolute">
                      <div className="d-flex flex-column gap-15"></div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </Container>

      <Container class1="marque-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="marquee-inner-wrapper card-wrapper">
              <Marquee className="d-flex">
                <div className="mx-4 w-25">
                  <img src="images/brand1.webp" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand2.webp" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand3.webp" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand4.webp" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand5.webp" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand6.webp" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand7.webp" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand8.webp" alt="brand" />
                </div>
              </Marquee>
            </div>
          </div>
        </div>
      </Container>

      <Container class1="blog-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading text-center">Tin tức</h3>
          </div>
        </div>
        <div className="row">
          {blogState &&
            blogState?.map((item, index) => {
              if (index < 4) {
                return (
                  <div className="col-4 py-2" key={index}>
                    <BlogCard
                      id={item?._id}
                      title={item?.title}
                      description={item?.description}
                      image={item?.images[0]?.url}
                      date={moment(item?.createdAt).format(
                        "DD [tháng] MM [năm] YYYY"
                      )}
                    />
                  </div>
                );
              }
            })}
        </div>
      </Container>
    </>
  );
};

export default Home;
