import React from "react";
import { Link } from "react-router-dom";
import { BsLinkedin, BsGithub, BsYoutube, BsInstagram } from "react-icons/bs";
import newsletter from "../images/newsletter.png";
const Footer = () => {
  return (
    <>
      
      <footer className="py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-md-4">
              <h4 className="text-white mb-4">Liên hệ</h4>
              <div>
                <address className="text-white fs-6">
                  Đường 30/4 <br />{" "}
                  Phường Hưng Lợi <br />
                  Quận Ninh Kiều, Cần Th
                </address>
                <a
                  href="tel:+91 8264954234"
                  className="mt-3 d-block mb-1 text-white"
                >
                  SĐT: +84 1234567890
                </a>
                <a
                  href="mailto:devjariwala8444@gmail.com"
                  className="mt-2 d-block mb-0 text-white"
                >
                  nganb2014762@student.ctu.edu.vn
                </a>
                <div className="social_icons d-flex align-items-center gap-30 mt-4">
                  <a className="text-white" href="#">
                    <BsLinkedin className="fs-4" />
                  </a>
                  <a className="text-white" href="#">
                    <BsInstagram className="fs-4" />
                  </a>
                  <a className="text-white" href="#">
                    <BsGithub className="fs-4" />
                  </a>
                  <a className="text-white" href="#">
                    <BsYoutube className="fs-4" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <h4 className="text-white mb-4">Chính sách</h4>
              <div className="footer-link d-flex flex-column">
                <Link to="/privacy-policy" className="text-white py-2 mb-1">
                  Bán hàng
                </Link>
                <Link to="/refund-policy" className="text-white py-2 mb-1">
                  Thanh toán
                </Link>
                <Link to="/shipping-policy" className="text-white py-2 mb-1">
                  Vận chuyển
                </Link>
                <Link to="/term-conditions" className="text-white py-2 mb-1">
                  Bảo mật
                </Link>
                <Link className="text-white py-2 mb-1">Tin tức</Link>
              </div>
            </div>
            <div className="col-md-4">
              <h4 className="text-white mb-4">Về chúng tôi</h4>
              <div className="footer-link d-flex flex-column">
                <Link className="text-white py-2 mb-1">Giới thiệu</Link>
                <Link className="text-white py-2 mb-1">Faq</Link>
                <Link className="text-white py-2 mb-1">Liên hệ</Link>
              </div>
            </div>

                        
          </div>
        </div>
      </footer>
      <footer className="py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <p className="text-center mb-0 text-white">
                &copy; {new Date().getFullYear()} Coppyright by NgoHoangKimNgan
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
