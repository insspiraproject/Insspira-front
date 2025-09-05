'use client'

import { Swiper, SwiperSlide } from "swiper/react";
import {Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import Image from "next/image";
import {images} from "@/utils/images";
import Aurora from "./Aurora";
export default function Landing() {
    return (
        <div className="w-full h-max-screen flex flex-col items-center justify-center">
          
          <Aurora
        colorStops={["#743596","#AC80C6","#AAB1BF" ]}
        blend={0.5}
        amplitude={3.0}
        speed={0.5}
      />
      
       <h1 className="text-white text-6xl font-semibold italic font-[lora] mb-10 mt-0">Insspira</h1>
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
            className="w-[200px] md:w-[300px] h-full"
          >
            <div className="relative w-full h-full">
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
      <h3 className="text-white text-lg font-[lora] mt-4 mb-4">Share your world, inspire others</h3>
      <div className="flex items-center justify-center mb-2 mt-4">
        <button className="text-white font-bold py-2 px-4 rounded-full bg-[var(--morado)] hover:bg-[var(--rosa)] transition-colors">
          Start explore
        </button>
      </div>
    </div>
  

  );
    
}