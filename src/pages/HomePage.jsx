import Hero from '../components/home/Hero.jsx';
import About from '../components/home/About.jsx';
import Positions from '../components/home/Positions.jsx';
import Process from '../components/home/Process.jsx';
import Experience from '../components/home/Experience.jsx';
import Requirements from '../components/home/Requirements.jsx';
import ApplyBand from '../components/home/ApplyBand.jsx';
import { SHOW_EXPERIENCE } from '../config/photos.js';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Positions />
      <Process />
      {SHOW_EXPERIENCE && <Experience />}
      <Requirements />
      <ApplyBand />
    </>
  );
}
