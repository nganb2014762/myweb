import React, { useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../features/products/productSlilce";
import { getuserProductWishlist } from "../features/user/userSlice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // Import các icon trái tim

const Wishlist = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getWishlistFromDb();
  }, []);

  const getWishlistFromDb = () => {
    dispatch(getuserProductWishlist());
  };

  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);

  const removeFromWishlist = (id) => {
    dispatch(addToWishlist(id));
    setTimeout(() => {
      dispatch(getuserProductWishlist());
    }, 300);
  };

  return (
    <>
      <Meta title={"Wishlist"} />
      <BreadCrumb title="Wishlist" />
      <Container class1="wishlist-wrapper home-wrapper-2 py-5">
        <div className="row">
          {wishlistState && wishlistState.length === 0 && (
            <div className="text-center fs-3">Không có sản phẩm</div>
          )}
          {wishlistState &&
            wishlistState?.map((item, index) => {
              const isWishlist = wishlistState.some(
                (wishItem) => wishItem._id === item._id
              );
              return (
                <div className="col-3" key={index}>
                  <div
                    className="wishlist-card position-relative "
                    style={{
                      backgroundColor: "#ffff",
                      borderRadius: "8px",
                      padding: "16px",
                    }}
                  >
                    <button
                      className="border-0 bg-transparent position-absolute"
                      onClick={() => {
                        removeFromWishlist(item?._id);
                      }}
                      style={{ top: "10px", right: "10px" }}
                    >
                      {isWishlist ? (
                        <AiFillHeart
                          className="fs-5"
                          style={{ color: "red" }}
                        />
                      ) : (
                        <AiOutlineHeart
                          className="fs-5"
                          style={{ color: "red" }}
                        />
                      )}
                    </button>
                    <div className="wishlist-card-image py-3">
                      <img
                        src={
                          item?.images[0].url
                            ? item?.images[0].url
                            : "images/watch.jpg"
                        }
                        className="img-fluid w-100"
                        alt="watch"
                      />
                    </div>
                    <div className="py-3 px-3">
                      <h5 className="title">{item?.title}</h5>
                      <h6 className="price">{item?.price} </h6>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Container>
    </>
  );
};

export default Wishlist;
