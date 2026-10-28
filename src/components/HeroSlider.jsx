import { Link } from "react-router-dom";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "react-i18next";

import "swiper/css";
import "swiper/css/pagination";

import BannerHero1 from "../img/banner_Hero1.jpg";
import BannerHero2 from "../img/banner_Hero2.jpg";
import BannerHero3 from "../img/banner_Hero3.jpg";

const slides = [
  {
    id: "gaming",
    image: BannerHero1,
    altKey: "gamingAlt",
    categoryKey: "gaming",
    titleKey: "heroGamingTitle",
    descriptionKey: "heroGamingDescription",
  },
  {
    id: "home",
    image: BannerHero2,
    altKey: "homeAlt",
    categoryKey: "homeEssentials",
    titleKey: "heroHomeTitle",
    descriptionKey: "heroHomeDescription",
  },
  {
    id: "audio",
    image: BannerHero3,
    altKey: "audioAlt",
    categoryKey: "audioTech",
    titleKey: "heroAudioTitle",
    descriptionKey: "heroAudioDescription",
  },
];

function HeroSlider() {
  const { t, i18n } = useTranslation();

  return (
    <section className="mx-auto w-full max-w-[1440px] select-none px-3 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-8 lg:px-10">
      <Swiper
        key={i18n.language}
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        className="overflow-hidden rounded-[1.5rem] shadow-2xl shadow-slate-900/15 sm:rounded-[2rem] [&_.swiper-pagination-bullet]:bg-white [&_.swiper-pagination-bullet]:opacity-60 [&_.swiper-pagination-bullet-active]:bg-lime-300 [&_.swiper-pagination-bullet-active]:opacity-100"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <article className="relative h-[32rem] overflow-hidden bg-[#182c23] sm:h-[36rem] lg:h-[39rem]">
              <img
                src={slide.image}
                alt={t(slide.altKey)}
                draggable="false"
                className="absolute inset-0 h-full w-full object-cover object-[68%_center] transition-transform duration-1000 ease-out hover:scale-[1.025] sm:object-center"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-[#14231d]/95 via-[#14231d]/45 to-[#14231d]/10 sm:bg-linear-to-r sm:from-[#14231d]/95 sm:via-[#14231d]/75 sm:to-transparent sm:rtl:bg-linear-to-l"
              />
              <div className="relative z-10 flex h-full max-w-2xl flex-col items-start justify-end px-6 pb-16 pt-10 sm:justify-center sm:px-12 sm:pb-12 sm:pt-10 lg:px-20">
                <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-lime-200 sm:mb-6 sm:text-xs">
                  <span className="size-1.5 rounded-full bg-lime-300" />
                  {t(slide.categoryKey)}
                </span>

                <h2 className="max-w-xl font-inter text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl">
                  {t(slide.titleKey)}
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-white/75 sm:mt-6 sm:max-w-lg sm:text-base sm:leading-8">
                  {t(slide.descriptionKey)}
                </p>

                <Link
                  to="/accessories"
                  className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-lime-200 px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:mt-8 sm:px-7 sm:text-base"
                >
                  {t("shopNow")}
                  <span aria-hidden="true" className="rtl-directional">↗</span>
                </Link>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroSlider;
