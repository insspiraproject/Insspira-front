'use client'

import { Swiper, SwiperSlide } from "swiper/react";
import {Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import Image from "next/image";
import {images} from "@/utils/images";
import Aurora from "./Aurora";
export default function Landing() {
    return (
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
     <div className="absolute inset-0 z-0 pointer-events-none">
        <Aurora
          colorStops={["#743596","#AC80C6","#AAB1BF"]}
          blend={0.5}
          amplitude={2.0}
          speed={0.5}
        />
      </div>
      <div className="relative z-10 w-full max-w-6xl px-4">
       <h1 className="text-white text-center text-6xl font-semibold italic font-[lora] mt-10 mb-10">Insspira</h1>
       
        <Swiper
        modules={[EffectCoverflow, Pagination, Autoplay]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={2}
        spaceBetween={20}
        coverflowEffect={{
          rotate: 45,
          stretch: 0,
          depth: 200,
          scale: 1,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="w-full h-[380px]"
      >
        {images.map((src, index) => (
          <SwiperSlide
            key={index}
            className="w-[200px] md:w-[300px] h-full rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image
                src={src}
                alt={`slide-${index}`}
                fill
                className="object-cover rounded-2xl shadow-lg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
      <h3 className="text-white text-xl font-[montserrat] mt-4 mb-4">Share your world, inspire others</h3>
      <div className="flex items-center justify-center mb-2 ">
        <button className="text-white font-bold py-4 px-6 rounded-full bg-[var(--morado)] hover:bg-[var(--rosa)] transition-colors">
          Start explore
        </button>
      </div>
       
    </div>
  

  );
    
}
