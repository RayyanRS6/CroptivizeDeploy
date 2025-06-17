import React from 'react'
import HeroSection from '../../components/basic/HeroSection'
import Features from '../../components/basic/Features'
import HowItWorks from '../../components/basic/HowItWorks'
import DiseasePreview from '../../components/basic/DiseaseSection'
import CtaSection from '../../components/basic/CtaSection'

const Home = () => {
    return (
        <main>
            <HeroSection />
            <Features />
            <HowItWorks />
            <DiseasePreview />
            <CtaSection />
        </main>
    )
}

export default Home