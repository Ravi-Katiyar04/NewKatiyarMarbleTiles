import React from "react";
import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import BottomBanner from "../components/BottomBanner";
import NewsLetter from "../components/NewsLetter";
import StatsStrip from "../components/rms/StatsStrip";
import GallerySection from "../components/rms/GallerySection";
import LegacySection from "../components/rms/LegacySection";
import ApplicationsSection from "../components/rms/ApplicationsSection";
import QualitySection from "../components/rms/QualitySection";
import QuoteSection from "../components/rms/QuoteSection";
const Home = () => {
  return (
    <div>
      <MainBanner />
      <StatsStrip />
      <Categories />
      <GallerySection />
      <LegacySection />
      <ApplicationsSection />
      <BestSeller />
      <BottomBanner />
      <QualitySection />
      <QuoteSection />
      <NewsLetter />
    </div>
  )
}

export default Home
